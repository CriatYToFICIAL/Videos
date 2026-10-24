import fs from 'node:fs';
import {geoMercator,geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import {Resvg} from '@resvg/resvg-js';
import iso from 'i18n-iso-countries';
const atlas=JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const features=feature(atlas,atlas.objects.countries).features;
const path=geoPath(geoMercator().scale(290).translate([960,550]));
const onlyId=process.argv[2];
const seen=new Set();
fs.mkdirSync('public/maps',{recursive:true});
const bake=(name,body,bounds)=>{const [[x,y],[xx,yy]]=bounds;const width=xx-x,height=yy-y;if(width<=0||height<=0||!Number.isFinite(width+height))return;const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${Math.max(1,Math.ceil(width*6))}" height="${Math.max(1,Math.ceil(height*6))}" viewBox="${x} ${y} ${width} ${height}">${body}</svg>`;fs.writeFileSync(`public/maps/${name}.png`,new Resvg(svg).render().asPng());};
const worldBody=features.filter(f=>String(f.id)!=='010').map(f=>`<path d="${path(f)}" fill="#1ac918" stroke="#102423" stroke-width=".2"/>`).join('');
if(!onlyId)for(let iy=0;iy<8;iy++)for(let ix=0;ix<8;ix++){const x=ix*256,y=-600+iy*256;bake(`tile-${ix}-${iy}`,worldBody,[[x,y],[Math.min(1920,x+256),Math.min(1300,y+256)]]);}
for(const f of features){const id=String(f.id).padStart(3,'0');if((onlyId&&id!==onlyId)||seen.has(id))continue;seen.add(id);const code=iso.numericToAlpha3(id);if(!code)continue;const flag=`public/flags/${iso.alpha3ToAlpha2(code)?.toLowerCase()}.svg`;if(!fs.existsSync(flag))continue;const href=`data:image/svg+xml;base64,${fs.readFileSync(flag).toString('base64')}`;const parts=f.geometry.type==='MultiPolygon'?f.geometry.coordinates.map(coordinates=>({type:'Feature',geometry:{type:'Polygon',coordinates},properties:{}})):[f];
 const body=parts.map((p,i)=>{const [[x,y],[xx,yy]]=path.bounds(p);const d=path(p);return `<defs><clipPath id="c${i}"><path d="${d}"/></clipPath></defs><image x="${x}" y="${y}" width="${xx-x}" height="${yy-y}" preserveAspectRatio="none" xlink:href="${href}" clip-path="url(#c${i})"/><path d="${d}" fill="none" stroke="#14231f" stroke-width=".2"/>`;}).join('');bake(id,body,path.bounds(f));}
console.log('Raster map assets complete');
