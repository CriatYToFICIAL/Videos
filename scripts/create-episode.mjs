import {mkdir, writeFile} from "node:fs/promises";
import {resolve} from "node:path";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw new Error("Uso: npm run create:episode -- <slug-em-kebab-case>");
const directory = resolve("episodes", slug);
await mkdir(directory, {recursive: false});
const today = new Date().toISOString().slice(0, 10);
const metadata = {
  id: slug,
  title: "Título do episódio",
  hook: "Pergunta global do episódio",
  topicLabel: "TEMA",
  primaryLabel: "SIM",
  secondaryLabel: "NÃO/PARCIAL",
  language: "pt-BR",
  fps: 30,
  width: 1920,
  height: 1080,
  secondsPerCountry: 2,
  introSeconds: 4,
  outroSeconds: 5,
  scope: "Defina o escopo territorial e temporal.",
  methodology: "Defina a classificação e as fontes.",
  disclaimer: `VERIFICADO EM ${today}`,
};
await Promise.all([
  writeFile(resolve(directory, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`),
  writeFile(resolve(directory, "countries.json"), "[]\n"),
  writeFile(resolve(directory, "script.pt-BR.md"), "# Roteiro\n\n"),
  writeFile(resolve(directory, "sources.md"), "# Fontes\n\n"),
]);
console.log(`Episódio criado: ${directory}`);
