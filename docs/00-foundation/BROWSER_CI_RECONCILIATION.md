# Browser CI Reconciliation

## Current workflow
Workflow: `.github/workflows/native-v2-browser-validation.yml`

The workflow installs Playwright/Chromium and executes the browser-validation sequence, including the hardened M208–M217 integrated fragmentation suite.

## Confirmed blocker resolved
The workflow previously used npm caching without a committed npm lockfile. GitHub Actions failed before browser tests started with a missing dependency-lockfile error. The npm cache dependency was removed on 2026-09-29.

## Current status
**Runtime verification pending observed evidence.**

The repository now contains the executable browser gate, but configuration alone is not a passing result.

## Required observed evidence
The next successful run must be inspected for:
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
Do not label any affected browser milestone runtime-passed until the workflow run is actually observed and its evidence is inspected.
