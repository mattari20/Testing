# M648–M667 — Explicit Recovery Resolution

## Purpose

This batch turns recovery diagnostics into an explicit action lifecycle. A pending recovery decision can now be intentionally resolved as either **recover** or **dismiss**.

## Recovery action states

The recovery controller exposes `recoveryAction`:

- `none` — no recovery action is required.
- `pending` — the persisted snapshot requires an explicit decision.
- `recovering` — recovery has been initiated.
- `resolved` — the persisted snapshot was successfully restored.
- `dismissed` — the persisted snapshot was intentionally discarded.

The existing `recoveryDecision` and `recoveryActionRequired` remain authoritative for determining whether user action is needed.

## Explicit resolution

`resolveRecovery('recover')` restores the persisted snapshot through the existing recovery safety rules.

`resolveRecovery('dismiss')` intentionally removes the persisted recovery snapshot while leaving the current editor document untouched.

Invalid actions are rejected, and resolution calls are harmless when no action is pending.

## Lifecycle integration

The editor lifecycle controller now exposes `resolveRecovery(action, options)`, delegating to the recovery controller while preserving lifecycle status updates.

No second persistence or recovery mechanism was introduced.

## Safety

- Stale recovery remains subject to the existing explicit stale override rules.
- Dirty-session confirmation remains owned by the lifecycle controller.
- Dismiss never replaces current editor content.
- Recovery resolution remains local.
- No persistence version bump is required.
- V1 production assets remain untouched.

## Validation

Test:

`tests/m648-m667/editor-recovery-resolution.test.js`

Coverage includes pending state, successful recovery resolution, dismissal, invalid actions, no-pending safety, and lifecycle delegation.

Remote CI execution remains dependent on GitHub workflow availability.
