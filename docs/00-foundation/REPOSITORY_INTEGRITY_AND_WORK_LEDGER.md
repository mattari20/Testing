# Repository Integrity & Work Ledger

## Repository
- Repository: `mattari20/CV-Builder-V2`
- Branch audited: `main`
- Purpose: authoritative storage for V2 architecture, implementation, tests, documentation, V1 Golden Baseline references, and validation workflows.

## Current integrity position
The repository contains the V1→V2 master reconciliation at `docs/01-current-system/V1_TO_V2_MASTER_RECONCILIATION.md`. The earlier 2026-09-29 note saying that this file was absent is historical and has been superseded.

### Verified present
- Foundation/project status and final release-readiness documentation
- Current V1 audit and architecture recovery documentation
- V1 functionality preservation inventory
- V1 UI/CSS preservation contract
- M0 baseline/security reconciliation
- V1→V2 master reconciliation
- V2 product requirements, feature matrix, capability register and ecosystem documentation
- V2 architecture and implementation source
- Seven recovered V1 HTML template sources
- Seven Native V2 template sources
- Template registries/source loader
- Core document, lifecycle, template, layout, preview, export, import, intelligence and security layers
- Editor runtime and command layers
- Browser validation infrastructure
- M110–M217 pagination/fragmentation implementation, tests and evidence contracts
- Native V2 browser validation workflow

### V1 template baseline
Seven recovered original V1 HTML template sources are stored. T01 ATS and T01 Simple remain unavailable and must not be invented.

### CI
The workflow's missing-lockfile npm-cache blocker was removed. The workflow now runs the hardened M208–M217 integrated browser suite and uploads PNG/JSON evidence. A successful GitHub Actions result is still required before calling browser validation green.

## Current release gates
1. T01 ATS and T01 Simple source recovery or formal approved disposition.
2. Remaining historical V1 asset reconciliation.
3. Production credential rotation/revocation and history verification.
4. Final Golden Baseline fixture/output evidence package.
5. Observed successful browser CI execution and artifact inspection.
6. Final V1 runtime retirement after V2 acceptance.

## Storage rule
A milestone is stored only when its source, tests where applicable, documentation and package/workflow integration are committed. Stored does not mean runtime-passed.

## V2 production rule
V1 is the Golden Baseline and migration/regression reference only. Final production architecture is V2-only; V1 runtime/adapters are temporary migration/validation infrastructure.
