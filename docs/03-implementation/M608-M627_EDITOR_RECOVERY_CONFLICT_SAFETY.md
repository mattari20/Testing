# M608–M627 — Conflict-Safe Editor Recovery

## Purpose

This batch adds an explicit recovery decision layer so persisted CV state is not silently used to replace newer or conflicting editor work.

## Recovery decision states

The recovery controller now exposes `recoveryDecision`:

- `none` — no persisted recovery snapshot.
- `safe` — persisted content matches the current editor content.
- `confirm` — persisted and current content differ and recovery requires an explicit user decision.
- `stale` — persisted content differs and is older than the current saved state; automatic recovery is blocked.
- `unknown` — the available metadata is insufficient for a safe classification.

This decision is derived from both `recoveryContentRelation` and `recoveryRelation`.

## Recovery safety

The persistence controller accepts an explicit `allowStale` recovery option. Without it, a stale conflicting snapshot is rejected without replacing editor state.

The lifecycle controller passes this override only when the caller explicitly forces recovery or when the lifecycle's existing confirmation flow has confirmed the stale recovery decision.

Existing dirty-session confirmation behavior remains intact.

## Compatibility

Existing `recoveryIsNewer`, `recoveryRelation`, and `recoveryContentRelation` diagnostics remain available.

No persistence version bump is required.

No V1 production assets are modified.

## Validation

Tests are in:

`tests/m608-m627/editor-recovery-conflict-safety.test.js`

Coverage includes safe matching content, conflicting newer content, stale blocking, explicit stale override, and lifecycle confirmation.

Remote CI status remains dependent on GitHub workflow availability.
