# M40 — PDF/Print Adapter Contract

**Status: Implementation complete; runtime tests pending.**

M40 isolates concrete PDF/Print generation from the V2 export and layout engines.

The adapter receives the immutable V2 runtime request and returns a generated artifact. Provider identity remains outside the core architecture.

This enables a future concrete PDF renderer or browser print implementation without changing the document, template, pagination, preview or export contracts.