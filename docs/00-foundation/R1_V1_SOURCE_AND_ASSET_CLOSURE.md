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

These files must not be recreated from the V2 implementation or from assumptions.

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

**R1 Source/Asset Closure: CONDITIONAL**

The seven recovered template sources are reconciled and stored. The two missing T01 sources and remaining historical asset references are still unverified.

## Required owner input

To move the two missing template items from conditional to recovered, the project owner must provide either:

- the original T01 ATS and T01 Simple HTML files; or
- an authoritative V1 copy/archive containing them.

If those files cannot be recovered, an explicit retirement/replacement decision is required before final release.

## Next release work

R2 — Security Closure can proceed independently because it requires production credential/history verification rather than the missing template files.

## Evidence rule

Repository presence alone does not prove historical production equivalence. Source recovery, asset provenance, runtime behavior and Golden Baseline outputs remain separate evidence categories.
