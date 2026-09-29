# M11 — End-to-End Document Assembly Pipeline

**Status:** Implementation foundation complete; browser/rendering integration remains pending.

## Objective

M11 connects the previously isolated V2 core engines into one deterministic document-assembly boundary:

**Master Profile → Targeted CV → Template → Presentation Variants → Document Snapshot → Layout/Pagination → Preview → Export Requests**

The pipeline is orchestration only. It does not make templates owners of career data and does not introduce a second document source of truth.

## Implemented

File: `src/assembly/document-assembly-engine.js`

The assembly engine:

- validates Master Profile and Targeted CV ownership/schema;
- resolves the selected template;
- derives visible content requirements;
- evaluates template compatibility;
- validates saved presentation variants;
- resolves approved variant fallbacks;
- creates one document snapshot;
- paginates the supplied semantic layout blocks;
- produces a layout result;
- creates preview request/result provenance;
- creates and validates PDF/print/DOCX/blank-DOCX export requests;
- blocks assembly when template compatibility, variant validity, or layout overflow is unresolved.

### Important boundary

M11 intentionally accepts **semantic layout blocks** as an input boundary. It does not pretend that HTML/browser measurement or binary PDF/DOCX rendering already exists.

Therefore:

- actual V1 template rendering is not claimed;
- actual PDF/DOCX generation is not claimed;
- browser preview integration is not claimed;
- Golden Baseline visual parity is not claimed.

## No-silent-loss behavior

Template incompatibility blocks the assembled document rather than deleting unsupported career content.

Variant incompatibility is surfaced explicitly.

Layout overflow blocks the final assembly state.

## Tests

File:

`tests/m11/document-assembly.test.js`

Coverage includes:

- complete assembly path;
- document snapshot provenance;
- template resolution;
- variant resolution;
- layout integration;
- preview provenance;
- export request creation;
- template compatibility blocking;
- layout overflow blocking.

Runtime execution remains required before M11 is fully accepted.

## Acceptance status

M11 implementation foundation is complete.

Remaining acceptance gates:

1. real V1 template assets/source reconciliation;
2. actual browser/template rendering;
3. real measurement integration;
4. preview UI integration;
5. real PDF/print/DOCX renderer adapters;
6. Golden Baseline visual/output regression;
7. end-to-end no-silent-loss testing with actual templates.

No UI/CSS modernization is introduced by M11.
