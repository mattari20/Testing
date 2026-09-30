# M168–M177 — Integrated Browser Fragment Validation

## Scope
This batch moves the pagination boundary from browser contracts toward an executable integrated-validation surface.

- M168: browser fragment evidence model.
- M169: DOM fragment probe.
- M170: browser page navigation boundary.
- M171: browser fragment integrity validation.
- M172: integrated browser-flow evidence.
- M173: long-CV execution contract.
- M174: screenshot/geometry evidence boundary.
- M175: regression preservation contract.
- M176: runtime integration reconciliation.
- M177: status/documentation reconciliation.

## Critical validation rule
These modules define what a real browser run must prove. They do not themselves prove that Chromium has passed.

The repository already contains Playwright-based browser tests from earlier milestones. The next actual runtime execution must load the editor preview, invoke the integrated fragment runtime, inspect every generated page, verify fragment distribution and overflow, navigate pages, and capture evidence.

## Non-claims
No Chromium pass, CI-green result, Golden Baseline parity, or production readiness is claimed until an actual execution record exists.
