# M468–M477 — Session Recovery & Unsaved-Changes Protection

## Purpose

Protect active editor work from accidental navigation loss and expose whether a persisted recovery snapshot is available.

## Completed

- Added `createEditorSessionGuard`.
- The guard tracks editor dirty state through the lifecycle controller.
- Browser `beforeunload` protection is enabled only while unsaved changes exist.
- Added deterministic `hasUnsavedChanges()`, `canLeave()`, and `requestLeave()` APIs for controlled navigation flows.
- The runtime now exposes `runtime.sessionGuard`.
- Lifecycle state now reports `recoveryAvailable`.
- Recovery and clear-recovery UI controls reflect actual recovery availability.
- Clearing a recovery snapshot immediately refreshes lifecycle subscribers.
- The guard is destroyed with the runtime and removes its browser listener.
- Added dedicated M468–M477 validation tests and CI coverage.

## Boundary

The browser guard protects local unsaved work. It does not introduce accounts, remote synchronization, authentication, or cloud persistence.

Recovery remains explicitly backed by the existing persistence adapter.

## Validation

`npm run test:m468-m477`
