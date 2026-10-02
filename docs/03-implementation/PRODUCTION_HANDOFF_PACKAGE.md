# V2 Production Handoff Package

## Purpose

This is the single operational handoff record for the remaining production release work.

Repository implementation and automated validation are complete through the current release-gate boundary, with the application-code deployment candidate frozen separately from the latest test-only evidence commit. This document does **not** claim that production deployment, external credential rotation, historical source recovery, or V1 retirement has occurred.

## Current verified repository state

- Accepted application-code deployment candidate: `36e5e174bec8e2445ac54daebe31d7956075eb31`.
- Fresh evidence commit: `ee7ca4f595906dd284dbaba07453fa0f757004cc` (test-only change after the deployment candidate).
- V2 Integration Validation: SUCCESS — run `36952569986`.
- Native V2 Browser Validation: SUCCESS — run `36952570025`.
- CV Builder V2 Validation: SUCCESS — run `36952570166`.
- CV Builder V2 E2E Contract: SUCCESS — run `36952570015`.
- Fresh browser evidence covers the current V2 application/template tree, including the production entry surface, editor preview, inline preview editing, and integrated fragmentation.
- R1 Source/asset closure: PASS.
- R3 Golden Baseline: PASS.
- R4 Browser CI: PASS.
- R5 Pagination/fragmentation: PASS.
- R2 Security closure: CONDITIONAL — production credential rotation/revocation and authoritative history verification remain external actions.
- R6 Production Integration: OPEN.
- R7 V1 Retirement: OPEN.
- R8 Final Release: BLOCKED until all preceding gates are PASS.

## Production execution order

### Step 0 — Pre-deployment release lock

Before uploading anything to production:

- freeze the deployment target at application-code commit `36e5e174bec8e2445ac54daebe31d7956075eb31`;
- do not deploy an unverified later application-code commit;
- confirm the fresh validation runs above remain the authoritative evidence for this release boundary; the evidence run uses `ee7ca4f...`, which differs from the deployment candidate only by test-only changes;
- ensure the seven Word-template assets and their manifest are included in the production upload plan;
- keep V1 available until R6 is PASS.

### Step 1 — Deploy the exact accepted commit

Deploy the exact V2 release commit intended for production and record:

- production URL;
- exact deployed Git commit SHA;
- environment identifier;
- deployment date/time;
- deployment method/reference.

Do not mark R6 PASS from repository status alone.

### Step 2 — Verify V2 entrypoint

Open the deployed V2 entrypoint in a real browser.

Record:

- URL;
- timestamp;
- screenshot/evidence reference;
- successful V2 editor initialization.

Expected result: the V2 editor loads without routing into the old V1 bridge.

### Step 3 — Real CV create/edit

Create a real test CV using non-sensitive test data.

Verify:

- profile information can be entered;
- sections can be edited;
- entries can be added/updated/removed;
- changes survive the intended session lifecycle;
- no production personal data is used for the release test.

Capture evidence.

### Step 4 — Template selection and live preview

Verify:

- template selection changes the active template;
- preview updates;
- supported variants behave as documented;
- no unexpected V1 fallback occurs.

Capture evidence.

### Step 5 — Multi-page pagination

Use a long controlled CV.

Verify:

- multiple A4 pages are produced;
- content remains ordered;
- split/continuation behavior is stable;
- no uncontrolled vertical overflow is observed;
- navigation/continuity remains correct.

Capture screenshots/evidence.

### Step 6 — PDF/Print

Execute the actual production PDF/print path.

Record:

- output type;
- generated artifact reference;
- page count;
- timestamp;
- browser/runtime evidence.

The repository currently exposes a provider boundary; the deployed environment must supply the concrete generation path.

### Step 7 — DOCX

Execute the actual production DOCX path.

Record:

- generated DOCX artifact reference;
- editable/openable result;
- timestamp;
- runtime evidence.

The repository currently exposes a provider boundary; the deployed environment must supply the concrete generation path.

### Step 8 — V1 data/migration path

Use an approved non-sensitive V1 test CV or controlled fixture.

Verify the supported migration/import path into V2.

Record:

- input reference;
- migration result;
- evidence;
- any compatibility limitation.

### Step 9 — Negative V1 fallback check

Confirm that normal V2 operation does not silently redirect to:

- `bridge.php`;
- V1 template selection;
- V1 Build Online;
- V1 Word-file flow.

If fallback exists intentionally, record the exact documented condition.

### Step 10 — Production security/configuration review

Confirm externally that:

- production credentials were rotated/revoked where required;
- deployed configuration contains no old exposed credentials;
- no credentials are present in browser evidence;
- no production secrets are copied into this repository.

Do not record secret values in this package.

### Step 11 — R6 acceptance

Create the final production smoke record using:

`docs/03-implementation/M228-M237_PRODUCTION_SMOKE_TEST_RECORD.md`

R6 may become PASS only after every required observation is true and the exact deployed commit is recorded.

### Step 12 — R7 V1 retirement

Only after R6 PASS:

- switch the production entry path to V2-only;
- remove/disable temporary V1 fallback according to the approved retirement plan;
- verify old V1 entrypoints no longer serve normal production traffic;
- retain only explicitly approved compatibility/migration mechanisms.

Record the retirement evidence.

### Step 13 — R8 final release

Run the machine-checkable final release gate:

`src/release/final-release-gate.js`

R8 is READY only when R1–R7 are explicitly PASS.

## Production evidence minimums

For the production deployment, capture one evidence item for each required R6 observation. At minimum the evidence set must contain:

1. V2 entrypoint screenshot;
2. CV create/edit screenshot or recording;
3. template switch + live preview screenshot;
4. long-CV multi-page pagination screenshots;
5. PDF/print artifact plus page-count evidence;
6. DOCX artifact plus successful-open evidence;
7. V1 controlled-fixture migration evidence;
8. negative V1-fallback evidence;
9. production configuration/security review record.

Do not put passwords, API keys, tokens, database credentials, or private keys into any evidence artifact.

## Evidence record template

```text
Production URL:
Deployment commit SHA:
Environment:
Observed at:

V2 entrypoint: PASS / FAIL
CV create/edit: PASS / FAIL
Template/live preview: PASS / FAIL
Multi-page pagination/fragmentation: PASS / FAIL
PDF/print export: PASS / FAIL
DOCX export: PASS / FAIL
V1 data/migration: PASS / FAIL
Unexpected V1 fallback: PASS / FAIL
Production credential/configuration review: PASS / FAIL

Evidence references:
- 
- 
- 

Notes:
```

## Remaining external release blockers

The repository-side implementation and current automated evidence are complete through R5. The remaining blockers are operational/external:

1. Production credential rotation/revocation.
2. Authoritative Git-history secret verification.
3. Actual Hostinger deployment of the accepted release commit.
4. Live nine-point R6 smoke-test evidence.
5. Production availability/integrity verification of the seven Word-template downloads.
6. V1 retirement after R6 acceptance.

The two historical T01 ATS/Simple V1 sources remain unrecovered by design, but their new V2-native replacements are implemented and covered by the fresh nine-template browser evidence. They are not a remaining production deployment blocker.

## Important rule

Do not mark a release gate PASS because a test, contract, or document exists. PASS requires the evidence defined by that gate.

## Handoff status

**Repository side:** ready for production handoff.

**Production side:** pending actual deployment and external verification.

**Final release:** blocked until the listed external/source gates are closed.
