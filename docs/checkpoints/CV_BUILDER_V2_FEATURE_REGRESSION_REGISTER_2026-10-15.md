# CV Builder V2 — Feature and Regression Register (2026-10-15)

**Purpose:** Working register for completing the post-milestone audit. Statuses below are based on recorded user reports and repository history, not fresh live browser tests.

## Status vocabulary

- **Recorded:** documented in prior project notes.
- **Reported working:** user manually reported success at a point in time; not freshly retested.
- **Partial:** user reported incomplete behavior or visual inconsistency.
- **Known regression:** reproducible/recorded failure requiring resolution.
- **Unverified:** proposed repair exists but no test evidence for the current repair SHA.
- **Pending design:** requirement is known but the final cross-template specification still needs to be written.

## A. Workspace and editor stability

| Feature / issue | Current evidence status | Required acceptance criteria |
|---|---|---|
| CV management / duplicate controls | Known regression: controls missing/not visible in prior screenshot; PR #119 changes menu behavior | Create, duplicate, switch and manage CVs on desktop and mobile without hidden controls |
| Workspace localStorage quota | Known failure: `estudent_cv_workspace_v2_2027` exceeded storage quota | Save succeeds after safe history trimming, or a clear recoverable error appears; current CV remains usable |
| Invalid/unreadable saved data | PR #119 attempts to preserve bytes | Startup does not silently delete stored data; warning/error is actionable |
| Mobile More menu tabs | Known regression in prior workspace validation; PR #119 adjusts pointerdown behavior | Edit/Preview switch changes `data-mobile-view` correctly on touch and mouse |
| Editor viewport jump | Prior test measured 66px upward shift after adding skill; PR #119 adds restoration | Structural edits preserve intended scroll position and keyboard interaction |
| Workspace lifecycle browser test | Prior validation timed out on `#duplicate-cv-btn` visibility | Lifecycle test can create, duplicate, switch, and close/reopen documents reliably |

## B. Editor fields and data behavior from earlier user testing

The following items were recorded in previous CV Builder V2 conversations and must be rechecked against current code and existing docs before being marked complete:

- Hide/show controls and move-up/move-down controls should work and reflect the preview.
- Education and experience date fields should use separate start/end month-and-year inputs where applicable.
- Education and experience ordering should support predictable date sorting and user-selected ascending/descending order.
- Personal information and contact details must appear in the preview in the intended order.
- Custom field order in the editor must match preview order.
- Typing into text fields must not unexpectedly move the cursor or restrict input to one word.
- Summary should be multiline and should support useful suggestions where planned.
- Language and skills entries should support individual items and proficiency levels.
- Tags/compact styles should not expose unwanted commas or ratings; rating style should be consistent and professional.
- Hidden section/subheading states must behave correctly in preview.
- Image crop popup, image shape consistency, rotation control, and image visibility toggle require confirmation.
- Print preview should focus on the CV rather than surrounding editor UI.
- Date formatting previously requested: “25th April, 2025”.
- Editor/preview scrolling and panel sizing should remain usable without an unnecessary nested preview scrollbar.

## C. Template and visual consistency requirements

Templates previously mentioned in user testing include T1, T2, T3, T4, T5, T7, T01 ATS, T02 Native v2, T03, T04, T05, and T06. Confirm actual template IDs from the repository before treating this list as exhaustive.

Recorded requirements:

- Preserve each template's intentional visual identity; do not globally disturb layouts to fix one component.
- Provide centralized behavior where appropriate, while allowing template-specific defaults.
- Skills and languages should have compatible editing behavior and intentional visual differences per template.
- Tags, piles, bullets, dots, stars, bars, and other proficiency displays need consistent sizing and spacing.
- Text and rating indicators must remain legible against dark/light backgrounds.
- Avoid duplicate icons, inconsistent heading styles, multiple bullets appearing on one line, and color clashes.
- Personal information/contact block ordering and visual hierarchy must be consistent with the selected template's intended design.
- The user previously reported that a later update disturbed the overall template view; treat preservation of current layouts as a high-priority regression guard.

## D. Export and deployment

| Area | Recorded state | Acceptance criteria |
|---|---|---|
| Print/export | User previously reported print preview as okay at one point | Re-test current output after changes; CV-only print area, correct page breaks and no editor controls |
| Live Hostinger deploy | Milestone deployment succeeded, but target mapping uncertainty remains | Workflow logs and Hostinger directory confirm only `/public_html/cv-builder-v2/` was changed |
| Production version | Accepted milestone is baseline | Live code/asset version corresponds to an explicitly recorded commit |
| SEO/sitemap/robots and analytics | Previously discussed in project history | Audit existing implementation/docs; do not assume scope or status without evidence |

## E. Required audit actions before final design

1. Read the current documentation index, architecture notes, milestone checkpoint, and all CV Builder V2 implementation records.
2. Compare the accepted milestone tree to PR #119's diff and list exact affected functions/selectors and tests.
3. Recover earlier requirements from commit messages, PR descriptions/comments, and available conversation records.
4. Mark each requirement as implemented, partial, failed, unverified, or superseded, with a file/test reference where possible.
5. Create a prioritized design specification only after the inventory is reconciled.
6. Keep production changes blocked until validation and deployment target are confirmed.

## F. Known evidence gaps

- No current test run is recorded for PR #119 head `918a01d103ce446afa9119645369870943631964`.
- The available GitHub connector returned no workflow runs or commit statuses for that head at the last check.
- The earlier workspace validation run failed on the accepted milestone.
- Live Hostinger mapping from FTP root to `/public_html/cv-builder-v2/` has not been independently confirmed.
- The user’s prior manual PASS/PARTIAL report needs to be retained as historical feedback, not relabeled as current automated verification.
- This register is intentionally a starting inventory, not a claim that every historical task has been recovered.
