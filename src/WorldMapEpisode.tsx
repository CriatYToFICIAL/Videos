import React from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import iso from 'i18n-iso-countries';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {feature} from 'topojson-client';
import atlas from 'world-atlas/countries-50m.json';
import type {Episode, Status} from './types';

const W=1920,H=1080;
const projection=geoMercator().scale(290).translate([960,550]);
const path=geoPath(projection);
const features=(feature(atlas,atlas.objects.countries) as any).features as any[];
const shapes=features.map(f=>({id:String(f.id).padStart(3,'0'),d:path(f)??'',bounds:path.bounds(f)}));
const colors={yes:'#19bc75',partial:'#ffa813',no:'#f6504a',unknown:'#9daab0'};
const names=new Intl.DisplayNames(['pt-BR'],{type:'region'});
const numberId=(code:string)=>iso.alpha3ToNumeric(code);
const flag=(code:string)=>staticFile(`flags/${iso.alpha3ToAlpha2(code)?.toLowerCase()}.svg`);
const label=(s:Status)=>({yes:'LIVRE',partial:'RESTRITO',no:'BLOQUEADO',unknown:'SEM DADOS'}[s]);
const ease=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const anchors:Record<string,[number,number,number]>={CAN:[-102,58,2.3],USA:[-100,39,3],MEX:[-102,23,4.2],GTM:[-90.3,15.7,8],CUB:[-79.5,21.8,7],HTI:[-72.7,19,10],DOM:[-70.2,19,10],JAM:[-77.3,18.1,10],COL:[-74,4.2,5.2],VEN:[-66,7.5,5.2],ECU:[-78.5,-1.4,7],PER:[-75,-10,5.2],BRA:[-52,-12,3.5],BOL:[-64.5,-17,5.5],CHL:[-71,-30,4],ARG:[-64,-35,4]};

export const Face=({x,y,size,angry=false}:{x:number;y:number;size:number;angry?:boolean})=><g transform={`translate(${x} ${y}) scale(${size/100})`}>
 <defs><radialGradient id="iris"><stop stopColor="#b2f8ff"/><stop offset=".55" stopColor="#24a9d4"/><stop offset="1" stopColor="#074867"/></radialGradient></defs>
 {[-30,30].map((cx,i)=><g key={cx} transform={`rotate(${angry?(i?16:-16):0} ${cx} 0)`}>
 <ellipse cx={cx} cy="0" rx="25" ry="29" fill="white" stroke="#111e27" strokeWidth="3.5"/>
 <ellipse cx={cx+3} cy="3" rx="17" ry="20" fill={angry?'#df4039':'url(#iris)'} stroke="#112b3c" strokeWidth="2"/>
 <ellipse cx={cx+4} cy="5" rx="10" ry="13" fill="#071720"/>
 <circle cx={cx-3} cy="-7" r="7" fill="white"/><circle cx={cx+10} cy="12" r="3.5" fill="white"/>
 {angry&&<path d={`M ${cx-27} -26 L ${cx+26} -12 L ${cx+24} -34 L ${cx-25} -34 Z`} fill="#142734"/>}
 </g>)}
 </g>;

export const WorldMapEpisode:React.FC<Episode>=(ep)=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig();
 const records=[...ep.countries].sort((a,b)=>a.order-b.order);
 const intro=ep.introSeconds*fps,step=ep.secondsPerCountry*fps;
 const index=Math.floor((frame-intro)/step),inIntro=index<0,outro=index>=records.length;
 const current=records[Math.max(0,Math.min(records.length-1,index))];
 const revealed=records.slice(0,inIntro?0:Math.min(records.length,index+1));
 const target=(i:number):[number,number,number]=>{
  if(i<0||i>=records.length)return [0,10,.95];
  return anchors[records[i].iso3]??[0,10,1];
 };
 const a=target(index-1),b=target(index),t=ease((frame-intro-index*step)/(fps*.95));
 const lon=mix(a[0],b[0],t),lat=mix(a[1],b[1],t),z=mix(a[2],b[2],t);
 const center=projection([lon,lat])!;
 const tx=850-z*center[0],ty=490-z*center[1];
 const counts=(s:Status)=>revealed.filter(r=>r.status===s).length;
 const yes=counts('yes'),no=counts('no'),partial=counts('partial');
 const percent=revealed.length?Math.round(100*yes/revealed.length):100;
 const activeAge=frame-intro-index*step;
 const font={fontFamily:'DejaVu Sans, sans-serif',fontWeight:900} as const;
 const outlined={paintOrder:'stroke',stroke:'#101a20',strokeWidth:7,strokeLinejoin:'round'} as const;
 return <div style={{width,height,overflow:'hidden',background:'#438eab'}}>
 <svg viewBox="0 0 1920 1080" width={width} height={height} style={font}>
 <defs>
 <linearGradient id="ocean" x2="0" y2="1"><stop stopColor="#65b5ca"/><stop offset="1" stopColor="#235d8d"/></linearGradient>
 <linearGradient id="bar" x2="0" y2="1"><stop stopColor="#77ef9f"/><stop offset=".45" stopColor="#1cbb73"/><stop offset="1" stopColor="#087548"/></linearGradient>
 <pattern id="ticks" width="9" height="60" patternUnits="userSpaceOnUse"><path d="M 2 0 V 60" stroke="#004d37" strokeWidth="2" opacity=".45"/></pattern>
 <filter id="shadow"><feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity=".6"/></filter>
 {revealed.map(r=>{const s=shapes.find(s=>s.id===numberId(r.iso3));return s?<clipPath key={r.iso3} id={`clip-${r.iso3}`}><path d={s.d}/></clipPath>:null})}
 </defs>
 <rect width={W} height={H} fill="url(#ocean)"/>
 {[0,1,2,3,4,5].map(i=><path key={i} d={`M -200 ${100+i*190} Q 450 ${-15+i*190} 1100 ${115+i*190} T 2200 ${60+i*190} L 2200 ${170+i*190} Q 1400 ${90+i*190} 650 ${175+i*190} T -200 ${150+i*190}Z`} fill={i%2?'#7ac5d5':'#236b9b'} opacity=".19"/>)}
 <g transform={`translate(${tx} ${ty}) scale(${z})`}>
 {shapes.filter(s=>s.id!=='010').map(s=><path key={s.id} d={s.d} fill="#1ac918" stroke="#102423" strokeWidth={1.8/z}/>)}
 {revealed.map(r=>{const s=shapes.find(s=>s.id===numberId(r.iso3));if(!s)return null;const [[x,y],[xx,yy]]=s.bounds;
 const anchor=anchors[r.iso3];const pt=anchor?projection([anchor[0],anchor[1]])!:[(x+xx)/2,(y+yy)/2];
 const size=Math.min((xx-x)*.44,(yy-y)*.32,115/z);
 return <g key={r.iso3}>
 <image href={flag(r.iso3)} x={x} y={y} width={xx-x} height={yy-y} preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-${r.iso3})`}/>
 {r.status!=='yes'&&<path d={s.d} fill={colors[r.status]} opacity=".22"/>}
 <path d={s.d} fill="none" stroke="#14231f" strokeWidth={2.1/z}/>
 <Face x={pt[0]} y={pt[1]} size={size} angry={r.status==='no'}/>
 {r.status!=='yes'&&<g transform={`translate(${pt[0]} ${pt[1]+size*.55}) scale(${1/z})`}><rect x="-104" y="0" width="208" height="43" rx="10" fill={colors[r.status]} stroke="#172128" strokeWidth="4"/><text y="29" textAnchor="middle" fontSize="23" fill="#131c24">{label(r.status)}</text></g>}
 </g>})}
 </g>
 <g filter="url(#shadow)">
 <text x="390" y="85" fontSize="37" fill="#1bd078" style={outlined}>LIVRE {percent}%</text>
 <rect x="693" y="40" width="510" height="58" rx="10" fill="#193e38" stroke="#ffba43" strokeWidth="5"/>
 <rect x="699" y="46" width={Math.max(1,498*percent/100)} height="46" fill="url(#bar)"/>
 <rect x="699" y="46" width="498" height="46" fill="url(#ticks)"/>
 <rect x="1180" y="33" width="55" height="73" rx="8" fill="#ffb936" stroke="#142129" strokeWidth="4"/>
 <text x="1208" y="78" fontSize="18" textAnchor="middle">VS</text>
 <text x="1263" y="85" fontSize="34" fill="#ff665d" style={outlined}>{revealed.length?Math.round(100*no/revealed.length):0}% BLOQUEADO</text>
 </g>
 <g transform="translate(65 800)" filter="url(#shadow)">
 <text x="0" y="50" fontSize="112" fill="#14bd75" style={outlined}>{yes}</text><text x="230" y="50" fontSize="112" fill="#ff6458" style={outlined}>{no}</text>
 <text x="0" y="112" fontSize="35" fill="#24ce83" style={outlined}>LIVRE</text><text x="210" y="112" fontSize="31" fill="#ff6458" style={outlined}>BLOQUEADO</text>
 <Face x={55} y={172} size={92}/><Face x={285} y={172} size={92} angry/>
 <text y="225" fontSize="20" fill="#ffe8a2" stroke="#163344" strokeWidth="3" paintOrder="stroke">{partial} restrito(s) · {counts('unknown')} sem dados</text>
 </g>
 {revealed.slice(-5).reverse().map((r,i)=><g key={r.iso3} transform={`translate(1445 ${620+i*78})`} opacity={1-i*.13}>
 <rect width="440" height="65" rx="12" fill={i===0&&r.status!=='yes'?'#473719':'#133d43'} fillOpacity=".94" stroke={colors[r.status]} strokeWidth="2"/>
 <image href={flag(r.iso3)} x="14" y="13" width="55" height="39"/>
 <text x="82" y="40" fontSize="23" fill="white" stroke="#111a20" strokeWidth="3" paintOrder="stroke">{(names.of(iso.alpha3ToAlpha2(r.iso3)!)??r.iso3).toUpperCase()}</text>
 <rect x="310" y="18" width="117" height="30" rx="5" fill={colors[r.status]} stroke="#111e26" strokeWidth="2"/>
 <text x="368" y="39" textAnchor="middle" fontSize="13" fill={r.status==='partial'?'#18212a':'white'}>{label(r.status)}</text>
 </g>)}
 {!inIntro&&!outro&&current.status!=='yes'&&activeAge>fps*.8&&<g transform="translate(565 868)" opacity={ease((activeAge-fps*.8)/8)}>
 <rect width="820" height="177" rx="19" fill="#332e21" fillOpacity=".95" stroke="#ffb42c" strokeWidth="4"/>
 <image href={flag(current.iso3)} x="22" y="17" width="52" height="35"/><text x="90" y="47" fill="white" fontSize="27">EXEMPLO DE EXCEÇÃO</text>
 <path d="M 24 68 H 790" stroke="#a58338"/>
 <text x="26" y="111" fontSize="25" fill="#ffe9a0">CATEGORIA: {label(current.status)}</text>
 <text x="26" y="150" fontSize="20" fill="white">Dados simulados para validar animação e interface.</text>
 </g>}
 {inIntro&&<g><rect width={W} height={H} fill="#123b52" opacity=".6"/><text x="960" y="475" textAnchor="middle" fill="white" fontSize="68" style={outlined}>O MUNDO, PAÍS POR PAÍS</text><text x="960" y="555" textAnchor="middle" fill="#ffd075" fontSize="32">NOVO ESTUDO VISUAL · MAPAS ANIMADOS</text></g>}
 <text x="960" y="1060" textAnchor="middle" fontSize="17" fill="white" opacity=".8">PRÉVIA VISUAL · CATEGORIAS FICTÍCIAS · SEM AFIRMAÇÕES SOBRE RESTRIÇÕES REAIS</text>
 </svg>
 {records.map((r,i)=><Sequence key={r.iso3} from={Math.round(intro+i*step+fps*.8)} durationInFrames={12}><Audio src={staticFile(r.status==='yes'?'audio/reveal.wav':'audio/notice.wav')} volume={.9}/></Sequence>)}
 </div>;
};
