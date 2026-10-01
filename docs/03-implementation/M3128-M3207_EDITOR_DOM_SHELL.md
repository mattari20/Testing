# M3128–M3207 — Editor DOM Shell
Defines the browser-facing DOM shell for CV Builder V2. It creates stable toolbar, form, preview, and status regions without selecting a UI framework. The shell owns structure only; application state and rendering remain delegated to existing editor modules.

## Boundary
- DOM-native and framework-neutral.
- No persistence or export responsibility.
- No V1 runtime/assets are referenced.
- Regions expose stable data attributes for integration and browser evidence.

## Acceptance
The shell can be mounted into an existing document, report status, and clear editor content without owning editor state.