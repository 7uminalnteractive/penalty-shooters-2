
/* PS2 UI: visual minimalista (vidro), menus e placar estilo transmissão. Uso pessoal. */
(function(){
'use strict';
var P=window.PS2;if(!P||window.PS2_EDITOR)return;
var LG=[['Inglaterra','ENG'],['Espanha','ESP'],['Copa do Mundo','COPA'],['Itália','ITA'],['França','FRA'],['Brasil','BRA'],['México','MEX'],['América do Norte','AMN'],['Argentina','ARG'],['Holanda','HOL'],['Alemanha','ALE'],['Rússia','RUS']],
LGPOS=[[180,135],[480,135],[780,135],[180,230],[480,230],[780,230],[180,323],[480,323],[780,323],[180,415],[480,415],[780,415]];
var ICO={home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',cup:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4c0 3 1.5 4.5 4 5M16 6h4c0 3-1.5 4.5-4 5M12 13v4M8 21h8M10 17h4"/>',job:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',pen:'<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>'};
function ico(n){return '<svg viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+ICO[n]+'</svg>'}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var CSS='.ps2ui{position:fixed;inset:0;z-index:30;display:none;color:#f4f7f5;font-family:Inter,"SF Pro Display",-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-weight:500;font-size:calc(13px + .9vmin);padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);background:radial-gradient(1100px 620px at 12% -10%,rgba(198,244,50,.20),transparent 62%),radial-gradient(900px 560px at 105% 110%,rgba(32,201,180,.18),transparent 62%),linear-gradient(180deg,#0c211a,#06120e);overflow:auto;-webkit-tap-highlight-color:transparent}'
+'.ps2ui *{box-sizing:border-box}.gl{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);border-radius:1.5em;box-shadow:0 1.2em 3em rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.12)}'
+'.ps2ui button{font:inherit;color:inherit}.ub{font-weight:650;border-radius:999px;padding:.85em 1.5em;cursor:pointer;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);display:inline-flex;align-items:center;justify-content:center;gap:.55em;transition:background .15s,transform .1s}.ub:active{transform:scale(.98)}.ub:hover{background:rgba(255,255,255,.15)}.ub.pri{background:#c6f432;color:#0b1a07;border-color:transparent;box-shadow:0 .6em 1.6em rgba(198,244,50,.28)}.ub.pri:hover{background:#d4ff4a}.ub[disabled]{opacity:.42;cursor:default}.ub small{font-size:.7em;font-weight:600;opacity:.8;letter-spacing:.04em}'
+'.lbl{font-size:.66em;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.58);font-weight:600}.wm{font-weight:800;letter-spacing:-.03em;line-height:.92}.wm b{display:block;font-weight:800;color:#c6f432}'
+'.mm{min-height:100%;display:grid;grid-template-columns:auto 1fr;gap:1.1em;padding:1.1em;align-items:center}.rail{display:flex;flex-direction:column;gap:.35em;padding:.45em;border-radius:999px}.rail button{width:2.6em;height:2.6em;border-radius:50%;border:0;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,.75)}.rail button:hover{background:rgba(255,255,255,.12)}.rail .on{background:rgba(255,255,255,.2);color:#fff}'
+'.mmc{display:grid;grid-template-columns:1.35fr 1fr;gap:1.1em;align-items:stretch}.hero{padding:1.8em 2em;display:flex;flex-direction:column;gap:1.1em;justify-content:center}.hero .wm{font-size:2.9em}.hero p{margin:0;color:rgba(255,255,255,.66);max-width:28em;line-height:1.45;font-size:.92em}.acts{display:flex;flex-direction:column;gap:.6em;max-width:21em}.side{display:flex;flex-direction:column;gap:1.1em}.card{padding:1.2em 1.4em;display:flex;flex-direction:column;gap:.6em;justify-content:center}.card h4{margin:0;font-size:1.25em;font-weight:700;letter-spacing:-.01em}.chip{width:2.8em;height:2.8em;border-radius:50%;background:rgba(198,244,50,.14);border:1px solid rgba(198,244,50,.45);color:#c6f432;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.72em;letter-spacing:.04em}.row{display:flex;align-items:center;gap:.8em}'
+'@media (orientation:portrait),(max-width:700px){.mm{grid-template-columns:1fr;align-items:start}.rail{flex-direction:row;justify-self:center;order:2}.mmc{grid-template-columns:1fr}.hero{padding:1.4em}.hero .wm{font-size:2.4em}.acts{max-width:none}}'
+'.pg{min-height:100%;padding:1.3em 1.3em 1.6em;display:flex;flex-direction:column;gap:1em;max-width:62em;margin:0 auto}.pg h2{margin:0;font-size:1.6em;font-weight:750;letter-spacing:-.02em}.pg p{margin:.2em 0 0;color:rgba(255,255,255,.62);font-size:.9em}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(11em,1fr));gap:.7em}.lg{display:flex;align-items:center;gap:.8em;padding:.9em 1em;border-radius:1.1em;cursor:pointer;text-align:left}.lg:hover{background:rgba(255,255,255,.13)}.lg b{display:block;font-weight:650;font-size:1em}.lg small{color:rgba(255,255,255,.55);font-size:.72em;letter-spacing:.06em}.lg.on{border-color:rgba(198,244,50,.6)}'
+'.ct{min-height:100%;display:flex;align-items:center;justify-content:center;padding:1.2em}.vs{width:min(46em,100%);padding:1.6em 1.8em;display:flex;flex-direction:column;gap:1.3em;align-items:stretch}.vsr{display:grid;grid-template-columns:1fr auto 1fr;gap:1em;align-items:center}.tm{display:flex;flex-direction:column;align-items:center;gap:.7em;text-align:center}.tm img{width:5em;height:5em;object-fit:contain;filter:drop-shadow(0 .4em .8em rgba(0,0,0,.4))}.tm b{font-size:1.15em;font-weight:700;letter-spacing:-.01em}.vsx{font-weight:800;color:#c6f432;font-size:1.3em;letter-spacing:.06em}.bar{display:flex;gap:.6em;justify-content:center;flex-wrap:wrap}.splash{width:min(26em,100%);padding:2em;display:flex;flex-direction:column;gap:1.2em;align-items:center;text-align:center}.splash .wm{font-size:2.6em}'
/* placar estilo transmissão */
+'#ps2sb{position:fixed;z-index:20;display:none;font-family:"Arial Narrow","Roboto Condensed",Impact,"Segoe UI",sans-serif;font-weight:900;text-transform:uppercase;color:#fff;pointer-events:none;filter:drop-shadow(0 .18em .3em rgba(0,0,0,.35))}'
+'#ps2sb > .g{display:grid;grid-template-columns:11% 27% 24% 27% 11%;grid-template-rows:2.25em 2.55em;position:relative;background:#090266}'
+'#ps2sb .cr{grid-row:1/3;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#b6f600 0 42%,#00d4ba 43% 73%,#b6f600 74%)}#ps2sb .cl{grid-column:1}#ps2sb .cx{grid-column:5}#ps2sb .cr img{width:85%;height:85%;object-fit:contain;filter:drop-shadow(0 .08em .08em rgba(0,0,0,.4))}'
+'#ps2sb .nm{display:flex;align-items:center;justify-content:center;background:#090266;font-size:1.2em;letter-spacing:.015em;white-space:nowrap;overflow:hidden;text-overflow:clip;padding:0 .25em}#ps2sb .nm.sm{font-size:1em}#ps2sb .nm.xs{font-size:.8em}#ps2sb .nl{grid-column:2;grid-row:1}#ps2sb .nr{grid-column:4;grid-row:1}#ps2sb .nm.on{box-shadow:inset 0 -.09em 0 #b8f900}'
+'#ps2sb .sc{grid-column:3;grid-row:2;position:relative;display:flex;align-items:center;justify-content:center;background:#a9f500;color:#08005d;font-family:Arial,sans-serif;font-size:2em;line-height:1;letter-spacing:-.04em;text-transform:none}#ps2sb .tr{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);width:2.1em;height:1.15em;fill:#e6f344;filter:drop-shadow(0 0 .09em rgba(255,255,255,.75))}'
+'#ps2sb .dt{display:flex;align-items:center;justify-content:center;gap:.15em;background:#fff;overflow:hidden;padding:0 .18em}#ps2sb .dl{grid-column:2;grid-row:2}#ps2sb .dr{grid-column:4;grid-row:2}#ps2sb .d{width:1.9em;height:1.9em;flex:0 1 1.9em;min-width:0;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#080808;font-family:Arial,sans-serif;font-style:normal;font-size:.88em;line-height:1;color:#fff;font-weight:900}#ps2sb .d.g{background:#00d4b5;color:#001b20}#ps2sb .d.m{background:#ed1749}#ps2sb .d.c{box-shadow:0 0 0 .12em #a9f500}';
var chosenTeam='',teamsSignature='',teamScrollingUntil=0,lastTeamScan=0,teamSelectToken=0,els={},cur='',sbOn=false,whoAt=[],lastSn=0,oldHide=false,css=document.createElement('style');
css.textContent=CSS;
function mk(id,cls,html){var d=document.createElement('div');d.id=id;d.className=cls;d.innerHTML=html;document.body.appendChild(d);els[id]=d;return d}
function tap(x,y){return function(){P.tap(x,y)}}
function boot(){
document.head.appendChild(css);P.noEdb=true;
/* splash */
mk('ps2-splash','ps2ui','<div class="ct"><div class="gl splash"><div class="wm">Penalty<b>Shooters 2</b></div><div class="lbl">Campeonato rápido</div><button class="ub pri" data-t="480,370">Começar</button></div></div>');
/* liga */
var h='<div class="pg"><div><div class="lbl">Passo 1</div><h2>Escolha a liga</h2><p>Você pode trocar de liga depois pelo menu.</p></div><div class="grid">';
LG.forEach(function(l,i){h+='<button class="gl lg'+(i===5?' on':'')+'" data-t="'+LGPOS[i].join(',')+'"><span class="chip">'+l[1]+'</span><span><b>'+esc(l[0])+'</b><small>'+(i===5?'TIMES E JOGADORES EDITÁVEIS':'LIGA')+'</small></span></button>'});
mk('ps2-league','ps2ui',h+'</div></div>');
/* menu */
mk('ps2-menu','ps2ui','<div class="mm"><nav class="gl rail"><button class="on" aria-label="Início">'+ico('home')+'</button><button data-t="480,300" aria-label="Campeonato">'+ico('cup')+'</button><button disabled aria-label="Carreira" style="opacity:.4">'+ico('job')+'</button><button data-go="editor.html" aria-label="Editor">'+ico('pen')+'</button><button data-t="740,407" aria-label="Como jogar">'+ico('help')+'</button></nav>'
+'<div class="mmc"><div class="gl hero"><div class="lbl">Futebol de pênaltis</div><div class="wm">Penalty<b>Shooters 2</b></div><p>Escolha seu time, defina os cobradores e vá até a final.</p><div class="acts"><button class="ub pri" data-t="480,300">Campeonato rápido</button><button class="ub" disabled>Nova carreira <small>EM BREVE</small></button><button class="ub" disabled>Carregar carreira <small>EM BREVE</small></button></div></div>'
+'<div class="side"><div class="gl card"><div class="lbl">Liga atual</div><div class="row"><span class="chip" id="mmChip">BRA</span><h4 id="mmLg">Brasil</h4></div><button class="ub" data-t="230,407">Trocar liga</button></div><div class="gl card" id="mmEd"><div class="lbl">Personalizar</div><h4>Editor de times</h4><button class="ub" data-go="editor.html">Abrir editor</button></div><button class="ub" data-t="740,407">Como jogar</button></div></div></div>');
/* Seleção de time: os botões acionam os controles originais do jogo. */
mk('ps2-teams','ps2ui','<div class="pg"><div class="lbl">Campeonato rápido</div><h2>Escolha seu time</h2><p>Selecione um clube para continuar.</p><div class="grid" id="teamGrid"></div><p id="teamStatus" role="status"></p><div class="bar"><button class="ub pri" id="teamContinue" data-team-continue="1" disabled>Continuar</button></div></div>');
/* VS */
mk('ps2-vs','ps2ui','<div class="ct"><div class="gl vs"><div class="lbl" style="text-align:center">Próxima partida</div><div class="vsr"><div class="tm"><img id="vsA" alt=""><b id="vsAn"></b></div><div class="vsx">VS</div><div class="tm"><img id="vsB" alt=""><b id="vsBn"></b></div></div><div class="bar"><button class="ub" data-t="130,482">Menu</button><button class="ub" data-t="480,482">Como jogar</button><button class="ub pri" data-next="1">Próximo</button></div></div></div>');
/* placar */
var sb=mk('ps2sb','','<div class="g"><div class="cr cl"><img id="sbIl" alt=""></div><div class="nm nl" id="sbNl"></div><div class="sc"><svg class="tr" viewBox="0 0 24 18" fill="#ffd400"><path d="M6 1h12v6a6 6 0 0 1-12 0zM6 3H1c0 4 2 6 5 6.5M18 3h5c0 4-2 6-5 6.5M10 13h4v2h2v2H8v-2h2z"/></svg><span id="sbSc">0x0</span></div><div class="nm nr" id="sbNr"></div><div class="cr cx"><img id="sbIr" alt=""></div><div class="dt dl" id="sbDl"></div><div class="dt dr" id="sbDr"></div></div>');
Object.keys(els).forEach(function(id){if(id==='ps2sb')return;els[id].addEventListener('click',function(e){var b=e.target.closest('button');if(!b||b.disabled)return;
if(b.dataset.go){location.href=b.dataset.go;return}
if(b.dataset.teamUid){selectTeam(b.dataset.teamUid);return}
if(b.dataset.teamContinue){P.tap(840,486);return}
if(b.dataset.next){var rt=P.rt();if(rt&&rt.globalVars.leagueNum===P.league)P.openPick();else P.tap(840,482);return}
if(b.dataset.t){var c=b.dataset.t.split(',');P.tap(+c[0],+c[1])}})});
setInterval(tick,100);
(function raf(){if(oldHide)hideOld();requestAnimationFrame(raf)})();
}
function hideOld(){var rt=P.rt();if(!rt)return;var o=rt.objects;['result_base','shotStatus'].forEach(function(k){try{o[k].getAllInstances().forEach(function(x){x.isVisible=false;x.opacity=0})}catch(e){}});
try{o.midText.getAllInstances().forEach(function(x){if(x.x>=590&&x.y>=350&&x.y<=445){x.isVisible=false;x.opacity=0}})}catch(e){}
try{o.bigTextShotAnnouncement.getAllInstances().forEach(function(x){if(/TURN/i.test(String(x.text))){x.isVisible=false;x.opacity=0}})}catch(e){}}

/* Usa a posição do controle original para selecionar qualquer clube da lista. */
function selectTeam(uid){var token=++teamSelectToken,el=els['ps2-teams'],status=el.querySelector('#teamStatus');chosenTeam='';lastTeamScan=0;el.querySelector('#teamContinue').disabled=true;status.textContent='Selecionando time...';
function step(attempt){var rt=P.rt();if(token!==teamSelectToken||!rt||rt.layout.name!=='teamPick')return;var inst=rt.objects.TeamButton.getAllInstances().find(function(v){return String(v.uid)===uid});if(!inst){status.textContent='Não foi possível selecionar. Tente novamente.';return}
var cv=document.querySelector('canvas').getBoundingClientRect(),q=inst.layer.layerToCssPx(inst.x+inst.width*.48,inst.y+inst.height*.3),x=(q[0]-cv.left)/cv.width*960,y=(q[1]-cv.top)/cv.height*540;
if(x<80||x>880){if(attempt>=4){status.textContent='Não foi possível selecionar. Tente novamente.';return}P.tap(x<80?34:926,294);setTimeout(function(){step(attempt+1)},900);return}
P.tap(x,y);setTimeout(function(){var current=P.rt();if(token!==teamSelectToken||!current||current.layout.name!=='teamPick')return;if(+current.globalVars.myTeamID!==+inst.instVars.teambuttonID){status.textContent='Não foi possível selecionar. Tente novamente.';return}chosenTeam=uid;status.textContent='Time selecionado.';lastTeamScan=0;drawTeams()},250)}
step(0)}
function drawTeams(){var rt=P.rt(),el=els['ps2-teams'],now=Date.now();if(!rt||!el||rt.layout.name!=='teamPick'||now-lastTeamScan<300)return;lastTeamScan=now;
try{var items=[];rt.objects.TeamButton.getAllInstances().forEach(function(x){var id=+x.instVars.teambuttonID;if(x.y<100||x.y>380||!Number.isFinite(id)||id<0)return;items.push({uid:String(x.uid),id:id,x:x.x,y:x.y})});
items.sort(function(a,b){return a.y-b.y||a.x-b.x});var key=JSON.stringify(items.map(function(t){return [t.uid,t.id]}))+chosenTeam;if(key===teamsSignature)return;teamsSignature=key;items.forEach(function(t){var details=team(rt,t.id,rt.globalVars.leagueNum===P.league);t.name=details.n;t.logo=details.logo});
el.querySelector('#teamGrid').innerHTML=items.map(function(t){return '<button class="gl lg'+(chosenTeam===t.uid?' on':'')+'" data-team-uid="'+esc(t.uid)+'"><img alt="" src="'+esc(t.logo)+'" style="width:2.8em;height:2.8em;object-fit:contain"><span><b>'+esc(t.name)+'</b></span></button>'}).join('');el.querySelector('#teamContinue').disabled=!chosenTeam;
}catch(e){console.warn('PS2: não foi possível mostrar a seleção de times',e)}}
function show(id){Object.keys(els).forEach(function(k){if(k==='ps2sb')return;els[k].style.display=(k===id)?'block':'none'});P.ovl=!!id}
function team(rt,id,br){var a=rt.objects.arrTeams.getFirstInstance(),n=a.getAt(id,0),k=a.getAt(id,2),d=(br&&P.load().t[id])||{};return{n:n,logo:d.l||P.crestURL(k,n)}}
function tick(){
var rt=P.rt();if(!rt){return}
var lay='';try{lay=rt.layout.name}catch(e){}var g=rt.globalVars,br=g.leagueNum===P.league;
var id=({splash:'ps2-splash',pickLeague:'ps2-league',mainMenu:'ps2-menu',teamPick:'ps2-teams',matchIntroV2:'ps2-vs'})[lay]||'';
if(lay==='teamPick')drawTeams();else if(chosenTeam){chosenTeam='';teamsSignature='';teamScrollingUntil=0;lastTeamScan=0;teamSelectToken++}
if(lay==='mainMenu'){var l=LG[g.leagueNum]||['Liga','—'];els['ps2-menu'].querySelector('#mmLg').textContent=l[0];els['ps2-menu'].querySelector('#mmChip').textContent=l[1];els['ps2-menu'].querySelector('#mmEd').style.display=br?'':'none'}
if(lay==='matchIntroV2'&&g.myTeamID>=0){var A=team(rt,g.myTeamID,br),B=team(rt,g.myOpponentId,br),e=els['ps2-vs'];e.querySelector('#vsA').src=A.logo;e.querySelector('#vsB').src=B.logo;e.querySelector('#vsAn').textContent=A.n;e.querySelector('#vsBn').textContent=B.n}
if(cur!==id){cur=id;show(id)}
/* placar */
var cv=document.querySelector('canvas');if(!cv)return;
if(lay!=='ballFlight3'||g.myTeamID<0){els.ps2sb.style.display='none';oldHide=false;whoAt=[];lastSn=0;return}
oldHide=true;
var r=cv.getBoundingClientRect(),sn=g.shotNumber,who=g.whoShoots;if(sn<lastSn)whoAt=[];lastSn=sn;if(sn>0)whoAt[sn]=who;
var me=team(rt,g.myTeamID,br),op=team(rt,g.myOpponentId,br),homeMe=g.wePlayHome==='yes',L=homeMe?{w:'player',t:me,s:g.tempResultPlayer}:{w:'cpu',t:op,s:g.tempResultCPU},R=homeMe?{w:'cpu',t:op,s:g.tempResultCPU}:{w:'player',t:me,s:g.tempResultPlayer};
var st=[];try{var a=rt.objects.arrShotStatus.getFirstInstance();for(var x=0;x<a.width;x++)st.push(a.getAt(x,0))}catch(e){}
function dots(w){var arr=[],i;for(i=0;i<st.length;i++){if(whoAt[i+1]===w){var c=(st[i]===2)?'g':(st[i]===1)?'m':((i+1===sn&&who===w)?'c':'p');arr.push(c)}}
var n=Math.max(5,arr.length),h='';for(i=0;i<n;i++)h+='<i class="d '+(arr[i]||'p')+'">'+(i+1)+'</i>';return h}
function cls(nm){return nm.length>13?'xs':nm.length>10?'sm':''}
var W=Math.min(r.width*.46,r.height*.8),e=els.ps2sb,k=JSON.stringify([L.t.n,R.t.n,L.s,R.s,dots(L.w),dots(R.w),who,L.t.logo.length,R.t.logo.length]);
e.style.display='block';e.style.width=W+'px';e.style.fontSize=(W/34)+'px';e.style.left=(r.right-W-r.width*.015)+'px';e.style.top=(r.top+r.height*.82)+'px';hideOld();
if(e.__k!==k){e.__k=k;var q=function(i){return e.querySelector(i)};q('#sbIl').src=L.t.logo;q('#sbIr').src=R.t.logo;
q('#sbNl').textContent=L.t.n;q('#sbNr').textContent=R.t.n;q('#sbNl').className='nm nl '+cls(L.t.n)+(who===L.w?' on':'');q('#sbNr').className='nm nr '+cls(R.t.n)+(who===R.w?' on':'');
q('#sbSc').textContent=L.s+'x'+R.s;q('#sbDl').innerHTML=dots(L.w);q('#sbDr').innerHTML=dots(R.w)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
