# M28 — Paired V1 / Native V2 Browser Comparison

## Purpose

M28 places the immutable recovered V1 source and the corresponding Native V2 source into the same controlled browser evidence workflow.

For each V1-derived template it records:
- shared viewport;
- V1 and V2 render status and diagnostics;
- V1 and V2 screenshot artifacts;
- root-height delta;
- visible-text-length delta;
- semantic/observed block-count delta;
- paired evidence readiness.

## Controlled comparison rule

Both sides receive the same canonical snapshot. The V1 source is compiled only through the source-derived V1 adapter. The Native V2 source is rendered through the Native V2 renderer.

## No automatic parity claim

M28 intentionally records `insufficient-evidence` for visual equivalence. Structural measurements alone do not prove typography, color, spacing, icon, photo, hierarchy, or pixel-level equivalence. Those dimensions remain subject to M21 evidence review.

## Extensibility

The plan is registry-driven and only pairs templates that have a `v1BaselineId`. Future V2-native templates without a V1 predecessor continue through the normal Native V2 validation pipeline and do not require a synthetic V1 comparison.
