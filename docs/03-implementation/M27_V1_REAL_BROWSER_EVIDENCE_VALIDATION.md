# M27 — V1 Real Browser Evidence Validation

The M27 browser test renders the seven currently recovered V1 sources using the same controlled canonical snapshot used for Native V2 evidence.

It uses the generic source-derived V1 adapter and the raw Playwright page adapter. It captures real screenshots and basic DOM geometry without modifying the V1 source files.

The test derives the current V1 template set from the registered V2 templates' V1 baseline identities rather than maintaining a second hard-coded seven-template list.

The output is evidence only. It does not declare V1/V2 equivalence.
