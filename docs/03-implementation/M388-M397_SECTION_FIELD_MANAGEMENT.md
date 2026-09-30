# M388–M397 — Complete Section & Field Management

## Objective
Extend the V2 editor from entry-level editing into a complete structural CV editor while preserving the separation between Master Profile data and Targeted CV presentation.

## Implemented

### Section management
- Add section.
- Remove section.
- Edit section title.
- Targeted section visibility remains isolated from Master Profile visibility.
- Targeted section ordering is supported.

### Field management
- Add field.
- Remove field.
- Edit field label.
- Edit field type.
- Field values continue to use the existing field-editing command.
- Targeted field visibility remains isolated from Master Profile visibility.
- Targeted field ordering is supported.

### Entry management
- Duplicate an existing repeatable entry.
- Existing add, update, remove and visibility controls remain available.
- Targeted entry ordering remains isolated in Targeted CV configuration.

### Runtime/editor integration
- Structural commands trigger a fresh editor-form render.
- Section title and field definition controls are bound to editor commands.
- Undo/redo continues to operate through the editor surface history.

## Safety and data ownership
Structural edits intentionally change the Master Profile because section/field definitions are shared career data. Targeted CV configuration continues to control presentation-specific visibility and ordering. Removing a shared section or field therefore affects the underlying Master Profile and should be treated as a deliberate destructive editor action.

## Acceptance coverage
`tests/m388-m397/section-field-management.test.js` covers:
- section and field lifecycle,
- entry duplication,
- section/field removal,
- undo availability,
- targeted ordering without changing Master Profile order,
- structural UI control rendering.

## CI
The package exposes `npm run test:m388-m397`. The integration workflow update remains a repository follow-up because the current GitHub write boundary rejected the workflow-file mutation.

## Scope boundary
This batch does not claim production deployment, live Hostinger execution, final PDF/DOCX provider wiring, production release-gate closure, or final V2 release. Those remain later milestones.
