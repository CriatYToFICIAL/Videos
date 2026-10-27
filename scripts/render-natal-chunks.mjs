import {existsSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
mkdirSync('output/natal-chunks',{recursive:true});
const total=15936,size=600;
for(let start=1200;start<total;start+=size){const end=Math.min(total-1,start+size-1),part=String(Math.floor(start/size)).padStart(3,'0'),out=`output/natal-chunks/part-${part}.mp4`;if(existsSync(out)){console.log(`skip ${part}`);continue}console.log(`start ${part} ${start}-${end}`);const r=spawnSync('npx',['remotion','render','src/index.ts','ChristmasMap',out,`--frames=${start}-${end}`,'--browser-executable=/usr/bin/chromium','--concurrency=5'],{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1)}
