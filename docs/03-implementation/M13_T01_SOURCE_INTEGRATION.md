# M13 — V1 Template Source Integration

## Completed in this batch

- Preserved all seven uploaded V1 HTML templates as repository assets under `src/templates/assets/v1/`.
- Added a source normalizer/compiler that understands the actual V1 token conventions used by the templates:
  - scalar tokens such as `{{NAME}}`
  - field conditional blocks such as `{{#PHONE}}...`
  - visibility blocks such as `{{#toggle_exp_visible}}...`
  - repeatable object loops such as `{{EXPERIENCE_LIST}}`
- Added a concrete T01 adapter manifest for the recovered modern template.
- Added tests covering token discovery, loop expansion, HTML escaping, and section visibility.
- The raw V1 HTML remains preserved; compilation is an adapter step and does not modify the source asset.

## T01 status

T01 is now **source-ingested and adapter-ready**.

It is **not yet declared V2-Compatible**. Browser rendering, DOM measurement, M4 pagination integration, and Golden Baseline visual/output evidence remain required before compatibility can be promoted.

## Safety boundary

The compiler treats the recovered V1 HTML as trusted presentation source, while user data is escaped before insertion. URL-like values used for `PHOTO` reject obvious executable schemes.

## Next gate

Render the real T01 source through the adapter in a browser, measure the resulting DOM, convert the measured regions into M4 semantic blocks, and compare the result against the V1 Golden Baseline before moving T01 to a published V2-compatible status.
