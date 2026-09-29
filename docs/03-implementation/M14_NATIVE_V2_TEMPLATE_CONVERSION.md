# M14 — Native V2 Template Conversion

## Status

**T01 conversion complete; validation pending.**

## Objective

Move template authoring from the legacy V1 token language to the native V2 semantic template contract while preserving the V1 Golden Baseline as an immutable reference.

## Completed

- Defined the native V2 template contract.
- Added a native T01 V2 asset derived from the recovered V1 T01 source.
- Preserved the V1 source under `src/templates/assets/v1/`.
- Removed V1 moustache bindings from the native T01 file.
- Added semantic V2 bindings for identity, summary, sections, repeatable entries, repeatable values, visibility, and photo asset binding.
- Added a native V2 template catalog entry.
- Added structural tests for native T01 contract compliance.

## Explicitly not claimed

Native conversion does **not** yet mean visual or runtime compatibility.

Still required:

1. Native V2 renderer support for repeatable regions and semantic visibility.
2. Browser rendering.
3. DOM measurement.
4. M4 pagination integration.
5. V1 Golden Baseline visual comparison.
6. Preview/PDF/print regression.
7. Accessibility validation.
8. Final template compatibility status.

## Preservation rule

The original V1 T01 source is never edited as part of this conversion.

## Next implementation gate

Build the native V2 template renderer/normalizer so the semantic T01 bindings become executable against the canonical M1 document model. The renderer must not reintroduce the V1 moustache language.
