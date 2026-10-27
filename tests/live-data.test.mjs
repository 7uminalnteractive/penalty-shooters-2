import assert from 'node:assert/strict';
import fs from 'node:fs';
import {startLive} from '../live-data.mjs';
const clubs=JSON.parse(fs.readFileSync(new URL('../clubs.json',import.meta.url))).teams.filter(t=>t.tier===1);
const oldFetch=globalThis.fetch,nav=Object.getOwnPropertyDescriptor(globalThis,'navigator');
Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
let days=1,missing=false;
const event=(id,a,b,offset,done)=>({id,date:new Date(Date.now()+offset*86400000).toISOString(),status:{type:{completed:done,state:done?'post':'pre'}},competitions:[{competitors:[{id:a.espnId,homeAway:'home',score:'2'},{id:b.espnId,homeAway:'away',score:'1'}]}]});
globalThis.fetch=async url=>({ok:true,json:async()=>{
 if(url.includes('scoreboard'))return{events:[event('1',clubs[0],clubs[1],-days,true),event('2',clubs[1],clubs[0],3,false)]};
 if(url.includes('standings'))return{children:[{standings:{entries:clubs.slice(0,missing?19:20).map(t=>({team:{id:t.espnId},stats:[{name:'points',value:40},{name:'gamesPlayed',value:20}]}))}}]};
 const t=clubs.find(t=>url.includes('/teams/'+t.espnId+'/'));return{athletes:t.players.map(p=>({id:p.id,displayName:p.name,jersey:p.number,position:{abbreviation:p.position}}))};
}});
try{
 const s=await startLive(clubs,{team:clubs[0].id,coach:'Teste'});assert.equal(s.mode,'live');assert.equal(s.fixtures.length,2);assert.equal(s.fixtures.filter(f=>f.historical).length,1);assert.equal(s.baseline.length,20);assert.equal(s.baseline[0].p,40);assert.ok(s.live.fetchedAt);console.log('PASS live: histórico, tabela, próximos jogos e elencos');
 days=30;await assert.rejects(()=>startLive(clubs,{team:clubs[0].id}),/desatualizados/);console.log('PASS live: cenário desatualizado é rejeitado');
 days=1;missing=true;await assert.rejects(()=>startLive(clubs,{team:clubs[0].id}),/classificação completa/);console.log('PASS live: tabela incompleta é rejeitada');
 navigator.onLine=false;await assert.rejects(()=>startLive(clubs,{team:clubs[0].id}),/internet/);console.log('PASS live: ausência de conexão é informada');
}finally{globalThis.fetch=oldFetch;if(nav)Object.defineProperty(globalThis,'navigator',nav);else delete globalThis.navigator;}
