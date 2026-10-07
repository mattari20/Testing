# eStudent CV Builder V2

This repository is the controlled development and documentation workspace for the next generation of the eStudent CV Builder.

## Production V1 protection

The currently live CV Builder is treated as the frozen production baseline. V1 must not be modified as part of V2 experimentation.

## Working sequence

1. Recover and document the existing production system.
2. Research current international CV/resume-builder capabilities.
3. Produce a V1-to-V2 gap analysis.
4. Define and approve V2 requirements.
5. Define and freeze V2 architecture.
6. Develop V2 in a controlled branch/workflow.
7. Test V2 without replacing production V1.
8. Release V2 only after acceptance testing and live verification.

## Core V2 direction

The architecture is expected to support:

- Local-first CV creation without mandatory login.
- Optional account/cloud save and backup.
- Extensible sections and fields.
- Preview-side editing.
- A reusable template engine.
- Dynamic multi-page A4 pagination.
- In-builder ATS readiness analysis.
- Standalone CV/ATS checker.
- AI-assisted CV intelligence.
- Job-description matching and tailoring.
- Multiple CV versions from a master profile.
- Future Student Career Wallet integration.
- Future job-platform integration.
- Strong technical and programmatic SEO.

The final architecture must be based on the audited production code and approved documentation, not assumptions.

## Current implementation behavior contract

The current implementation-level behavior, UI interaction patterns, visual conventions, editor/preview synchronization rules, identity behavior, photo/crop rules, ordering rules, print behavior, cache/versioning rules, and mandatory documentation update process are recorded in:

`docs/03-implementation/CURRENT_IMPLEMENTATION_BEHAVIOR_AND_STYLE_CONTRACT.md`

This document is the compatibility reference for future versions. A feature/fix is not considered fully complete until implementation, documentation, regression impact, and release evidence are aligned.

## Current release-readiness status

The repository-level documentation and implementation reconciliation is complete through the existing milestone/release records. The final readiness matrix is documented in `docs/00-foundation/FINAL_RELEASE_READINESS.md`.

Internal V2 productization is carried through runtime acceptance and controlled deployment boundaries. Production deployment and live acceptance must always be established by actual deployment/evidence, not by repository documentation alone.
