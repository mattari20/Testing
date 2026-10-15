# CV Builder V2 — Unimplemented, Incomplete and Further-Work Register

**Audit date:** 2026-10-15  
**Reference baseline:** `release/cv-builder-v2-production` at `9faf549ce714bd7e22bc266d5540ee886d9f0395`  
**Purpose:** A single, explicit inventory of functions/features that are not coded, are only foundation-level, lack a complete user-facing flow, need testing, need production evidence, or are intentionally deferred.  
**Status:** First comprehensive reconciliation; items are not claimed complete unless evidence is linked.

## How to read this register

- **Not coded / not surfaced:** required user-facing capability is absent or documented as not implemented.
- **Foundation only / partial:** contracts, engines, or lower-level code exist, but the end-to-end user flow is incomplete.
- **Regression / re-test:** implementation exists but a reported failure or incomplete behavior must be corrected and verified.
- **Evidence / release gate:** code may exist, but required automated, browser, security, or live-production evidence is missing.
- **Deferred / future:** explicitly reserved; do not treat as a current-release blocker unless scope is approved to change.

A source file or old test result is not sufficient to mark a feature complete. Every future status change must identify the tested SHA and evidence.

## 1. Current release blockers and known regressions

| ID | Function / issue | Known state | Required next work / acceptance |
|---|---|---|---|
| GAP-001 | Workspace duplicate/manage controls | Prior browser run timed out because `#duplicate-cv-btn` existed but was not visible; screenshot showed missing management buttons | Verify create, rename, duplicate, archive, switch and reopen flows on desktop/mobile; no hidden/unreachable actions |
| GAP-002 | Workspace localStorage quota recovery | Error recorded for `estudent_cv_workspace_v2_2027` exceeding quota | Validate safe trimming of old snapshots while retaining latest snapshot per CV; clear recoverable error if still full; verify existing CV remains usable |
| GAP-003 | Corrupt/unreadable workspace data | PR #119 proposes preserving unreadable data rather than deleting it | Test malformed, inaccessible and quota-full storage; no silent destructive reset; actionable recovery path |
| GAP-004 | Mobile Edit/Preview tab | Milestone browser validation failed to switch `data-mobile-view` from edit to preview | Validate touch and mouse; confirm state, visible panel, keyboard/focus behavior |
| GAP-005 | Scroll restoration after structural edits | Prior test shifted scroll from y=3545 to y=3479 (66px) after adding a skill | Re-run on exact repair SHA for skill, language, section and entry edits; assert stable intended viewport |
| GAP-006 | Repair PR #119 validation | PR head `918a01d103ce446afa9119645369870943631964` has no recorded passing checks in the audit evidence | Run targeted tests, workspace validation and browser acceptance on exact head; do not merge or deploy until green |
| GAP-007 | Production deploy target | Existing workflow has `server-dir: ./`; FTP-root mapping to `/public_html/cv-builder-v2/` is not independently verified | Confirm destination mapping and dry-run/scope before deployment; never touch V1 `/public_html/cv-builder/` |
| GAP-008 | Current exact-SHA release evidence | Gallery validation passed, workspace validation failed on milestone SHA; historical PASSes are from older SHAs | Build a SHA-bound evidence ledger; rerun relevant checks for each candidate; do not transfer old PASS statuses |
| GAP-009 | Security closure (R2) | Tracker marks CONDITIONAL | Complete production credential rotation/revocation and authoritative Git-history secret verification; record evidence without exposing secrets |
| GAP-010 | Production integration (R6) | Tracker marks OPEN | Run the documented production smoke contract against the actual deployed V2 URL and record the required evidence |
| GAP-011 | V1 retirement (R7) | Tracker marks OPEN | Only after R6 PASS, verify V2-only production path and retire temporary V1 adapters/runtime as approved |
| GAP-012 | Final release acceptance (R8) | Tracker marks BLOCKED | Close all prior gates and record explicit final acceptance |
| GAP-013 | Section Library release boundary | Spec, source and tests exist on `main`, but are absent at accepted milestone SHA; histories diverge | Compare exact feature/dependency diff, validate on an isolated candidate from accepted baseline, then obtain release approval; never merge `main` wholesale |
| GAP-014 | Deployment workflow hardening | Current accepted baseline workflow uses generic FTP target `./`; a guarded workflow fix was found on `main` but is not assumed present in baseline | Review guarded deployment change and port only a verified, minimal fix to an isolated candidate; require exact SHA approval and verified V2 target |

## 2. Editor and document-management functions requiring recheck

| ID | Function / requirement | Known state | Required next work / acceptance |
|---|---|---|---|
| GAP-020 | Hide/show section and field | Previously reported as not always working or not reflected in preview | Test section, field and subheading independently; hidden data remains stored and can be restored |
| GAP-021 | Move up/down and drag reorder | Previously reported controls not working or preview order not updating | Test sections, fields and repeatable entries; editor and preview order must match and persist |
| GAP-022 | Custom fields and ordering | Prior report: custom-field order differed between editor and preview | Verify add/edit/remove/reorder, preview mapping, persistence, undo/redo |
| GAP-023 | Text-entry/cursor behavior | Prior report: typing one word or cursor unexpectedly moving | Exercise long text, spaces, paste, multiline, rapid edits and rerender cases |
| GAP-024 | Summary field | Multiline and suggestion UX requested; closure audit describes broader guided assistance as incomplete | Verify multiline editing; decide whether suggestions are current release or deferred and document it |
| GAP-025 | Personal/contact information rendering | Prior report that fields were not appearing or ordering correctly in preview | Map each field to editor state and template output; verify contact/personal blocks and visibility per template |
| GAP-026 | Education and experience dates | Requested separate start/end month-year controls and format `25th April, 2025` | Verify input control, storage shape, rendering, sorting, invalid/open-ended dates and chosen display format |
| GAP-027 | Education/experience chronological sorting | Sorting and ascending/descending selection requested | Confirm whether coded; if not, document as unimplemented; implement only against approved behavior |
| GAP-028 | Image crop/rotation/visibility | Crop popup, crop/preview shape, rotation and image hide/show were reported incomplete | Test upload, crop open/close, aspect ratio, rotate, hide/show and persistence across templates |
| GAP-029 | Editor/preview panel sizing and scroll | Nested preview scrollbar was unwanted; editor should track preview height | Verify desktop/mobile layout, focus, keyboard access and long-CV behavior |
| GAP-030 | Print preview | Previously reported as corrected, but current baseline still needs evidence | Confirm only CV prints, no editor controls, page backgrounds and margins preserved |
| GAP-031 | Save/autosave/recovery/undo-redo | Foundation documented; exact user-facing completeness varies by flow | Map each control to controller, tests and browser acceptance; test refresh/reopen and error cases |
| GAP-032 | Multiple-CV isolation and Master Profile | Foundation recorded, complete document-manager surface was previously marked B | Verify shared source data versus targeted-CV isolation, duplicate, rename, archive, restore and active selection |
| GAP-033 | Version history/restore/compare | Closure audit marks version/history UI as foundation-level | Confirm current UI exists; if absent, mark not coded/surfaced; define acceptance for history list, restore and compare |
| GAP-034 | Page navigation, thumbnails and zoom | Closure audit marks page selector as B and thumbnails/zoom as B/C | Confirm exact controls and release scope; document absent controls separately from underlying pagination engine |
| GAP-035 | Unsaved-change protection | Included in builder UX completion work list; current end-to-end evidence not reconciled | Verify navigation/close/reload behavior and recoverable confirmation |
| GAP-036 | Accessibility | Foundation documented, full keyboard/focus/labels/contrast/screen-reader QA incomplete | Run documented accessibility acceptance across desktop/mobile and template controls |

## 3. Templates, visual styles, skills and languages

| ID | Function / requirement | Known state | Required next work / acceptance |
|---|---|---|---|
| GAP-040 | Template identity preservation | User reported an update disturbed overall template design | Establish screenshot/golden baseline per actual template ID before shared CSS changes; compare before/after |
| GAP-041 | Skill/language presentation variants | Earlier work includes multiple styles; no complete current template-by-template evidence matrix established | Map tags/piles/bullets/dots/stars/bars to each template default and supported user choice |
| GAP-042 | Proficiency levels | Individual entries and professional proficiency display requested | Confirm per-item proficiency model and renderer behavior; no unwanted numeric `4/5` text where not intended |
| GAP-043 | Tag/compact presentation | Unwanted commas/ratings and inconsistent sizing reported | Test comma-separated editor hints versus clean preview; ensure compact style hides irrelevant ratings and punctuation |
| GAP-044 | Dark/light contrast | Prior report of black text on dark column and pile text-color mismatches | Verify automatic contrast and accessible text/rating colors for each template background |
| GAP-045 | Headings and icons | Duplicate icons and inconsistent heading styles reported | Check heading/contact icons and spacing; eliminate duplicates without flattening template-specific identity |
| GAP-046 | Personal/contact block layout | User requested template-appropriate ordering and visual hierarchy | Record expected layout for each template; test photo/contact/personal data order and responsive changes |
| GAP-047 | Template switching compatibility | Template engine/catalog exists; gallery passed but workspace validation failed | Verify switching retains CV data, visibility, supported variants and safe fallbacks |
| GAP-048 | Actual template inventory | Historical user list mixes IDs such as T1/T2 and T01/T02 Native v2 | Derive authoritative IDs from repository catalog; maintain one mapping and do not assume the informal list is exhaustive |
| GAP-049 | Pre-designed Section Library | 26 types in five groups are specified/implemented/tested on `main`, absent from accepted milestone | Validate every group/item, inline preview edit, add-entry, hide/remove/reorder, persistence, undo/redo and all template fallback paths on isolated release candidate |
| GAP-050 | Golden visual/browser baseline | Historical browser artifacts exist for earlier SHAs | Rebuild/inspect current screenshots and JSON evidence for all release templates and core editing flows |

## 4. Product surfaces documented as foundation-only or incomplete

These are recorded in `FINAL_PRODUCT_FEATURE_CLOSURE_AUDIT.md`. They must each receive an explicit disposition: current-release implementation, foundation-only, deferred, or not in scope. Do not silently treat an engine/contract as a complete product feature.

| ID | Feature / user-facing function | Recorded state | Required work or explicit disposition |
|---|---|---|---|
| GAP-060 | Master Profile flow | B — foundation implemented | Surface and verify Master Profile/workspace journey or explicitly defer |
| GAP-061 | Multiple targeted CV manager | B | Complete create/rename/duplicate/archive/switch/restore surface and isolation tests |
| GAP-062 | Version history UI | B | Surface history, restore and compare if included; otherwise document deferred scope |
| GAP-063 | Presentation variant selector | B | User-facing controls, per-CV persistence, template-compatible filtering/fallback, undo/redo |
| GAP-064 | Template Library / public gallery UX | B/C | Cards, thumbnails, search, filters and responsive discovery experience |
| GAP-065 | Template detail/preview pages | B/C | Full/near-full A4 preview, demo profile, metadata, supported sections, accessibility/export information |
| GAP-066 | Demo Profiles | B | Connect controlled demo data to gallery/detail preview without overwriting user data |
| GAP-067 | Try with My Data | B/C | Authorized copy/import flow, compatibility handling and clear non-destructive behavior |
| GAP-068 | Build Online gallery handoff | B | Selected template arrives in builder already selected and rendered |
| GAP-069 | Sample PDF | B/C | Surface sample artifacts and verify live URLs, content and template identity |
| GAP-070 | Template comparison | B/C | Build or explicitly defer comparison experience |
| GAP-071 | Blank Word template download | B | Binary assets are deferred by release decision; any future release needs asset/UI/live-download verification |
| GAP-072 | User-data DOCX export | B | Verify real editable DOCX artifact, multi-page content and download lifecycle; distinguish from blank templates |
| GAP-073 | ATS / Resume Health panel | B | Integrate user-facing explainable report: issue, reason, evidence and recommended fix |
| GAP-074 | Job-description matching | B | Job input, extraction, matched/missing requirements, score rationale and actionable report |
| GAP-075 | Skill Evidence workflow | B | Show claimed skill, supporting evidence, missing/weak evidence and honest improvement prompts |
| GAP-076 | Controlled AI assistance | B | Suggest/review/approve/apply flow for summaries/bullets/grammar/tailoring; prevent fabricated facts; provider remains optional |
| GAP-077 | PDF/DOCX import | B | Upload, extraction, mapping, confidence, review, partial acceptance/rejection and user approval before applying |
| GAP-078 | V1 migration | B | Run real fixture/production smoke; prove mapping, visibility, template compatibility and no silent data loss |
| GAP-079 | Online CV publishing | B/C | If in scope: public/link-only/private, share URL, indexing control, download and revoke/privacy UX; otherwise explicitly defer |
| GAP-080 | Portfolio linking | C/D | Confirm release scope; implement only if approved |
| GAP-081 | Analytics/tracking | B | Trace event wiring, consent/privacy behavior and production verification |
| GAP-082 | Advertising inventory | B/C | Decide release scope; define safe gallery/detail/builder slots; never include ads in generated CV or send sensitive CV content to ad payload |
| GAP-083 | Premium/entitlement layer | B/C | Define capability→entitlement→monetization integration and visible access states; no payment logic scattered across features |
| GAP-084 | Premium template packs/ad-free access | C/D | Deferred unless monetization scope is approved; document entitlement dependency |
| GAP-085 | SEO template/library pages | B/C | Useful indexable landing/detail pages, canonical/metadata and actual sitemap/robots integration as scoped |
| GAP-086 | Data export/delete controls | B/C | User-facing portability and privacy controls; confirm exact release scope |
| GAP-087 | Student/Fresh Graduate mode | C | Guided education-first sections for projects, coursework, internships, certificates and achievements if included in V2 scope |
| GAP-088 | Academic CV mode | C | Research/publications/thesis/conference/teaching/grants/memberships if included in V2 scope |
| GAP-089 | Standalone ATS checker | V2 Release in feature matrix; product closure notes foundation gaps | Confirm scope; PDF/DOCX input and report UX if included |
| GAP-090 | Cover Letter Builder | C/Future depending on governing document | Keep separate from current release unless scope is explicitly expanded |
| GAP-091 | Online CV analytics | D — Future | Reserved; not a current-release blocker |
| GAP-092 | Student Career Wallet / application workspace / job tracker / Interview Coach integration | D — Future | Architecture boundary only; no current implementation implied |
| GAP-093 | Google authentication / Drive backup | D — Future | Deferred; no implementation implied |
| GAP-094 | LinkedIn/external profile import | Evaluate/Future | Requires platform authorization/rules review before commitment |
| GAP-095 | External job, credential and certificate integrations | D — Future | Reserved; not a current-release blocker |

## 5. Export, SEO, security, deployment and external work

| ID | Function / area | Known state | Required next work / acceptance |
|---|---|---|---|
| GAP-100 | PDF artifact correctness | Export boundary exists; current live output not independently evidenced | Test representative short/long CVs, all release templates, multi-page content, links/fonts and download lifecycle |
| GAP-101 | A4 pagination/fragmentation | Significant engine and historical browser tests exist; old results are SHA-bound | Re-run integrated fragmentation and inspect actual PDF/print output on candidate SHA |
| GAP-102 | DOCX assets/downloads | Blank Word binaries explicitly deferred; user-data DOCX has separate acceptance | Do not report blank Word assets as available; separately validate user-data export if in release scope |
| GAP-103 | Sitemap/robots/canonical/metadata | Docs mention SEO/tracking; per-file current-baseline mapping not completed | Locate exact routes/files and tests; verify deployed response, canonical URLs and sitemap coverage |
| GAP-104 | Privacy and consent | Contracts exist; production behavior not fully evidenced | Verify local data handling, analytics/ad payload boundaries, deletion/export and consent UX according to scope |
| GAP-105 | Production URL smoke test | R6 OPEN | Verify actual live URL, editor entry, save/reopen, template preview, pagination, PDF/print and negative V1 fallback |
| GAP-106 | Hostinger credential/configuration | R2 CONDITIONAL | Rotate/revoke credentials and verify Git history without disclosing secrets |
| GAP-107 | V2 deployment boundary | FTP root mapping unverified and baseline workflow is not guarded | Verify target path, exclusions and exact-SHA approval before any deploy |
| GAP-108 | Release rollback and evidence archive | Backup branches/checkpoint exist; operational deploy target still needs verification | Preserve accepted SHA and capture artifacts/logs for each candidate/deployment |
| GAP-109 | DOCX live downloads | Blank templates deferred; historic notes mention prior asset package and live verification pending | Keep marked deferred unless release scope changes; if enabled later, verify HTTP status, SHA-256 and filenames |
| GAP-110 | Production tracking events | Implementation not individually traced in this pass | Map each event to source, privacy rule and deployed evidence or mark not implemented |

## 6. Explicitly deferred / future scope (not current blockers unless re-approved)

- Seven blank downloadable Word-template binaries and their future packaging/integrity verification.
- Cover Letter Builder where the governing scope classifies it as C/Future.
- Premium template packs, subscriptions, one-time purchases, credit packages and ad-free entitlement until monetization is approved for release.
- Public online CV publishing and analytics where classified Future/V2+.
- Google authentication and Google Drive backup.
- Student Career Wallet, career/application workspace, job tracker, Interview Coach and external career ecosystem integrations.
- LinkedIn/external profile import until evaluated and authorized.
- External job-service, credential and certificate integrations.
- Portfolio/personal-site integration when classified Future.
- Any feature explicitly labelled Future/Reserved in the approved Master Capability Register.

## 7. Evidence ledger requirements

For each row above, the audit/implementation owner must eventually record:
1. governing specification and exact requirement;
2. implementation file(s) and relevant function/controller/renderer;
3. automated test file and test name;
4. exact tested commit SHA and workflow run URL/result;
5. browser acceptance result and artifact link, where applicable;
6. live production evidence, where applicable;
7. status: coded, integrated, automated-tested, browser-tested, deployed (separate fields);
8. next action, owner/dependency, and whether current release or deferred.

## 8. Phase 1 closure rule

This register is the required “things not performed / not coded / need work” list. It is not proof those tasks are finished. Phase 1 can close only after each current-release item in the feature closure audit is mapped to code/tests/evidence or explicitly marked as an implementation gap/external gate/deferred item, contradictions are recorded, and the completion register points to this file. Unknowns must remain unknown rather than being promoted to PASS.
