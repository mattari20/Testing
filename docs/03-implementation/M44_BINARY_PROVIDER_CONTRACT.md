# M44 — Binary Provider Contract

**Status: Implementation complete; runtime tests pending.**

M44 defines the replaceable contract used by PDF, Print and DOCX adapters to hand off final binary generation.

The core V2 architecture does not select a vendor, library or hosting provider. A provider implements a small generation contract and returns an artifact.

Provider identity is retained for provenance after generation.