# M478–M487 — Editor Autosave Reliability and Observability

## Purpose
This batch makes autosave behavior observable and failure-safe without changing the editor's persistence boundary.

## Completed
- Recovery controller exposes autosave status: `idle`, `scheduled`, `saving`, `saved`, and `error`.
- Successful autosaves expose `lastAutosavedAt`.
- Autosave failures expose a deterministic `lastAutosaveError`.
- Lifecycle state mirrors autosave state for application/UI consumers.
- Clearing recovery resets autosave metadata.
- Existing dirty-state semantics remain unchanged: autosave never marks the editor clean.
- Editor DOM can expose autosave status, error, and last-autosaved metadata through dedicated data attributes.
- Dedicated M478–M487 test command is wired into V2 integration CI.

## DOM contract
- `data-v2-editor-autosave-status`
- `data-v2-editor-autosave-error`
- `data-v2-editor-last-autosaved`

## Architectural boundary
Autosave persistence remains independent from the CV form renderer. The recovery controller owns persistence mechanics; the lifecycle controller exposes application state; DOM bindings only reflect that state.

No V1 production code, account/cloud behavior, or provider-specific storage was introduced.

## Validation
`npm run test:m478-m487`

Coverage includes successful autosave transitions, failure observability, metadata reset, and lifecycle mirroring.