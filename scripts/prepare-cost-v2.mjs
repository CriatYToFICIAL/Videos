import fs from 'node:fs';
import {costRows,costFrames} from '../src/cost-data.ts';
const dir='episodes/custo-vida-v2';fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(`${dir}/countries.json`,JSON.stringify(costRows.map((r,i)=>({...r,order:i+1})),null,2));
fs.writeFileSync(`${dir}/metadata.json`,JSON.stringify({id:'custo-vida-v2',title:'Quanto custa viver em cada país em 2026?',countries:costRows.length,frames:costFrames,fps:30,durationSeconds:costFrames/30},null,2));
console.log({countries:costRows.length,frames:costFrames,duration:costFrames/30});
