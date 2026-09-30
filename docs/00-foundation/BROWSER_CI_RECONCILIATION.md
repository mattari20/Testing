# Browser CI Reconciliation

## Current workflow
Workflow: `.github/workflows/native-v2-browser-validation.yml`

The workflow installs Playwright/Chromium and executes the browser-validation sequence, including the hardened M208–M217 integrated fragmentation suite.

## Confirmed blocker resolved
The workflow previously used npm caching without a committed npm lockfile. GitHub Actions failed before browser tests started with a missing dependency-lockfile error. The npm cache dependency was removed on 2026-09-29.

## Current status
**Runtime verification PASS — observed on 2026-09-30.**

Observed successful run: GitHub Actions run `36681451778` on `main`. M26, M27, M87, M90, M28, and M208–M217 all completed successfully, including evidence upload steps.

The repository now contains the executable browser gate, but configuration alone is not a passing result.

## Required observed evidence
The observed successful run confirmed:
1. dependency/setup success;
2. Playwright/Chromium installation;
3. M26 Native V2 browser evidence;
4. M27 V1 browser evidence;
5. M87 real editor browser evidence;
6. M90 real editor-preview evidence;
7. M28 paired V1/V2 browser comparison;
8. M208–M217 integrated fragmentation execution;
9. uploaded screenshots/JSON evidence for the integrated fragmentation scenario.

## Rule
The browser gate is now runtime-passed for the observed main-branch run above. Future code changes must re-establish this evidence before release acceptance is carried forward.
