import fs from 'node:fs';
import {geoMercator,geoPath,geoArea} from 'd3-geo';
import {feature} from 'topojson-client';
import {Resvg} from '@resvg/resvg-js';
import iso from 'i18n-iso-countries';
const slug=process.argv[2];if(!slug||!/^[a-z0-9-]+$/.test(slug))throw Error('episode id required');
const atlas=JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const features=feature(atlas,atlas.objects.countries).features.filter(f=>String(f.id)!=='010');
const projection=geoMercator().scale(290).translate([960,550]),path=geoPath(projection);
const anchors=JSON.parse(fs.readFileSync('src/camera-anchors.json'));
const rows=JSON.parse(fs.readFileSync(`episodes/${slug}/countries.json`)).sort((a,b)=>a.order-b.order);
const shapes=features.map(f=>{const parts=f.geometry.type==='MultiPolygon'?f.geometry.coordinates.map(coordinates=>({type:'Feature',geometry:{type:'Polygon',coordinates},properties:{}})):[f];const patches=parts.map(p=>({d:path(p),bounds:path.bounds(p)}));const main=patches[parts.reduce((best,p,i)=>geoArea(p)>geoArea(parts[best])?i:best,0)];return {id:String(f.id).padStart(3,'0'),d:path(f),patches,bounds:main.bounds};});
const textures=new Map(rows.map(r=>[r.iso3,`data:image/svg+xml;base64,${fs.readFileSync(`public/flags/${iso.alpha3ToAlpha2(r.iso3).toLowerCase()}.svg`).toString('base64')}`]));
fs.mkdirSync(`public/shots/${slug}`,{recursive:true});
for(let i=0;i<rows.length;i++){
 const r=rows[i],s=shapes.find(s=>s.id===iso.alpha3ToNumeric(r.iso3));if(!s)throw Error(r.iso3);
 let pose=anchors[r.iso3];let z,lon,lat;if(pose){[lon,lat,z]=pose;z*=z>=7?1.65:1.12;}else{const [[x,y],[xx,yy]]=s.bounds;[lon,lat]=projection.invert([(x+xx)/2,(y+yy)/2]);z=Math.min(128,Math.max(1.5,Math.min(880/(xx-x),650/(yy-y))));}
 const center=projection([lon,lat]),tx=850-z*center[0],ty=490-z*center[1];
 const visible=p=>{const [[x,y],[xx,yy]]=p.bounds;return xx*z+tx>=0&&x*z+tx<=1920&&yy*z+ty>=0&&y*z+ty<=1080;};
 let body=shapes.flatMap(s=>s.patches.filter(visible).map(p=>`<path d="${p.d}" fill="#1ac918" stroke="#102423" stroke-width="${1.8/z}"/>`)).join('');
 for(const rr of rows.slice(0,i+1)){const ss=shapes.find(s=>s.id===iso.alpha3ToNumeric(rr.iso3));ss.patches.forEach((p,j)=>{if(!visible(p))return;const [[x,y],[xx,yy]]=p.bounds;const id=`c${rr.iso3}${j}`;body+=`<defs><clipPath id="${id}"><path d="${p.d}"/></clipPath></defs><image x="${x}" y="${y}" width="${xx-x}" height="${yy-y}" preserveAspectRatio="none" xlink:href="${textures.get(rr.iso3)}" clip-path="url(#${id})"/><path d="${p.d}" fill="none" stroke="#14231f" stroke-width="${2.1/z}"/>`;});}
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="1080"><g transform="translate(${tx} ${ty}) scale(${z})">${body}</g></svg>`;
 fs.writeFileSync(`public/shots/${slug}/${i}.png`,new Resvg(svg).render().asPng());
}
console.log(`${rows.length} camera holds baked`);
