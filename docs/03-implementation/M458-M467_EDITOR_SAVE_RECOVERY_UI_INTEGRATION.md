# M458–M467 — Editor Save / Recovery UI Integration

## Purpose

Connect the editor lifecycle boundary to the editor DOM without coupling persistence behavior to the CV form renderer.

## Completed

- Added lifecycle DOM bindings for explicit save, recovery, recovery clearing, and lifecycle status.
- Supported controls:
  - `data-v2-editor-save`
  - `data-v2-editor-recover`
  - `data-v2-editor-clear-recovery`
  - `data-v2-editor-save-status`
- Save controls expose the current dirty state through `data-v2-editor-dirty`.
- Lifecycle status is reflected through `data-v2-editor-lifecycle-status`.
- Save controls are disabled after the document reaches the saved state.
- Runtime mounts the lifecycle binding once, outside dynamic CV form rerendering.
- Lightweight/non-DOM test roots remain supported.
- Added dedicated DOM lifecycle tests.
- Added the batch test command to V2 integration CI.

## Architectural boundary

The CV form renderer remains responsible for CV editing fields and section controls. Save/recovery controls are lifecycle concerns and are therefore bound at the runtime/root boundary rather than injected into the dynamic form.

This batch does not introduce accounts, cloud synchronization, provider-specific storage, or deployment behavior.

## Validation

`npm run test:m458-m467`
