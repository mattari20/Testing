# M1688–M1767 — CV Pagination Runtime

## Purpose
Establish the runtime boundary between projected CV content and the existing layout-pagination engine.

## Contract
- Convert projected sections, fields, and entries into deterministic layout blocks.
- Accept measured heights from a future browser measurement boundary without coupling the core engine to a browser.
- Delegate pagination to the existing layout engine.
- Return stable layout evidence containing page count, pages, diagnostics, overflow, and source identity.
- Validate page-count/page-array consistency.
- Fence runtime operations after destruction.

## Validation
The milestone suite covers block generation, pagination, measured heights, evidence validation, and lifecycle fencing.

## Next boundary
The paginated result will feed preview-side editing, where a rendered block can identify its source section/field/entry without directly mutating presentation output.
