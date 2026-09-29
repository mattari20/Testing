# M50 — Online CV Publication Boundary

**Status: Implementation complete; runtime tests pending.**

M50 creates the application boundary for publishing a CV as a private/link-only/public projection.

Rules:
- canonical private career data is not exposed wholesale;
- publication uses an explicit public projection;
- publication carries source revision/template provenance;
- revocation removes the public projection and returns visibility to private.

No web-server, routing, database or hosting implementation is selected by this milestone.