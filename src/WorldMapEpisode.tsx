import React from 'react';
import anchorData from './camera-anchors.json';
import {geoMercator, geoPath, geoCentroid, geoContains, geoArea} from 'd3-geo';
import iso from 'i18n-iso-countries';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {feature} from 'topojson-client';
import atlas from 'world-atlas/countries-50m.json';
import lightAtlas from 'world-atlas/countries-110m.json';
import type {Episode, Status} from './types';

const W=1920,H=1080;
const mapTiles=Array.from({length:64},(_,i)=>{const ix=i%8,iy=Math.floor(i/8),x=ix*256,y=-600+iy*256;return {ix,iy,x,y,width:Math.min(256,1920-x),height:Math.min(256,1300-y)};});
const projection=geoMercator().scale(290).translate([960,550]);
const path=geoPath(projection);
const features=(feature(atlas,atlas.objects.countries) as any).features as any[];
// Project disconnected land areas separately: Alaska/Aleutians must not make
// the contiguous US flag's texture bounds span almost the whole world.
const makeShapes=(items:any[])=>items.map(f=>{
 const parts=f.geometry.type==='MultiPolygon'?f.geometry.coordinates.map((coordinates:any)=>({type:'Feature',properties:{},geometry:{type:'Polygon',coordinates}})):[f];
 const patches=parts.map((part:any)=>({d:path(part)??'',bounds:path.bounds(part)}));
 const main=patches[parts.reduce((best:number,p:any,i:number)=>geoArea(p)>geoArea(parts[best])?i:best,0)];
 const mainPart=parts[patches.indexOf(main)];
 let faceCenter=projection(geoCentroid(mainPart))!;
 if(!geoContains(mainPart,projection.invert!(faceCenter)!)){
  const [[x,y],[xx,yy]]=main.bounds;let best=Infinity;
  for(let row=1;row<20;row++)for(let col=1;col<20;col++){const pt:[number,number]=[x+(xx-x)*col/20,y+(yy-y)*row/20];const distance=Math.hypot(col-10,row-10);if(distance<best&&geoContains(mainPart,projection.invert!(pt)!)){faceCenter=pt;best=distance;}}
 }
 return {id:String(f.id).padStart(3,'0'),d:path(f)??'',bounds:main.bounds,patches,centroid:geoCentroid(f),faceCenter,rasterBounds:path.bounds(f)};
});
const detailedShapes=makeShapes(features);
const lightShapes=makeShapes((feature(lightAtlas,lightAtlas.objects.countries) as any).features);
const colors={yes:'#19bc75',partial:'#ffa813',no:'#f6504a',unknown:'#9daab0'};
const names=new Intl.DisplayNames(['pt-BR'],{type:'region'});
const numberId=(code:string)=>iso.alpha3ToNumeric(code);
const flag=(code:string)=>staticFile(`flags/${iso.alpha3ToAlpha2(code)?.toLowerCase()}.svg`);
const label=(s:Status)=>({yes:'LIVRE',partial:'RESTRITO',no:'BLOQUEADO',unknown:'SEM DADOS'}[s]);
const ease=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const anchors=anchorData as unknown as Record<string,[number,number,number]>;

export const Face=({x,y,size,angry=false,phase=0,eyeColor='#24a9d4'}:{x:number;y:number;size:number;angry?:boolean;phase?:number;eyeColor?:string})=>{
 const frame=useCurrentFrame();
 const eyeClipId=React.useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const cycle=(frame+phase*19)%119;
 const openness=cycle<8?Math.max(.08,Math.abs(cycle-4)/4):1;
 const gaze=Math.sin((frame+phase*29)/48)*2.6;
 return <g transform={`translate(${x} ${y}) scale(${size/100})`}>
 {[-30,30].map((cx,i)=><g key={cx} transform={`scale(1 ${openness})`}>
 <defs><clipPath id={`${eyeClipId}-${i}`}><polygon points={`${cx-40},${i?0:-30} ${cx+40},${i?-30:0} ${cx+40},45 ${cx-40},45`}/></clipPath></defs>
 <g clipPath={angry?`url(#${eyeClipId}-${i})`:undefined}>
 <ellipse cx={cx} cy="0" rx="25" ry="29" fill="white" stroke="#111e27" strokeWidth="3.5"/>
 <g transform={`translate(${gaze} 0)`}><ellipse cx={cx+3} cy="3" rx="17" ry="20" fill={eyeColor} stroke="#112b3c" strokeWidth="2"/>
 <ellipse cx={cx+4} cy="5" rx="10" ry="13" fill="#071720"/>
 <circle cx={cx-3} cy="-7" r="7" fill="white"/><circle cx={cx+10} cy="12" r="3.5" fill="white"/></g>
 </g>
 {angry&&<g transform={`translate(${cx} 0) scale(${i?-1:1} 1)`}><path d="M -26 -31 L 26 -12 L 24 -3 L -26 -18 Z" fill="#142734"/></g>}
 </g>)}
 </g>;
};

export const WorldMapEpisode:React.FC<Episode>=(ep)=>{
 const shapes=ep.surveyYear?lightShapes:detailedShapes;
 const raster=ep.compactRestrictions&&ep.productionStage==='final';
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
 const records=[...ep.countries].sort((a,b)=>a.order-b.order);
 const categoryLabel=(s:Status)=>ep.categoryLabels?.[s]??label(s);
 const soundFor=(s:Status)=>ep.categorySounds?.[s]??({yes:'reveal.wav',partial:'notice.wav',no:'negative.wav',unknown:'unknown.wav'}[s]);
 const intro=ep.introSeconds*fps,step=ep.secondsPerCountry*fps;
 const index=Math.floor((frame-intro)/step),inIntro=index<0,outro=index>=records.length;
 const current=records[Math.max(0,Math.min(records.length-1,index))];
 const activeAge=frame-intro-index*step;
 const arrived=activeAge>=fps*.95;
 const cachedShot=raster&&arrived&&!inIntro&&!outro;
 const revealed=records.slice(0,inIntro?0:outro?records.length:Math.min(records.length,index+(arrived?1:0)));
 const target=(i:number):[number,number,number]=>{
  if(i<0||i>=records.length)return [0,10,.95];
  const pose=anchors[records[i].iso3];
  if(pose)return [pose[0],pose[1],pose[2]*(pose[2]>=7?1.65:1.12)];
  const shape=shapes.find(s=>s.id===numberId(records[i].iso3));
  if(!shape)return [0,10,1];
  const [[x,y],[xx,yy]]=shape.bounds;
  const c=projection.invert!([(x+xx)/2,(y+yy)/2])!;
  return [c[0],c[1],Math.min(128,Math.max(1.5,Math.min(880/(xx-x),650/(yy-y))))];
 };
 const a=target(index-1),b=target(index),t=ease((frame-intro-index*step)/(fps*.95));
 const lon=mix(a[0],b[0],t),lat=mix(a[1],b[1],t),z=mix(a[2],b[2],t);
 const center=projection([lon,lat])!;
 const tx=850-z*center[0],ty=490-z*center[1];
 const counts=(s:Status)=>revealed.filter(r=>!r.excludeFromTotals&&r.status===s).length;
 const yes=counts('yes'),no=counts('no'),partial=counts('partial');
 const previous=records.slice(0,Math.max(0,Math.min(records.length,index)));
 const tween=ease((activeAge-fps*.95)/(fps*.35));
 const share=(s:Status)=>{
  const ratio=(rows:typeof records)=>{const valid=rows.filter(r=>!r.excludeFromTotals&&(r.status==='yes'||r.status==='no'));return valid.length?valid.filter(r=>r.status===s).length/valid.length:(s==='yes'?1:0)};
  const old=ratio(previous);
  const next=ratio(revealed);
  return mix(old,next,outro?1:tween);
 };
 const percent=Math.round(100*share('yes'));
 const boundary=699+498*(1-share('no'));
 const detailOpacity=outro?1-ease((frame-intro-records.length*step)/(fps*.65)):1;
 const pop=1+.055*Math.sin(Math.max(0,Math.min(1,(activeAge-fps*.95)/12))*Math.PI);
 const font={fontFamily:'DejaVu Sans, sans-serif',fontWeight:900} as const;
 const outlined={paintOrder:'stroke',stroke:'#101a20',strokeWidth:7,strokeLinejoin:'round'} as const;
 return <div style={{width,height,overflow:'hidden',background:'#438eab'}}>
 <svg viewBox="0 0 1920 1080" width={width} height={height} style={font}>
 <defs>
 <linearGradient id="ocean" x2="0" y2="1"><stop stopColor="#65b5ca"/><stop offset="1" stopColor="#235d8d"/></linearGradient>
 <linearGradient id="bar" x2="0" y2="1"><stop stopColor="#77ef9f"/><stop offset=".45" stopColor="#1cbb73"/><stop offset="1" stopColor="#087548"/></linearGradient>
 <pattern id="ticks" width="9" height="60" patternUnits="userSpaceOnUse"><path d="M 2 0 V 60" stroke="#004d37" strokeWidth="2" opacity=".45"/></pattern>
 <filter id="shadow"><feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity=".6"/></filter>
 {!raster&&revealed.flatMap(r=>{const s=shapes.find(s=>s.id===numberId(r.iso3));return s?s.patches.map((p:any,i:number)=><clipPath key={`${r.iso3}-${i}`} id={`clip-${r.iso3}-${i}`}><path d={p.d}/></clipPath>):[]})}
 </defs>
 <rect width={W} height={H} fill="url(#ocean)"/>
 {[0,1,2,3,4,5].map(i=><path key={i} d={`M -200 ${100+i*190} Q 450 ${-15+i*190} 1100 ${115+i*190} T 2200 ${60+i*190} L 2200 ${170+i*190} Q 1400 ${90+i*190} 650 ${175+i*190} T -200 ${150+i*190}Z`} fill={i%2?'#7ac5d5':'#236b9b'} opacity=".19"/>)}
 <g transform={`translate(${tx} ${ty}) scale(${z})`}>
 {cachedShot?<image href={staticFile(`shots/${ep.id}/${index}.png`)} x={-tx/z} y={-ty/z} width={W/z} height={H/z}/>:raster?mapTiles.filter(p=>(p.x+p.width)*z+tx>=0&&p.x*z+tx<=W&&(p.y+p.height)*z+ty>=0&&p.y*z+ty<=H).map(p=><image key={`${p.ix}-${p.iy}`} href={staticFile(`maps/tile-${p.ix}-${p.iy}.png`)} x={p.x} y={p.y} width={p.width} height={p.height}/>):shapes.filter(s=>s.id!=='010').map(s=><path key={s.id} d={s.d} fill="#1ac918" stroke="#102423" strokeWidth={1.8/z}/>)}
 {revealed.filter(r=>{if(!raster)return true;const s=shapes.find(s=>s.id===numberId(r.iso3));if(!s)return false;const [[x,y],[xx,yy]]=s.rasterBounds;return xx*z+tx>=0&&x*z+tx<=W&&yy*z+ty>=0&&y*z+ty<=H;}).map(r=>{const s=shapes.find(s=>s.id===numberId(r.iso3));if(!s)return null;const [[x,y],[xx,yy]]=s.bounds;
 const anchor=anchors[r.iso3];const pt=anchor?projection([anchor[0],anchor[1]])!:s.faceCenter;
 // Thin islands need a screen-space floor; cap the pair at 38% of
 // land width so the flag remains legible (Jamaica is the regression case).
 const size=Math.min(Math.max(Math.min((xx-x)*.44,(yy-y)*.32),52/z),(xx-x)*.38,115/z);
 return <g key={r.iso3}>
 {!cachedShot&&(raster?<image href={staticFile(`maps/${s.id}.png`)} x={s.rasterBounds[0][0]} y={s.rasterBounds[0][1]} width={s.rasterBounds[1][0]-s.rasterBounds[0][0]} height={s.rasterBounds[1][1]-s.rasterBounds[0][1]}/>:s.patches.map((p:any,i:number)=>{const [[px,py],[qx,qy]]=p.bounds;return <image key={i} href={flag(r.iso3)} x={px} y={py} width={Math.max(.01,qx-px)} height={Math.max(.01,qy-py)} preserveAspectRatio="none" clipPath={`url(#clip-${r.iso3}-${i})`}/>}))}
 {r.status!=='yes'&&<path d={s.d} fill={colors[r.status]} opacity={ep.compactRestrictions&&r.status==='partial'?(r.iso3===current.iso3&&!outro&&activeAge/fps>=.95&&activeAge/fps<1.55?.36*Math.pow(Math.sin((activeAge/fps-.95)/.6*Math.PI*2),2):0):.22}/>}
 {!raster&&<path d={s.d} fill="none" stroke="#14231f" strokeWidth={2.1/z}/>}
 <g opacity={detailOpacity}><Face x={pt[0]} y={pt[1]} size={size*(r.iso3===current.iso3&&!outro?1+.07*Math.sin(Math.min(1,Math.max(0,activeAge/(fps*.5)))*Math.PI):1)} angry={r.status==='no'} phase={r.order} eyeColor={r.eyeColor??(r.status==='no'?'#df4039':'#24a9d4')}/></g>
 {r.status!=='yes'&&!(ep.compactRestrictions&&r.status==='partial')&&r.iso3===current.iso3&&!outro&&<g transform={`translate(${pt[0]} ${pt[1]+size*.7}) scale(${1/z})`}><rect x="-104" y="0" width="208" height="43" rx="10" fill={colors[r.status]} stroke="#172128" strokeWidth="4"/><text y="29" textAnchor="middle" fontSize="23" fill="#131c24">{categoryLabel(r.status)}</text></g>}
 </g>})}
 </g>
 <g filter="url(#shadow)">
 <text x="665" y="85" textAnchor="end" fontSize="34" fill="#1bd078" style={outlined}>{categoryLabel('yes')} {yes+no?`${percent}%`:'—'}</text>
 <rect x="693" y="40" width="510" height="58" rx="10" fill="#193e38" stroke="#ffba43" strokeWidth="5"/>
 <rect x="699" y="46" width="498" height="46" fill={yes+no?'url(#bar)':'#758b92'}/>
 <rect x={boundary} y="46" width={Math.max(0,1197-boundary)} height="46" fill="#f6504a"/>
 <rect x="699" y="46" width="498" height="46" fill="url(#ticks)"/>
 <rect x={(yes+no?boundary:948)-27} y="33" width="55" height="73" rx="8" fill="#ffb936" stroke="#142129" strokeWidth="4"/>
 <text x={yes+no?boundary:948} y="78" fontSize="18" textAnchor="middle">VS</text>
 <text x="1263" y="85" fontSize="34" fill="#ff665d" style={outlined}>{yes+no?`${Math.round(100*share('no'))}%`:'—'} {categoryLabel('no')}</text>
 </g>
 <g transform={`translate(65 800) scale(${arrived?pop:1})`} filter="url(#shadow)">
 <text x="0" y="50" fontSize="112" fill="#14bd75" style={outlined}>{yes}</text><text x="230" y="50" fontSize="112" fill="#ff6458" style={outlined}>{no}</text>
 <text x="0" y="112" fontSize={ep.surveyYear?26:35} fill="#24ce83" style={outlined}>{categoryLabel('yes')}</text><text x="230" y="112" fontSize={ep.surveyYear?26:31} fill="#ff6458" style={outlined}>{categoryLabel('no')}</text>
 <Face x={55} y={172} size={92}/><Face x={285} y={172} size={92} angry eyeColor="#df4039"/>
 {!ep.compactRestrictions&&<text y="225" fontSize="20" fill="#ffe8a2" stroke="#163344" strokeWidth="3" paintOrder="stroke">{partial} {ep.surveyYear?'divididos':'restrito(s)'} · {counts('unknown')} sem dados</text>}
 </g>
 {!outro&&revealed.slice(-5).reverse().map((r,i)=>{
 const age=frame-(intro+records.indexOf(r)*step+fps*.95);
 const progress=Math.max(0,Math.min(1,age/14));
 const overshoot=(v:number)=>1+2.3*Math.pow(v-1,3)+1.3*Math.pow(v-1,2);
 const scale=.84+.16*overshoot(progress);
 return <g key={r.iso3} transform={`translate(1665 ${652.5+i*78}) scale(${scale}) translate(-220 -32.5)`} opacity={(1-i*.13)*ease(age/5)}>
 <rect width="440" height="65" rx="12" fill={i===0&&r.status!=='yes'?'#473719':'#133d43'} fillOpacity=".94" stroke={colors[r.status]} strokeWidth="2"/>
 <image href={flag(r.iso3)} x="14" y="13" width="55" height="39"/>
 <text x="82" y="40" fontSize="23" textLength={(names.of(iso.alpha3ToAlpha2(r.iso3)!)??r.iso3).length>16?213:undefined} lengthAdjust="spacingAndGlyphs" fill="white" stroke="#111a20" strokeWidth="3" paintOrder="stroke">{(names.of(iso.alpha3ToAlpha2(r.iso3)!)??r.iso3).toUpperCase()}</text>
 <rect x="310" y="18" width="117" height="30" rx="5" fill={colors[r.status]} stroke="#111e26" strokeWidth="2"/>
 <text x="368" y="39" textAnchor="middle" fontSize="13" fill={r.status==='partial'?'#18212a':'white'}>{categoryLabel(r.status)}</text>
 </g>})}
 {!ep.surveyYear&&!inIntro&&!outro&&current.status!=='yes'&&arrived&&<g transform={`translate(975 1045) scale(${pop*ease((activeAge-fps*.95)/8)*ease((step-activeAge)/8)}) translate(-410 -177)`}>
 <rect width="820" height="177" rx="19" fill="#332e21" fillOpacity=".95" stroke="#ffb42c" strokeWidth="4"/>
 <image href={flag(current.iso3)} x="22" y="17" width="52" height="35"/><text x="90" y="47" fill="white" fontSize="27">{ep.compactRestrictions?names.of(iso.alpha3ToAlpha2(current.iso3)!):'EXEMPLO DE EXCEÇÃO'}</text>
 <path d="M 24 68 H 790" stroke="#a58338"/>
 <text x="26" y="111" fontSize="25" fill="#ffe9a0">{ep.compactRestrictions?categoryLabel(current.status):`CATEGORIA: ${categoryLabel(current.status)}`}</text>
 <text x="26" y="150" fontSize="20" fill="white">{ep.compactRestrictions?current.note:'Dados simulados para validar animação e interface.'}</text>
 </g>}
 {ep.surveyYear&&!inIntro&&!outro&&arrived&&<g transform={`translate(570 760) scale(${ease((activeAge-fps*.95)/12)*ease((step-activeAge)/10)})`}>
 <rect width="810" height="266" rx="20" fill="#123440" fillOpacity=".96" stroke={colors[current.status]} strokeWidth="3"/>
 <text x="24" y="38" fontSize="24" fill="#ffdb7a">{current.excludeFromTotals?'BÔNUS: A AUTOAVALIAÇÃO DO BRASIL':'INFLUÊNCIA DO BRASIL · BBC / GLOBESCAN 2017'}</text>
 <text x="24" y="83" fontSize="28" fill="#54e6a3">{current.positive}% positiva</text><text x="410" y="83" fontSize="28" fill="#ff8e88">{current.negative}% negativa</text>
 <rect x="24" y="101" width="760" height="15" rx="5" fill="#889aa1"/>
 <rect x="24" y="101" width={760*(current.positive??0)/100*ease((activeAge-fps)/30)} height="15" fill="#19bc75"/>
 <rect x={784-760*(current.negative??0)/100*ease((activeAge-fps)/30)} y="101" width={760*(current.negative??0)/100*ease((activeAge-fps)/30)} height="15" fill="#f6504a"/>
 <text x="24" y="149" fontSize="20" fill="#d5e3e8">{100-(current.positive??0)-(current.negative??0)}% sem avaliação positiva ou negativa</text>
 {(current.beats?.[Math.min(2,Math.floor(Math.max(0,activeAge/fps-2)/7))]??current.note).split('|').map((line,i)=><text key={i} x="24" y={194+i*30} fontSize="24" fill="white">{line}</text>)}
 </g>}
 {inIntro&&<g><rect width={W} height={H} fill="#123b52" opacity=".85"/><text x="960" y="370" textAnchor="middle" fill="white" fontSize="55" style={outlined}>{ep.hook}</text><text x="960" y="455" textAnchor="middle" fill="#ffd075" fontSize="32">{ep.surveyYear?'PESQUISA HISTÓRICA · BBC WORLD SERVICE / GLOBESCAN · 2017' :ep.compactRestrictions?'180 PAÍSES · ACESSO PÚBLICO E RESTRIÇÕES DE USO':'NOVO ESTUDO VISUAL · MAPAS ANIMADOS'}</text>{ep.surveyYear&&<><text x="960" y="550" textAnchor="middle" fill="white" fontSize="28">17 países estrangeiros + a autoavaliação brasileira</text><text x="960" y="610" textAnchor="middle" fill="white" fontSize="28">A pergunta mede a influência do Brasil no mundo.</text><text x="960" y="670" textAnchor="middle" fill="white" fontSize="28">Positiva, negativa ou dividida: classificação do relatório.</text><text x="960" y="730" textAnchor="middle" fill="#ffd075" fontSize="27">Os resultados descrevem 2017. Não são um retrato de 2026.</text></>}</g>}
 {inIntro&&ep.compactRestrictions&&<text x="960" y="574" textAnchor="middle" fontSize="28" fill="white">LIVRE = sem bloqueio registrado na base de referência.</text>}
 {outro&&ep.surveyYear&&<g><rect x="480" y="300" width="960" height="410" rx="24" fill="#123440" fillOpacity=".95"/><text x="960" y="380" textAnchor="middle" fill="#ffdc85" fontSize="40">O QUE A PESQUISA MOSTROU?</text>{['17 países estrangeiros: 8 positivos, 4 negativos, 5 divididos.','A barra compara apenas países positivos e negativos.','Não representa a porcentagem da população mundial.','O Brasil avaliou a si mesmo: fora dos totais estrangeiros.','Pesquisa histórica de 2017 · fonte e limites na descrição.'].map((s,i)=><text key={i} x="960" y={450+i*48} textAnchor="middle" fill="white" fontSize="25">{s}</text>)}</g>}
 {!(ep.compactRestrictions&&ep.productionStage==='final')&&<text x="960" y="1060" textAnchor="middle" fontSize="17" fill="white" opacity=".9">{ep.compactRestrictions?ep.disclaimer:ep.surveyYear?'BBC / GLOBESCAN 2017 · INFLUÊNCIA DO BRASIL · BARRA: PAÍSES POSITIVOS × NEGATIVOS · DIVIDIDOS À PARTE': 'PRÉVIA VISUAL · CATEGORIAS FICTÍCIAS · SEM AFIRMAÇÕES SOBRE RESTRIÇÕES REAIS'}</text>}
 </svg>
 {records.map((r,i)=><React.Fragment key={r.iso3}><Sequence from={Math.round(intro+i*step)} durationInFrames={26}><Audio src={staticFile('audio/whoosh.wav')} volume={.35}/></Sequence><Sequence from={Math.round(intro+i*step+fps*.95)} durationInFrames={18}><Audio src={staticFile(`audio/${soundFor(r.status)}`)} volume={.9}/></Sequence></React.Fragment>)}
 </div>;
};
