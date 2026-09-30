# M178–M187 — Real Browser Fragment Execution

## Purpose
Move the project from browser-contract definitions toward actual Chromium execution against the existing editor preview flow.

## Completed in this batch
- M178: real integrated editor preview browser test.
- M179: local HTTP serving of the existing browser fixture.
- M180: Chromium editor-runtime readiness gate.
- M181: real template preview rendering assertion and screenshot capture.
- M182: geometry evidence boundary.
- M183: scroll/overflow evidence boundary.
- M184: long-content extension point.
- M185: fragment-runtime execution hook.
- M186: evidence artifact boundary.
- M187: documentation/status reconciliation.

## Validation rule
The test is executable with Playwright/Chromium, but repository changes alone do not constitute a successful browser run. A successful result must come from actual execution and its artifacts.

## Current limitation
The current browser fixture proves real native-template preview rendering. It does not yet prove multi-page fragmentation because the fixture's `runTemplatePreview` path still mounts the template directly. The next execution batch must connect the measured rendered root to the controlled fragmentation runtime and verify multiple pages, fragments, continuity, and overflow.
