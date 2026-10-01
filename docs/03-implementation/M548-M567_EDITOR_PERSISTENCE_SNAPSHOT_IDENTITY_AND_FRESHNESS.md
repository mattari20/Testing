# M548–M567 — Persistence Snapshot Identity and Recovery Freshness

## Purpose

This 20-milestone batch strengthens the persistence boundary with snapshot identity verification and explicit recovery freshness diagnostics.

## M548–M557 — Snapshot identity

- Persisted records now receive a deterministic snapshot identity.
- Identity covers persistence version, savedAt, revision, session, and application data.
- Deserialization verifies the identity when present.
- Tampered snapshot content is rejected.
- Older records without snapshot identity remain readable for backward compatibility.

## M558–M567 — Recovery freshness decision support

- Recovery diagnostics expose the persisted snapshot identity.
- Recovery diagnostics compare persisted savedAt against the current editor savedAt.
- A newer persisted snapshot is explicitly observable through recoveryIsNewer.
- Successful save/autosave updates snapshot identity and freshness state.
- Recovery restores snapshot identity and freshness state.
- Clear and invalid recovery reset identity/freshness diagnostics.

## Safety boundary

This batch only strengthens persistence metadata and recovery diagnostics. It does not silently overwrite dirty work, bypass recovery confirmation, modify V1 production, or introduce account/cloud behavior.

## Validation

npm run test:m548-m567

Coverage includes deterministic identity, tamper rejection, legacy compatibility, freshness comparison, and diagnostic reset behavior.
