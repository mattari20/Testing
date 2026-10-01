# M508–M517 — Editor Autosave Retry and Backoff

## Purpose

This batch makes autosave resilient to transient persistence failures while keeping retry behavior bounded and observable.

## Completed

- Autosave supports a configurable maximum retry count.
- Autosave supports a configurable retry delay.
- Retries use increasing delay based on retry attempt number.
- Successful retry resets the retry counter and returns autosave to `saved`.
- Permanent failures stop after the configured retry limit and remain observable as `error`.
- The editor remains dirty after failed persistence.
- Explicit Save cancels any pending autosave retry.
- Recovery and Clear Recovery also cancel pending retry work.
- Retry diagnostics expose `retryCount` and `maxRetries` through the recovery state.
- Editor DOM can expose retry count and maximum retries through `data-v2-editor-autosave-retry` metadata.
- Existing autosave and recovery state contracts remain intact.
- Dedicated M508–M517 tests and CI validation are wired.

## Configuration

The recovery controller accepts:

- `maxRetries` — non-negative integer; default `2`.
- `retryDelayMs` — non-negative retry delay; defaults to the autosave delay.

Retry timing is bounded and does not create an unbounded background loop.

## Safety boundary

Retries only repeat persistence of the current dirty editor state. They do not mutate the CV document, mark the editor clean, or bypass recovery confirmation. Explicit Save, Recovery, Clear Recovery, and Destroy cancel outstanding retry work.

No V1 production code, cloud/account behavior, or provider-specific technology was introduced.

## Validation

npm run test:m508-m517

Coverage includes transient recovery, bounded permanent-failure behavior, retry diagnostics, dirty-state preservation, and explicit-save cancellation of pending retries.
