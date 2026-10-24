import React from "react";
import {geoCentroid, geoEqualEarth, geoPath} from "d3-geo";
import isoCountries from "i18n-iso-countries";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {feature} from "topojson-client";
import worldTopology from "world-atlas/countries-110m.json" with {type: "json"};
import type {Feature, FeatureCollection, Geometry} from "geojson";
import type {CountryRecord, Episode, Status} from "./types";

type WorldFeature = Feature<Geometry, {name?: string}> & {id?: string | number};

const topology = worldTopology as unknown as {
  objects: {countries: unknown};
};
const countryFeatures = (
  feature(topology as never, topology.objects.countries as never) as FeatureCollection<Geometry>
).features as WorldFeature[];

const statusColors: Record<Status, string> = {
  yes: "#21c96b",
  partial: "#f2aa3b",
  no: "#e34b55",
  unknown: "#467f90",
};

const numericId = (iso3: string) => {
  const number = isoCountries.alpha3ToNumeric(iso3);
  return number ? String(number).padStart(3, "0") : null;
};

const recordForFeature = (records: CountryRecord[], item: WorldFeature) =>
  records.find((record) => numericId(record.iso3) === String(item.id).padStart(3, "0"));

const Eyes = ({x, y, status}: {x: number; y: number; status: Status}) => {
  const iris = status === "no" ? "#ff6571" : status === "partial" ? "#ffd95a" : "#63e7ff";
  return (
    <g transform={`translate(${x - 16} ${y - 7})`} pointerEvents="none">
      <ellipse cx="0" cy="0" rx="9" ry="11" fill="white" stroke="#102630" strokeWidth="2" />
      <ellipse cx="18" cy="0" rx="9" ry="11" fill="white" stroke="#102630" strokeWidth="2" />
      <circle cx="1" cy="1" r="4" fill={iris} />
      <circle cx="19" cy="1" r="4" fill={iris} />
      <circle cx="1" cy="1" r="1.8" fill="#102630" />
      <circle cx="19" cy="1" r="1.8" fill="#102630" />
    </g>
  );
};

const Counter = ({label, value, color}: {label: string; value: number; color: string}) => (
  <div style={{display: "flex", alignItems: "baseline", gap: 10}}>
    <strong style={{fontSize: 50, color, textShadow: "3px 3px 0 #102630"}}>{value}</strong>
    <span style={{fontSize: 18, fontWeight: 900, letterSpacing: 1}}>{label}</span>
  </div>
);

export const WorldMapEpisode: React.FC<Episode> = (episode) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const records = [...episode.countries].sort((a, b) => a.order - b.order);
  const introFrames = episode.introSeconds * fps;
  const eventFrames = episode.secondsPerCountry * fps;
  const activeIndex = Math.max(0, Math.min(records.length - 1, Math.floor((frame - introFrames) / eventFrames)));
  const isIntro = frame < introFrames;
  const isOutro = frame >= introFrames + records.length * eventFrames;
  const revealedCount = isIntro ? 0 : isOutro ? records.length : activeIndex + 1;
  const revealed = records.slice(0, revealedCount);
  const active = isIntro || isOutro ? null : records[activeIndex];
  const activeId = active ? numericId(active.iso3) : null;
  const activeFeature = activeId ? countryFeatures.find((item) => String(item.id).padStart(3, "0") === activeId) : null;

  const projection = geoEqualEarth().fitSize([width * 0.94, height * 0.75], {
    type: "Sphere",
  });
  const path = geoPath(projection);
  const point = activeFeature ? projection(geoCentroid(activeFeature)) : null;
  const phase = active ? (frame - introFrames - activeIndex * eventFrames) / eventFrames : 0;
  const eventPop = active ? spring({fps, frame: Math.round(phase * eventFrames), config: {damping: 12}}) : 0;
  const zoom = active && point ? interpolate(eventPop, [0, 1], [1, 1.16]) : 1;
  const tx = active && point ? (width / 2 - zoom * point[0]) * 0.48 : 0;
  const ty = active && point ? (height * 0.54 - zoom * point[1]) * 0.42 : 0;
  const count = (status: Status) => revealed.filter((record) => record.status === status).length;
  const recent = revealed.slice(-5).reverse();
  const progress = records.length ? (revealedCount / records.length) * 100 : 0;

  return (
    <div style={{width, height, overflow: "hidden", position: "relative", color: "white", fontFamily: "Arial Black, Arial, sans-serif", background: "#0b5268"}}>
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, #65d4dd 0%, #24798d 42%, #0a4058 100%)"}} />
      <div style={{position: "absolute", inset: 0, opacity: 0.22, backgroundImage: "repeating-linear-gradient(0deg, transparent 0 58px, #b8f4f2 60px 64px)"}} />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: "absolute", inset: 0}}>
        <g transform={`translate(${tx} ${ty}) scale(${zoom})`}>
          {countryFeatures.map((item) => {
            const record = recordForFeature(records, item);
            const isRevealed = !!record && revealed.some((entry) => entry.iso3 === record.iso3);
            const isCurrent = !!record && numericId(record.iso3) === activeId;
            const d = path(item) ?? "";
            return (
              <path
                key={String(item.id)}
                d={d}
                fill={isRevealed && record ? statusColors[record.status] : "#2e7881"}
                stroke={isCurrent ? "#fff6b1" : "#102630"}
                strokeWidth={isCurrent ? 4.5 : 1.4}
                style={{filter: isCurrent ? "drop-shadow(0 0 12px #fff6b1)" : undefined}}
              />
            );
          })}
          {revealed.map((record) => {
            const item = countryFeatures.find((candidate) => numericId(record.iso3) === String(candidate.id).padStart(3, "0"));
            const centroid = item ? projection(geoCentroid(item)) : null;
            if (!centroid || !item) return null;
            return <Eyes key={record.iso3} x={centroid[0]} y={centroid[1]} status={record.status} />;
          })}
        </g>
      </svg>

      <div style={{position: "absolute", top: 30, left: 70, right: 70, display: "flex", alignItems: "center", gap: 18, textShadow: "2px 2px 0 #102630"}}>
        <span style={{fontSize: 24, fontWeight: 900}}>{episode.topicLabel}</span>
        <div style={{height: 27, flex: 1, border: "3px solid #102630", borderRadius: 18, background: "#153e4d", overflow: "hidden"}}>
          <div style={{width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #21c96b, #a7f47e)", transition: "width 120ms linear"}} />
        </div>
        <span style={{fontSize: 22}}>{revealedCount}/{records.length}</span>
      </div>

      {!isIntro && (
        <>
          <div style={{position: "absolute", left: 70, bottom: 55, padding: "18px 24px", minWidth: 230, border: "3px solid #102630", borderRadius: 18, background: "rgba(11, 39, 51, .84)", boxShadow: "8px 8px 0 rgba(0,0,0,.22)"}}>
            <Counter label={episode.primaryLabel} value={count("yes")} color={statusColors.yes} />
            <Counter label={episode.secondaryLabel} value={count("partial") + count("no")} color={statusColors.partial} />
          </div>
          <div style={{position: "absolute", right: 58, top: 150, width: 310, display: "grid", gap: 8}}>
            {recent.map((record) => (
              <div key={record.iso3} style={{display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 12px", border: "2px solid #102630", borderRadius: 8, background: "rgba(7, 39, 49, .88)", fontSize: 16}}>
                <span>{record.iso3} · {record.region}</span>
                <strong style={{color: statusColors[record.status]}}>{record.label.toUpperCase()}</strong>
              </div>
            ))}
          </div>
        </>
      )}

      {active && (
        <div style={{position: "absolute", left: "50%", bottom: 70, transform: `translateX(-50%) scale(${interpolate(eventPop, [0, 1], [0.86, 1])})`, padding: "15px 28px", border: "4px solid #102630", borderRadius: 16, background: statusColors[active.status], color: "#102630", fontSize: 34, fontWeight: 900, textAlign: "center", boxShadow: "7px 7px 0 rgba(0,0,0,.26)"}}>
          {active.iso3} · {active.label.toUpperCase()}
        </div>
      )}

      {isIntro && (
        <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: "rgba(5, 35, 48, .24)", textShadow: "4px 4px 0 #102630"}}>
          <div style={{fontSize: 66, maxWidth: 1500, lineHeight: 1.05}}>{episode.hook}</div>
          <div style={{marginTop: 30, padding: "14px 24px", border: "4px solid #102630", borderRadius: 14, background: "#f2aa3b", color: "#102630", fontSize: 24}}>{episode.disclaimer}</div>
        </div>
      )}

      {isOutro && (
        <div style={{position: "absolute", left: "50%", bottom: 50, transform: "translateX(-50%)", padding: "18px 28px", border: "4px solid #102630", borderRadius: 16, background: "rgba(7, 39, 49, .9)", fontSize: 26, textAlign: "center", maxWidth: 1200}}>
          {episode.scope}
        </div>
      )}
    </div>
  );
};
