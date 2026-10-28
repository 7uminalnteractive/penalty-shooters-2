
/* PS2 mod: edições de times (Brasil), botão de tela cheia e painel logo+jogador. Uso pessoal. */
(function(){
'use strict';
var KEY='ps2.br.v1',LG=5,P=window.PS2={key:KEY,league:LG};
P.load=function(){try{return JSON.parse(localStorage.getItem(KEY))||{t:{}}}catch(e){return{t:{}}}};
P.save=function(o){localStorage.setItem(KEY,JSON.stringify(o))};
var SUR=['SILVA','SANTOS','OLIVEIRA','SOUZA','LIMA','PEREIRA','COSTA','RIBEIRO','ALVES','MARTINS','ROCHA','GOMES','BARBOSA','CARDOSO','TEIXEIRA','NUNES','MOREIRA','CAMPOS','MENDES','FREITAS','PINTO','AZEVEDO','DIAS','ARAUJO','FERREIRA','RAMOS','MACHADO','BORGES','LOPES','VIEIRA'],INI='ABCDEFGHJLMNPRSTV';
P.defPlayers=function(id){function hh(x){x=((x>>>16)^x)*0x45d9f3b>>>0;x=((x>>>16)^x)*0x45d9f3b>>>0;return((x>>>16)^x)>>>0}var a=[],seen={},i,n,k,t;for(i=0;i<11;i++){k=0;do{t=INI[hh(id*131+i*17+k*7+3)%INI.length]+'. '+SUR[hh(id*977+i*31+k*13+5)%SUR.length];k++}while(seen[t]&&k<60);seen[t]=1;a.push(t)}return a};
P.order=function(n,k){var r=[],i,v;(k||[]).forEach(function(x){x=+x;if(x>=0&&x<n&&r.indexOf(x)<0)r.push(x)});for(i=0;i<n;i++)if(r.indexOf(i)<0)r.push(i);return r};
P.colors=null;
P.loadColors=function(){return fetch('teamColours.json').then(function(r){return r.json()}).then(function(j){P.colors=j.data.map(function(c){return c.map(function(v){return v[0]})});return P.colors}).catch(function(){})};
P.rgbArr=function(i){var c=P.colors&&P.colors[i];return c?c.map(function(v){return Math.round(v*2.55)}):[136,136,136]};
P.crestSVG=function(kit,txt){var s=kit||'03000000',ci=+s.slice(2,4),a=P.rgbArr(ci),bi=(+s.slice(6,8)!==ci)?+s.slice(6,8):+s.slice(4,6),b=P.rgbArr(bi),
l=.299*b[0]+.587*b[1]+.114*b[2],tc=l>140?'#111':'#fff',ac='rgb('+a+')',bc='rgb('+b+')',t=(txt||'?').toString().charAt(0);
return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 5L90 17V50Q90 80 50 96Q10 80 10 50V17Z" fill="'+ac+'" stroke="#fff" stroke-width="4"/><path d="M50 5L90 17V50Q90 80 50 96Z" fill="'+bc+'" opacity=".35"/><text x="50" y="62" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-size="40" fill="'+(.299*a[0]+.587*a[1]+.114*a[2]>140?'#111':'#fff')+'">'+t.replace(/[<&]/g,'')+'</text></svg>'};
P.crestURL=function(kit,txt){return 'data:image/svg+xml;utf8,'+encodeURIComponent(P.crestSVG(kit,txt))};
if(window.PS2_EDITOR)return;
/* 1) aplica as edições de nome/sigla ao carregar teams_br2.json (o jogo lê via XHR) */
var O=XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open=function(m,u){try{this.__ps2=/teams_br2\.json/.test(u)}catch(e){}return O.apply(this,arguments)};
var dT=Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype,'responseText'),dR=Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype,'response');
function fix(txt){try{var d=P.load().t,j=JSON.parse(txt),id,e,r;for(id in d){e=d[id];r=j.data[+id];if(!r)continue;if(e.n)r[0][0]=e.n;if(e.s)r[4][0]=e.s;if(typeof e.u1==='string'&&/^(0[1-9]|1[0-3])(?:0[0-9]|1[0-9]|20){3}$/.test(e.u1))r[2][0]=e.u1;if(typeof e.u2==='string'&&/^(0[1-9]|1[0-3])(?:0[0-9]|1[0-9]|20){3}$/.test(e.u2))r[3][0]=e.u2}return JSON.stringify(j)}catch(x){return txt}}
Object.defineProperty(XMLHttpRequest.prototype,'responseText',{configurable:true,get:function(){var v=dT.get.call(this);return(this.__ps2&&this.readyState===4)?fix(v):v}});
Object.defineProperty(XMLHttpRequest.prototype,'response',{configurable:true,get:function(){var v=dR.get.call(this);if(!(this.__ps2&&this.readyState===4))return v;if(typeof v==='string')return fix(v);if(v&&typeof v==='object')return JSON.parse(fix(JSON.stringify(v)));return v}});
/* 2) interface sobre o jogo */
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var cv,badge,fsb,edb,shirtCanvas,shirtCtx,shirtData=null,crestImage=new Image(),crestSrc='',lastKey='',sides=[],lastSn=0,hideOn=false,css=document.createElement('style');
css.textContent='#ps2badge{position:fixed;z-index:20;display:none;align-items:center;height:1.5em;padding:0 0 0 2.15em;border-radius:999px;background:rgba(25,60,15,.8);color:#fff;font-family:"Roboto Condensed","Arial Narrow","Helvetica Neue",Arial,sans-serif;font-weight:700;font-stretch:condensed;letter-spacing:.02em;text-transform:uppercase;line-height:1;pointer-events:none;white-space:nowrap;transform:translateY(-100%);box-shadow:0 .08em .25em rgba(0,0,0,.35)}#ps2badge img{position:absolute;left:-.3em;top:50%;height:2.05em;width:2.05em;transform:translateY(-50%);object-fit:contain;filter:drop-shadow(0 .05em .1em rgba(0,0,0,.5))}#ps2badge .nm{padding-right:.7em}#ps2badge .no{align-self:stretch;display:flex;align-items:center;justify-content:center;min-width:1.9em;padding:0 .5em;border-radius:0 999px 999px 0;background:#8fd11e;color:#fff;text-shadow:0 .04em .08em rgba(0,0,0,.35)}.ps2btn{position:fixed;z-index:60;border:0;border-radius:50%;background:rgba(10,30,15,.55);color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}.ps2pill{border-radius:999px;font:700 14px Arial,sans-serif;padding:8px 16px;width:auto;height:auto;text-decoration:none;background:rgba(10,30,15,.7);color:#fff}';
function boot(){
document.head.appendChild(css);
badge=document.createElement('div');badge.id='ps2badge';document.body.appendChild(badge);
shirtCanvas=document.createElement('canvas');shirtCanvas.id='ps2shirtDetails';shirtCanvas.style.cssText='position:fixed;left:0;top:0;z-index:19;pointer-events:none;display:none';shirtCtx=shirtCanvas.getContext('2d');document.body.appendChild(shirtCanvas);
fsb=document.createElement('button');fsb.className='ps2btn';fsb.setAttribute('aria-label','Tela cheia');
fsb.innerHTML='<svg viewBox="0 0 24 24" width="60%" height="60%" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
document.body.appendChild(fsb);
edb=document.createElement('a');edb.className='ps2btn ps2pill';edb.href='editor.html';edb.textContent='✎ Editar times';document.body.appendChild(edb);
['pointerdown','touchstart','mousedown'].forEach(function(ev){[fsb,edb].forEach(function(b){b.addEventListener(ev,function(e){e.stopPropagation()},{passive:true})})});
fsb.addEventListener('click',function(e){e.stopPropagation();var d=document,el=d.documentElement,on=d.fullscreenElement||d.webkitFullscreenElement;
if(on){(d.exitFullscreen||d.webkitExitFullscreen).call(d);try{screen.orientation.unlock()}catch(x){}}
else{var rq=el.requestFullscreen||el.webkitRequestFullscreen;if(rq){var p=rq.call(el);var lk=function(){try{screen.orientation.lock('landscape').catch(function(){})}catch(x){}};if(p&&p.then)p.then(lk,function(){});else lk()}}});
P.loadColors();setInterval(tick,120);
(function raf(){if(hideOn){var r=ir();try{r.objects.midText.getAllInstances().forEach(function(i){if(i.x<430&&i.y>380&&i.y<430&&(/^POINTS/i.test(i.text)||/^[0-9]+$/.test(String(i.text).trim()))){i.isVisible=false;i.opacity=0}})}catch(e){}}drawShirtDetails();requestAnimationFrame(raf)})();
}
function ir(){try{return c3_runtimeInterface._localRuntime.GetIRuntime()}catch(e){return null}}
function tick(){
cv=cv&&cv.isConnected?cv:document.querySelector('canvas:not(#ps2shirtDetails)');if(!cv)return;
var r=cv.getBoundingClientRect(),w=r.width,can=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled),sz=Math.max(34,w*.062);
if(can){fsb.style.display='flex';if(P.ovl){sz=40;fsb.style.width=fsb.style.height=sz+'px';fsb.style.left=(innerWidth-sz-14)+'px';fsb.style.top='14px'}else{fsb.style.width=fsb.style.height=sz+'px';fsb.style.left=(r.left+w*.835)+'px';fsb.style.top=(r.top+r.height*.14-sz/2)+'px'}}else fsb.style.display='none';
var rt=ir();if(!rt){badge.style.display='none';edb.style.display='none';return}
var lay='',g=rt.globalVars;try{lay=rt.layout.name}catch(e){}
var br=g.leagueNum===LG;
edb.style.display=(br&&lay==='mainMenu'&&!P.noEdb)?'inline-flex':'none';edb.style.left=(r.left+w/2)+'px';edb.style.top=(r.top+r.height*.93)+'px';edb.style.transform='translate(-50%,-50%)';
if(lay!=='ballFlight3'||!br){badge.style.display='none';shirtData=null;hideOn=false;sides=[];lastSn=0;return}
hideOn=true;
var sn=g.shotNumber,who=g.whoShoots;if(sn<lastSn)sides=[];lastSn=sn;if(sn>0)sides[sn]=who;
var idx=0,k;for(k=1;k<sn;k++)if(sides[k]===who)idx++;
var tid=who==='player'?g.myTeamID:g.myOpponentId;if(tid==null||tid<0){badge.style.display='none';return}
var a=rt.objects.arrTeams.getFirstInstance(),name=a.getAt(tid,0),kit=a.getAt(tid,2),d=P.load().t[tid]||{},
pl=(d.p&&d.p.length)?d.p:P.defPlayers(tid),ord=P.order(pl.length,d.k),pi=ord[idx%ord.length],pn=pl[pi],shirtNo=(d.num&&Number.isInteger(d.num[pi])&&d.num[pi]>0&&d.num[pi]<=99)?d.num[pi]:pi+1,logo=d.l||P.crestURL(kit,name),H=r.height,key=[tid,pn,shirtNo,logo.length,H|0].join('|');
shirtData={shot:sn,who:who,name:pn,number:shirtNo,kit:kit,team:String(name||''),sponsor:typeof d.sponsor==='string'?d.sponsor.trim().slice(0,18):''};
badge.style.left=(r.left+r.width*.014)+'px';badge.style.top=(r.top+H*.968)+'px';badge.style.fontSize=(H*.046)+'px';badge.style.display='flex';
if(key!==lastKey){lastKey=key;badge.innerHTML='<img alt="" src="'+esc(logo)+'"><span class="nm">'+esc(pn)+'</span><span class="no">'+shirtNo+'</span>'}
}

/* Detalhes por jogador: acompanha a transformação da camada da camisa. */
function drawShirtDetails(){if(!shirtCanvas||!shirtCtx)return;var rt=ir(),data=shirtData,game=cv&&cv.isConnected?cv:document.querySelector('canvas:not(#ps2shirtDetails)');if(!rt||!data||!game||rt.layout.name!=='ballFlight3'||P.ovl||rt.globalVars.shotNumber!==data.shot||rt.globalVars.whoShoots!==data.who){shirtCanvas.style.display='none';return}
try{var inst=rt.objects.shooterShirt.getAllInstances().find(function(x){return x.isVisible&&x.opacity>0});if(!inst||!inst.layer){shirtCanvas.style.display='none';return}var rect=game.getBoundingClientRect();if(!rect.width||!rect.height)return;var ratio=Math.min(window.devicePixelRatio||1,2),cw=Math.round(rect.width*ratio),ch=Math.round(rect.height*ratio);if(shirtCanvas.width!==cw)shirtCanvas.width=cw;if(shirtCanvas.height!==ch)shirtCanvas.height=ch;shirtCanvas.style.left=rect.left+'px';shirtCanvas.style.top=rect.top+'px';shirtCanvas.style.width=rect.width+'px';shirtCanvas.style.height=rect.height+'px';shirtCanvas.style.display='block';var ctx=shirtCtx;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cw,ch);
var w=inst.width,h=inst.height;if(!w||!h){shirtCanvas.style.display='none';return}var angle=inst.angle||0,cos=Math.cos(angle),sin=Math.sin(angle),left=-inst.originX*w,top=-inst.originY*h;function project(dx,dy){return inst.layer.layerToCssPx(inst.x+dx*cos-dy*sin,inst.y+dx*sin+dy*cos)}var p0=project(left,top),px=project(left+w,top),py=project(left,top+h);ctx.setTransform((px[0]-p0[0])*ratio/w,(px[1]-p0[1])*ratio/w,(py[0]-p0[0])*ratio/h,(py[1]-p0[1])*ratio/h,(p0[0]-rect.left)*ratio,(p0[1]-rect.top)*ratio);
var color=P.rgbArr(+String(data.kit).slice(2,4)),lum=.299*color[0]+.587*color[1]+.114*color[2],ink=lum>180?'#111':'#fff';
var isFlamengo=/flamengo/i.test(data.team),display=String(data.name||'').trim().toUpperCase();
ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.fillStyle=isFlamengo?'#fff':ink;
// Distribuição inspirada na parte de trás da camisa: marca, nome, número e marca inferior.
if(isFlamengo){ctx.font='bold '+Math.max(3,h*.075)+'px Arial,sans-serif';ctx.fillText('✿ Hapvida',w*.5,h*.205,w*.49)}
ctx.font='bold '+Math.max(3,h*.105)+'px "Arial Narrow", Impact, sans-serif';ctx.fillText(display,w*.5,h*.32,w*.65);
ctx.font='900 '+Math.max(6,h*.39)+'px Impact, "Arial Narrow", sans-serif';ctx.fillText(String(data.number),w*.5,h*.55,w*.50);
if(isFlamengo){ctx.font='italic bold '+Math.max(3,h*.065)+'px Arial,sans-serif';ctx.fillText('ASSIST',w*.5,h*.78,w*.42);ctx.fillText('CARD',w*.5,h*.84,w*.35)}else if(data.sponsor){ctx.font='bold '+Math.max(3,h*.08)+'px Arial,sans-serif';ctx.fillText(data.sponsor.toUpperCase(),w*.5,h*.79,w*.62)}
}catch(e){shirtCanvas.style.display='none'}}

/* 3) tela de escolha dos cobradores: aparece ao tocar em NEXT na tela "A VS B", antes da partida */
var pk,pick=null,allowUntil=0;
var PCSS='#ps2pick{position:fixed;inset:0;z-index:40;display:none;flex-direction:column;background:radial-gradient(1100px 620px at 12% -10%,rgba(198,244,50,.18),transparent 62%),radial-gradient(900px 560px at 105% 110%,rgba(32,201,180,.16),transparent 62%),linear-gradient(180deg,#0c211a,#06120e);color:#f4f7f5;font-family:Inter,"SF Pro Display",-apple-system,"Segoe UI",Roboto,Arial,sans-serif;font-weight:600;font-size:calc(12px + 1vmin);padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}#ps2pick *{box-sizing:border-box}.pk-top{display:flex;align-items:center;justify-content:space-between;gap:1em;padding:.9em 4.4em .4em 1.2em}.pk-title{font-size:1.2em;font-weight:700;letter-spacing:-.01em}.pk-vs{display:flex;align-items:center;gap:.55em;padding:.35em .9em;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);font-size:.85em;font-weight:600}.pk-vs img{width:1.9em;height:1.9em;object-fit:contain}.pk-vs i{font-style:normal;color:#c6f432;font-weight:700;font-size:.8em}.pk-body{flex:1;min-height:0;display:grid;grid-template-columns:1.25fr 1fr;gap:1em;padding:.6em 1.2em;overflow:auto}@media (orientation:portrait){.pk-body{grid-template-columns:1fr}}.pk-body h3{margin:0 0 .55em;font-size:.68em;color:rgba(255,255,255,.58);letter-spacing:.14em;font-weight:600}.pk-roster{display:grid;grid-template-columns:repeat(auto-fill,minmax(10.5em,1fr));gap:.5em}.pc{display:flex;align-items:center;gap:.6em;height:2.7em;padding:0 .7em 0 .8em;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:#fff;font:inherit;cursor:pointer;text-align:left}.pc .no{min-width:1.4em;color:rgba(255,255,255,.5);font-size:.85em;font-variant-numeric:tabular-nums}.pc .nm{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pc .od{width:1.55em;height:1.55em;border-radius:50%;background:#c6f432;color:#0b1a07;display:none;align-items:center;justify-content:center;font-size:.8em;font-weight:700}.pc.on{background:rgba(198,244,50,.12);border-color:rgba(198,244,50,.6)}.pc.on .od{display:flex}.pk-slots{display:flex;flex-direction:column;gap:.5em}.sl{display:flex;align-items:center;gap:.6em;height:2.9em;padding:0 .45em 0 .5em;border-radius:16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12)}.sl>b{width:1.9em;height:1.9em;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#c6f432;color:#0b1a07;font-size:.8em;font-weight:700}.sl span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sl.em{border-style:dashed;background:transparent}.sl.em b{background:rgba(255,255,255,.14);color:#fff}.sl.em span{opacity:.5;font-weight:500}.sl button{width:2em;height:2em;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;font-size:.8em;cursor:pointer;padding:0}.pk-foot{display:flex;flex-wrap:wrap;gap:.6em;justify-content:flex-end;padding:.7em 1.2em .9em}.pk-b1,.pk-b2{font:inherit;font-weight:650;border-radius:999px;padding:.7em 1.5em;cursor:pointer;color:#f4f7f5;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16)}.pk-b1{background:#c6f432;color:#0b1a07;border-color:transparent;box-shadow:0 .5em 1.5em rgba(198,244,50,.28)}@media (orientation:portrait){.pk-b1,.pk-b2{flex:1 1 40%;padding:.7em .5em}.pk-b1{flex-basis:100%;order:-1}}';
function curLay(){var r=ir();try{return r?r.layout.name:''}catch(e){return''}}
function nextHit(e){cv=cv&&cv.isConnected?cv:document.querySelector('canvas:not(#ps2shirtDetails)');if(!cv)return false;var r=cv.getBoundingClientRect(),t=(e.changedTouches&&e.changedTouches[0])||e,x=(t.clientX-r.left)/r.width*960,y=(t.clientY-r.top)/r.height*540;return x>=700&&x<=960&&y>=430&&y<=540}
function guard(e){cv=cv&&cv.isConnected?cv:document.querySelector('canvas:not(#ps2shirtDetails)');if(e.target!==cv||pick||Date.now()<allowUntil)return;var rt=ir();if(!rt)return;var l=curLay();if((l!=='matchIntroV2'&&l!=='matchIntro')||rt.globalVars.leagueNum!==LG||!nextHit(e))return;
e.stopImmediatePropagation();if(e.cancelable)e.preventDefault();
if(/up$|click$/.test(e.type)&&!pick)openPick()}
['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','click'].forEach(function(t){window.addEventListener(t,guard,true)});
function openPick(){var rt=ir(),g=rt.globalVars,tid=g.myTeamID,oid=g.myOpponentId;if(tid==null||tid<0)return;
var a=rt.objects.arrTeams.getFirstInstance(),all=P.load().t,d=all[tid]||{},od=all[oid]||{},pl=(d.p&&d.p.length)?d.p:P.defPlayers(tid),n=a.getAt(tid,0),on=a.getAt(oid,0);
pick={tid:tid,pl:pl,t0:Date.now(),sel:P.order(pl.length,d.k).slice(0,Math.min(5,pl.length)),n:n,on:on,lg:d.l||P.crestURL(a.getAt(tid,2),n),olg:od.l||P.crestURL(a.getAt(oid,2),on)};
if(!pk){pk=document.createElement('div');pk.id='ps2pick';document.body.appendChild(pk);css.textContent+=PCSS;pk.addEventListener('click',pickClick)}
drawPick();pk.style.display='flex'}
function drawPick(){var p=pick,h='<div class="pk-top"><div class="pk-title">Cobradores</div><div class="pk-vs"><img alt="" src="'+esc(p.lg)+'"><span>'+esc(p.n)+'</span><i>VS</i><span>'+esc(p.on)+'</span><img alt="" src="'+esc(p.olg)+'"></div></div><div class="pk-body"><section><h3>Elenco · toque para escolher</h3><div class="pk-roster">';
p.pl.forEach(function(nm,i){var o=p.sel.indexOf(i);h+='<button class="pc'+(o>=0?' on':'')+'" data-a="t" data-i="'+i+'"><span class="no">'+(i+1)+'</span><span class="nm">'+esc(nm)+'</span><span class="od">'+(o>=0?o+1:'')+'</span></button>'});
h+='</div></section><section><h3>Ordem das cobranças</h3><div class="pk-slots">';
for(var j=0;j<Math.min(5,p.pl.length);j++){var v=p.sel[j];h+=(v==null)?'<div class="sl em"><b>'+(j+1)+'º</b><span>Toque num jogador</span></div>':'<div class="sl"><b>'+(j+1)+'º</b><span>'+esc(p.pl[v])+'</span><button data-a="u" data-j="'+j+'" aria-label="Subir">▲</button><button data-a="d" data-j="'+j+'" aria-label="Descer">▼</button><button data-a="r" data-j="'+j+'" aria-label="Remover">✕</button></div>'}
h+='</div></section></div><div class="pk-foot"><button class="pk-b2" data-a="b">Voltar</button><button class="pk-b2" data-a="c">Limpar</button><button class="pk-b2" data-a="x">Automático</button><button class="pk-b1" data-a="ok">Confirmar</button></div>';pk.innerHTML=h}
function pickClick(e){e.stopPropagation();if(!pick||Date.now()-pick.t0<450)return;var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a,i=+b.dataset.i,j=+b.dataset.j,s=pick.sel,max=Math.min(5,pick.pl.length);
if(a==='t'){var o=s.indexOf(i);if(o>=0)s.splice(o,1);else if(s.length<max)s.push(i);else s[max-1]=i}
else if(a==='r')s.splice(j,1);else if(a==='u'&&j>0){var t=s[j];s[j]=s[j-1];s[j-1]=t}else if(a==='d'&&j<s.length-1){var t2=s[j];s[j]=s[j+1];s[j+1]=t2}
else if(a==='c')pick.sel=[];else if(a==='x')pick.sel=P.order(pick.pl.length,null).slice(0,max);
else if(a==='b'){closePick();return}
else if(a==='ok'){var all=P.load();if(!all.t)all.t={};var cur=all.t[pick.tid]||{};cur.k=P.order(pick.pl.length,s);all.t[pick.tid]=cur;P.save(all);closePick();proceed();return}
drawPick()}
function closePick(){pick=null;if(pk)pk.style.display='none'}
function tap(lx,ly){allowUntil=Date.now()+1500;cv=document.querySelector('canvas:not(#ps2shirtDetails)');if(!cv)return;var r=cv.getBoundingClientRect(),x=r.left+r.width*lx/960,y=r.top+r.height*ly/540,o={bubbles:true,cancelable:true,clientX:x,clientY:y,pointerId:1,pointerType:'mouse',isPrimary:true,button:0,view:window};
cv.dispatchEvent(new PointerEvent('pointerdown',Object.assign({buttons:1},o)));setTimeout(function(){cv.dispatchEvent(new PointerEvent('pointerup',Object.assign({buttons:0},o)))},60)}
function proceed(){
var rt=ir();
if(rt&&curLay()==='matchIntroV2'&&typeof rt.goToLayout==='function'){
  // Equivalente ao botão Próximo da tela original: libera a partida.
  rt.globalVars.rewardAdWatched=false;
  rt.goToLayout('ballFlight3');
  return;
}
tap(840,482);
}
P.tap=tap;P.openPick=openPick;P.layout=curLay;P.rt=ir;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
