# M46 — Intelligence and AI Safety Boundary

**Status: Implementation complete; runtime tests pending.**

M46 adds a safety gate around AI-generated suggestions.

Suggestions:
- remain separate from authoritative career data;
- require user review;
- retain provenance;
- are blocked when they explicitly request fabricated career claims.

This layer does not select an AI provider.