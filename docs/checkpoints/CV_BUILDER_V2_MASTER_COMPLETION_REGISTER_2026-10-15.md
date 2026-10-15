# CV Builder V2 — Master Completion Register (Phase 1 Audit)

**Audit date:** 2026-10-15  
**Repository under audit:** `mattari20/Testing`  
**Reference branch / baseline:** `release/cv-builder-v2-production` at `9faf549ce714bd7e22bc266d5540ee886d9f0395`  
**Audit status:** IN PROGRESS — first reconciliation pass  
**Authority:** This register links existing governing documents and records current evidence boundaries. It does not supersede approved architecture/product contracts.

## 1. Purpose and rules

This register is the index for Phase 1 documentation reconciliation. It prevents the recent short regression register from being mistaken for the entire CV Builder V2 specification history.

Status labels:
- **Documented** — a relevant repository specification or record exists.
- **Implemented (recorded)** — an implementation/workstream document records delivery; not proof that it still works at the accepted baseline.
- **Test evidence (historical)** — a recorded test exists for the exact SHA/run named in the source document; not automatically valid for later code.
- **Partial / integration gap** — foundation or contract exists but the user-facing flow, acceptance evidence, or release integration remains incomplete.
- **Failed / regression** — a failure has been recorded and remains to be resolved or re-tested.
- **Unverified** — no adequate evidence was found in this pass.
- **Future / deferred** — intentionally outside the current release target unless scope is explicitly changed.

A feature is not Complete merely because its document or source file exists. Every status must be tied to a source document, code/test reference, exact commit, workflow run, or live evidence.

## 2. Baseline and release facts

| Item | Current record | Evidence / interpretation |
|---|---|---|
| Accepted milestone | `9faf549ce714bd7e22bc266d5540ee886d9f0395` | Accepted rollback/reference point; preserve |
| Production branch | `release/cv-builder-v2-production` | Current reference branch for this audit |
| Repair PR #119 | Open, unmerged; head `918a01d103ce446afa9119645369870943631964` | Proposed workspace fixes have no recorded passing checks on this head |
| Documentation PR #120 | Draft, open, unmerged; head `7ef065a1e4d6eea0ee5cf4208bdd9a23d0298ec4` | This Phase 1 audit continues on this documentation-only branch |
| Prior milestone workflows | Deploy and Gallery Validation succeeded; Workspace Validation failed | Runs `38490677809`, `38490677818`, `38490677821`; results belong to milestone SHA, not PR #119 |
| Deployment target | Not independently verified | Confirm Hostinger FTP root maps to `/public_html/cv-builder-v2/` before any deploy |
| V1 / other projects | Out of scope | Do not change `/public_html/cv-builder/` or Institutes project |

## 3. Existing authoritative documentation discovered

The accepted milestone tree already contains a large documentation system. The initial post-milestone register did not enumerate these files; this register corrects that omission. A further comparison of `release/cv-builder-v2-production` at the accepted milestone against `main` found **diverged histories**: GitHub reports 38 commits on `main` not in the accepted milestone history and 462 commits on the accepted milestone side not in `main` (compare status `diverged`). Treat this as a branch/release reconciliation issue; do not merge branches wholesale or assume that a feature on `main` is part of the accepted release.

### Foundation / release governance
- `docs/00-foundation/PROJECT_STATUS.md`
- `docs/00-foundation/RELEASE_GATE_TRACKER.md`
- `docs/00-foundation/FINAL_RELEASE_READINESS.md`
- `docs/00-foundation/REPOSITORY_INTEGRITY_AND_WORK_LEDGER.md`
- `docs/00-foundation/BROWSER_CI_RECONCILIATION.md`
- `docs/00-foundation/V2_MILESTONE_STORAGE_MATRIX.md`
- `docs/00-foundation/R1_V1_SOURCE_AND_ASSET_CLOSURE.md`
- `docs/00-foundation/R2_SECURITY_CLOSURE.md`
- `docs/00-foundation/R3_GOLDEN_BASELINE_CLOSURE.md`
- `docs/00-foundation/R3_RUNTIME_EVIDENCE_RECONCILIATION.md`

### Architecture / product requirements
- `docs/01-architecture/V2_ARCHITECTURE_CONTRACT_AND_FREEZE.md`
- `docs/01-architecture/V2_DOMAIN_AND_DATA_CONTRACT_SPECIFICATION.md`
- `docs/01-architecture/V2_TEMPLATE_COMPATIBILITY_AND_CAPABILITY_CONTRACT.md`
- `docs/01-architecture/V2_LAYOUT_AND_PAGINATION_CONTRACT.md`
- `docs/01-architecture/V2_EXPORT_AND_DISTRIBUTION_CONTRACT.md`
- `docs/01-architecture/V2_IMPORT_AND_MIGRATION_CONTRACT.md`
- `docs/01-architecture/V2_TESTING_GOLDEN_BASELINE_AND_RELEASE_GOVERNANCE_CONTRACT.md`
- `docs/02-v2-product/V2_PRODUCT_REQUIREMENTS.md`
- `docs/02-v2-product/V2_FEATURE_MATRIX.md`
- `docs/02-v2-product/V2_MASTER_CAPABILITY_REGISTER.md`

### Implementation / closure / UI behavior
- `docs/03-implementation/FINAL_PRODUCT_FEATURE_CLOSURE_AUDIT.md`
- `docs/03-implementation/CURRENT_IMPLEMENTATION_BEHAVIOR_AND_STYLE_CONTRACT.md`
- `docs/03-implementation/M1088-M1127_CV_WORKSPACE_PERSISTENCE.md`
- `docs/03-implementation/M2408-M2487_MULTI_CV_SWITCHING.md`
- `docs/03-implementation/M10338-M10358_EDITOR_PRODUCT_UX.md`
- Hundreds of M-numbered implementation, test-contract, browser-evidence, export, pagination, persistence, editor, and release-gate records exist under `docs/03-implementation/`.

### Important audit conclusion
There is already substantial historical documentation. Therefore, Phase 1 must **reconcile and link** this material rather than rewrite it from scratch. Some older documents use the historical repository name `mattari20/CV-Builder-V2`; the current repository in this task is `mattari20/Testing`. Preserve that as a historical naming discrepancy, and do not assume the old repo name means the content is absent.

## 4. Capability register — first reconciliation pass

The matrix below summarizes the main product areas. It is not a claim that every individual sub-requirement has been audited. Detailed source documents listed above remain authoritative.

| ID | Capability area | Documentation status | Recorded implementation status | Current test / release evidence | Phase 1 disposition |
|---|---|---|---|---|---|
| DOC-01 | Product requirements and capability scope | Documented across product requirements, feature matrix and master capability register | Mixed by capability; many are planned/future | No single current test proves the whole register | Separate current release, integration gap and future scope |
| DOC-02 | Architecture and canonical document model | Documented in architecture/domain contracts | Core architecture and implementation are recorded | Historical repository CI evidence exists for earlier SHAs | Map individual contracts to current source/tests |
| DOC-03 | Workspace persistence and recovery | Documented in M1088–M1127 and related editor persistence records | Foundation recorded; quota/corrupt-data issues under repair | PR #119 tests proposed; no pass recorded on its head | Audit controller, storage key, test coverage and acceptance cases |
| DOC-04 | Multiple CVs, switching and duplication | Documented in M2408–M2487 and feature closure audit | Switching controller recorded; full management surface was incomplete/hidden in reported browser run | Milestone workspace validation failed on duplicate control visibility | Separate controller delivery from complete UI workflow |
| DOC-05 | Save, autosave, versions, recovery and undo/redo | Multiple M-numbered contracts and feature closure audit | Foundations recorded; final product surface varies by feature | Exact current-baseline coverage needs mapping | Trace each action to UI, state, test and current behavior |
| DOC-06 | Editor fields, sections, hide/show, reorder and custom fields | Feature matrix, product requirements, style contract and M-numbered records | Substantial implementation recorded | Prior user reports include hide/reorder/preview synchronization issues | Verify each behavior and record affected source/test |
| DOC-07 | Personal/contact information and identity fields | Style contract and product requirements | Canonical identity/visibility rules documented and implemented in prior work | Current visual/preview behavior needs current-baseline verification | Include required fields, ordering, visibility and format |
| DOC-08 | Skills, languages and proficiency variants | Master capability register and presentation-variant contracts | Prior implementation/design work recorded; cross-template regressions reported | No complete current template-by-template evidence matrix found in this pass | Reconcile variant contract, per-template defaults and regression evidence |
| DOC-09 | Template metadata, compatibility and switching | Native template and compatibility contracts | Native V2 renderer/catalog and switching foundation recorded | Gallery validation passed on milestone SHA; workspace validation failed | Distinguish template engine from gallery/product journey |
| DOC-10 | Template Gallery / library / demo profile | Product requirements and feature closure audit | Foundation exists; public gallery UX and handoff described as incomplete | Gallery workflow passed on milestone SHA; full product flow not proven | Identify in-scope release surfaces vs future work |
| DOC-11 | Pre-designed Section Library (26 types / five groups) | Specification exists on `main` at `docs/02-v2-product/PRE_DESIGNED_SECTION_LIBRARY.md`; absent at accepted milestone SHA | Implementation files exist on `main` (`src/ui/pre-designed-section-library.js`, editor integration and native renderer fallback); these files are absent at accepted milestone SHA | Unit/browser test files exist on `main` under `tests/m496-m505/`; historical notes explicitly say test execution was unconfirmed at that boundary | Do not treat as included in accepted release. Audit the feature on `main`, recover its exact intended release boundary, compare it against the accepted milestone, and decide a safe isolated integration plan after Phase 1. Do not cherry-pick or merge automatically |
| DOC-12 | Theme, colors, headings, icons and template visual identity | Style contract, native template contract and user decisions | Central styling and template-specific behavior recorded | User reported a later update disturbed template layouts | Create template-by-template visual baseline and acceptance map in Phase 2 |
| DOC-13 | Preview editing and page navigation | Product requirements and M-numbered preview/editor records | Foundation recorded; full UX integration varies | Historical browser/CI evidence is SHA-bound | Map each control to current DOM/controller/tests |
| DOC-14 | Pagination, A4 and multi-page rendering | Layout/pagination contracts and M100–M217 records | Significant fragmentation/pagination implementation recorded | Historical browser evidence passed on earlier application-code boundaries | Retest current accepted baseline and release candidate; don't reuse stale PASS |
| DOC-15 | Print and PDF export | Export contract and M2008+ records | Production boundary and pipeline foundations recorded | Exact live output verification remains separate | Verify CV-only print, PDF artifact, page breaks and template coverage |
| DOC-16 | DOCX / blank Word templates | Export/distribution contracts and feature closure audit | Infrastructure exists; seven production DOCX assets/download verification were previously deferred | Not part of current release target per release-readiness document | Keep deferred unless scope is explicitly expanded |
| DOC-17 | ATS, job matching, AI and intelligence | Master capability register and intelligence M-records | Engines/contracts exist; user-facing workflows described as incomplete | Must be assessed by individual capability | Separate integrated core, surface gaps, and future scope |
| DOC-18 | Import/migration and online CV publishing | Import/migration and publication contracts | Foundation/boundary exists; user-facing workflows described as incomplete/future | No production acceptance established here | Preserve as integration gaps or future scope per approved requirements |
| DOC-19 | SEO, metadata, sitemap, tracking and privacy | Product/architecture/security docs exist | Implementation details not yet individually audited in this pass | No fresh production evidence in this pass | Trace exact files, URLs, tests and deployment evidence |
| DOC-20 | Accessibility, responsive behavior and mobile controls | Architecture/style contracts and editor UX workstream records | UI surface and responsive foundations recorded | Mobile preview tab failed in milestone workspace validation | Audit actual keyboard, screen-reader, responsive and mobile acceptance evidence |
| DOC-21 | CI, browser evidence and release gates | Release tracker, testing contract and M-numbered evidence docs | Test infrastructure exists | Gallery PASS and workspace FAIL on milestone SHA; PR #119 head has no recorded checks | Build exact-SHA evidence ledger; never transfer PASS between SHAs |
| DOC-22 | Deployment, security and production verification | Final readiness and release tracker | Release process documented | R2 conditional; R6 open; R7 open; R8 blocked in recorded tracker; destination mapping unresolved | Keep production blocked until external evidence and deployment path are verified |

## 5. Branch divergence and Section Library release-boundary finding

A GitHub comparison of accepted SHA `9faf549ce714bd7e22bc266d5540ee886d9f0395` against `main` reports status `diverged`, `ahead_by=38`, `behind_by=462`. The comparison lists a coherent sequence of Section Library work on `main`, including catalog/integration, starter-entry preservation, generic preview fallback, unit/browser tests, the written spec, compatibility fixes and a regression guard. The same Section Library spec, implementation and tests return 404 when fetched at the accepted milestone SHA. Therefore, the Section Library was **developed and documented on `main` but is not present in the accepted milestone tree**. This is the strongest explanation so far for why the user-visible goal may not match the accepted production baseline.

Relevant `main` commits include `969e2bb` (catalog), `e658931` (editor panel), `bd6d64e` (generic preview fallback), `44bea4a` (specification), `f323a39` / `5c126db` (compatibility and inline editing fixes), and `a40143e` (type-collision regression test). The repository notes associated with the Section Library state that CI/browser results were not confirmed in that workstream; file presence and static checks are not a passing runtime test. This requires exact-SHA workflow evidence before release inclusion.

Because the branch histories diverged, do not merge `main` wholesale into `release/cv-builder-v2-production`. First compare the exact feature diff and dependencies, run the required tests against an isolated candidate based on the accepted milestone, then seek explicit release approval.

## 6. Product scope must not be collapsed into one “done” label

Existing documents distinguish:
- **A — Integrated**;
- **B — Foundation implemented**;
- **C — Planned V2 release work**;
- **D — Future/reserved**;
- **E — External release gate**.

Use that model alongside implementation/test evidence. A future capability such as Google Drive, public online CV publishing, or career ecosystem integration must not be marked as an incomplete current-release blocker if governing documents explicitly reserve it for later. Conversely, a foundation-only feature must not be called complete merely because its contract exists.

## 7. Known regressions / current release blockers

1. Workspace validation failure on accepted milestone: mobile More-menu Preview click did not switch view; duplicate-CV control was not visible; adding a skill moved scroll position by 66px.
2. LocalStorage quota error for `estudent_cv_workspace_v2_2027`.
3. PR #119 has proposed fixes but no passing test/browser evidence recorded for head `918a01d103ce446afa9119645369870943631964`.
4. Hostinger target mapping to `/public_html/cv-builder-v2/` remains unverified.
5. Live production R6 evidence, security R2 external actions, V1 retirement R7, and final release R8 remain open/conditional in the existing release tracker.
6. User-reported template/skills/language visual regressions need a controlled template-by-template recheck before new design work.

## 8. Remaining Phase 1 work

This register is a **first reconciliation pass**, not Phase 1 closure. Continue by:
1. Reading the full final feature closure matrix and identifying every capability marked B/C/D/E.
2. Compare the Section Library `main` implementation/spec/tests with the accepted milestone and establish a safe candidate integration boundary; do not merge the divergent branches wholesale.
3. Mapping the user-reported CV Builder V2 issues to current source paths and test files.
4. Mapping every relevant M-numbered workstream to current implementation and test evidence without assuming that document numbers imply delivery.
5. Reconciling old release tracker statuses with the accepted milestone SHA and October 14–15 regressions.
6. Adding a per-feature evidence row for current code reference, test name/run/SHA, browser evidence and next action.
7. Updating the continuation record and regression register to link this master register.

## 9. Phase 1 exit criteria

Phase 1 may be called complete only when:
- every in-scope current-release capability has a unique register row;
- each row links to its governing specification and relevant implementation/test records;
- implementation, automated testing, browser testing and production status are separate fields;
- current release vs foundation-only vs future/deferred scope is explicit;
- known failures and external release gates are accounted for;
- no unresolved item is represented as complete without evidence;
- the register and source docs agree, or discrepancies are explicitly logged.

Until then, the audit status remains **IN PROGRESS**.


## 10. Required gap register and code/evidence mapping

The exhaustive list of capabilities that are not coded, are foundation-only, lack a complete user-facing surface, need regression work, or require external evidence is maintained in:

- `docs/checkpoints/CV_BUILDER_V2_UNIMPLEMENTED_AND_FURTHER_WORK_REGISTER_2026-10-15.md`

That register is mandatory for continuation and contains explicit IDs GAP-001 onward, acceptance criteria, current evidence boundaries, and a distinction between current-release blockers and deliberately deferred/future features. It must be updated whenever an item is implemented, tested, deferred by decision, or blocked by an external dependency.

### Initial feature-to-code mapping (verified source paths at accepted baseline)

| Area | Source paths present at accepted baseline | Relevant tests/evidence paths | Current evidence status / next action |
|---|---|---|---|
| Workspace persistence and CV management | `src/ui/cv-workspace-controller.js`, `builder.html`, `src/ui/editor-runtime.js` | `tests/m1000-m1059/cv-workspace-quota.test.js`; `.github/workflows/cv-workspace-validation.yml` | PR #119 has proposed fixes but no passing evidence recorded for its head; run targeted and browser tests on candidate SHA |
| Template Gallery | `index.html` and gallery/runtime files confirmed by the accepted tree | `.github/workflows/template-gallery-validation.yml` | Workflow run 38490677818 passed on milestone; this does not prove workspace lifecycle or all gallery-to-builder journeys |
| Native template rendering | `src/render/native-v2-template-renderer.js` and template/render modules in accepted tree | `.github/workflows/native-v2-browser-validation.yml`; `.github/workflows/v2-integration-validation.yml` | Historical results are SHA-bound; build candidate-specific browser and screenshot evidence |
| Editor form/section controls | `src/ui/editor-form-renderer.js`, `src/ui/editor-runtime.js` and command/controller modules | M-numbered editor records and registered tests under `tests/` | Map individual actions (hide, reorder, custom fields, preview synchronization) to exact test names; current broad browser evidence is incomplete |
| Export/pagination | Export/render/layout modules documented by `V2_LAYOUT_AND_PAGINATION_CONTRACT.md` and `V2_EXPORT_AND_DISTRIBUTION_CONTRACT.md` | Native V2 browser and integrated fragmentation suites | Re-run on candidate SHA and inspect actual print/PDF artifact; older PASSes do not establish current production output |
| Security/release | `.github/workflows/deploy-cv-builder-v2.yml`; `docs/00-foundation/R2_SECURITY_CLOSURE.md`; `docs/00-foundation/RELEASE_GATE_TRACKER.md` | Deploy run 38490677809; release-gate records | Deployment succeeded but FTP destination mapping is unverified; R2 conditional, R6 open, R7 open, R8 blocked |
| Pre-designed Section Library | Not present at accepted SHA; present on `main` at `src/ui/pre-designed-section-library.js`, `src/ui/editor-form-renderer.js`, `src/render/native-v2-template-renderer.js`, `index.html` | `tests/m496-m505/pre-designed-section-library.test.js`, `tests/m496-m505/pre-designed-section-browser.test.js` on `main` | Do not count as part of accepted baseline; isolate and validate feature/dependency diff before proposed integration |

This is the initial path mapping, not yet a line-by-line mapping of every individual capability. Phase 1 remains IN PROGRESS until every current-release item in the feature closure audit has a mapped implementation/test/evidence record or an explicit gap disposition.

## 11. Documentation consistency corrections

- The older `FINAL_PRODUCT_FEATURE_CLOSURE_AUDIT.md` uses status groups A–E; this register adds evidence-specific states. Keep both dimensions: product scope disposition and actual code/test/deployment evidence.
- The older release readiness document's “repository documentation/specification completion: 100%” refers to documentation/specification coverage at its historical audit boundary; it must not be interpreted as all product functions coded or production release complete.
- Older records refer to `mattari20/CV-Builder-V2`; this audit's active repository is `mattari20/Testing`. Preserve the old repository label as historical provenance, not proof that the current active repository contains the same commit history.
- The Section Library's specification on `main` says its unit/browser/CI checks passed on the merged source/test sequence, while the earlier continuation notes said execution was unconfirmed at a previous evidence boundary. Treat the newer spec as a claim requiring exact workflow-run/SHA verification before release acceptance; do not carry either status across to the accepted milestone.
- The current baseline deploy workflow's `server-dir: ./` conflicts with a safe target-verification requirement. Deployment destination remains UNKNOWN until independently confirmed.


## 12. Latest Phase 1 checkpoint

As of the latest documentation update, PR #120 is still **open, draft, and unmerged**, with head `7ef065a1e4d6eea0ee5cf4208bdd9a23d0298ec4` and base `9faf549ce714bd7e22bc266d5540ee886d9f0395`. The new gap register and representative source/test map are included in the PR.

**Phase 1 is not yet closed.** The audit has improved the inventory and mapped representative code/test paths, but full exact-SHA automated/browser evidence, per-template visual acceptance, deployment-target verification, and remaining feature-by-feature mappings are still outstanding. This is intentionally not marked 100% complete. No application code or production deployment was changed.
