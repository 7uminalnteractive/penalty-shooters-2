
/* PS2 mod: edições de times (Brasil), botão de tela cheia e painel logo+jogador. Uso pessoal. */
(function(){
'use strict';
var KEY='ps2.br.v1',LG=5,P=window.PS2={key:KEY,league:LG};
P.leagues=[['Inglaterra','teams_eng2.json'],['Espanha','teams_es2.json'],['Copa do Mundo','teams_world.json'],['Itália','teams_it2.json'],['França','teams_fr2.json'],['Brasil','teams_br2.json'],['México','teams_mex2.json'],['América do Norte','teams_us2.json'],['Argentina','teams_arg2.json'],['Holanda','teams_ned2.json'],['Alemanha','teams_de2.json'],['Rússia','teams_rus2.json']];
P.currentLeague=function(){if(Number.isInteger(P.editorLeague))return P.editorLeague;try{var n=+c3_runtimeInterface._localRuntime.GetIRuntime().globalVars.leagueNum;if(Number.isInteger(n)&&P.leagues[n])return n}catch(e){}return LG};
P.keyForLeague=function(n){n=Number.isInteger(n)?n:P.currentLeague();return n===LG?KEY:'ps2.league.'+n+'.v1'};
P.load=function(n){try{var d=JSON.parse(localStorage.getItem(P.keyForLeague(n)));return d&&d.t?d:{t:{}}}catch(e){return{t:{}}}};
P.save=function(o,n){localStorage.setItem(P.keyForLeague(n),JSON.stringify(o))};
var SUR=['SILVA','SANTOS','OLIVEIRA','SOUZA','LIMA','PEREIRA','COSTA','RIBEIRO','ALVES','MARTINS','ROCHA','GOMES','BARBOSA','CARDOSO','TEIXEIRA','NUNES','MOREIRA','CAMPOS','MENDES','FREITAS','PINTO','AZEVEDO','DIAS','ARAUJO','FERREIRA','RAMOS','MACHADO','BORGES','LOPES','VIEIRA'],INI='ABCDEFGHJLMNPRSTV';
P.defPlayers=function(id){function hh(x){x=((x>>>16)^x)*0x45d9f3b>>>0;x=((x>>>16)^x)*0x45d9f3b>>>0;return((x>>>16)^x)>>>0}var a=[],seen={},i,n,k,t;for(i=0;i<11;i++){k=0;do{t=INI[hh(id*131+i*17+k*7+3)%INI.length]+'. '+SUR[hh(id*977+i*31+k*13+5)%SUR.length];k++}while(seen[t]&&k<60);seen[t]=1;a.push(t)}return a};
// Sempre oferece um goleiro quando o elenco antigo não identifica um.
P.roster=function(id,d){d=d||{};var players=(d.p&&d.p.length?d.p:P.defPlayers(id)).slice(),profiles=Array.isArray(d.perfis)?d.perfis.slice():[],numbers=Array.isArray(d.num)?d.num.slice():[];if(!players.some(function(_,i){return profiles[i]&&String(profiles[i].position||'').toLowerCase()==='goleiro'})){var i=players.length;players.push('GOLEIRO');profiles[i]={name:'GOLEIRO',position:'Goleiro'};numbers[i]=null}return{players:players,profiles:profiles,numbers:numbers}};
P.order=function(n,k){var r=[],i,v;(k||[]).forEach(function(x){x=+x;if(x>=0&&x<n&&r.indexOf(x)<0)r.push(x)});for(i=0;i<n;i++)if(r.indexOf(i)<0)r.push(i);return r};
P.colors=null;
P.loadColors=function(){return fetch('teamColours.json').then(function(r){return r.json()}).then(function(j){P.colors=j.data.map(function(c){return c.map(function(v){return v[0]})});return P.colors}).catch(function(){})};
P.rgbArr=function(i){var c=P.colors&&P.colors[i];return c?c.map(function(v){return Math.round(v*2.55)}):[136,136,136]};
P.crestSVG=function(kit,txt){var s=kit||'03000000',ci=+s.slice(2,4),a=P.rgbArr(ci),bi=(+s.slice(6,8)!==ci)?+s.slice(6,8):+s.slice(4,6),b=P.rgbArr(bi),
l=.299*b[0]+.587*b[1]+.114*b[2],tc=l>140?'#111':'#fff',ac='rgb('+a+')',bc='rgb('+b+')',t=(txt||'?').toString().charAt(0);
return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 5L90 17V50Q90 80 50 96Q10 80 10 50V17Z" fill="'+ac+'" stroke="#fff" stroke-width="4"/><path d="M50 5L90 17V50Q90 80 50 96Z" fill="'+bc+'" opacity=".35"/><text x="50" y="62" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-size="40" fill="'+(.299*a[0]+.587*a[1]+.114*a[2]>140?'#111':'#fff')+'">'+t.replace(/[<&]/g,'')+'</text></svg>'};
var crestCache={};
P.crestURL=function(kit,txt){var key=String(kit||'03000000')+'|'+String(txt||'?')+'|'+(P.colors?'loaded':'default');if(crestCache[key])return crestCache[key];try{var c=document.createElement('canvas');c.width=c.height=100;var ctx=c.getContext('2d'),a=P.rgbArr(+(kit||'03000000').slice(2,4)),bi=+(kit||'03000000').slice(6,8),b=P.rgbArr(bi);ctx.beginPath();ctx.moveTo(50,5);ctx.lineTo(90,17);ctx.lineTo(90,50);ctx.quadraticCurveTo(90,80,50,96);ctx.quadraticCurveTo(10,80,10,50);ctx.lineTo(10,17);ctx.closePath();ctx.fillStyle='rgb('+a.join(',')+')';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle=(.299*a[0]+.587*a[1]+.114*a[2]>140)?'#111':'#fff';ctx.textAlign='center';ctx.font='bold 40px Arial';ctx.fillText(String(txt||'?').charAt(0),50,64);return crestCache[key]=c.toDataURL('image/png')}catch(e){return 'data:image/svg+xml;utf8,'+encodeURIComponent(P.crestSVG(kit,txt))}};
if(!window.PS2_EDITOR)document.addEventListener('error',function(e){var img=e.target;if(!img||img.tagName!=='IMG'||img.dataset.ps2Fallback)return;if(!img.closest('.ps2ui,#ps2pick,#ps2sb,#ps2badge'))return;img.dataset.ps2Fallback='1';img.src=P.crestURL('03000000','?')},true);
if(window.PS2_EDITOR)return;
/* 1) aplica as edições de nome/sigla ao carregar teams_br2.json (o jogo lê via XHR) */
var O=XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open=function(m,u){try{this.__ps2=P.leagues.findIndex(function(l){return String(u).split('?')[0].split('/').pop()===l[1]})}catch(e){}return O.apply(this,arguments)};
var dT=Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype,'responseText'),dR=Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype,'response');
function fix(txt,league){try{var d=P.load(league).t,j=JSON.parse(txt),id,e,r;for(id in d){e=d[id];r=j.data[+id];if(!r)continue;if(e.n)r[0][0]=e.n;if(e.s)r[4][0]=e.s;if(typeof e.u1==='string'&&/^(0[1-9]|1[0-3])(?:0[0-9]|1[0-9]|20){3}$/.test(e.u1))r[2][0]=e.u1;if(typeof e.u2==='string'&&/^(0[1-9]|1[0-3])(?:0[0-9]|1[0-9]|20){3}$/.test(e.u2))r[3][0]=e.u2}return JSON.stringify(j)}catch(x){return txt}}
Object.defineProperty(XMLHttpRequest.prototype,'responseText',{configurable:true,get:function(){var v=dT.get.call(this);return(this.__ps2>=0&&this.readyState===4)?fix(v,this.__ps2):v}});
Object.defineProperty(XMLHttpRequest.prototype,'response',{configurable:true,get:function(){var v=dR.get.call(this);if(!(this.__ps2>=0&&this.readyState===4))return v;if(typeof v==='string')return fix(v,this.__ps2);if(v&&typeof v==='object')return JSON.parse(fix(JSON.stringify(v),this.__ps2));return v}});
/* 2) interface sobre o jogo */
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var cv,badge,fsb,edb,lastKey='',sides=[],lastSn=0,hideOn=false,keeperShirt=null,keeperRuntime=null,hiddenPoints=new Map(),css=document.createElement('style');
css.textContent='#ps2badge{position:fixed;z-index:20;display:none;align-items:center;height:1.5em;padding:0 0 0 2.15em;border-radius:999px;background:rgba(25,60,15,.8);color:#fff;font-family:"Roboto Condensed","Arial Narrow","Helvetica Neue",Arial,sans-serif;font-weight:700;font-stretch:condensed;letter-spacing:.02em;text-transform:uppercase;line-height:1;pointer-events:none;white-space:nowrap;transform:translateY(-100%);box-shadow:0 .08em .25em rgba(0,0,0,.35)}#ps2badge img{position:absolute;left:-.3em;top:50%;height:2.05em;width:2.05em;transform:translateY(-50%);object-fit:contain;filter:drop-shadow(0 .05em .1em rgba(0,0,0,.5))}#ps2badge .nm{padding-right:.7em}#ps2badge .no{align-self:stretch;display:flex;align-items:center;justify-content:center;min-width:1.9em;padding:0 .5em;border-radius:0 999px 999px 0;background:#8fd11e;color:#fff;text-shadow:0 .04em .08em rgba(0,0,0,.35)}.ps2btn{position:fixed;z-index:60;border:0;border-radius:50%;background:rgba(10,30,15,.55);color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}.ps2pill{border-radius:999px;font:700 14px Arial,sans-serif;padding:8px 16px;width:auto;height:auto;text-decoration:none;background:rgba(10,30,15,.7);color:#fff}';
function boot(){
document.head.appendChild(css);
badge=document.createElement('div');badge.id='ps2badge';document.body.appendChild(badge);
fsb=document.createElement('button');fsb.className='ps2btn';fsb.setAttribute('aria-label','Tela cheia');
fsb.innerHTML='<svg viewBox="0 0 24 24" width="60%" height="60%" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
document.body.appendChild(fsb);
edb=document.createElement('a');edb.className='ps2btn ps2pill';edb.href='editor.html';edb.textContent='✎ Editar times';document.body.appendChild(edb);
['pointerdown','touchstart','mousedown'].forEach(function(ev){[fsb,edb].forEach(function(b){b.addEventListener(ev,function(e){e.stopPropagation()},{passive:true})})});
fsb.addEventListener('click',function(e){e.stopPropagation();var d=document,el=d.documentElement,on=d.fullscreenElement||d.webkitFullscreenElement;
if(on){(d.exitFullscreen||d.webkitExitFullscreen).call(d);try{screen.orientation.unlock()}catch(x){}}
else{var rq=el.requestFullscreen||el.webkitRequestFullscreen;if(rq){var p=rq.call(el);var lk=function(){try{screen.orientation.lock('landscape').catch(function(){})}catch(x){}};if(p&&p.then)p.then(lk,function(){});else lk()}}});
P.loadColors();setInterval(tick,120);
(function raf(){if(hideOn){var r=ir();try{r.objects.midText.getAllInstances().forEach(function(i){if(i.x<430&&i.y>380&&i.y<430&&(/^POINTS/i.test(i.text)||/^[0-9]+$/.test(String(i.text).trim()))){if(!hiddenPoints.has(i))hiddenPoints.set(i,{visible:i.isVisible,opacity:i.opacity});i.isVisible=false;i.opacity=0}})}catch(e){}}requestAnimationFrame(raf)})();
}
function ir(){try{return c3_runtimeInterface._localRuntime.GetIRuntime()}catch(e){return null}}
// O goleiro usa a cor oposta à do goleiro que está defendendo.
function goalkeeperShirt(rt,isKeeper,who){
 function instance(name){var o=rt.objects[name];return o&&o.getFirstInstance?o.getFirstInstance():null}
 function visible(name){var x=instance(name);return !!(x&&x.isVisible!==false&&x.opacity!==0)}
 function close(a,b){return a&&b&&a.length>=3&&a.every(function(v,i){return Math.abs(v-b[i])<0.005})}
 function restore(){if(!keeperShirt)return;keeperShirt.effects.forEach(function(x){try{if(close(x.fx.getParameter(0),x.applied))x.fx.setParameter(0,x.original)}catch(e){}});if(keeperShirt.stripes)try{if(!keeperShirt.stripes.isVisible)keeperShirt.stripes.isVisible=keeperShirt.stripesVisible}catch(e){}keeperShirt=null}
 try{var shirt=instance('shooterShirt'),shorts=instance('shooterShorts');if(keeperShirt&&(!isKeeper||keeperShirt.shirt!==shirt||keeperShirt.shorts!==shorts))restore();if(!isKeeper||!shirt)return;
 var cyanVisible=visible('goalkeeperShirtCyan'),orangeVisible=visible('goalkeeperShirtOrange'),color=cyanVisible&&!orangeVisible?[0.80,0.48,0]:orangeVisible&&!cyanVisible?[0,0.80,0.80]:who==='cpu'?[0.80,0.48,0]:[0,0.80,0.80];
 if(!keeperShirt){keeperShirt={shirt:shirt,shorts:shorts,effects:[],stripes:instance('Stripes')};if(keeperShirt.stripes)keeperShirt.stripesVisible=keeperShirt.stripes.isVisible;[shirt,shorts].forEach(function(obj){if(!obj)return;var fx=(obj.effects||[]).find(function(e){return String(e.name).toLowerCase()==='setcolor'});if(fx)keeperShirt.effects.push({fx:fx,original:fx.getParameter(0).slice(),applied:null,shirt:obj===shirt})})}
 keeperShirt.effects.forEach(function(x){x.applied=x.shirt?color:[0,0,0];x.fx.isActive=true;x.fx.setParameter(0,x.applied)});if(keeperShirt.stripes)keeperShirt.stripes.isVisible=false;
 }catch(e){restore()}
}
function tick(){
cv=cv&&cv.isConnected?cv:document.querySelector('canvas:not(#ps2shirtDetails):not(#ps2players3d)');if(!cv)return;
var r=cv.getBoundingClientRect(),w=r.width,can=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled),sz=Math.max(34,w*.062);
if(can){fsb.style.display='flex';if(P.ovl){sz=40;fsb.style.width=fsb.style.height=sz+'px';fsb.style.left=(innerWidth-sz-14)+'px';fsb.style.top='14px'}else{fsb.style.width=fsb.style.height=sz+'px';fsb.style.left=(r.left+w*.835)+'px';fsb.style.top=(r.top+r.height*.14-sz/2)+'px'}}else fsb.style.display='none';
var rt=ir();if(!rt){badge.style.display='none';edb.style.display='none';return}
var lay='',g=rt.globalVars;try{lay=rt.layout.name}catch(e){}
if(rt!==keeperRuntime&&typeof rt.addEventListener==='function'){keeperRuntime=rt;rt.addEventListener('tick2',function(){try{var g=rt.globalVars,a=P.playerAppearance,active=rt.layout.name==='ballFlight3'&&a&&a.shot===g.shotNumber&&a.who===g.whoShoots&&a.isKeeper;goalkeeperShirt(rt,!!active,g.whoShoots)}catch(e){}})}
var br=g.leagueNum===LG;
edb.style.display=(br&&lay==='mainMenu'&&!P.noEdb)?'inline-flex':'none';edb.style.left=(r.left+w/2)+'px';edb.style.top=(r.top+r.height*.93)+'px';edb.style.transform='translate(-50%,-50%)';
if(lay!=='ballFlight3'){goalkeeperShirt(rt,false);hiddenPoints.forEach(function(v,i){try{if(i.isVisible===false)i.isVisible=v.visible;if(i.opacity===0)i.opacity=v.opacity}catch(e){}});hiddenPoints.clear();P.playerAppearance=null;badge.style.display='none';hideOn=false;sides=[];lastSn=0;return}
hideOn=true;
var sn=g.shotNumber,who=g.whoShoots;if(sn<lastSn)sides=[];lastSn=sn;if(sn>0)sides[sn]=who;
var idx=0,k;for(k=1;k<sn;k++)if(sides[k]===who)idx++;
var tid=who==='player'?g.myTeamID:g.myOpponentId;if(tid==null||tid<0){badge.style.display='none';return}
var a=rt.objects.arrTeams.getFirstInstance(),name=a.getAt(tid,0),kit=a.getAt(tid,2),d=P.load().t[tid]||{},
roster=P.roster(tid,d),pl=roster.players,ord=P.order(pl.length,d.k),pi=ord[idx%ord.length],pn=pl[pi],shirtNo=(d.num&&Number.isInteger(d.num[pi])&&d.num[pi]>0&&d.num[pi]<=99)?d.num[pi]:pi+1,logo=d.l||P.crestURL(kit,name),H=r.height,key=[tid,pn,shirtNo,logo.length,H|0].join('|');
var isKeeper=!!(roster.profiles[pi]&&String(roster.profiles[pi].position||'').toLowerCase()==='goleiro');goalkeeperShirt(rt,isKeeper,who);
P.playerAppearance={shot:sn,who:who,isKeeper:isKeeper,name:pn,number:shirtNo,kit:kit,team:String(name||''),sponsor:typeof d.sponsor==='string'?d.sponsor.trim().slice(0,18):''};
badge.style.left=(r.left+r.width*.014)+'px';badge.style.top=(r.top+H*.968)+'px';badge.style.fontSize=(H*.046)+'px';badge.style.display='flex';
if(key!==lastKey){lastKey=key;badge.innerHTML='<img alt="" src="'+esc(logo)+'"><span class="nm">'+esc(pn)+'</span><span class="no">'+shirtNo+'</span>'}
}

/* 3) tela de escolha dos cobradores: aparece ao tocar em NEXT na tela "A VS B", antes da partida */
var pk,pick=null,allowUntil=0;
var PCSS='#ps2pick{position:fixed;inset:0;z-index:40;display:none;flex-direction:column;background:radial-gradient(1100px 620px at 12% -10%,rgba(198,244,50,.18),transparent 62%),radial-gradient(900px 560px at 105% 110%,rgba(32,201,180,.16),transparent 62%),linear-gradient(180deg,#0c211a,#06120e);color:#f4f7f5;font-family:Inter,"SF Pro Display",-apple-system,"Segoe UI",Roboto,Arial,sans-serif;font-weight:600;font-size:calc(12px + 1vmin);padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}#ps2pick *{box-sizing:border-box}.pk-top{display:flex;align-items:center;justify-content:space-between;gap:1em;padding:.9em 4.4em .4em 1.2em}.pk-title{font-size:1.2em;font-weight:700;letter-spacing:-.01em}.pk-vs{display:flex;align-items:center;gap:.55em;padding:.35em .9em;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);font-size:.85em;font-weight:600}.pk-vs img{width:1.9em;height:1.9em;object-fit:contain}.pk-vs i{font-style:normal;color:#c6f432;font-weight:700;font-size:.8em}.pk-body{flex:1;min-height:0;display:grid;grid-template-columns:1.25fr 1fr;gap:1em;padding:.6em 1.2em;overflow:auto}@media (orientation:portrait){.pk-body{grid-template-columns:1fr}}.pk-body h3{margin:0 0 .55em;font-size:.68em;color:rgba(255,255,255,.58);letter-spacing:.14em;font-weight:600}.pk-roster{display:grid;grid-template-columns:repeat(auto-fill,minmax(10.5em,1fr));gap:.5em}.pc{display:flex;align-items:center;gap:.6em;height:2.7em;padding:0 .7em 0 .8em;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:#fff;font:inherit;cursor:pointer;text-align:left}.pc .no{min-width:1.4em;color:rgba(255,255,255,.5);font-size:.85em;font-variant-numeric:tabular-nums}.pc .nm{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pc .od{width:1.55em;height:1.55em;border-radius:50%;background:#c6f432;color:#0b1a07;display:none;align-items:center;justify-content:center;font-size:.8em;font-weight:700}.pc.on{background:rgba(198,244,50,.12);border-color:rgba(198,244,50,.6)}.pc.on .od{display:flex}.pk-slots{display:flex;flex-direction:column;gap:.5em}.sl{display:flex;align-items:center;gap:.6em;height:2.9em;padding:0 .45em 0 .5em;border-radius:16px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12)}.sl>b{width:1.9em;height:1.9em;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#c6f432;color:#0b1a07;font-size:.8em;font-weight:700}.sl span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sl.em{border-style:dashed;background:transparent}.sl.em b{background:rgba(255,255,255,.14);color:#fff}.sl.em span{opacity:.5;font-weight:500}.sl button{width:2em;height:2em;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;font-size:.8em;cursor:pointer;padding:0}.pk-foot{display:flex;flex-wrap:wrap;gap:.6em;justify-content:flex-end;padding:.7em 1.2em .9em}.pk-b1,.pk-b2{font:inherit;font-weight:650;border-radius:999px;padding:.7em 1.5em;cursor:pointer;color:#f4f7f5;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16)}.pk-b1{background:#c6f432;color:#0b1a07;border-color:transparent;box-shadow:0 .5em 1.5em rgba(198,244,50,.28)}@media (orientation:portrait){.pk-b1,.pk-b2{flex:1 1 40%;padding:.7em .5em}.pk-b1{flex-basis:100%;order:-1}}';
function curLay(){var r=ir();try{return r?r.layout.name:''}catch(e){return''}}
function nextHit(e){cv=cv&&cv.isConnected?cv:document.querySelector('canvas:not(#ps2shirtDetails):not(#ps2players3d)');if(!cv)return false;var r=cv.getBoundingClientRect(),t=(e.changedTouches&&e.changedTouches[0])||e,x=(t.clientX-r.left)/r.width*960,y=(t.clientY-r.top)/r.height*540;return x>=700&&x<=960&&y>=430&&y<=540}
function guard(e){cv=cv&&cv.isConnected?cv:document.querySelector('canvas:not(#ps2shirtDetails):not(#ps2players3d)');if(e.target!==cv||pick||Date.now()<allowUntil)return;var rt=ir();if(!rt)return;var l=curLay();if((l!=='matchIntroV2'&&l!=='matchIntro')||!nextHit(e))return;
e.stopImmediatePropagation();if(e.cancelable)e.preventDefault();
if(/up$|click$/.test(e.type)&&!pick)openPick()}
['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','click'].forEach(function(t){window.addEventListener(t,guard,true)});
function openPick(){var rt=ir(),g=rt.globalVars,tid=g.myTeamID,oid=g.myOpponentId;if(tid==null||tid<0)return;
var a=rt.objects.arrTeams.getFirstInstance(),all=P.load().t,d=all[tid]||{},od=all[oid]||{},roster=P.roster(tid,d),pl=roster.players,n=a.getAt(tid,0),on=a.getAt(oid,0);
pick={tid:tid,pl:pl,profiles:roster.profiles,numbers:roster.numbers,t0:Date.now(),sel:P.order(pl.length,d.k).slice(0,Math.min(5,pl.length)),n:n,on:on,lg:d.l||P.crestURL(a.getAt(tid,2),n),olg:od.l||P.crestURL(a.getAt(oid,2),on)};
if(!pk){pk=document.createElement('div');pk.id='ps2pick';document.body.appendChild(pk);css.textContent+=PCSS;pk.addEventListener('click',pickClick)}
drawPick();pk.style.display='flex'}
function drawPick(){var p=pick,h='<div class="pk-top"><div class="pk-title">Cobradores</div><div class="pk-vs"><img alt="" src="'+esc(p.lg)+'"><span>'+esc(p.n)+'</span><i>VS</i><span>'+esc(p.on)+'</span><img alt="" src="'+esc(p.olg)+'"></div></div><div class="pk-body"><section><h3>Elenco · toque para escolher</h3><div class="pk-roster">';
p.pl.forEach(function(nm,i){var o=p.sel.indexOf(i);h+='<button class="pc'+(o>=0?' on':'')+'" data-a="t" data-i="'+i+'"><span class="no">'+(p.numbers[i]||i+1)+'</span><span class="nm">'+esc(nm)+((p.profiles[i]&&p.profiles[i].position==='Goleiro')?' (GOL)':'')+'</span><span class="od">'+(o>=0?o+1:'')+'</span></button>'});
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
function tap(lx,ly){allowUntil=Date.now()+1500;cv=document.querySelector('canvas:not(#ps2shirtDetails):not(#ps2players3d)');if(!cv)return;var r=cv.getBoundingClientRect(),x=r.left+r.width*lx/960,y=r.top+r.height*ly/540,o={bubbles:true,cancelable:true,clientX:x,clientY:y,pointerId:1,pointerType:'mouse',isPrimary:true,button:0,view:window};
cv.dispatchEvent(new PointerEvent('pointerdown',Object.assign({buttons:1},o)));setTimeout(function(){cv.dispatchEvent(new PointerEvent('pointerup',Object.assign({buttons:0},o)))},60)}
function proceed(){
var rt=ir();
if(rt&&curLay()==='matchIntroV2'&&typeof rt.goToLayout==='function'){
  // Equivalente ao botão Próximo da tela original: libera a partida.
  rt.globalVars.rewardAdWatched=false;
  rt.goToLayout('ballFlight3');
  return;
}
if(curLay()==='matchIntro'){tap(480,430);return}
tap(840,482);
}
P.tap=tap;P.openPick=openPick;P.layout=curLay;P.rt=ir;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
