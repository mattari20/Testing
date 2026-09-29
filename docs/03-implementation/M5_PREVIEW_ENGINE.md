# M5 — Preview Engine

**Status:** Foundation implemented; browser/template rendering integration remains pending.

## Objective

M5 establishes the canonical preview state and request/result boundary on top of the M4 semantic pagination result.

## Implemented

- Preview request contract tied to a document snapshot and template version.
- Preview lifecycle states.
- Pagination-to-preview state conversion.
- Page navigation state.
- Zoom state.
- Preview result with document/template revision provenance.
- Explicit unresolved-overflow state.

## Architecture

Document Snapshot → Template → Presentation Configuration → M4 Semantic Pagination → Preview Result → UI Renderer

The preview engine does not become a second document model and does not mutate authoritative career data.

## V1 Preservation

This milestone does not replace or modernize V1 CSS/UI. Browser rendering and V1 Golden Baseline comparison remain a later integration task.

## Testing

Added tests/m5/preview-engine.test.js.

Runtime execution is not claimed until the repository test command is run in an actual runtime.

## Acceptance

M5 foundation is implemented.

Full acceptance remains pending:
- actual template rendering;
- browser/viewport integration;
- V1 visual regression;
- responsive preview integration;
- click-to-edit synchronization;
- export integration.

## Next Gate

M6 — Export Engines.
