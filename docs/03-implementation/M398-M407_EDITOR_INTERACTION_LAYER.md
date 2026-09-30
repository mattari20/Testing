# M398–M407 — Editor Interaction Layer

## Objective
Turn structural editor controls into direct interaction primitives: drag-and-drop ordering and inline editing commands that can be used by the live preview.

## Implemented

### Drag-and-drop ordering
- Added src/ui/editor-reorder-controller.js.
- Section, field and repeatable-entry nodes expose sortable metadata.
- Same-scope drag-and-drop produces the existing reorder editor command.
- Section, field and entry ordering remains stored in Targeted CV configuration.
- Cross-scope drops are rejected rather than silently changing ownership.

### Preview-side inline editing boundary
- Added src/ui/editor-preview-inline-controller.js.
- Supports three existing editor command mappings: identity → set-identity; field → set-field; entry value → update-entry.
- The controller is provider/template-neutral. Preview markup can opt into editing through data-v2-preview-edit and data-v2-preview-target attributes.
- No new data model or duplicate editing path was introduced.

### Runtime integration
- The main editor runtime now binds the drag-and-drop reorder controller after each structural render.
- Existing button-based ordering remains available as an accessible fallback.

## Acceptance coverage
tests/m398-m407/editor-interaction-layer.test.js covers deterministic reorder command creation, same-scope drag/drop command dispatch, identity/field/entry inline-edit command mapping, and sortable markers in the editor form.

## Scope boundary
This batch does not claim production deployment or final release. It establishes the interaction layer used by the next template/preview integration work.
