/* Same-origin interface to the original Construct runtime. No private APIs beyond
   the runtime handle already used by ps2-mod.js; gameplay remains in Construct. */
(function(){'use strict';
const embedded=window.parent!==window;if(!embedded)return;
const style=document.createElement('style');style.textContent='.ps2btn,#ps2badge,#ps2pick{display:none!important}';document.head.append(style);
let active=null,phase='idle',lastLayout='',ready=false,paused=false,error='',shotRecords=[],lastShot=0,lastWho='',lastScores=[0,0],booted=false;
function runtime(){try{return window.c3_runtimeInterface?._localRuntime?.GetIRuntime()||null}catch{return null}}
function tell(type,data){parent.postMessage({source:'ps2-engine-v2',type,...data},location.origin)}
function arr(r,name){return r.objects[name]?.getFirstInstance()}
function fillTeams(r,teams){const a=arr(r,'arrTeams');if(!a)throw Error('Base de clubes ainda não carregou.');a.setSize(Math.max(32,...teams.map(t=>t.id+1)),5,1);for(const t of teams){a.setAt(t.name,t.id,0);a.setAt(80,t.id,1);a.setAt(t.kit||'03010011',t.id,2);a.setAt(t.awayKit||'03000111',t.id,3);a.setAt(t.short,t.id,4);}}
window.PS2Engine={
 status(){return{ready,phase,error}},
 start(payload){const r=runtime();if(!ready||!r)throw Error('O motor ainda está carregando.');if(active)throw Error('Já há uma partida em andamento.');fillTeams(r,payload.teams);active=payload;phase='intro';error='';shotRecords=[];lastShot=0;lastScores=[0,0];lastWho='';paused=false;r.timeScale=1;const g=r.globalVars;g.leagueNum=5;g.myTeamID=payload.team;g.opponentID=payload.home===payload.team?payload.away:payload.home;g.myOpponentId=g.opponentID;g.wePlayHome=payload.home===payload.team?'yes':'no';g.areWeHosts=payload.home===payload.team?1:0;g.COMPETITION_ROUND=0;g.showAd='no';g.rewardAdWatched=true;g.GAMEDISTRIBUTION_ENABLED='NO';g.soundStatus=payload.sound===false?1:0;g.tempResultPlayer=0;g.tempResultCPU=0;g.shotNumber=0;const shots=arr(r,'arrShotStatus');if(shots){shots.setSize(200,1,1);for(let i=0;i<200;i++)shots.setAt(0,i);}r.goToLayout('matchIntroV2');},
 pause(value){let r=runtime();if(!r||!active)return;paused=!!value;r.timeScale=paused?0:1;},
 exit(){let r=runtime();active=null;phase='idle';paused=false;if(r){r.globalVars.soundStatus=1;try{r.callFunction('checkSound')}catch{}r.timeScale=1;r.goToLayout('mainMenu');}},
 setSound(on){let r=runtime();if(r){r.globalVars.soundStatus=on?0:1;try{r.callFunction('checkSound')}catch{}}}
};
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&active){e.preventDefault();tell('pause-request',{})}});
function finish(r){if(!active)return;const g=r.globalVars,p=Number(g.tempResultPlayer)||0,c=Number(g.tempResultCPU)||0,payload=active;active=null;phase='idle';r.timeScale=1;tell('result',{id:payload.id,score:payload.home===payload.team?[p,c]:[c,p]});r.goToLayout('mainMenu');}
function hideOriginalHUD(r){for(const name of ['result_base','resultBackground','shotStatus','teamName','mainMenuIcon','sound'])for(const o of r.objects[name]?.getAllInstances()||[])o.isVisible=false;
 // The original result text lives at the top. Keep shot instructions and players visible.
 for(const name of ['midText','midTextOrange','bigText','veryBigText'])for(const o of r.objects[name]?.getAllInstances()||[])if(o.y<95||(name==='midText'&&o.y>340&&o.y<450))o.isVisible=false;
}
setInterval(()=>{try{const r=runtime();if(!r)return;const layout=r.layout.name,g=r.globalVars;
 if(!booted&&['splash','pickLeague'].includes(layout)){booted=true;g.leagueNum=5;r.goToLayout('first');return;}
 if(!ready&&arr(r,'arrColourTable')?.width>=21&&layout==='mainMenu'){ready=true;r.addEventListener('afterlayoutstart',()=>{if(active&&phase==='playing'&&['mobileAd','afterMatch','results','gameOver','knockoutPhase'].includes(r.layout.name))finish(r);});tell('ready',{});}
 if(!active)return;
 if(phase==='intro'&&layout==='matchIntroV2'){phase='playing';setTimeout(()=>{if(active){r.goToLayout('ballFlight3')}},100);}
 if(layout==='ballFlight3'){
  hideOriginalHUD(r);const shot=Number(g.shotNumber),who=g.whoShoots;let scores=[Number(g.tempResultPlayer)||0,Number(g.tempResultCPU)||0];
  const status=arr(r,'arrShotStatus')?.getAt((shot-1)%10);
  if(shot>0&&status>0)shotRecords[shot-1]={who,goal:status===2};
  const records=shotRecords.filter(Boolean);lastShot=shot;lastWho=who;
  lastScores=scores;tell('tick',{id:active.id,home:active.home===active.team?scores[0]:scores[1],away:active.home===active.team?scores[1]:scores[0],records,who,shot,paused});
 }
 if(['afterMatch','results','gameOver','knockoutPhase','interAd','mobileAd'].includes(layout)&&phase==='playing'){
  finish(r);
 }
 lastLayout=layout;
}catch(e){error=e.message;tell('error',{message:e.message});active=null;phase='idle';}},80);
})();
