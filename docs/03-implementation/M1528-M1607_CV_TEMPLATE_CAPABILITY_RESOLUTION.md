# M1528–M1607 — CV Template Capability Resolution

## Purpose
Establish the application boundary that combines template capability compatibility with presentation-variant compatibility before a CV document proceeds toward rendering.

## Contract
- Evaluate requested document capabilities against the selected template.
- Evaluate candidate presentation variants in the same template context.
- Distinguish compatible, constrained/review-required, and blocking states.
- Resolve a preferred compatible variant deterministically, otherwise use the first compatible candidate.
- Preserve blocking reasons for diagnostics instead of silently adapting content.
- Keep V1 assets and production runtime untouched.

## Validation
The milestone test suite covers capability resolution, constrained review, preferred selection, deterministic fallback, and explicit incompatibility.

## Next boundary
The next workstream converts master-profile sections, fields, and entries into a stable editor/render projection while honoring targeted-CV visibility and ordering.
