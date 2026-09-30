# M168–M177 — Integrated Browser Fragment Validation

## Scope
This batch establishes the executable browser integration boundary for rendered fragmentation.

- M168: browser fragment evidence model.
- M169: DOM fragment probe and regression correction.
- M170: browser page navigation boundary.
- M171: browser fragment integrity validation.
- M172: integrated browser-flow evidence.
- M173: executable Chromium validation harness.
- M174: screenshot/geometry evidence boundary.
- M175: regression preservation contract.
- M176: runtime integration adapter and controlled layout-runtime path.
- M177: status/documentation reconciliation.

## Integration rule
The existing layout runtime remains the default path. Fragmentation is activated only when the fragmented === true option is supplied together with an explicit measured renderedRoot. This prevents accidental production behavior changes while the browser evidence gate is being completed.

## Critical validation rule
These modules define what a real browser run must prove. They do not themselves prove that Chromium has passed.

No Chromium pass, CI-green result, Golden Baseline parity, or production readiness is claimed until an actual execution record exists.
