# M6 — Export Engines

**Status:** Implementation foundation complete; runtime renderer integration pending.

## 1. Objective

M6 establishes the V2 export boundary for PDF, print, generated DOCX, and blank DOCX. Export is treated as a controlled projection of an approved document snapshot rather than a second source of truth.

## 2. Implemented

Added:

- `src/export/export-engine.js`
- `tests/m6/export-engine.test.js`

The engine defines:

- explicit output types: PDF, print, generated DOCX, blank DOCX;
- coherent export requests containing document snapshot, template/version, presentation, layout result, and assets;
- export lifecycle states;
- pre-export compatibility/validation checks;
- layout-overflow blocking;
- template output capability checks;
- artifact provenance;
- immutable-style artifact records;
- validation results and constraint reporting;
- explicit distinction between blank DOCX and generated user-data DOCX.

## 3. Architectural Rules Preserved

M6 follows the export contract:

1. generated artifacts are derived outputs;
2. exports use one coherent document snapshot;
3. unsupported output capabilities are rejected before rendering;
4. unresolved layout overflow blocks successful export;
5. PDF, print, DOCX, and blank DOCX remain separate contracts;
6. blank DOCX is not a substitute for generated user-data DOCX;
7. artifacts retain source document/template provenance;
8. validation is required before completion;
9. completed artifacts are treated as immutable records;
10. no export implementation technology is selected by this foundation layer.

## 4. Important Boundary

This milestone does **not** claim actual binary PDF/DOCX generation.

Renderer adapters remain a separate implementation concern. They can later implement the controlled interface around this export core without changing the source-of-truth model.

The V1 mobile PDF and desktop print/PDF paths remain Golden Baseline references. Visual/export parity is not yet claimed because the V1 asset reconciliation and runtime comparison gates remain open.

## 5. Validation Model

The foundation currently validates:

- required document/template provenance;
- supported output type;
- declared template capability;
- unresolved layout overflow;
- blank-DOCX separation;
- artifact provenance;
- validation state.

Future renderer-specific validation must additionally cover file integrity, page boundaries, assets, fonts/styles, links, image placement, and output-specific fidelity.

## 6. Artifact Lifecycle

Conceptual flow:

**Requested → Preparing → Rendering → Validating → Completed / Completed with Constraints / Failed / Cancelled / Expired**

An artifact receives a new identity for each generation and is never treated as an editable source of career facts.

## 7. V1 Compatibility

M6 preserves the V1 user-visible export intent:

- A4;
- multi-page output;
- mobile PDF;
- desktop/browser print/PDF;
- template-specific rendering.

V2 will replace implementation limitations where required while retaining Golden Baseline regression obligations.

## 8. Acceptance Gate

M6 foundation is complete when:

- export requests are snapshot-bound;
- output capabilities are explicit;
- validation can block unsafe completion;
- artifact provenance exists;
- blank/generated DOCX are separated;
- no implementation technology is hard-coded into the export boundary.

Actual renderer integration, binary generation, and Golden Baseline visual/export comparison remain subsequent gates.
