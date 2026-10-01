# M668–M687 — Post-Recovery Integrity and Operation Fencing

## Purpose

This batch closes the recovery lifecycle after explicit resolution by verifying that restored editor content still matches the persisted snapshot identity before recovery is marked resolved.

## Integrity verification

The recovery controller now exposes:

- `recoveryVerification`: `unknown`, `verified`, or `failed`
- `recoveryVerificationError`: diagnostic text when verification fails
- `recoveryVerificationAt`: timestamp of the latest verification attempt

A successful explicit recovery must pass content-identity verification. A failed verification leaves the action pending instead of silently declaring recovery complete.

Autosave does not claim recovery verification; normal persistence writes reset the verification state to `unknown`.

## Operation fencing

Recovery dismissal and recovery execution invalidate pending autosave/retry operations through the existing operation token mechanism. A queued autosave therefore cannot recreate a dismissed recovery snapshot after the dismissal has completed.

The current editor document remains authoritative when recovery is dismissed.

## Lifecycle integration

The existing lifecycle controller continues to own dirty-session confirmation. Its recovery state now naturally exposes the post-recovery verification result supplied by the recovery controller.

No second persistence mechanism was introduced and no persistence version bump was required.

## Validation

Test:

`tests/m668-m687/editor-recovery-integrity.test.js`

Coverage includes:

- successful post-recovery integrity verification;
- failed verification remaining pending;
- dismissal clearing verification state without changing current content;
- fencing of queued autosave after dismissal;
- lifecycle exposure of verified recovery state.

The package script `test:m668-m687` runs the M648–M667 resolution suite together with this batch.

Remote CI execution must still be treated as unverified when GitHub reports no workflow run/status for the commit.

## V1 safety

No V1 production asset or V1 runtime path was changed by this batch.
