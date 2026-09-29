# M32 — V2 Build Online Flow

## Status
**Implementation complete; runtime test execution pending.**

M32 establishes the V2-only entry contract from Template Library into the builder.

Supported starts:
- new CV;
- Master Profile;
- existing Targeted CV;
- controlled Demo Profile.

Every flow requires compatibility review and explicitly forbids canonical career-data mutation during template selection/start.

The selected template remains presentation configuration. It does not become the owner of Master Profile data.

No V1 runtime dependency, UI redesign, payment provider, storage provider, or rendering provider is introduced.
