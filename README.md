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


## Current release-readiness status

The repository-level documentation and implementation reconciliation is complete through M208–M217. The final readiness matrix is documented in `docs/00-foundation/FINAL_RELEASE_READINESS.md`.

Internal V2 productization is now carried through the final runtime/deployment closure workstream. The project still does not convert unverified external conditions into a false production-complete claim. Remaining release gates are explicitly tracked: missing authoritative V1 T01 ATS/Simple sources, historical asset/credential reconciliation, Golden Baseline evidence, observed browser CI execution, and final V1 runtime retirement. Internal source completion is tracked separately from live execution evidence.
