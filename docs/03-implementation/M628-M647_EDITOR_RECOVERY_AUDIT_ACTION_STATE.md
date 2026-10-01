# M628–M647 — Recovery Audit & Action State

## Purpose

This batch adds a bounded recovery audit trail and explicit action-state diagnostics on top of the conflict-safe recovery layer from M608–M627.

## Recovery action state

The recovery controller now exposes:

- `recoveryActionRequired` — true when a persisted snapshot requires an explicit recovery decision (`confirm` or `stale`).
- `recoveryLastAction` — the most recent recovery/clear action outcome.
- `recoveryAudit` — a bounded local history of recent recovery actions.

The existing `recoveryDecision`, freshness, content identity, and snapshot metadata remain unchanged.

## Audit events

Recovery events record:

- event id
- timestamp
- action type
- decision state
- freshness relation
- content relation
- snapshot id
- revision
- outcome
- optional reason

The history is intentionally bounded to 12 entries to avoid unbounded client-side growth.

Recorded outcomes include:

- `missing`
- `blocked`
- `recovered`
- `cleared`

## Lifecycle integration

The editor lifecycle controller surfaces the recovery action state and bounded audit history through its existing state contract. No second recovery decision system is introduced.

## Compatibility and safety

- Existing recovery decisions remain authoritative.
- Stale recovery remains blocked unless explicitly allowed.
- Existing dirty-session confirmation remains intact.
- No persistence version bump is required.
- No V1 production assets are modified.
- Audit history is local to the recovery controller and is not sent anywhere.

## Validation

Tests:

`tests/m628-m647/editor-recovery-audit.test.js`

Coverage includes action-required classification, blocked recovery auditing, successful recovery auditing, missing recovery, bounded history, clear auditing, and lifecycle state exposure.

Remote CI execution remains dependent on GitHub workflow availability.
