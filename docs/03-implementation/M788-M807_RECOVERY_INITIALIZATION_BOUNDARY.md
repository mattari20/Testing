# M788–M807 — Recovery Initialization Boundary

Recovery persistence now exposes an explicit initialization boundary for application startup.

The recovery controller provides an idempotent `initialize()` operation. It uses the cached inspection when the inspection is already valid and therefore does not repeatedly read persistence during startup/state hydration.

The lifecycle controller exposes `initializeRecovery()` so application code can initialize recovery without reaching into the storage layer.

`refreshRecovery()` remains the explicit force-refresh boundary for external persistence changes.

Validation: `tests/m788-m807/recovery-initialization.test.js` and package script `test:m788-m807`.

No V1 production runtime or asset was changed.