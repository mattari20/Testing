# M498–M507 — Editor Save and Autosave Consistency

## Purpose

This batch makes explicit Save and autosave share one observable persistence lifecycle so the editor never reports stale autosave state after a successful or failed manual save.

## Completed

- Explicit Save now cancels the pending autosave timer before persistence.
- Manual Save transitions through the same observable saving state used by autosave.
- Successful manual Save records lastAutosavedAt.
- Successful manual Save reports autosaveStatus: saved.
- Manual Save establishes recoveryStatus: available.
- Manual Save failures expose autosaveStatus: error and lastAutosaveError.
- A failed manual Save does not mark the editor clean.
- Existing explicit-save session semantics remain intact.
- Lifecycle consumers automatically receive synchronized autosave state through the recovery controller.
- Dedicated M498–M507 tests and CI validation are wired.

## State contract

A successful explicit Save converges on autosaveStatus=saved, a populated lastAutosavedAt, recoveryStatus=available, and editor session dirty=false.

A failed explicit Save converges on autosaveStatus=error and lastAutosaveError while the editor session remains dirty.

## Architectural boundary

The recovery controller remains responsible for persistence mechanics and observable persistence state. The lifecycle controller continues to expose that state to application consumers. No form-rendering, V1 production, cloud/account, or provider-specific behavior was introduced.

## Validation

npm run test:m498-m507

Coverage includes manual-save state convergence, manual-save failure safety, lifecycle synchronization, and prevention of a stale scheduled autosave after explicit Save.
