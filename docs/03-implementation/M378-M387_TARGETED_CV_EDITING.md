# M378–M387 — Targeted CV Editing & Builder Interaction

## Purpose

Make the builder operate on a **Targeted CV configuration** rather than accidentally changing the user's Master Profile when they customize one CV.

## Completed

1. Added targeted section, field and entry visibility helpers.
2. Changed editor visibility commands to update the selected Targeted CV configuration.
3. Preserved canonical Master Profile visibility/data when a targeted CV hides content.
4. Updated the editor form renderer to respect Targeted CV hidden sections, fields and entries.
5. Added editor-surface subscriptions so structural commands can trigger UI refreshes.
6. Added runtime refresh handling for structural edits, template/variant changes and undo/redo.
7. Added regression tests for targeted visibility isolation and builder refresh behavior.

## Product behavior

A user can build a targeted CV from the Master Profile and hide content for that CV without deleting or modifying the source career information.

This establishes the required separation:

**Master Profile → Targeted CV configuration → Builder presentation**

## Scope boundary

This batch does not claim completion of the complete builder UI. Rich field types, section creation/removal UX, drag-and-drop ordering, autosave/recovery, template switching UX, compatibility review and export providers remain later work.

## Acceptance

The batch is accepted when the new regression tests and existing integration/browser validation remain green.
