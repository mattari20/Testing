# CV Builder V2 — Current Deployment Package Scope

## Status

This document records the release package boundary after the project decision to defer downloadable Word-template files.

## Target

Production branch:

`release/cv-builder-v2-production`

Current repository candidate before final release freeze:

`ffdd8e5f666f89683e08c6a0a6d0819ee10d92e6`

The repository may receive additional release-readiness documentation commits before the final deployment SHA is frozen.

## Included application package

The current V2 web application deployment package consists of the production application files required by the existing deployment workflow, including:

- `index.html`
- `builder.html`
- `templates.html`
- `src/**`
- `scripts/**`
- other root/runtime assets required by the application

The exact final upload set is determined from the frozen release commit and the existing deployment workflow exclusions.

## Explicitly excluded from the web upload

Repository-only material remains excluded from the production web upload according to the deployment workflow, including:

- `.git/**`
- `.github/**`
- `node_modules/**`
- `docs/**`
- `tests/**`
- package-management files excluded by the workflow

These exclusions do not delete the material from GitHub; they only define the production upload boundary.

## Deferred assets

The separate downloadable Word-template binaries are deferred and are **not required for this release package**.

No claim is made that those future downloadable template assets are currently available or production-ready.

Future template-asset delivery will be handled as a separate controlled release phase without changing the established V2 application architecture.

## Runtime acceptance still required

The current release package must still preserve and support the existing V2 runtime contracts for:

- CV creation and editing;
- section and entry management;
- template selection and live preview;
- desktop and mobile UX;
- pagination and fragmentation;
- PDF/print boundary;
- DOCX runtime boundary where exposed;
- workspace/recovery behavior;
- intelligence/career-tool boundaries;
- V1 migration/compatibility boundary;
- V1 fallback security boundary.

## Deployment rule

Do not deploy from an unreviewed working tree or from a moving branch reference.

Before deployment:

1. complete remaining repository-side work;
2. run the agreed validation suite;
3. freeze one exact commit SHA;
4. deploy that exact SHA;
5. record the deployed SHA and observation time;
6. execute the R6 production smoke record;
7. close R7 only after R6 passes;
8. run the final R8 gate only after R1–R7 are PASS.

## Current release-gate position

- R1: PASS
- R2: CONDITIONAL
- R3: PASS
- R4: PASS
- R5: PASS
- R6: OPEN
- R7: OPEN
- R8: BLOCKED

This document does not change those statuses.

## Scope decision

**Current objective:** complete the remaining V2 application, runtime, validation, security and production-readiness work.

**Deferred objective:** downloadable Word-template asset delivery.

**Deployment:** not yet performed.
