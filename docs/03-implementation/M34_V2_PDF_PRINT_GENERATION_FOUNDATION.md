# M34 — V2 PDF and Print Generation Foundation

## Status

**Implementation complete; runtime test execution pending.**

## Purpose

M34 moves V2 export from the production export boundary into an explicit PDF/Print generation plan.

The generation layer consumes:
- canonical document snapshot;
- selected V2 template/version;
- presentation configuration;
- measured semantic layout/pagination result.

## Delivered

- PDF generation plan;
- Print generation plan;
- page-count propagation;
- artifact manifests;
- semantic-pagination requirement;
- explicit provider boundary for final binary generation.

## Architectural rules

- V2 layout/pagination remains authoritative.
- PDF/Print generation must not silently reflow or discard content.
- V1 mobile/desktop export engines are not production dependencies.
- No PDF library, browser provider or hosting provider is hard-coded by M34.
- UI/CSS redesign remains outside this batch.

## Acceptance criteria

1. PDF generation requires a valid V2 export request.
2. Print generation requires a valid V2 export request.
3. Page count comes from the V2 layout result.
4. Template/version and source document provenance are retained.
5. Binary generation remains an explicit implementation boundary.
