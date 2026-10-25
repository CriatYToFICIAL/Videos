import fs from 'node:fs';
const file='public/flags/us.svg';let svg=fs.readFileSync(file,'utf8');
if(svg.includes('<marker')){
 let stars='';
 for(let row=0;row<9;row++)for(let col=0;col<(row%2?5:6);col++){
  const x=(row%2?47:16)+61*col,y=11+26*row;
  const points=Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?4.5:11;return `${(x+Math.cos(a)*r).toFixed(2)},${(y+Math.sin(a)*r).toFixed(2)}`}).join(' ');
  stars+=`  <polygon fill="#fff" points="${points}"/>\n`;
 }
 svg=svg.replace(/  <marker[\s\S]*?<\/marker>\s*<path[^>]*marker-mid[^>]*\/>\s*/,stars);
 fs.writeFileSync(file,svg);
}
if(svg.includes('<marker')||(svg.match(/<polygon/g)||[]).length!==50)throw Error('US flag normalization failed');
console.log('US flag: 50 explicit stars; no marker renderer dependency');
