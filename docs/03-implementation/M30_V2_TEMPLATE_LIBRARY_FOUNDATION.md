# M30 — V2 Template Library Foundation

## Status

**Implementation complete; runtime test execution pending.**

## Purpose

M30 creates the first V2-only Template Library product foundation around the existing Template Engine and onboarding gate.

The library is a discovery/distribution layer. It does not own Master Profile data and does not become part of the document core.

## Delivered

- Registry-driven template library entries.
- Career-level, industry and style filtering.
- Free/premium metadata filtering.
- Photo, DOCX, blank-DOCX and Online CV capability filtering.
- Product-facing output capability normalization.
- Onboarding readiness surfaced for each library entry.
- Registry-driven library plan with no hard-coded template count.
- Future V2-native templates can enter the library without a V1 baseline.

## Explicit boundaries

M30 does not:
- create a UI implementation;
- change CSS;
- implement payment/entitlement enforcement;
- implement DOCX generation;
- implement PDF generation;
- expose private career data in demo content;
- make V1 runtime a production dependency;
- select a hosting, database, rendering, payment or AI provider.

## Acceptance criteria

1. Library metadata is derived from template registry data.
2. Filtering uses declared metadata only.
3. Blank Word and generated DOCX remain distinct capabilities.
4. Free/premium classification remains product metadata, not rendering logic.
5. Master Profile is not owned or stored by the library.
6. New V2-native templates can be listed without V1 compatibility.
7. No hard-coded seven-template assumption exists.

## Next direction

Continue V2-only with template preview/demo-profile distribution contracts and then real export implementation, while V1 comparison remains a temporary validation gate for the seven recovered designs.
