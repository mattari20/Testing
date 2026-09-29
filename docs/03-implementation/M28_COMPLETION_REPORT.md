# M28 — Completion Report

## Status

**Implementation complete; real CI runtime verification pending.**

## Delivered

- Registry-driven paired V1/V2 comparison plan.
- Same controlled snapshot for both rendering paths.
- Same viewport for both rendering paths.
- V1 source compiled only through the generic source-derived V1 adapter.
- Native V2 source rendered through the Native V2 renderer.
- Separate real-browser screenshots for both sides.
- Root-height, visible-text, and block-count deltas recorded per template.
- Visual equivalence deliberately remains `insufficient-evidence` until actual evidence review establishes dimension-level parity.
- Future V2-native templates without a V1 baseline are excluded from V1 pairing rather than receiving a fabricated baseline.
- GitHub Actions workflow now includes M28 after M26 and M27.

## Current seven-template scope

The current paired scope is the seven recovered V1 modern templates represented in the Native V2 registry. The missing T01 ATS and T01 Simple variants are not fabricated or included.

## Runtime truth

The repository now contains the real Chromium test and CI workflow, but no successful GitHub Actions run has yet been observed for M28 in this session. Therefore M28 is not marked runtime-passed.

## Next step

M29 should consume the paired browser evidence and establish a controlled, dimension-by-dimension V1/V2 evidence review flow, including screenshot/geometry evidence and explicit human-review states before any template is marked V2-compatible.
