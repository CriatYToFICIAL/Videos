import {Composition} from "remotion";
import {CostEpisode} from './CostEpisode';
import {costFrames} from './cost-data';
import demoCountries from "../episodes/demo-access/countries.json" with {type: "json"};
import demoMetadata from "../episodes/demo-access/metadata.json" with {type: "json"};
import {WorldMapEpisode} from "./WorldMapEpisode";
import type {Episode} from "./types";

const demoEpisode: Episode = {
  ...demoMetadata,
  countries: demoCountries as Episode["countries"],
};

const durationInFrames = (episode: Episode) =>
  Math.round(
    (episode.introSeconds + episode.outroSeconds + episode.countries.length * episode.secondsPerCountry) *
      episode.fps,
  );

export const RemotionRoot = () => (
 <><Composition id="CostOfLiving" component={CostEpisode} durationInFrames={costFrames} fps={30} width={1920} height={1080}/>
  <Composition
    id="WorldMapEpisode"
    component={WorldMapEpisode}
    durationInFrames={durationInFrames(demoEpisode)}
    fps={demoEpisode.fps}
    width={demoEpisode.width}
    height={demoEpisode.height}
    defaultProps={demoEpisode}
    calculateMetadata={({props}) => {
      const episode = props as Episode;
      return {
        durationInFrames: durationInFrames(episode),
        fps: episode.fps,
        width: episode.width,
        height: episode.height,
      };
    }}
  /></>
);
