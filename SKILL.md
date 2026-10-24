---
name: world-map-video
description: Create repeatable, data-driven animated world-map videos from an episode idea, with country-level facts, narration, map animation, thumbnails, and final render.
---

# World-map video production

Use this skill when a user gives an idea for a YouTube-style animated country map video. Produce an evidence-backed episode package and, when the project renderer exists, render the finished video. The visual reference is high-energy map explainers: saturated country fills, bold borders, flag textures or country characters, a compact game-like HUD, regional camera moves, counters, and a clear global result. Build an original channel identity; do not copy another channel's logo, exact artwork, thumbnail, character assets, or music.

## Inputs and sensible defaults

The user should only need to provide an episode idea. Default to Brazilian Portuguese narration, an 8–9 minute 16:9 1080p/30 fps episode, concise energetic delivery, and an original visual identity. Ask a concise question only if the topic or definition is too ambiguous to research responsibly. If the topic naturally supports another language or region, say what assumption you made.

Before generating assets, inspect this repository's instructions, scripts, data schema, renderer, and available assets. Reuse the current checkout; do not create a Git worktree. If the implementation is not present yet, create the reusable production engine first rather than fabricating a finished video.

## Proven episode profile

### Visual acceptance rules (revised after reference comparison)

The original technical demo is not a visual target. Use `episodes/visual-v2` as the current visual study and compare new renders against the user-supplied reference frames. A successful render alone does not demonstrate visual fidelity.

- Camera: keep a regional close-up throughout country reveals. Interpolate from the previous country pose to the next over roughly 0.7–1 second with smoothstep, then hold. Never reset scale to the world view on each event; never use a spring on the camera. Reserve the world view for the opening/closing. Author camera targets and scale for each region and handle microstates with insets or badges. Explicitly inspect border-crossing transitions and the final pullback.
- Map: bright green unrevealed territories, crisp dark borders, illustrated blue ocean with broad layered wave shapes. Revealed countries retain their flag texture. Use local licensed SVG flags clipped to geography with preserved aspect ratio; do not stretch emblems.
- Characters: the territories themselves are the characters. Draw expressive paired eyes with dark contour, white sclera, colored iris, pupil and two highlights; size relative to the visible territory and prevent overlap on tiny countries. Distinguish alert/angry and friendly expressions. Use reviewed placement anchors where a geometric centroid falls outside the useful land area.
- HUD: compact gold-framed segmented green/red status bar across the upper center; bold outlined green and red totals at lower left, expression icons beneath; five recent-country cards at lower right with flag, localized name and status badge. Fade older entries. Keep the country face unobstructed. Show a gold or red information card only for noteworthy exceptions.
- Counts: progress through the episode and percentages of classified outcomes are different quantities. Define the denominator and labels explicitly. `partial` must not increment the blocked counter; show restricted/unknown totals separately. Never label a partial result as a prohibition.
- Motion and sound: one short, quiet reveal cue per event; a different cue for an exception. Leave silence between cues. Optional subtle character animation must be frame-based and deterministic. Do not add continuous bouncing or reset zoom pulses. Generate or license the sounds and retain provenance.
- Preview review: inspect opening, at least three consecutive nearby-country transitions, a dense small-country region, an exception callout, and the closing. Watch the rendered motion as well as contact sheets. Confirm audible cues and no clipping. Do not claim listening or motion review if only static frames were inspected.

Current executable workflow: `npm ci`, `npm run typecheck`, then `npm run render -- visual-v2 --frame 900` for the Brazil design check or `npm run render -- visual-v2` for the complete visual study. `npm run render -- <episode-id>` validates and renders another prepared episode directory. The cloud runner currently uses `/usr/bin/chromium`. Add reviewed camera anchors for new regions before calling their motion production-ready. Research, narration and publication still require their own completed episode inputs; this visual study has simulated categories and short synthesized cues only.

Use this profile unless the idea calls for another format:

- Start with a 3–5 second global-map hook that states the question and shows one strong visual symbol.
- Reveal countries by coherent regions: Americas, Europe, Middle East, Africa, Asia, then Oceania. Keep each camera move purposeful and finish with a global result view.
- Maintain a persistent compact HUD: topic-specific progress bar at the top, two or more running counters at lower left, and a recent-country list at right. All values must derive from the same episode data.
- Give standard country events about 1.5–2.5 seconds. Reserve more time for a methodological caveat, a surprising exception, or a dense regional view. Do not introduce hard cuts just to make the timeline feel busy.
- Use a stable illustrated ocean/background, dark country borders, saturated data fills, large readable labels, and optional original expressive-country layers. The informational map remains readable without those characters.
- For a thumbnail, use one dominant subject, a world-map cue, and a short conflict or curiosity phrase. Test it at small size before delivery.

For title ideas, prioritize one clear global question. Product-access, national-affinity, versus, and universal-ranking formats are proven patterns. Examples: `Onde [produto] é bloqueado?`, `Quais países mais gostam e menos gostam de [país]?`, `[A] vs [B]: qual domina cada país?`, and `Qual é o [tema] nº 1 de cada país?`. Generate alternatives, but select only one whose claim the dataset can support.

## Episode workflow

1. **Define the claim.** Translate the idea into one answerable question, an explicit inclusion rule for countries and territories, a date range, and a classification method. Identify edge cases such as disputed territories, partial restrictions, unknown data, and dependencies on regional laws.
2. **Research country data.** Seek primary or authoritative sources first. Store one record per ISO 3166-1 alpha-3 code, with the result, source URL/title, publication or access date, confidence, and a short note. Keep `yes`, `partial`, `no`, and `unknown` distinct. Never infer missing values or claim worldwide coverage when data is incomplete. For subjective topics, identify what the proxy measures and do not call it objective public opinion without representative polling.
3. **Create the episode package.** Generate a title set, a concise hook, narration, map event sequence, descriptions and source notes. Keep claims aligned with the dataset. Use tension and a strong question without presenting uncertainty as certainty. Draft in the requested language; default to natural Brazilian Portuguese.
4. **Build the timeline.** Express the episode as data, not frame-by-frame instructions. Recommended sequence: global hook, question/title card, method in one short beat, regional reveal in a consistent order, notable exceptions, final global view and closing prompt. Country events update the map, counters, side list, callouts, narration and sound cues from the same record.
5. **Render deterministically.** Use the project's supported renderer. Preferred architecture: TypeScript/React with Remotion for composition and timeline, GeoJSON/SVG for geometry and clipping, and FFmpeg for encoding/audio. Other existing project tools take precedence. Never use an image or video model as the authority for borders, country labels, flags, or factual map coloring.
6. **Quality check.** Validate schema, unique ISO codes, source coverage, geometry joins, missing/duplicate countries, count totals, timeline order, safe text margins, map legibility at phone size, narration pronunciation, audio loudness and video playback. Inspect contact sheets at the intro, region transitions, exceptions and final frame. Do not describe an unrendered or unchecked output as complete.
7. **Deliver.** Provide the rendered file path when available, plus title/thumbnail concept, factual methodology, data sources, duration/resolution, and any uncertainty or missing coverage. If blocked, deliver the most complete honest package and name the concrete blocker.

## Visual and motion system

- Use a licensed, versioned world GeoJSON with ISO codes. Preserve polygon topology and projection. Include documented special handling for Antarctica, microstates, overseas territories, disputed areas and map insets.
- Generate country colors from structured episode data. Use a legible palette and redundant labels/icons so meaning is not conveyed by color alone.
- Use flags clipped to country geometry only when they remain recognizable; otherwise use a flag badge or neutral country label. Add original expressive characters as optional decorative layers, never as factual data.
- Compose reusable layers: ocean/background, map polygons, borders, data texture, HUD, callouts, camera, subtitles and branding. Use a small consistent set of camera targets and easing curves; avoid frantic continuous zoom.
- Keep map labels and counters inside title/action-safe margins. Test dense Europe/Caribbean views at 720p and mobile thumbnail size.
- Create original thumbnails with one central visual, a short high-contrast phrase, and a readable map cue. Avoid reproducing the reference channel's exact composition or assets.

## Data contract

Each episode's source data should live separately from code, ideally as JSON or CSV validated against the project's schema. A minimum country record is:

```json
{
  "iso3": "BRA",
  "status": "yes",
  "label": "Disponível",
  "source_url": "https://example.org/source",
  "source_title": "Source title",
  "checked_at": "YYYY-MM-DD",
  "confidence": "high",
  "note": "Short scope clarification"
}
```

Allowed status values are `yes`, `partial`, `no`, and `unknown`; map them to topic-specific labels in episode metadata. Do not silently treat territories, missing sources, or ambiguous laws as sovereign-country results. Add a coverage summary and methodology to every episode package.

## Project contract

When building the engine, keep code and episode material separate so a new episode changes data and creative inputs rather than rendering logic. Use an equivalent structure if the repository already establishes one:

```
assets/        # licensed map, flags, fonts, music, sound effects, original UI art
src/           # renderer, map components, timeline, validators
episodes/      # one directory per episode: metadata, country data, script, sources
output/        # generated previews, contact sheets, final renders; do not treat as source
```

Each episode directory should contain: `metadata.json`, `countries.json`, `script.pt-BR.md`, `sources.md`, and a generated `validation.json`. The renderer accepts an episode directory and produces a preview, contact sheet, final MP4, and a machine-readable validation report. Keep all reusable visual constants, country geometry and animation presets in code or versioned assets, never duplicated per episode.

## Token and compute discipline

Use the language model for research synthesis, structured data review, writing, code and visual inspection of selected frames. Rendering frames is local deterministic computation and should not call a model per frame. Analyze a representative contact sheet rather than sending every frame. Reuse map geometry, components, audio beds and templates across episodes. Generate a new video from episode data plus narration/assets; do not regenerate the engine each time.

## Safety, rights, and truthfulness

- Cite sources in the description or companion source file, and retain per-country provenance in project data.
- Treat laws and access restrictions as time-sensitive; record `checked_at` and qualify partial or temporary cases.
- Do not scrape or reuse another creator's original assets, voice, music, logo, or exact thumbnail design. Use licensed assets or original replacements.
- Avoid misleading map boundaries. State the territorial scope and use neutral styling where sovereignty is disputed.
- Keep credentials out of scripts, episode data and logs.

## Completion standard

An episode is ready only when its country data is validated, provenance is present, timeline derives from that same data, the render completed, and representative frames plus audio have been inspected. If any condition is unmet, report the episode as a draft and state what remains.
