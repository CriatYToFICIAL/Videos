export const statuses = ["yes", "partial", "no", "unknown"] as const;

export type Status = (typeof statuses)[number];

export type CountryRecord = {
  iso3: string;
  status: Status;
  label: string;
  source_url: string;
  source_title: string;
  checked_at: string;
  confidence: "high" | "medium" | "low";
  note: string;
  order: number;
  region: string;
};

export type EpisodeMetadata = {
  id: string;
  title: string;
  hook: string;
  topicLabel: string;
  primaryLabel: string;
  secondaryLabel: string;
  language: string;
  fps: number;
  width: number;
  height: number;
  secondsPerCountry: number;
  introSeconds: number;
  outroSeconds: number;
  scope: string;
  methodology: string;
  disclaimer: string;
  categoryLabels?: Partial<Record<Status, string>>;
  categorySounds?: Partial<Record<Status, string>>;
};

export type Episode = EpisodeMetadata & {countries: CountryRecord[]};
