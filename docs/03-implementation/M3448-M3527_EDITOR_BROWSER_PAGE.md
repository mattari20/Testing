# M3448–M3527 — Integrated Editor Browser Page
Connects the browser adapter to a real DOM page surface: shell, form renderer, preview renderer, and toolbar.

## Flow
1. Read the adapter state.
2. Render the current form model.
3. Render the current preview result.
4. Surface failures through the page status region.
5. Delegate edits/history to the existing application boundary.

## Boundary
This is the first integrated browser UI layer. It remains framework-neutral and does not alter V1 production assets or runtime.

## Acceptance
A supplied DOM mount can host a complete V2 editor surface with form, preview, status, and history controls.