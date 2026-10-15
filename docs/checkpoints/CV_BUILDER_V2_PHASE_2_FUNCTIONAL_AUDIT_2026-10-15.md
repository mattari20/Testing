# CV Builder V2 — Phase 2 Functional Audit (Initial Pass)

**Audit date:** 2026-10-15  
**Repository:** `mattari20/Testing`  
**Reference baseline:** `release/cv-builder-v2-production` at `9faf549ce714bd7e22bc266d5540ee886d9f0395`  
**Phase:** 2 — functional audit and gap verification  
**Status:** IN PROGRESS — source-level first pass only  
**Safety:** Documentation only. No application code, production branch, deployment, V1, or Institutes changes.

## 1. Purpose

Phase 2 checks the actual implementation against the required user journeys. It must distinguish:
1. source code exists;
2. unit/contract test exists;
3. test passed on the exact candidate SHA;
4. browser workflow passed on that SHA;
5. live production behavior was verified.

These are separate states. This initial pass reads accepted-baseline source and test files; it does not execute repository tests or claim fresh browser/production validation.

The comprehensive unresolved-function list remains in `CV_BUILDER_V2_UNIMPLEMENTED_AND_FURTHER_WORK_REGISTER_2026-10-15.md` on the Phase 1 documentation branch. This report adds Phase 2 findings and audit sequencing.

## 2. Audit summary

| Workstream | Source review | Test files found | Fresh test execution | Browser/live evidence | Current disposition |
|---|---|---|---|---|---|
| A. Workspace and CV management | Partial | Yes | Not run | Known milestone browser failure | Priority 0 regression |
| B. Persistence, quota, corruption and recovery | Concrete code-level risk found | Existing persistence tests; quota repair test absent at accepted baseline | Not run | Quota error previously reported | Priority 0 regression |
| C. Editor fields, sections and ordering | Partial | Multiple contract/unit suites | Not run | Individual controls need full workflow | Audit further |
| D. Skills and languages | Contract/migration source reviewed; potential legacy-field loss found | Architecture test exists | Not run | Template visual checks not run | Priority 0 data-integrity check |
| E. Templates and theme compatibility | Contract and renderer paths found | Template unit/gallery suites | Historical gallery pass only | No fresh all-template screenshots | Audit further |
| F. Live preview and viewport behavior | Runtime and preview paths found | Browser/unit suites | Not run | Historical 66px jump recorded | Priority 0 regression |
| G. Pagination, print, PDF/DOCX | Export pipeline and contracts found | Unit/contract suites | Not run | Current candidate artifacts not inspected | Audit further |
| H. Import/migration and recovery | Import modules and tests found | Import/migration suites | Not run | End-to-end upload/review not established | Scope and UI gap |
| I. Accessibility and responsive UX | Accessibility/runtime modules found | Partial test coverage | Not run | Full keyboard/mobile review not done | Audit further |
| J. SEO, analytics, security and release | Workflow and release docs found; target mapping unknown | Release workflows exist | Not run | R2 conditional, R6 open, R7 open, R8 blocked | External release gates |

## 3. A — Workspace and CV management

### Source reviewed
- `src/ui/cv-workspace-controller.js`
- `src/application/cv-workspace.js`
- `src/application/cv-workspace-persistence.js`
- `src/application/cv-editor-document-manager.js`
- `src/application/cv-editor-document-switching.js`

### Test files found
- `tests/m1000-m1059/cv-workspace-controller.test.js`
- `tests/m1000-m1059/cv-workspace.browser.test.js`
- `tests/m1088-m1127/cv-workspace-persistence.test.js`
- `tests/m888-m987/cv-workspace.test.js`
- `tests/m2408-m2487/cv-editor-document-switching.test.js`
- `tests/m3928-m4007/cv-editor-document-manager.test.js`

### Findings
- Controller functions exist for creating, duplicating, renaming, archiving, switching, versioning and restoring CV documents.
- Unit tests cover several core operations; a browser workflow covers mobile More-menu behavior, duplicate, switch, rename and version restore.
- This does not contradict the recorded browser failure: the workflow run on the accepted milestone failed because the duplicate control was not visible, and the mobile Preview tab did not change the view state.
- Therefore, controller-level support must not be used as proof that the complete user-facing document manager is accessible.

### Acceptance still required
- Desktop and mobile: create, duplicate, rename, archive, switch, save, refresh/reopen, version history and restore.
- Each action is visible, reachable and has clear feedback.
- Switching/duplicating never overwrites another CV's data; dirty state and confirmation behavior are safe.
- Run the exact browser workflow against the repair candidate and save its logs/artifacts.

## 4. B — Persistence, quota, corruption and recovery

### Concrete finding B-1: unreadable workspace data is deleted by the accepted-baseline controller

In `src/ui/cv-workspace-controller.js`, the `loadState` function catches errors and calls `storage.removeItem?.(storageKey)`. A malformed JSON payload, storage read exception, or error during migration/restore can therefore result in the saved workspace being removed. This conflicts with the desired non-destructive recovery rule.

**Required correction:** Preserve the original stored bytes; expose an actionable recovery/error state; only delete after explicit user approval or a documented safe reset. Test malformed JSON, storage read errors, incompatible versions, migration errors and quota exceptions.

### Concrete finding B-2: quota recovery is not present in accepted-baseline source reviewed

The baseline `saveState` serializes the complete workspace and version history and calls `storage.setItem` without local quota recovery handling. The previously created quota-specific test file `tests/m1000-m1059/cv-workspace-quota.test.js` is absent from the accepted-baseline tree (it is proposed on PR #119). The user has already reported a quota error for `estudent_cv_workspace_v2_2027`.

**Required correction:** Validate the PR #119 approach on its exact head: safely trim older snapshots while retaining a recent snapshot per CV; do not drop the current document or destroy all data; return a clear error if storage remains full. Cover quota exceptions on first save and repeated saves, corrupt payloads, and recovery after the error.


### Concrete finding B-3: duplicate npm script key masks the skills/languages test alias

The accepted-baseline `package.json` contains two `"test:m110"` keys: one points to `tests/m110/skills-languages-architecture.test.js`, while a later one points to `tests/m110/editor-preview-page-dom.test.js`. JSON parsers generally keep the last duplicate key, so `npm run test:m110` is likely to execute the page-DOM test instead of the skills/languages architecture test.

**Required correction:** Rename the two scripts to unique aliases, for example `test:skills-languages-architecture` and `test:editor-preview-page-dom`; update CI/workflow references; validate `package.json` has no duplicate script keys; run both test files directly and through their named npm aliases. This is a test-discovery/coverage risk, not proof that either test fails.

### Gate
PR #119 remains unmerged and its latest head has no passing CI evidence recorded in the current audit. Do not treat the repair as accepted until automated and browser checks pass.

## 5. C — Editor fields, sections, ordering and data entry

### Source/test anchors found
- Form: `src/ui/editor-form-renderer.js`, `src/ui/editor-dom-controller.js`, `src/application/cv-editor-form.js`
- Sections: `src/ui/section-editor-controller.js`, `src/application/cv-editor-section-editor.js`, `src/application/cv-editor-section-controls.js`
- Reorder: `src/ui/editor-reorder-controller.js`, `src/application/cv-editor-sections-moveIndex.js` (verify exact module/path before relying on this helper)
- Commands/history: `src/application/editor-command-executor.js`, `src/application/cv-editor-command-history.js`
- Tests: `tests/m72/editor-form-renderer.test.js`, `tests/m73/section-editor-controller.test.js`, `tests/m3608-m3687/cv-editor-section-controls.test.js`, `tests/m388-m397/section-field-management.test.js`, `tests/m1848-m1927/cv-editor-command-history.test.js`

### Findings
- Source and test foundations exist for section visibility, field editing, command history and section controls.
- A focused section-controls test asserts the controller emits a visibility change; that alone does not prove the final preview changes or the state persists.
- Historical reports of hide/show, move-up/down, custom field ordering and typing/cursor behavior remain open until verified end-to-end.

### Acceptance still required
- For each field type: add/edit/remove, multiline and paste behavior, hide/show, reorder, persistence, undo/redo and preview parity.
- Section and subheading visibility must be independent where supported.
- Editor and preview ordering must match after multiple operations, save/reload and template switch.
- Exercise text with spaces, long content, keyboard navigation, IME/paste and rapid typing to detect cursor jumps.
- Verify education/experience start/end date fields, sorting behavior and display format against the approved product contract; if a behavior is not in current scope, mark it deferred rather than silently omitting it.

## 6. D — Skills and languages

### Source/test anchors found
- Canonical migration: `src/core/skills-languages.js`
- Presentation contract: `src/templates/skills-languages-presentation-contract.js`
- Architecture test: `tests/m110/skills-languages-architecture.test.js`

### Findings
- The model supports individual entries and per-entry proficiency values.
- Presentation vocabulary includes tags, pills, compact, inline, bullets and stacked lists; proficiency variants include off, text, stars, bars and dots, with template defaults.
- The architecture test covers migration of legacy comma-separated values, independent proficiency for duplicate names and moving legacy ratings into entry data. The test file exists, but was not executed in this audit.
- The contract currently contains defaults for nine template IDs. The actual live catalog and this contract must be compared; unlisted template IDs fall back to the default contract.

### Concrete finding D-1: possible legacy data loss when old fields coexist with at least one entry

In `migrateSkillsLanguagesSection`, legacy `fields` are migrated only when `normalizedEntries.length` is zero. If a saved section contains one or more valid `entries` and also contains non-empty legacy `fields`, the existing entries are retained, the legacy fields are not converted, and the returned section clears `fields: []`. This is a potential data-loss path.

**Required correction:** Add a regression test for mixed data; merge eligible legacy field values into entries without duplicating already-migrated values; preserve per-entry IDs/proficiency/visibility/order; do not discard hidden field data silently. Implement only after reviewing the intended migration semantics.

### Acceptance still required
- Test mixed legacy/new data, duplicate skill names, blank/hidden entries, proficiency zero, migration idempotence and refresh/reload.
- Verify every actual template's default list style and proficiency style.
- Verify user-selected style survives template switching, save/reopen and fallback.
- Browser-check commas, wrapping, size, contrast, icons and proficiency legibility on all release templates.
- Protect the whole template layout while fixing the skills/languages region.

## 7. E — Templates, themes and template gallery

### Source/test anchors found
- Renderer: `src/render/native-v2-template-renderer.js`, `src/render/template-render-engine.js`
- Template controllers/catalog: `src/ui/editor-template-controller.js`, `src/application/cv-editor-template-controller.js`, `src/application/cv-template-selection.js`
- Gallery/preview: `src/application/cv-editor-template-gallery.js`, `src/ui/template-preview-controller.js`, `src/ui/template-preview-mounter.js`
- Tests: `tests/m14/native-v2-template-renderer.test.js`, `tests/m15/native-v2-template-catalog.test.js`, `tests/m89/template-switching.test.js`, `tests/m30/template-gallery.test.js`, `tests/m31/template-gallery.browser.test.js`

### Findings
- Renderer, selection and gallery foundations are present.
- The accepted-milestone Gallery Validation workflow passed, but the Workspace Validation workflow failed. A gallery pass does not establish that all templates render correctly after real edits or that the gallery-to-builder flow is complete.
- Informal template names reported by the user are not a safe source of truth; exact IDs must come from the repository's actual template catalog.
- Pre-designed Section Library code/spec/tests were absent at the accepted milestone and found on `main`. Do not assume it is already in the release baseline.



### Concrete finding E-1: authoritative catalog exposes nine native template IDs and export evidence remains pending

The accepted-baseline `src/templates/v2-native-template-catalog.js` defines these nine IDs:

1. `t01-modern-minimalist-cv-design_ats`
2. `t01-modern-minimalist-cv-design_simple`
3. `t01-modern-minimalist-cv-design_modern`
4. `t02-professional-cv-design_modern`
5. `t03-professional-cv-design_modern`
6. `t04-modern-blue-corporate_modern`
7. `t05-simple-cv-graphic-web-designer_modern`
8. `t06-professional-cv-graphic-designer_modern`
9. `t07-professional-cv-store-manager-incharge_modern`

The catalog marks browser measurement/pagination evidence as passed for several templates, but every listed template still has `exportEvidence: 'pending'`. The common metadata also sets `samplePdf: false`; T01 ATS and T01 Simple explicitly set `docx: false` and `blankDocx: false`. This is direct catalog metadata, not a live download test.

**Required action:** Use these nine IDs as the audit matrix. Verify actual PDF/print/DOCX output capability per template and do not advertise sample PDF or DOCX output where catalog metadata or live artifact evidence does not support it. Any status update must be evidence-backed and consistent between catalog, gallery and export UI.

### Acceptance still required
- Build an authoritative list of actual template IDs and compare it to skills/languages contracts, gallery cards and renderer support.
- For each release template, capture a baseline screenshot and test identity/contact, summary, education, experience, skills/languages, custom sections, visibility, reorder, theme colors, image and multi-page output.
- Verify dark/light contrast and no duplicated icons or unexpected layout changes.
- Validate gallery selection, preview, Try with My Data and Build Online handoff separately.
- Section Library integration requires a separate dependency/diff audit and candidate validation.

## 8. F — Live preview, viewport, mobile and accessibility

### Source/test anchors found
- Runtime: `src/ui/editor-runtime.js`, `src/ui/editor-live-preview-runtime.js`, `src/ui/editor-live-preview.js`
- Preview: `src/ui/editor-paginated-preview.js`, `src/application/cv-preview-controller.js`, `src/application/cv-editor-preview-navigation.js`
- Accessibility: `src/application/cv-editor-accessibility-controller.js`, `src/application/cv-editor-accessibility-announcer.js`
- Browser suites: `tests/m47962-m48761/real-browser-editor-workflow.test.js`, `tests/m408-m417/preview-inline-edit.test.js`, `tests/m4888-m4967/cv-editor-accessibility-announcer.test.js`

### Findings
- The editor runtime disables document scroll anchoring during its lifetime, but a historical browser run still recorded a 66px scroll change after adding a skill. The runtime change alone is not proof that the jump is fixed.
- Mobile Edit/Preview switching is a known failed acceptance case at the accepted milestone.
- The preview may have several separate navigation/zoom modules; whether every control is surfaced in the final UI needs explicit verification.
- Accessibility source modules and tests exist, but complete keyboard, focus, contrast and screen-reader acceptance is not evidenced.

### Acceptance still required
- Record scroll position before/after adding skill, language, field, section and repeatable entry at several viewport positions.
- Test mobile Edit/Preview, More menu, menu overlays, keyboard/touch and focus restoration.
- Confirm live preview updates immediately and remains data-identical to saved/exported CV.
- Verify preview panel height, scroll behavior, page navigation and zoom against the final product contract.
- Run keyboard-only and accessibility checks on critical forms, dialogs, toolbar actions and errors.

## 9. G — Pagination, print, PDF and DOCX

### Source/test anchors found
- Export: `src/export/export-engine.js`, `src/export/pdf-print-generator.js`, `src/export/pdf-print-runtime.js`, `src/export/docx-generator.js`, `src/export/docx-runtime.js`
- Production export boundary: `src/export/production-export.js`, `src/application/cv-export-pipeline.js`
- Relevant tests: `tests/m6/export-engine.test.js`, `tests/m33/production-export.test.js`, `tests/m2008-m2167/cv-export-contract.test.js` (confirm exact directory membership in the baseline tree before using as a command), `tests/m2488-m2567/cv-export-pipeline.test.js`, pagination tests under `tests/m100`–`tests/m126` and `tests/m1688-m1767/`.

### Findings
- Export contracts and implementation modules exist; the production export request has a validation boundary.
- This source-level review has not generated or inspected a current candidate PDF/DOCX artifact.
- Blank Word template assets were previously classified as deferred; do not treat them as available because DOCX runtime modules exist.
- The historical report that print preview was fixed is not a substitute for a current browser test.

### Acceptance still required
- Short, long and multi-page CVs across each release template.
- Text clipping, orphan/widow behavior, section breaks, repeated headings where supported, images, colors, margins and A4 scaling.
- Print must contain only the CV, not editor controls.
- PDF downloads must open and preserve content; DOCX must be a valid editable file when included in release scope.
- Capture artifact filenames, sizes and evidence links from the tested SHA.



### Concrete finding G-1: production builder exposes print-based PDF, not an obvious DOCX export control

In accepted-baseline `builder.html`, the visible toolbar exposes `#print-btn` labelled “Export PDF”; its handler clones the current template preview into a print window and calls `printWindow.print()` (falling back to `window.print()`). The same HTML contains no DOCX button or DOCX reference. Separate DOCX/export DOM modules exist in `src/application/`, but `src/application/v2-production-entry.js` mounts `mountV2EditorRuntime` and does not import those export DOM modules.

**Interpretation:** A print-based PDF route is surfaced; the existence of DOCX modules does not prove DOCX export is reachable in the production builder. Confirm the actual integration boundary before deciding whether DOCX export is an intended current-release capability or a foundation-only gap. Test PDF from the actual toolbar and inspect the resulting artifact.

### Concrete finding H-1: PDF/DOCX import is not surfaced in the inspected builder/gallery HTML

The accepted-baseline `builder.html` and `index.html` have no file-input/upload controls or PDF/DOCX import entry point in the inspected source. The import layer defines an extraction-adapter contract and migration/review functions, but no upload UI was identified in these entry pages.

**Interpretation:** Treat PDF/DOCX import as foundation-only/not surfaced unless another active production entry is found. Do not claim that students can upload and review a CV based solely on the import engine and contract.

## 10. H — Import/migration and data recovery

### Source/test anchors found
- `src/import/document-extraction-contract.js`
- `src/import/import-migration-engine.js`
- `src/import/import-review-pipeline.js`
- `tests/m7/import-migration.test.js`
- `tests/m42/import-review-pipeline.test.js`
- `tests/m58/export-import-evidence.test.js`

### Findings
- Import/migration modules and contract tests exist.
- Their presence does not establish that a user can upload a PDF/DOCX, review extracted fields, correct mappings, accept/reject individual fields and recover safely after partial failure.
- V1 migration and local workspace recovery must be tested for no silent loss and template compatibility.

### Acceptance still required
- Trace the actual user-facing import entry point and confirm whether PDF/DOCX upload is implemented or only planned.
- If in release scope, test malformed, scanned, multi-page and partial documents, confidence display, field mapping, review/approval and cancel/rollback.
- Test legacy profile migration, unknown fields, visibility, images, template IDs and repeated migrations.
- If the user-facing upload flow is not coded, mark it explicitly as not implemented/deferred.

## 11. I — SEO, analytics, privacy, security and release

### Findings
- Accepted baseline includes `.github/workflows/deploy-cv-builder-v2.yml`, workspace/gallery validation workflows and release governance docs.
- The deploy workflow uses `server-dir: ./`; mapping to Hostinger `/public_html/cv-builder-v2/` remains unverified.
- The release tracker recorded R2 CONDITIONAL, R6 OPEN, R7 OPEN and R8 BLOCKED at the recorded evidence boundary.
- A filename search did not find explicit sitemap/robots/canonical/analytics/tracking files in the accepted tree. This is not proof that those features are absent; inspect HTML/PHP/deployment assets and deployed responses before disposition.
- Never change the V1 path `/public_html/cv-builder/` or the separate Institutes project.

### Acceptance still required
- Verify secrets are not committed and complete the R2 remediation/evidence.
- Independently verify FTP target and exclusions before any deploy.
- Perform live V2 smoke checks for the exact deployed commit and retain artifacts.
- Trace SEO metadata/sitemap/robots and analytics/privacy behavior to actual code and live responses.
- Close R6, then R7, then R8 in the governing order; never infer release readiness from unit tests alone.



### Additional source-level verification — dates and photo crop

- Month/year picker handlers are present in `src/ui/editor-dom-controller.js`; they open the hidden month picker, parse the selected value and dispatch an `update-entry` command. Date-of-birth picker handlers are also present.
- The same controller defines `createPhotoCropper`, builds a modal with canvas preview, zoom/horizontal/vertical controls, rotate-left/right/reset, and Apply Crop behavior.
- The presence of these handlers means crop/rotation and date-picker behavior should not be classified as simply “not coded.” The remaining issue is end-to-end reliability: the user previously reported the crop popup failing to appear and date-picker click/cursor problems. No dedicated crop/browser test file was found by the current filename audit.
- **Required acceptance:** test opening/closing crop, image load failure, rotate/reset, zoom/position, Apply Crop, correct preview aspect ratio and persistence; test month/year picker on desktop and mobile, keyboard focus, date formatting and start/end date semantics. Add focused browser tests if no existing test exercises these controls.

## 12. Phase 2 execution sequence

1. **P2-A — Stop data-loss risks first:** mixed skills/languages migration test and non-destructive workspace corruption/quota repair.
2. **P2-B — Reproduce workspace regressions:** duplicate visibility, mobile Preview switching and scroll stability on a repair candidate.
3. **P2-C — Build authoritative template matrix:** actual IDs, default styles, screenshot baselines and template switching behavior.
4. **P2-D — Editor function matrix:** every field/section action mapped to code, test, browser case and result.
5. **P2-E — Export and migration:** inspect real artifacts and end-to-end import/recovery flows.
6. **P2-F — Accessibility, SEO/privacy and release gates:** resolve code mapping and external evidence.
7. **P2-G — Consolidate findings:** update the master gap register with exact source/test references, tested SHA, evidence, severity, disposition and next action.

## 13. Current Phase 2 status and exit criteria

**Current status: IN PROGRESS.** This is a source-level first pass, not a completed audit.

Phase 2 can be considered audited only when:
- each current-release function has a code/test/browser-evidence mapping or explicit not-coded/deferred/external-gate disposition;
- the mixed skills/languages migration risk is covered by a regression test and resolved or formally blocked;
- workspace quota/corrupt-data handling is validated on a candidate SHA;
- duplicate, mobile Edit/Preview and scroll behavior pass reproducible browser acceptance;
- actual template IDs and per-template results are recorded;
- export/import flows have artifact or explicit missing-surface evidence;
- the live deployment destination and release gates are either verified or explicitly remain blocked;
- no unknown is mislabeled PASS.

No application changes have been made during this initial audit. Fixes should be isolated, tested, documented and reviewed in small batches after the relevant acceptance criteria are clear.


## 14. Additional audit finding — test command reliability

The `package.json` script list contains duplicate `test:m110` keys (see B-3). Before treating historical CI as comprehensive, inspect the complete script map for duplicate keys and verify each workflow command resolves to the intended test file. In particular, skills/languages migration coverage must run explicitly as `node --test tests/m110/skills-languages-architecture.test.js` until the aliases are corrected and verified.


## 15. Audit distinction: code exists versus user journey works

The cropper and date-picker handlers are present in `src/ui/editor-dom-controller.js`; they remain behaviorally unverified. The same rule applies to controller methods for section visibility, reorder, save and export: source existence is recorded, while full acceptance depends on browser-visible behavior and persisted/preview/export results.


## 16. User-facing entry-point reconciliation

The builder toolbar's PDF action is print-based and surfaced; the separately defined DOCX export UI modules were not found wired into `v2-production-entry.js` or the inspected builder toolbar. Similarly, import/extraction engines exist but the inspected builder and gallery entry pages have no upload input. Phase 2 must distinguish these foundation modules from actual end-user controls and either wire/test them in an approved implementation batch or explicitly keep them out of the current release.


## 17. Review of proposed repair PR #119 (code review only; not validated)

The PR patch was inspected without merging or executing it.

### Promising changes
- Stops automatically removing unreadable workspace data in `src/ui/cv-workspace-controller.js` and in the builder's startup sanitizer.
- Adds quota handling that tries to trim older version snapshots while retaining the latest snapshot per CV, then returns a recoverable error if still full.
- Attempts to preserve viewport scroll position during editor form rerenders.
- Changes the mobile More-menu pointer handling so layout reflow should not cancel the Preview tab click.
- Adds a focused quota/corrupt-storage unit test file.

### Gaps in the proposed validation
- No GitHub Actions workflow run was returned for PR #119 head `918a01d103ce446afa9119645369870943631964`; its code is not validated.
- The added quota test simulates one quota exception that succeeds after a history snapshot is trimmed. It does not cover a quota error that persists after all removable history is trimmed, non-quota write exceptions, or storage read exceptions.
- The unreadable-data test checks that `removeItem` was not called, but does not prove the UI gives the user a recovery/download/reset path.
- No new dedicated scroll restoration test is added in the patch; the existing browser workflow needs to demonstrate the reported 66px jump is gone.
- No new dedicated test was added for the mobile More-menu pointerdown race; the existing workspace browser workflow must pass on the exact PR head.
- Quota recovery should be checked for correct rollback of in-memory history when a non-quota error occurs during retry.
- Because the current controller catches errors during the entire load/migration path, preserving the bytes is safer than deleting them, but the user also needs a visible warning instead of silently continuing with an empty default workspace.

### PR #119 review disposition

**Keep open and unmerged.** Run the focused unit suites and the real browser workspace workflow on the exact PR head; add the missing negative/error-path tests; inspect test artifacts; then review the diff again. Do not deploy until the verified Hostinger V2 target is confirmed.
