# M4 — Layout and Pagination Engine

**Status:** Foundation implemented; visual/template integration remains pending.

## 1. Objective

M4 establishes the V2 semantic layout and pagination foundation. The engine operates on semantic layout blocks and page geometry rather than rendered-image slicing. It is intentionally independent from UI/CSS and does not yet claim V1 template visual parity.

## 2. Implemented

- A4-default page model with dimensions, margins, header/footer regions, usable content area and columns.
- Semantic blocks with kind, ordering, measurement, split rules, keep-with-next, keep-together and metadata.
- Dynamic page count.
- Automatic and manual page breaks.
- Moving blocks to a new page.
- Controlled splitting at approved split points.
- Explicit overflow diagnostics.
- Measurement-function boundary independent of a rendering technology.
- Structured layout result suitable for later preview/export integration.

## 3. V1 Compatibility Boundary

V1 794px × 1123px assumptions are compatibility references, not the V2 domain model. V2 does not copy the V1 mobile canvas slicing or desktop iframe-print architecture.

## 4. No-Silent-Loss Rule

When a block cannot fit, the engine attempts valid movement or approved splitting and otherwise reports overflow. It never deletes the block.

## 5. Tests

Added: tests/m4/layout-pagination.test.js

Coverage includes page geometry, usable area, keep-with-next movement, multi-page flow, approved splitting, overflow detection and measurement injection.

Runtime execution is not claimed in this milestone record until the repository test command is actually run in a runtime environment.

## 6. Acceptance Status

M4 foundation is implemented.

Full M4 acceptance remains pending:
- real rendering measurement;
- V2 template capability integration;
- Golden Baseline visual/page comparison;
- preview integration;
- PDF/print integration;
- complex multi-column validation;
- broader regression coverage.

## 7. Next Gate

The next controlled milestone is **M5 — Preview Engine**. M4 remains the semantic pagination source for preview and later export integration.

## 8. Governance

No UI/CSS modernization is introduced by M4.
