# M418–M427 — Editor Persistence and Recovery

## Objective
Move the V2 editor from an in-memory editing experience toward a recoverable CV-building session without coupling persistence to a specific browser storage technology.

## Delivered
- Versioned editor persistence record containing the Master Profile and Targeted CV.
- Validation before persistence so malformed documents are not stored as recoverable state.
- Serialization/deserialization contract with explicit version rejection.
- Storage adapter boundary with load/save/clear operations.
- Debounced autosave controller for dirty editor mutations.
- Immediate flush for lifecycle-sensitive save points.
- Recovery controller that restores persisted application state and clears stale undo/redo history.
- Persistence remains provider-neutral; the implementation does not require a specific storage engine.

## Safety boundaries
- Persisted records contain CV application data only; credentials, provider secrets and production configuration are not part of the record.
- Invalid or unsupported records are rejected instead of silently migrated.
- Recovery replaces the active editing document and intentionally discards stale history.
- Autosave is opt-in through the recovery controller; existing editor mounts remain unchanged unless persistence is explicitly attached.

## Acceptance
1. Versioned persistence record round-trips without data loss.
2. Invalid documents are rejected.
3. Adapter can save/load/clear.
4. Recovery restores both Master Profile and Targeted CV.
5. Recovery clears stale undo/redo history.
6. Autosave is debounced and can be flushed synchronously.
