# M2168–M2247 — CV Job Matching Contract

## Purpose
Create an explainable boundary for comparing a CV snapshot against job requirements.

## Contract
- Accept explicit job keywords or derive lightweight terms from a supplied description.
- Report matched and missing terms with a bounded ratio.
- Preserve evidence rather than returning an opaque recommendation.
- Keep rewriting, AI generation, and provider-specific behavior outside this contract.

## Validation
The milestone suite covers keyword matching, missing terms, description input, ratio bounds, and validation.
