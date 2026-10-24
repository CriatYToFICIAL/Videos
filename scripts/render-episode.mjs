import {spawn} from "node:child_process";
import {access, mkdir} from "node:fs/promises";
import {resolve} from "node:path";

const [slug, ...options] = process.argv.slice(2);
if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw new Error("Uso: npm run render -- <slug-em-kebab-case> [--frame N]");
const episodeDirectory = resolve("episodes", slug);
const metadataFile = resolve(episodeDirectory, "metadata.json");
await access(metadataFile);
await mkdir("output", {recursive: true});

const run = (command, args) =>
  new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {stdio: "inherit"});
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolveRun() : reject(new Error(`${command} terminou com código ${code}`))));
  });

await run(process.execPath, ["scripts/validate-episode.mjs", episodeDirectory]);
const propsFile = resolve("output", `${slug}.props.json`);
await run(process.execPath, ["scripts/build-props.mjs", episodeDirectory, propsFile]);

const framePosition = options.indexOf("--frame");
const isStill = framePosition >= 0;
const frame = isStill ? options[framePosition + 1] : null;
if (isStill && (!frame || !/^\d+$/.test(frame))) throw new Error("--frame requer um número inteiro");
const output = resolve("output", isStill ? `${slug}-frame-${frame}.png` : `${slug}.mp4`);
const args = [
  "remotion",
  isStill ? "still" : "render",
  "src/index.ts",
  "WorldMapEpisode",
  output,
  `--props=${propsFile}`,
  "--browser-executable=/usr/bin/chromium",
];
if (isStill) args.push(`--frame=${frame}`);
await run("npx", args);
console.log(`Render finalizado: ${output}`);
