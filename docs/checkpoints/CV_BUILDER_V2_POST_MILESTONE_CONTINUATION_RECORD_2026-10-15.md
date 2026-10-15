# CV Builder V2 — Post-Milestone Restoration and Continuation Record

**Record date:** 2026-10-15  
**Scope:** CV Builder V2 in `mattari20/Testing` only. This record does not authorize changes to CV Builder V1 or the separate Institutes project.

## 1. Purpose and authority

This document consolidates the known state after the accepted milestone, records verified facts separately from unverified assumptions, and defines the safe sequence for continuation. It is an audit/continuation record, not evidence that outstanding fixes have passed testing.

## 2. Accepted production baseline

- **Accepted milestone:** `9faf549ce714bd7e22bc266d5540ee886d9f0395`
- **Milestone message:** “Bust editor controller cache for synchronous scroll restoration”
- **Production branch:** `release/cv-builder-v2-production`
- **Original pre-rollback production SHA:** `78b4ba2ff4e7415e137e6ce9d448612523986111`
- **Exact-tree backup branch:** `backup/cv-builder-v2-exact-code-9faf549`
- **Pre-restore backup branch:** `backup/cv-builder-v2-release-before-milestone-restore-20261014`
- **Checkpoint branch:** `backup/cv-builder-v2-milestone-20261014-final-checkpoint`
- **Checkpoint report commit:** `5b1c02b94012c6937c0ba2b2ff6cd12944d6db33`
- **Earlier PR #118:** closed, never merged.

The accepted milestone is the safe reference point. Do not move production away from it without review and validation.

## 3. Post-milestone repair work: PR #119

- **PR:** https://github.com/mattari20/Testing/pull/119
- **Title:** Repair CV Builder V2 workspace regressions
- **Branch:** `fix/cv-builder-v2-workspace-regressions-20261014`
- **Base:** `release/cv-builder-v2-production` at `9faf549ce714bd7e22bc266d5540ee886d9f0395`
- **Latest known head:** `918a01d103ce446afa9119645369870943631964`
- **State at last audit:** Open, not merged; GitHub reported mergeable.
- **Important:** no workflow runs or commit statuses were returned for the latest repair SHA by the available GitHub tools. This is missing validation evidence, not a passing result.

### Commits known on PR #119

1. `2a4050734fe4bc27cd244703a2f3ce969a067087` — workspace quota handling.
2. `55764e56819b6f76cdcbe4a587b230d1efceed34` — workspace menu and preserve unreadable saved data.
3. `c828d6576f04ab4ee0b4b866e6e51280ebc75ef8` — editor viewport restoration.
4. `f4797677e832d2468465f7c8558ebeb8587b83b4` — quota and unreadable-storage tests.
5. `918a01d103ce446afa9119645369870943631964` — mobile menu pointerdown handling.

### Files changed by PR #119

- `src/ui/cv-workspace-controller.js`
- `builder.html`
- `src/ui/editor-runtime.js`
- `tests/m1000-m1059/cv-workspace-quota.test.js`

### Intended repair behavior (not yet accepted as verified)

- Preserve unreadable/corrupt workspace storage instead of automatically deleting it.
- On quota errors, trim older history snapshots only as needed and retain the newest snapshot for each CV; if space remains insufficient, report a clear error.
- Keep desktop workspace actions accessible.
- Avoid collapsing the mobile More menu on pointerdown before a target tab click can complete.
- Preserve viewport scroll position during structural editor rerenders.
- Add tests for quota recovery and unreadable storage preservation.

## 4. Validation and deployment evidence

### Previously recorded milestone checks

- Hostinger deployment workflow run **38490677809**: success.
- Template Gallery Validation run **38490677818**: success.
- CV Workspace Validation run **38490677821**: failure.
- These runs correspond to the accepted milestone, not PR #119's latest repair commit.
- Reported workspace validation failures:
  1. Mobile More menu preview tab did not switch `#v2-editor[data-mobile-view]` from `edit` to `preview`.
  2. Workspace multi-CV lifecycle timed out because `#duplicate-cv-btn` existed but was not visible.
  3. Adding a skill changed scroll position from y=3545 to y=3479 (66px jump).
- Controller tests passed (8 tests) in prior recorded results; gallery validation passed. These are not evidence that PR #119 has passed.
- User manually reported the website as PASS, design PARTIAL, main editing features PARTIAL, and three browser checks PASS. Treat this as manual feedback, not a substitute for reproducible test logs.
- A screenshot showed missing CV management buttons and a localStorage quota error for `estudent_cv_workspace_v2_2027`.

### Deployment safety

A previous Hostinger workflow used `server-dir: ./` and reported uploading/replacing files, but the mapping from FTP root to `/public_html/cv-builder-v2/` was not independently verified in the recorded evidence. Verify the actual destination before any new production deploy.

**Never overwrite** CV Builder V1 at `/public_html/cv-builder/`. Do not modify the Institutes project.

## 5. Current status matrix

| Area | Status | Evidence / next action |
|---|---|---|
| Accepted milestone baseline | Recorded | SHA `9faf549...`; preserve as rollback reference |
| PR #119 repair code | Committed, unmerged | Review diff and retest |
| Workspace quota recovery | Untested on PR head | Run targeted test and browser storage scenario |
| Corrupt/unreadable storage preservation | Untested on PR head | Run targeted test without deleting existing user data |
| Desktop workspace actions | Unverified repair | Test duplicate/manage controls at desktop width |
| Mobile More menu | Unverified repair | Test edit/preview tabs at mobile width |
| Scroll preservation | Unverified repair | Test add/edit skill and other structural fields |
| Gallery validation on PR head | No result recorded | Run workflow/tests on PR head |
| Workspace validation on PR head | No result recorded | Run workflow/tests on PR head |
| Hostinger destination | Not independently verified | Verify FTP root/path before deployment |
| Live deployment of PR #119 | Not deployed/confirmed | PR is open and unmerged |
| Full historical documentation | In progress | Reconcile earlier conversations, commits, screenshots and existing docs |

## 6. Phase 1 documentation reconciliation update — 2026-10-15

Repository inspection confirmed that the accepted milestone already contains a substantial documentation system: foundation/release governance, architecture and product requirements, a master capability register, a feature matrix, a final product feature closure audit, current implementation/style contracts, and hundreds of M-numbered implementation/evidence records. The first-pass regression register was therefore incomplete as a project-wide inventory, not because the repository lacked documentation.

The new central index is `docs/checkpoints/CV_BUILDER_V2_MASTER_COMPLETION_REGISTER_2026-10-15.md` on the documentation audit branch. It links the existing authorities, separates integrated/foundation/planned/future/external-gate scope, and records the known October regressions and exact-SHA evidence rules. It is explicitly a first reconciliation pass; Phase 1 is not yet complete.

Key existing authorities reviewed in this pass include:
- `docs/00-foundation/PROJECT_STATUS.md`
- `docs/00-foundation/RELEASE_GATE_TRACKER.md`
- `docs/00-foundation/FINAL_RELEASE_READINESS.md`
- `docs/00-foundation/REPOSITORY_INTEGRITY_AND_WORK_LEDGER.md`
- `docs/02-v2-product/V2_FEATURE_MATRIX.md`
- `docs/02-v2-product/V2_MASTER_CAPABILITY_REGISTER.md`
- `docs/02-v2-product/V2_PRODUCT_REQUIREMENTS.md`
- `docs/03-implementation/FINAL_PRODUCT_FEATURE_CLOSURE_AUDIT.md`
- `docs/03-implementation/CURRENT_IMPLEMENTATION_BEHAVIOR_AND_STYLE_CONTRACT.md`

Important reconciliation finding: older documents contain repository-name references to `mattari20/CV-Builder-V2`, while the active task repository is `mattari20/Testing`. Treat the former as historical references unless a source mapping proves otherwise; do not treat those documents as absent solely because the repository label differs.

The existing release tracker records R1/R3/R4/R5 as PASS, R2 as CONDITIONAL, R6 as OPEN, R7 as OPEN, and R8 as BLOCKED at its recorded evidence boundary. These statuses do not override the newer milestone workspace failure or create evidence for PR #119. Current branch-specific and exact-SHA evidence must be reconciled before any release status is upgraded.

## 7. Continuation plan (required order)

1. **Complete documentation audit.** Continue from `CV_BUILDER_V2_MASTER_COMPLETION_REGISTER_2026-10-15.md`; reconcile the full feature closure matrix, section-library specification/implementation/regression guard, M-numbered workstreams, user-reported issues, exact source/test paths and current evidence. Keep unknowns explicitly marked.
2. **Review PR #119.** Inspect all changed files and confirm no unrelated redesign, CV Builder V1 change, Institutes change, or pre-designed section library change.
3. **Run targeted automated tests** for quota handling, corrupt storage preservation, workspace lifecycle, mobile menu, and editor scroll preservation.
4. **Run browser acceptance tests** on desktop and mobile widths. Capture test results and screenshots/logs.
5. **Resolve failures before merge.** Do not treat an empty Checks tab or missing workflow run as success.
6. **Merge PR #119 only after validation is green** and the diff has been reviewed.
7. **Verify deployment configuration and destination** before deploying to Hostinger.
8. **Deploy and verify live site** using version/commit evidence and smoke tests. Record exact run, commit SHA, target directory, and test outcomes.
9. **Only then finalize the remaining-feature design** and implement in small, documented batches.

## 8. Rules for all future work

- Keep the accepted milestone and backup branches intact.
- Do not claim a fix is complete, tested, merged, or deployed without evidence for that exact state.
- Separate committed code, passing automated tests, manual browser results, and live deployment status.
- Make focused changes and document each batch.
- Preserve existing template design unless a specifically scoped design change is approved.
- Do not combine unrelated projects or change CV Builder V1.
- Update this record whenever status, test evidence, or deployment state changes.

## 9. Documentation completeness statement

This record consolidates the known milestone, PR #119, known regressions, validation evidence, deployment uncertainty, and continuation order from the available project history as of 2026-10-15. It does **not** claim to contain every historical decision or every previous implementation detail. The documentation audit is complete only after the repository's existing docs and the available prior work history have been reconciled against this record.
