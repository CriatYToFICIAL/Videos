import fs from 'node:fs';
import iso from 'i18n-iso-countries';
import pt from 'i18n-iso-countries/langs/pt.json' with {type:'json'};
iso.registerLocale(pt);
const native=iso.getAlpha3Code.bind(iso);iso.getAlpha3Code=(n,l)=>({'Catar':'QAT','Bahrein':'BHR','Quênia':'KEN','Irã':'IRN','Vietnã':'VNM','Moldávia':'MDA','Bielorrússia':'BLR','Cazaquistão':'KAZ','Maurício':'MUS'}[n]??native(n,l));
const text=fs.readFileSync(process.argv[2]??'episodes/custo-vida/input.txt','utf8');
const old=JSON.parse(fs.readFileSync('episodes/tiktok/countries.json'));
const lookup=iso.getAlpha3Code.bind(iso);const norm=s=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();iso.getAlpha3Code=(n,l)=>lookup(n,l)??Object.keys(iso.getAlpha3Codes()).find(c=>norm(new Intl.DisplayNames(['pt-BR'],{type:'region'}).of(iso.alpha3ToAlpha2(c)))===norm(n));
const aliases={'Bermudas':'BMU','Ilhas Cayman':'CYM','Ilhas Virgens Americanas':'VIR','Hong Kong':'HKG','Jersey':'JEY','Ilha de Man':'IMN','Guernsey':'GGY','Gibraltar':'GIB','Países Baixos (Holanda)':'NLD','República Tcheca':'CZE','Rep. Democrática do Congo':'COD','Singapura':'SGP','Seychelles':'SYC','Macau':'MAC','Botswana':'BWA','Myanmar':'MMR'};
const extra={BMU:[-64.75,32.3,38],CYM:[-81.25,19.3,65],VIR:[-64.8,18.3,65],HKG:[114.15,22.3,55],JEY:[-2.13,49.2,80],IMN:[-4.5,54.2,45],GGY:[-2.58,49.45,80],GIB:[-5.35,36.14,100],MAC:[113.55,22.18,100],PRI:[-66.4,18.2,24]};
const rows=[...text.matchAll(/^(\d+)\. (.+?) — US\$ ([\d.]+) \(~R\$ ([\d.]+)\)/gm)].map(m=>{const code=aliases[m[2]]??iso.getAlpha3Code(m[2],'pt');if(!code)throw Error(m[2]);const prior=old.find(r=>r.iso3===code);return {iso3:code,name:m[2],usd:Number(m[3].replaceAll('.','')),brl:Number(m[4].replaceAll('.','')),rank:Number(m[1]),region:prior?.region??(code==='HKG'||code==='MAC'?'Ásia':code==='PRI'||['BMU','CYM','VIR'].includes(code)?'América do Norte':'Europa'),sort:prior?.order??0,anchor:extra[code],eyeColor:prior?.eyeColor??'#b88839'};});
if(rows.length!==150||new Set(rows.map(r=>r.iso3)).size!==150)throw Error('Coverage');
const regions=['América do Norte','América do Sul','Europa','Ásia','África','Oceania'];
rows.sort((a,b)=>regions.indexOf(a.region)-regions.indexOf(b.region)||a.sort-b.sort);
for(const r of rows){if(r.iso3==='SYC')r.region='África';if(r.iso3==='MDV')r.region='Ásia';}
rows.sort((a,b)=>regions.indexOf(a.region)-regions.indexOf(b.region)||a.sort-b.sort);
fs.mkdirSync('episodes/custo-vida',{recursive:true});fs.writeFileSync('episodes/custo-vida/countries.json',JSON.stringify(rows,null,2));fs.writeFileSync('episodes/custo-vida/input.txt',text);
fs.writeFileSync('episodes/custo-vida/sources.md','Base fornecida pelo usuário, compilada pelo Gemini. Referências gerais declaradas pelo Gemini: Numbeo, LivingCost, Expatistan e Banco Mundial. Não foram fornecidos links por registro nem metodologia verificável; esses bancos não são apresentados como autores dos números. Valores estimados e arredondados; inclusão de aluguel e data de coleta não especificadas. Conversões BRL preservadas do arquivo, sem atualização cambial. 150 países e territórios.');
console.log(rows.length, [...new Set(rows.map(r=>r.region))]);
