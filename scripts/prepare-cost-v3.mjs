import fs from 'node:fs';
import iso from 'i18n-iso-countries';
import {feature,neighbors} from 'topojson-client';
import {geoCentroid,geoDistance} from 'd3-geo';
const base=JSON.parse(fs.readFileSync('episodes/custo-vida/countries.json'));
const prior=JSON.parse(fs.readFileSync('episodes/tiktok/countries.json'));
const atlas=JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const geometries=atlas.objects.countries.geometries,features=feature(atlas,atlas.objects.countries).features,adj=neighbors(geometries);
const excluded=new Set(['BMU','CYM','VIR','HKG','JEY','IMN','GGY','GIB','MAC','MLT','SYC','MDV','BHR','CPV','MUS','SGP','AND','LUX','LIE','MCO','SMR','VAT','NRU','TUV','PLW','KNA','DMA','ATG','GRD','LCA','VCT','COM','STP']);
const names=new Intl.DisplayNames(['pt-BR'],{type:'region'});
// Keep the previous editorial limit on remote micro-islands, including the
// newly considered Pacific states that would create dateline-spanning detours.
for(const code of ['KIR','FSM','WSM'])excluded.add(code);
const africa='DZA AGO BEN BWA BFA BDI CMR CAF TCD COD COG CIV DJI EGY GNQ ERI SWZ ETH GAB GMB GHA GIN GNB KEN LSO LBR LBY MDG MWI MLI MRT MAR MOZ NAM NER NGA RWA SEN SLE SOM ZAF SSD SDN TZA TGO TUN UGA ZMB ZWE'.split(' ');
const supplied=Object.fromEntries('HTI:950 PSE:850 TKM:1500 BTN:412 LAO:650 TLS:506 PRK:600 LBY:401 SDN:430 ERI:508 DJI:950 SOM:600 BDI:450 MWI:550 LSO:650 SWZ:540 COG:850 GAB:1000 GNQ:1100 BEN:650 TGO:550 LBR:515 SLE:412 GIN:650 GNB:550 GMB:600 MRT:700 MLI:550 BFA:550 NER:500 TCD:518 CAF:502 SSD:506 PNG:1550 VUT:900'.split(' ').map(s=>{const [code,value]=s.split(':');return [code,Number(value)];}));
const rows=base.filter(r=>!excluded.has(r.iso3)).map(r=>({...r,hasData:true}));
for(const code of new Set([...prior.map(r=>r.iso3),...africa])){
 if(excluded.has(code)||rows.some(r=>r.iso3===code)||!features.some(f=>String(f.id).padStart(3,'0')===iso.alpha3ToNumeric(code)))continue;
 const old=prior.find(r=>r.iso3===code);
 const usd=supplied[code]??0;
 rows.push({iso3:code,name:names.of(iso.alpha3ToAlpha2(code)),usd,brl:Math.round(usd*5.3),rank:0,region:africa.includes(code)?'África':old.region,sort:0,eyeColor:old?.eyeColor??'#9b713c',hasData:usd>0});
}
const index=r=>features.findIndex(f=>String(f.id).padStart(3,'0')===iso.alpha3ToNumeric(r.iso3));
const center=r=>geoCentroid(features[index(r)]);
const result=[];
for(const region of ['América do Norte','América do Sul','Europa','Ásia','África','Oceania']){
 const pool=rows.filter(r=>r.region===region);let current=pool.find(r=>r.iso3===({'América do Norte':'CAN','América do Sul':'COL','Europa':'PRT','Ásia':'TUR','África':'MAR','Oceania':'AUS'}[region]))??pool[0];
 while(pool.length){result.push(current);pool.splice(pool.indexOf(current),1);if(!pool.length)break;const next=pool.filter(r=>adj[index(current)].includes(index(r)));current=(next.length?next:pool).sort((a,b)=>geoDistance(center(current),center(a))-geoDistance(center(current),center(b)))[0];}
}
fs.mkdirSync('episodes/custo-vida-v3',{recursive:true});fs.writeFileSync('episodes/custo-vida-v3/countries.json',JSON.stringify(result.map((r,i)=>({...r,order:i+1})),null,2));
fs.writeFileSync('episodes/custo-vida-v3/metadata.json',JSON.stringify({countries:result.length,known:result.filter(r=>r.hasData).length,unknown:result.filter(r=>!r.hasData).length,africa:result.filter(r=>r.region==='África').length,seconds:(360+result.length*96)/30},null,2));
console.log(fs.readFileSync('episodes/custo-vida-v3/metadata.json','utf8'));
