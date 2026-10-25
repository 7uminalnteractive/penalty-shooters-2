/* PS2 mod: edições de times (Brasil), botão de tela cheia e painel logo+jogador. Uso pessoal. */
(function(){
'use strict';
var KEY='ps2.br.v1',LG=5,P=window.PS2={key:KEY,league:LG};
P.load=function(){try{return JSON.parse(localStorage.getItem(KEY))||{t:{}}}catch(e){return{t:{}}}};
P.save=function(o){localStorage.setItem(KEY,JSON.stringify(o))};
var SUR=['SILVA','SANTOS','OLIVEIRA','SOUZA','LIMA','PEREIRA','COSTA','RIBEIRO','ALVES','MARTINS','ROCHA','GOMES','BARBOSA','CARDOSO','TEIXEIRA','NUNES','MOREIRA','CAMPOS','MENDES','FREITAS','PINTO','AZEVEDO','DIAS','ARAUJO','FERREIRA','RAMOS','MACHADO','BORGES','LOPES','VIEIRA'],INI='ABCDEFGHJLMNPRSTV';
P.defPlayers=function(id){var a=[],i,h;for(i=0;i<11;i++){h=(id*131+i*17+7)%997;a.push(INI[h%INI.length]+'. '+SUR[(h*7+id*3+i)%SUR.length])}return a};
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
function fix(txt){try{var d=P.load().t,j=JSON.parse(txt),id,e,r;for(id in d){e=d[id];r=j.data[+id];if(!r)continue;if(e.n)r[0][0]=e.n;if(e.s)r[4][0]=e.s}return JSON.stringify(j)}catch(x){return txt}}
Object.defineProperty(XMLHttpRequest.prototype,'responseText',{configurable:true,get:function(){var v=dT.get.call(this);return(this.__ps2&&this.readyState===4)?fix(v):v}});
Object.defineProperty(XMLHttpRequest.prototype,'response',{configurable:true,get:function(){var v=dR.get.call(this);if(!(this.__ps2&&this.readyState===4))return v;if(typeof v==='string')return fix(v);if(v&&typeof v==='object')return JSON.parse(fix(JSON.stringify(v)));return v}});
/* 2) interface sobre o jogo */
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var cv,badge,fsb,edb,lastKey='',sides=[],lastSn=0,css=document.createElement('style');
css.textContent='#ps2badge{position:fixed;z-index:20;display:none;align-items:center;gap:.5em;padding:.3em .8em .3em .35em;border-radius:999px;background:rgba(10,30,15,.62);color:#fff;font-family:"Archivo Black",Arial Black,Impact,sans-serif;pointer-events:none;white-space:nowrap;transform:translateY(-100%)}#ps2badge img{display:block;object-fit:contain}#ps2badge b{display:block;font-weight:400;line-height:1.05}#ps2badge small{display:block;opacity:.8;font-size:.62em;line-height:1.1;font-family:Arial,sans-serif;font-weight:700;letter-spacing:.03em}.ps2btn{position:fixed;z-index:21;border:0;border-radius:50%;background:rgba(10,30,15,.55);color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}.ps2pill{border-radius:999px;font:700 14px Arial,sans-serif;padding:8px 16px;width:auto;height:auto;text-decoration:none;background:rgba(10,30,15,.7);color:#fff}';
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
}
function ir(){try{return c3_runtimeInterface._localRuntime.GetIRuntime()}catch(e){return null}}
function tick(){
cv=cv&&cv.isConnected?cv:document.querySelector('canvas');if(!cv)return;
var r=cv.getBoundingClientRect(),w=r.width,can=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled),sz=Math.max(34,w*.062);
if(can){fsb.style.display='flex';fsb.style.width=fsb.style.height=sz+'px';fsb.style.left=(r.left+w*.835)+'px';fsb.style.top=(r.top+r.height*.14-sz/2)+'px'}else fsb.style.display='none';
var rt=ir();if(!rt){badge.style.display='none';edb.style.display='none';return}
var lay='',g=rt.globalVars;try{lay=rt.layout.name}catch(e){}
var br=g.leagueNum===LG;
edb.style.display=(br&&(lay==='mainMenu'))?'inline-flex':'none';edb.style.left=(r.left+w/2)+'px';edb.style.top=(r.top+r.height*.93)+'px';edb.style.transform='translate(-50%,-50%)';
if(lay!=='ballFlight3'||!br){badge.style.display='none';sides=[];lastSn=0;return}
try{rt.objects.midText.getAllInstances().forEach(function(i){if(/^POINTS/i.test(i.text))i.isVisible=false})}catch(e){}
var sn=g.shotNumber,who=g.whoShoots;if(sn<lastSn)sides=[];lastSn=sn;if(sn>0)sides[sn]=who;
var idx=0,k;for(k=1;k<sn;k++)if(sides[k]===who)idx++;
var tid=who==='player'?g.myTeamID:g.myOpponentId;if(tid==null||tid<0){badge.style.display='none';return}
var a=rt.objects.arrTeams.getFirstInstance(),name=a.getAt(tid,0),kit=a.getAt(tid,2),sh=a.getAt(tid,4),d=P.load().t[tid]||{},
pl=(d.p&&d.p.length)?d.p:P.defPlayers(tid),pn=pl[idx%pl.length],logo=d.l||P.crestURL(kit,name),key=[tid,pn,logo.length,name,w|0].join('|');
badge.style.left=(r.left+w*.012)+'px';badge.style.top=(r.top+r.height*.975)+'px';badge.style.fontSize=(w*.036)+'px';badge.style.display='flex';
if(key!==lastKey){lastKey=key;badge.innerHTML='<img alt="" src="'+esc(logo)+'" style="width:'+(w*.09)+'px;height:'+(w*.09)+'px"><div><b>'+esc(pn)+'</b><small>'+esc(name)+'</small></div>'}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
