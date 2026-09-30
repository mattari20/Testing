# M208–M217 — Integrated Browser Evidence and Release Gate

## Purpose

This batch hardens the executable Chromium validation path for the editor-preview fragmentation runtime. The goal is evidence correctness, not a source-only claim of browser success.

## Completed milestones

- **M208 — Browser test sequencing:** template rendering is validated before the fragmentation demo replaces the preview DOM; the obsolete post-fragment template-root selector is removed.
- **M209 — Evidence artifact:** the test writes a machine-readable JSON evidence artifact containing template, pagination, fragment, geometry, ordering, navigation, and completion state.
- **M210 — Before/after screenshots:** the browser test captures the rendered template before fragmentation and the fragmented preview after distribution.
- **M211 — Navigation validation:** every generated page is selected in turn and exactly one page is visible.
- **M212 — Fragment ordering:** each block's fragment parts are checked for sequential part ordering and page association.
- **M213 — Fragment distribution coverage:** the browser test requires distributed fragments and records per-page fragment counts.
- **M214 — Geometry/overflow validation:** page width, height, and scrollHeight are checked against the A4 fixture contract.
- **M215 — CI artifact publication:** the workflow uploads PNG and JSON evidence from the hardened browser suite.
- **M216 — Regression command:** `test:m208-m217` runs the integrated browser test together with the existing pagination/evidence regressions.
- **M217 — Release-gate documentation:** this document records the evidence boundary and status rule.

## Evidence boundary

A source edit, test definition, or workflow definition does **not** constitute a passing browser result. The release gate is satisfied only when an actual GitHub Actions run completes the browser suite successfully and the uploaded evidence is available for inspection.

The repository currently contains the executable gate and artifact publication configuration. No CI-green result is inferred from the presence of these files.

## Known technical boundary

Fragmentation remains rendered-DOM vertical slicing driven by declared split points. It is not yet a general semantic text reflow engine. Repeated-header metadata, orphan/widow handling, and keep-with-next behavior remain controlled contracts requiring future browser scenarios where their visual behavior matters.

## Release decision

**Status: evidence-gated / pending observed CI execution.**

The project must not be marked production-complete solely from repository state. Final completion requires reconciliation of the remaining V1 security/asset gates, actual browser CI evidence, and final V1-runtime retirement evidence.
