# Browser CI Reconciliation

## Current workflow
Workflow: .github/workflows/native-v2-browser-validation.yml

The workflow is stored in the repository and is intended to execute the browser-validation sequence.

## Confirmed CI blocker resolved
The workflow previously used npm caching without a committed npm lockfile. GitHub Actions therefore failed before browser tests started with a missing dependency lockfile error.

The npm cache dependency was removed on 2026-09-29.

## Current status
The workflow should be treated as **runtime verification pending** until a subsequent GitHub Actions run completes successfully.

## Warnings seen in the failed run
The observed Node.js 20 deprecation warning and Ubuntu runner migration notice were warnings/notices, not the root cause of the failed run.

## Evidence rule
A green workflow run is required before describing the affected browser validation milestones as runtime-passed.

## Next CI evidence
The next push-triggered run should be inspected for:
1. dependency/setup success;
2. Playwright/Chromium installation;
3. M26 real browser evidence;
4. M27 V1 browser evidence;
5. M87 editor browser evidence;
6. M90 preview browser evidence;
7. M28 paired comparison evidence.

Later M99 and pagination browser validation should be added to the workflow only after their local/CI contract is stable.
