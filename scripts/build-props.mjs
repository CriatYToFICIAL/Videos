import {mkdir, readFile, writeFile} from "node:fs/promises";
import {dirname, resolve} from "node:path";

const [episodeDirectory, outputFile] = process.argv.slice(2);
if (!episodeDirectory || !outputFile) throw new Error("Uso: node scripts/build-props.mjs episodes/<id> output/<id>.props.json");
const readJson = async (name) => JSON.parse(await readFile(resolve(episodeDirectory, name), "utf8"));
const episode = {...(await readJson("metadata.json")), countries: await readJson("countries.json")};
await mkdir(dirname(outputFile), {recursive: true});
await writeFile(outputFile, `${JSON.stringify(episode, null, 2)}\n`);
console.log(`Props geradas: ${outputFile}`);
