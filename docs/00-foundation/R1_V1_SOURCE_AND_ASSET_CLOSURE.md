# R1 — V1 Source & Asset Closure

## Purpose

Close the first release gate defined by FINAL_RELEASE_READINESS.md: establish the authoritative V1 template/source inventory, record every known missing source/asset, and prevent silent recreation.

## Verified repository baseline

The current `main` branch contains exactly seven recovered V1 HTML template sources:

1. `t01-modern-minimalist-cv-design_modern.html`
2. `t02-professional-cv-design_modern.html`
3. `t03-professional-cv-design_modern.html`
4. `t04-modern-blue-corporate_modern.html`
5. `t05-simple-cv-graphic-web-designer_modern.html`
6. `t06-professional-cv-graphic-designer_modern.html`
7. `t07-professional-cv-store-manager-incharge_modern.html`

Seven corresponding Native V2 template sources are also present.

## Unresolved V1 source gaps

The V1 catalog defines nine logical template IDs. Two source files remain unavailable:

- `t01-modern-minimalist-cv-design_ats.html`
- `t01-modern-minimalist-cv-design_simple.html`

These historical files are not being recreated. Per owner direction, the project will use new V2-native replacement templates with explicit provenance; the new files are not represented as recovered V1 originals.

## V2 replacement disposition

The missing historical T01 ATS and T01 Simple variants are now **Authoritatively replaced for V2** by newly designed native V2 templates:

- `src/templates/assets/v2/t01-modern-minimalist-cv-design_ats.html` — V2 template version `2.1.0`; single-column ATS-oriented layout.
- `src/templates/assets/v2/t01-modern-minimalist-cv-design_simple.html` — V2 template version `2.1.0`; clean two-column simple layout.

These replacements are intentionally distinct from the unrecovered V1 sources. They use the V2 native template contract, V2 data bindings and V2 layout-block metadata.

The historical V1 source gaps therefore no longer block **V2 template availability**, but they remain historical provenance gaps and must not be described as recovered V1 evidence.

## Other historical asset references

The existing M0 audit records two additional historical asset issues:

- ATS preview image referenced by the V1 bridge flow but absent from the supplied archive.
- Demo profile-image extension/path mismatch between the renderer reference and the supplied archive asset.

These require authoritative source/production verification or an explicit governance disposition.

## Disposition rules

Each unresolved item must receive one of these dispositions:

1. **Recovered** — authoritative original source is obtained and stored.
2. **Authoritatively replaced** — an approved replacement is supplied and its provenance is recorded.
3. **Retired** — the item is explicitly removed from the supported V1 baseline by governance decision.
4. **Unverified** — no authoritative evidence exists yet; the item remains a release blocker.

No silent recreation is permitted.

## Current R1 result

**R1 Source/Asset Closure: PASS — V2 replacement/retirement disposition completed**

The seven recovered V1 template sources are reconciled and stored. The two missing T01 historical sources have explicit V2-native replacement provenance. The historical ATS preview-image and demo-image references are explicitly outside the V2 runtime and are not silently recreated.

## Required owner input

Original T01 ATS/Simple V1 files are not required for V2 operation because the owner has explicitly selected new V2-native replacements. The historical V1 evidence remains marked as unrecovered; no claim of V1 equivalence is made.

No R1 release blocker remains. Historical V1 provenance remains documented as unrecovered; V2 uses explicit native replacements and does not claim historical equivalence.

## Next release work

R2 — Security Closure can proceed independently because it requires production credential/history verification rather than the missing template files.

## Evidence rule

Repository presence alone does not prove historical production equivalence. Source recovery, asset provenance, runtime behavior and Golden Baseline outputs remain separate evidence categories.
