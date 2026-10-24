import {mkdir, readFile, writeFile} from "node:fs/promises";
import {basename, resolve} from "node:path";

const episodeDirectory = process.argv[2];
if (!episodeDirectory) {
  throw new Error("Uso: npm run validate -- episodes/<id>");
}

const readJson = async (name) => JSON.parse(await readFile(resolve(episodeDirectory, name), "utf8"));
const metadata = await readJson("metadata.json");
const countries = await readJson("countries.json");
const errors = [];
const warnings = [];
const allowedStatuses = new Set(["yes", "partial", "no", "unknown"]);

for (const field of ["id", "title", "hook", "topicLabel", "primaryLabel", "secondaryLabel", "scope", "methodology", "disclaimer"]) {
  if (!metadata[field] || typeof metadata[field] !== "string") errors.push(`metadata.${field} é obrigatório`);
}
for (const field of ["fps", "width", "height", "secondsPerCountry", "introSeconds", "outroSeconds"]) {
  if (!Number.isFinite(metadata[field]) || metadata[field] <= 0) errors.push(`metadata.${field} deve ser um número positivo`);
}
if (!Array.isArray(countries) || countries.length === 0) errors.push("countries.json precisa conter ao menos um país");

const seenIso3 = new Set();
const seenOrder = new Set();
for (const [index, record] of countries.entries()) {
  const prefix = `countries[${index}]`;
  if (!/^[A-Z]{3}$/.test(record.iso3 ?? "")) errors.push(`${prefix}.iso3 deve usar ISO alpha-3 em maiúsculas`);
  if (seenIso3.has(record.iso3)) errors.push(`${prefix}.iso3 está duplicado: ${record.iso3}`);
  seenIso3.add(record.iso3);
  if (!allowedStatuses.has(record.status)) errors.push(`${prefix}.status é inválido`);
  if (!Number.isInteger(record.order) || record.order < 1) errors.push(`${prefix}.order deve ser inteiro positivo`);
  if (seenOrder.has(record.order)) errors.push(`${prefix}.order está duplicado: ${record.order}`);
  seenOrder.add(record.order);
  if (!record.label || !record.region || !record.note || !record.source_title) errors.push(`${prefix} tem campos de contexto ausentes`);
  try {
    new URL(record.source_url);
  } catch {
    errors.push(`${prefix}.source_url não é uma URL válida`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.checked_at ?? "")) errors.push(`${prefix}.checked_at deve usar AAAA-MM-DD`);
  if (!['high', 'medium', 'low'].includes(record.confidence)) errors.push(`${prefix}.confidence é inválido`);
  if (record.status === "unknown") warnings.push(`${record.iso3} está sem classificação final`);
}

const statusCounts = Object.fromEntries([...allowedStatuses].map((status) => [status, countries.filter((item) => item.status === status).length]));
const report = {
  episode: metadata.id ?? basename(episodeDirectory),
  generated_at: new Date().toISOString(),
  valid: errors.length === 0,
  country_count: countries.length,
  status_counts: statusCounts,
  errors,
  warnings,
};
await mkdir(episodeDirectory, {recursive: true});
await writeFile(resolve(episodeDirectory, "validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
