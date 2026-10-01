# M438–M447 — Explicit Editor Save Lifecycle

## Objective

Complete the next editor lifecycle boundary after M428–M437 by distinguishing explicit user save from background recovery persistence.

## Delivered

- Added an explicit `save()` operation to the editor recovery controller.
- Explicit save persists the current valid editor state through the existing adapter.
- Explicit save marks the editor session clean and records the save timestamp.
- Save notifications do not trigger another recovery write loop.
- Existing background recovery/autosave behavior remains unchanged.
- Added regression tests for save persistence, dirty-state clearing, and loop prevention.

## Boundary

Background persistence protects recoverability. Explicit save represents the user's intentional save action. These two lifecycle events remain separate so future UI can expose clear saved/recovering states.
