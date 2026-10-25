import input from '../episodes/custo-vida/countries.json' with {type:'json'};
// Editorial selection: remove remote micro-territories and places previously
// represented with a location inset. Retain ordinary national map reveals.
const excluded=new Set(['BMU','CYM','VIR','HKG','JEY','IMN','GGY','GIB','MAC','MLT','SYC','MDV','BHR','CPV','MUS','SGP','AND','LUX']);
export const costRows=input.filter(r=>!excluded.has(r.iso3));
const puertoRico=costRows.find(r=>r.iso3==='PRI');
if(puertoRico){costRows.splice(costRows.indexOf(puertoRico),1);costRows.splice(costRows.findIndex(r=>r.iso3==='TTO'),0,puertoRico);}
export const costFrames=180+costRows.length*108+180;
