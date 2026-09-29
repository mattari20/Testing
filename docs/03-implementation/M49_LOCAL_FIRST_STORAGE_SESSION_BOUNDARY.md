# M49 — Local-First Storage and Session Boundary

**Status: Implementation complete; runtime tests pending.**

M49 provides a small local-first session contract for active profile/CV/revision context.

It does not choose a database, cloud provider or authentication system.

The storage implementation is injected through an adapter, allowing browser local storage, another local store, or future account/cloud persistence without changing the domain model.