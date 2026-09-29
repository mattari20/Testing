# M2 — Lifecycle and Persistence Core

**Status:** Implemented and tested

## Scope
M2 establishes lifecycle and persistence-domain semantics on top of the M1 canonical core.

Delivered:
- document lifecycle states;
- immutable-style revision snapshots;
- current/superseded revision semantics;
- recovery points;
- explicit archive/restore/delete;
- revision retrieval/listing;
- lifecycle validation;
- serialization boundary.

## Boundaries
M2 does not introduce a database, hosting choice, authentication provider, UI, export engine, ATS, Job Match, or AI provider.

Persistence is represented as a domain boundary so a later infrastructure adapter can implement storage without changing canonical career/document semantics.

## Invariants
- exactly one current revision;
- revision numbers are monotonic;
- recovery is explicit and single-consumption;
- archive does not erase data;
- delete is an explicit lifecycle state;
- revision history remains available to authorized persistence/recovery logic;
- lifecycle operations do not mutate the canonical profile model directly.

## Next
M3 — Template Engine and V2 Template Compatibility.
