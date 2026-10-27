/* Independent simulation model. Real-world snapshots never share simulated results. */
export const VERSION = 1;
export const clone = x => JSON.parse(JSON.stringify(x));
export function rng(seed) { let a=seed>>>0; return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;}; }
export function roundRobin(ids, twice=true) {
 const a=[...ids]; if(a.length%2)a.push(null); const rounds=[];
 for(let r=0;r<a.length-1;r++){const pairs=[];for(let i=0;i<a.length/2;i++){let h=a[i],v=a[a.length-1-i];if(h!==null&&v!==null)pairs.push((r+i)%2?[v,h]:[h,v]);}rounds.push(pairs);a.splice(1,0,a.pop());}
 return twice?[...rounds,...rounds.map(r=>r.map(([a,b])=>[b,a]))]:rounds;
}
export function datePlus(date,days){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
export function standings(state,comp='league') {
 const ids=state.competitions[comp]?.members||[];
 const map=new Map(ids.map(id=>[id,{id,p:0,j:0,v:0,e:0,d:0,gf:0,ga:0,form:[]}]));
 if(comp==='league'&&state.baseline)state.baseline.forEach(x=>{if(map.has(x.id))Object.assign(map.get(x.id),clone(x));});
 for(const f of state.fixtures.filter(f=>f.comp===comp&&f.result&&!f.historical)){
  let a=map.get(f.home),b=map.get(f.away);if(!a||!b)continue;let [x,y]=f.result;a.j++;b.j++;a.gf+=x;a.ga+=y;b.gf+=y;b.ga+=x;
  if(x===y){a.e++;b.e++;a.p++;b.p++;a.form.push('E');b.form.push('E');}else{let w=x>y?a:b,l=x>y?b:a;w.v++;w.p+=3;l.d++;w.form.push('V');l.form.push('D');}
 }
 return [...map.values()].map(x=>({...x,sg:x.gf-x.ga,form:x.form.slice(-5)})).sort((a,b)=>b.p-a.p||b.v-a.v||b.sg-a.sg||b.gf-a.gf||a.id-b.id);
}
export function createCareer(clubs,{team,coach='Treinador',season=2026,mode='career',continental=null}={}){
 const s={version:VERSION,id:globalThis.crypto?.randomUUID?.()||String(Date.now()),team,coach,season,mode,date:`${season}-01-28`,createdAt:new Date().toISOString(),savedAt:null,budget:100,teams:clone(clubs),fixtures:[],competitions:{league:{name:'Brasileirão',members:clubs.map(t=>t.id),format:'league'}},news:[],history:[],orders:{},pending:null};
 roundRobin(clubs.map(t=>t.id)).forEach((round,r)=>round.forEach(([home,away],i)=>s.fixtures.push({id:`L-${r}-${i}`,comp:'league',round:r+1,date:datePlus(s.date,r*8),home,away,result:null})));
 if(mode==='career'){
  s.competitions.cup={name:'Copa do Brasil',members:clubs.map(t=>t.id),format:'cup',stage:0,alive:clubs.map(t=>t.id),adapted:true};scheduleCup(s,'cup',datePlus(s.date,12));
  if(continental&&continental.members.length>=4){s.competitions.continental={name:continental.name,members:continental.members,format:'cup',stage:0,alive:[...continental.members],adapted:true};scheduleCup(s,'continental',datePlus(s.date,20));}
 }
 news(s,'Um novo capítulo',`${coach} assume o comando de ${club(s,team).name}. A temporada começa agora.`);return s;
}
export const club=(s,id)=>s.teams.find(t=>t.id===id);
export function news(s,title,text){s.news.unshift({id:`${Date.now()}-${s.news.length}`,date:s.date,title,text});s.news=s.news.slice(0,100);}
export function scheduleCup(s,key,date){let c=s.competitions[key],alive=c.alive;if(alive.length<=1)return;
 const power=2**Math.floor(Math.log2(alive.length));let n=alive.length===power?alive.length:(alive.length-power)*2;
 c.stage++;c.byes=alive.slice(n);for(let i=0;i<n;i+=2)s.fixtures.push({id:`${key}-${c.stage}-${i}`,comp:key,round:c.stage,date,home:alive[i],away:alive[i+1],result:null});
}
export function nextFixture(s){return s.fixtures.filter(f=>!f.result&&(f.home===s.team||f.away===s.team)).sort((a,b)=>a.date.localeCompare(b.date))[0]||null;}
function simulatedScore(random,draw){let a=Math.floor(random()*5),b=Math.floor(random()*5);if(!draw&&a===b)a++;return[a,b];}
export function settle(s,id,score){const f=s.fixtures.find(x=>x.id===id);if(!f)throw Error('Partida não encontrada.');if(f.result)return false;
 if(!Array.isArray(score)||score.length!==2||score.some(x=>!Number.isInteger(x)||x<0))throw Error('Placar inválido.');
 if(s.competitions[f.comp]?.format==='cup'&&score[0]===score[1])throw Error('O mata-mata precisa de um vencedor.');
 const random=rng(s.season*900+s.fixtures.indexOf(f)+s.history.length);s.date=f.date;f.result=[...score];
 // Finish every scheduled AI fixture up to this date; never auto-play the user's fixtures.
 s.fixtures.filter(x=>!x.result&&x.date<=f.date&&x.home!==s.team&&x.away!==s.team).forEach(x=>x.result=simulatedScore(random,s.competitions[x.comp]?.format==='league'));
 for(const [k,c] of Object.entries(s.competitions)){if(c.format!=='cup')continue;let current=s.fixtures.filter(x=>x.comp===k&&x.round===c.stage);if(current.length&&current.every(x=>x.result)){c.alive=[...(c.byes||[]),...current.map(x=>x.result[0]>x.result[1]?x.home:x.away)];if(c.alive.length===1){c.champion=c.alive[0];news(s,'Título decidido',`${club(s,c.champion).name} conquista ${c.name}.`);}else scheduleCup(s,k,datePlus(current.map(x=>x.date).sort().at(-1),16));}}
 let own=f.home===s.team?score[0]:score[1],opp=f.home===s.team?score[1]:score[0];s.budget+=own>opp?2:0.5;s.history.push({fixture:id,team:s.team,result:[...score]});s.pending=null;
 news(s,own>opp?'Vitória para a conta':own<opp?'Hora de reagir':'Tudo igual',`${club(s,f.home).name} ${score[0]} × ${score[1]} ${club(s,f.away).name}. Resultado da sua carreira.`);return true;
}
export function simulate(s,id){let f=s.fixtures.find(f=>f.id===id);if(!f)throw Error('Partida não encontrada.');return settle(s,id,simulatedScore(rng(s.season+s.history.length*419+s.fixtures.indexOf(f)),s.competitions[f.comp].format==='league'));}
export function transfer(s,fromId,playerId){let from=club(s,fromId),to=club(s,s.team);if(!from||from===to)throw Error('Escolha outro clube.');let p=from.players.find(p=>p.id===playerId);if(!p)throw Error('Jogador indisponível.');if(to.players.some(x=>x.id===p.id))throw Error('Este jogador já consta no seu elenco.');if(from.players.length<=11)throw Error('O clube precisa manter pelo menos 11 jogadores.');if(s.budget<p.value)throw Error('Orçamento insuficiente.');s.budget-=p.value;from.players=from.players.filter(x=>x.id!==playerId);to.players.push(p);news(s,'Reforço confirmado',`${p.name} deixa ${from.name} e chega ao ${to.name}.`);return p;}
export function sell(s,playerId){let from=club(s,s.team),p=from.players.find(x=>x.id===playerId);if(!p||from.players.length<=11)throw Error('Mantenha pelo menos 11 jogadores no elenco.');let to=s.teams.find(t=>t.id!==s.team);from.players=from.players.filter(x=>x.id!==playerId);to.players.push(p);s.budget+=Math.round(p.value*.8);s.orders[s.team]=(s.orders[s.team]||[]).filter(x=>x!==playerId);news(s,'Saída confirmada',`${p.name} foi negociado com ${to.name}.`);}
export function changeClub(s,id){if(s.pending)throw Error('Conclua a partida antes de mudar de clube.');if(!s.teams.some(t=>t.id===id&&s.competitions.league.members.includes(id)))throw Error('Clube indisponível.');if(id===s.team)return;const before=club(s,s.team).name;s.team=id;s.budget=80;news(s,'Novo comando',`${s.coach} deixa ${before} para assumir ${club(s,id).name}.`);}
export function validateSave(s){if(!s||s.version!==VERSION||!Array.isArray(s.teams)||!Array.isArray(s.fixtures)||!s.competitions||!s.orders||!Array.isArray(s.news)||!Array.isArray(s.history))throw Error('Arquivo de carreira incompatível.');const ids=new Set(s.teams.map(t=>t.id));if(!/^\d{4}-\d{2}-\d{2}$/.test(s.date)||!Number.isInteger(s.season)||s.season<2020||s.season>2200||!ids.has(s.team)||!Number.isFinite(s.budget)||s.budget<0||typeof s.coach!=='string'||typeof s.id!=='string')throw Error('Carreira inválida.');for(const t of s.teams)if(!Number.isInteger(t.id)||!Array.isArray(t.players)||typeof t.name!=='string'||t.players.some(p=>typeof p.id!=='string'||typeof p.name!=='string'||!Number.isFinite(p.value)))throw Error('Elenco inválido.');for(const f of s.fixtures)if(!ids.has(f.home)||!ids.has(f.away)||f.home===f.away||!s.competitions[f.comp]||!/^\d{4}-\d{2}-\d{2}$/.test(f.date)||f.result&&(!Array.isArray(f.result)||f.result.length!==2||f.result.some(x=>!Number.isInteger(x)||x<0)))throw Error('Calendário inválido.');return s;}
export function createQuick(clubs,team){const chosen=clubs.slice(0,32);if(chosen.length!==32)throw Error('O campeonato rápido precisa de 32 clubes.');const s=createCareer(chosen,{team,mode:'quick'});s.fixtures=[];s.competitions={};for(let n=0;n<8;n++){let members=chosen.slice(n*4,n*4+4).map(t=>t.id),key='group'+n;s.competitions[key]={name:'Grupo '+String.fromCharCode(65+n),members,format:'group'};roundRobin(members,false).forEach((pairs,r)=>pairs.forEach(([home,away],i)=>s.fixtures.push({id:`Q-${n}-${r}-${i}`,comp:key,round:r+1,date:datePlus(s.date,r*7),home,away,result:null})));}s.news=[];news(s,'O caminho até a taça','32 clubes, oito grupos e mata-mata. Os dois melhores de cada grupo avançam.');return s;}
export function advanceQuick(s){if(s.mode!=='quick'||s.competitions.knockout)return;const groups=Object.keys(s.competitions);if(!s.fixtures.every(f=>f.result))return;const rows=groups.map(k=>standings(s,k));let alive=[];for(let i=0;i<8;i+=2)alive.push(rows[i][0].id,rows[i+1][1].id,rows[i+1][0].id,rows[i][1].id);s.competitions.knockout={name:'Fase final',members:alive,format:'cup',stage:0,alive};scheduleCup(s,'knockout',datePlus(s.date,7));}
export function advanceWorld(s){const random=rng(s.history.length+Date.now());let pending=s.fixtures.filter(f=>!f.result).sort((a,b)=>a.date.localeCompare(b.date));if(!pending.length)return false;const date=pending[0].date;if(pending.some(f=>f.date===date&&(f.home===s.team||f.away===s.team)))throw Error('Jogue ou simule a partida do seu clube.');for(const f of pending.filter(f=>f.date===date))settle(s,f.id,simulatedScore(random,s.competitions[f.comp]?.format!=='cup'));advanceQuick(s);return true;}
