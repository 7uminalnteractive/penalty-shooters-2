// Player rendering integration. Assets/rig conversion: see LICENSES.txt.
import * as THREE from './three.module.js';
import {GLTFLoader} from './GLTFLoader.js';
import {clone} from './SkeletonUtils.js';
const P=window.PS2;
const loader=new GLTFLoader();
const [clipsGlb,sculptGlb]=await Promise.all(['ps2-clips.glb','ps2-player.glb'].map(f=>loader.loadAsync(new URL(f,import.meta.url).href)));
  sculptGlb.scene.updateMatrixWorld(true);
  clipsGlb.scene.updateMatrixWorld(true);
  const bodies = {};
  clipsGlb.scene.traverse(o => {
    if (o.isSkinnedMesh && o.material) bodies[o.material.name] = o;
  });
  const anyBody = Object.values(bodies)[0];
  const boneIndex = new Map(anyBody.skeleton.bones.map((b, i) => [b.name, i]));
  const v = new THREE.Vector3();
  sculptGlb.scene.traverse(o => {
    if (!o.isSkinnedMesh || !o.material) return;
    const dst = bodies[o.material.name];
    const geo = o.geometry;
    // both binds describe the same T-pose, so inverse(clipsIBM) * sculptIBM
    // is one global rigid map from sculpt bind space to clips bind space
    // (identical across bones)
    const si = o.skeleton.bones.findIndex(b => b.name === anyBody.skeleton.bones[0].name);
    const toClips = new THREE.Matrix4()
      .copy(anyBody.skeleton.boneInverses[0]).invert()
      .multiply(o.skeleton.boneInverses[si]);
    const nrmMat = new THREE.Matrix3().getNormalMatrix(toClips);
    const pos = geo.attributes.position, nrm = geo.attributes.normal;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(toClips);
      pos.setXYZ(i, v.x, v.y, v.z);
      v.fromBufferAttribute(nrm, i).applyMatrix3(nrmMat).normalize();
      nrm.setXYZ(i, v.x, v.y, v.z);
    }
    const map = o.skeleton.bones.map(b => boneIndex.get(b.name) ?? 0);
    const idx = geo.attributes.skinIndex;
    for (let i = 0; i < idx.array.length; i++) idx.array[i] = map[idx.array[i]];
    geo.computeBoundingSphere();
    if (dst) {
      dst.geometry = geo;
    } else {
      // sculpt-only primitive (grafted hands): no mesh in clips.glb has this
      // material, so add a sibling bound to the same skeleton
      const mesh = new THREE.SkinnedMesh(geo, o.material);
      mesh.position.copy(anyBody.position);
      mesh.quaternion.copy(anyBody.quaternion);
      mesh.scale.copy(anyBody.scale);
      mesh.frustumCulled = false;   // tiny static bound would mis-cull mid-clip
      anyBody.parent.add(mesh);
      mesh.bind(anyBody.skeleton, anyBody.bindMatrix);
    }
  });

  // Hair removed: the GRF hair cap is a 90-vertex shell with holes. It is a
  // rigid child of the neck bone (not skinned), so the swap above never
  // touches it — remove it before SkeletonUtils.clone copies it per player.
  const hairMeshes = [];
  clipsGlb.scene.traverse(o => {
    if (o.isMesh && !o.isSkinnedMesh && o.material
        && o.material.name === 'hair') hairMeshes.push(o);
  });
  hairMeshes.forEach(o => {o.material.side=THREE.DoubleSide; o.material.roughness=1;});
for(const clip of clipsGlb.animations)for(const track of clip.tracks)if(track.name==='player.position')for(let i=0;i<track.values.length;i+=3){track.values[i]=0;track.values[i+1]=0}
P.players3dLoading=true;
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
P.players3dLoading=false;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
const canvas=renderer.domElement;canvas.id='ps2players3d';canvas.style.cssText='position:fixed;pointer-events:none;z-index:18;display:none';document.body.append(canvas);
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(0,960,540,0,.1,4000);camera.position.set(0,0,1000);scene.add(new THREE.HemisphereLight(0xffffff,0x8c9f80,2.2));const sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(-200,400,600);scene.add(sun);
const idle=clipsGlb.animations.find(c=>c.name==='movement/idle/000_idlelevel1');
const shot=clipsGlb.animations.find(c=>c.name==='shot/idle/020');
const ready=clipsGlb.animations.find(c=>c.name==='deflect/idle/000_trunk_holdball');
const keeperClips={Idle:ready,MidCatch:clipsGlb.animations.find(c=>c.name==='deflect/idle/000_trunk_holdball'),LowCatch:clipsGlb.animations.find(c=>c.name==='deflect/idle/000_ground_holdball'),HighCatch:clipsGlb.animations.find(c=>c.name==='deflect/idle/000_high_holdball'),MidParade:clipsGlb.animations.find(c=>c.name==='deflect/idle/090_midheight_deflect_far'),HighParade:clipsGlb.animations.find(c=>c.name==='deflect/idle/090_high_deflect_far')};
function actor(){const model=clone(clipsGlb.scene),rig=new THREE.Group();rig.add(model);scene.add(rig);const mats=[];model.traverse(o=>{if(!o.isMesh)return;o.frustumCulled=false;o.material=o.material.clone();o.material.roughness=.92;if(['kit','hands'].includes(o.material.name))mats.push(o.material)});const mixer=new THREE.AnimationMixer(model);const box=new THREE.Box3().setFromObject(model);return {rig,model,mats,mixer,height:1.8,key:'',texture:null,action:null,clip:null,frame:0};}
const shooter=actor(),keeper=actor();
function animate(a,clip,t){if(!clip)return;if(a.clip!==clip){a.mixer.stopAllAction();a.action=a.mixer.clipAction(clip);a.action.play();a.clip=clip}a.action.time=Math.max(0,Math.min(clip.duration-.001,t));a.mixer.update(0)}
function rgb(i){return 'rgb('+P.rgbArr(i).join(',')+')'}
function kit(a,data,gk){const key=JSON.stringify([data.kit,data.name,data.number,data.team,gk,data.crest]);if(a.key===key)return;a.key=key;const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d'),code=String(data.kit||'03000000');const flam=/flamengo/i.test(data.team),primary=gk?'#167e93':rgb(+code.slice(2,4)),secondary=flam?'#111':rgb(+code.slice(4,6));g.fillStyle='#17191d';g.fillRect(0,0,1024,1024);g.fillStyle=primary;g.fillRect(0,0,1024,407);
if(!gk&&(flam||+code.slice(0,2)!==3)){g.fillStyle=secondary;if(flam||[2,4,5,8].includes(+code.slice(0,2))){for(let y=0;y<407;y+=102)g.fillRect(0,y,1024,50)}else{for(let x=0;x<1024;x+=100)g.fillRect(x,0,48,407)}}
g.fillStyle=gk?'#167e93':rgb(+code.slice(6,8));g.fillRect(0,407,1024,174);g.fillStyle=gk?'#167e93':'#eee';g.fillRect(0,581,1024,198);g.fillStyle=gk?'#eee':'#927265';g.fillRect(0,779,1024,225);
g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.font='bold 28px Arial';g.fillText(String(data.name||'').toUpperCase(),768,126,188);g.font='bold 138px Arial';g.fillText(String(data.number||1),768,235,155);
if(flam&&!gk){g.font='bold 23px Arial';g.fillText('Hapvida',768,80,150);g.font='italic bold 21px Arial';g.fillText('ASSIST CARD',768,335,166);g.font='bold 38px Arial';g.fillText('Betano',256,205,190)}
const tex=new THREE.CanvasTexture(c);tex.flipY=false;tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());if(a.texture)a.texture.dispose();a.texture=tex;for(const m of a.mats){m.map=tex;m.color.set(0xffffff);m.needsUpdate=true}
if(data.crest&&!gk){const im=new Image();im.onload=()=>{if(a.texture!==tex)return;g.drawImage(im,294,110,40,50);tex.needsUpdate=true};im.src=data.crest}
}
const hidden=new Map();function hide(i){if(!hidden.has(i))hidden.set(i,i.opacity);if(i.opacity>0)hidden.set(i,i.opacity);i.opacity=0}function restore(){for(const [i,o]of hidden)try{i.opacity=o}catch{}hidden.clear()}
function all(rt,n){return rt.objects[n]?.getAllInstances()||[]}
const visualNames=['Shooter','shooterShirt','shooterShorts','Stripes','shirtAlt','goalkeeperNoShirt','goalkeeperShirtOrange','goalkeeperShirtCyan'];
const ball=new THREE.Mesh(new THREE.SphereGeometry(1,20,12),new THREE.MeshStandardMaterial({color:'#fafafa',roughness:.9}));scene.add(ball);
// Dark seams on the ball share its rotation.
for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.995,.025,4,48),new THREE.MeshStandardMaterial({color:'#151719'}));ring.rotation.set(i===0?Math.PI/2:0,i===1?Math.PI/2:0,0);ball.add(ring)}
let width=0,height=0,last=performance.now(),idleTime=0,failed=false,editsCache={},editsAt=0,kitAt=0;
function position(a,i,rect,gk){const sx=Math.abs(i.width/i.imageWidth),sy=Math.abs(i.height/i.imageHeight);const point=i.layer.layerToCssPx(i.x+(gk?0:-47)*sx,i.y+(gk?66:145)*sy),base=i.layer.layerToCssPx(i.x,i.y),up=i.layer.layerToCssPx(i.x,i.y-(gk?116:262)*sy);const h=Math.hypot(up[0]-base[0],up[1]-base[1]);a.rig.scale.setScalar(h/a.height);a.rig.position.set(point[0]-rect.left,rect.height-(point[1]-rect.top),gk?0:150);a.rig.rotation.y=gk?0:Math.PI;a.rig.visible=i.isVisible&&i.layer.isVisible!==false;}
function render(now){requestAnimationFrame(render);if(failed)return;let rt,layout;try{rt=window.c3_runtimeInterface?._localRuntime?.GetIRuntime();layout=rt?.layout?.name}catch{}const game=document.querySelector('canvas:not(#ps2shirtDetails):not(#ps2players3d)');if(!rt||!game||layout!=='ballFlight3'||P.ovl){canvas.style.display='none';restore();P.players3dActive=false;last=now;return}try{const s=all(rt,'Shooter')[0],k=all(rt,'goalkeeperNoShirt')[0];if(!s||!k)return;const r=game.getBoundingClientRect();if(!r.width||!r.height)return;if(width!==r.width||height!==r.height){width=r.width;height=r.height;renderer.setSize(width,height,false);camera.right=width;camera.top=height;camera.updateProjectionMatrix()}canvas.style.left=r.left+'px';canvas.style.top=r.top+'px';canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';
const dt=Math.min((now-last)/1000,.05)*(rt.timeScale||0);last=now;idleTime+=dt;const g=rt.globalVars,arr=rt.objects.arrTeams?.getFirstInstance(),tid=g.whoShoots==='player'?g.myTeamID:g.myOpponentId,kid=g.whoShoots==='player'?g.myOpponentId:g.myTeamID;if(now-editsAt>500){editsCache=g.leagueNum===5?P.load().t:{};editsAt=now}const edits=editsCache;const sd=edits[tid]||{},kd=edits[kid]||{};const sd3=g.leagueNum===5&&P.playerAppearance&&P.playerAppearance.shot===g.shotNumber&&P.playerAppearance.who===g.whoShoots?P.playerAppearance:{name:sd.p?.[0]||'',number:sd.num?.[0]||9,kit:arr?.getAt(tid,2),team:arr?.getAt(tid,0),crest:sd.l||''};if(now-kitAt>120){kitAt=now;kit(shooter,sd3,false);kit(keeper,{kit:arr?.getAt(kid,2),team:arr?.getAt(kid,0),number:1,name:kd.p?.[kd.p.length-1]||''},true);}
position(shooter,s,r,false);position(keeper,k,r,true);
const sf=s.animationFrame;if(sf<20){animate(shooter,idle,idleTime%idle.duration)}else{animate(shooter,shot,(sf-20)/34*shot.duration)}
const kc=keeperClips[k.animationName]||idle;animate(keeper,kc,kc===ready&&k.animationName==='Idle'?0.015:kc===idle?idleTime%kc.duration:(k.animationFrame/({MidCatch:8,LowCatch:31,HighCatch:10,MidParade:46,HighParade:48}[k.animationName]||153))*kc.duration);
for(const n of visualNames)for(const i of all(rt,n))hide(i);
const b=all(rt,'ball')[0];ball.visible=!!b?.isVisible;if(b&&ball.visible){const bp=b.layer.layerToCssPx(b.x+(0.5-b.originX)*b.width,b.y+(0.5-b.originY)*b.height),edge=b.layer.layerToCssPx(b.x+Math.abs(b.width)/2,b.y);ball.position.set(bp[0]-r.left,r.height-(bp[1]-r.top),80);ball.scale.setScalar(Math.max(1,Math.hypot(edge[0]-bp[0],edge[1]-bp[1])));ball.rotation.x+=dt*7;hide(b)}
renderer.render(scene,camera);canvas.style.display='block';P.players3dActive=true;
}catch(e){failed=true;restore();canvas.style.display='none';P.players3dActive=false;console.error('PS2 3D desativado:',e)}}
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();failed=true;restore();canvas.style.display='none';P.players3dActive=false});
P.players3d={shooter,keeper,renderer,scene,camera};requestAnimationFrame(render);
