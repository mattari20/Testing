# CV BUILDER V2 — PERMANENT MASTER PROJECT PROMPT

## 1. Project identity

Project: CV Builder V2  
Repository: `mattari20/Testing`  
Production branch: `release/cv-builder-v2-production`  
Previously accepted milestone: `9faf549ce714bd7e22bc266d5540ee886d9f0395`

This is a continuation of an existing application. It is not a new project.

The goal is to finish CV Builder V2 as a reliable, professional, fully tested CV-building application, using the existing architecture and preserving all accepted functionality.

## 2. Permanent operating rules

1. Always inspect the latest GitHub state before making changes.
2. Read the existing master tracker, checkpoints, regression register, and relevant pull requests.
3. Continue existing work wherever practical. Do not recreate completed work or duplicate project documentation.
4. Preserve existing working functionality, design decisions, template layouts, and accepted code.
5. Make focused, logically grouped changes and commit completed work regularly.
6. Use automated tests and browser tests wherever the necessary tools are available.
7. Investigate failures, implement fixes, and rerun affected tests within the same execution cycle whenever possible.
8. Do not stop after merely producing an audit or a proposed plan if the requested phase includes implementation.
9. Do not claim a task is completed, tested, merged, or deployed without verifiable evidence.
10. If a tool, permission, environment, or external service prevents progress, identify the precise blocker and continue all independent work that remains possible.
11. Do not repeatedly ask the user to perform manual operations when an available authorized tool can perform them.
12. Never merge a pull request or perform a production-changing action without the required checks, review, authorization, and release safeguards.
13. Keep the project tracker and handover documentation updated as work progresses.
14. Never modify CV Builder V1 at `/public_html/cv-builder/`.
15. Never modify the separate Institutes Directory project as part of CV Builder V2 work.

## 3. Source-of-truth policy

The current GitHub repository, actual commit history, existing project documentation, automated test evidence, and verified production state are authoritative.

The previously accepted milestone is a historical reference, not permission to reset or overwrite newer legitimate work.

Before implementing anything:

- Verify the current branch and commit.
- Inspect relevant open and merged PRs.
- Determine whether each reported issue is open, fixed, partially fixed, or unverified.
- Reuse existing branches and PRs when appropriate.
- Avoid broad merges or resets that could reintroduce regressions.

Never assume historical statuses are still current.

## 4. Required project completion areas

### A. Data integrity and workspace recovery

- CV saving, loading, duplication, deletion, and workspace management.
- Storage quota errors and recoverable storage failures.
- Preservation of valid and legacy user data.
- Safe error handling and regression coverage.

### B. Editor functionality

- All supported personal, education, experience, project, skill, language, and other CV fields.
- Section visibility, ordering, editing, and preview synchronization.
- Undo/redo and history where supported by the existing product scope.
- Reliable desktop and mobile controls.

### C. Skills and languages

- Individual entries and proficiency levels.
- Template-specific presentation styles.
- Migration between legacy and current data formats without loss or duplication.
- Visibility, ordering, and persistence.

### D. Template system

- All nine existing native template IDs.
- Correct contact details, personal information, typography, spacing, colors, and section layouts.
- Responsive behavior and long-content handling.
- Consistent editing and preview behavior.

### E. Photo and date controls

- Photo upload/cropping, positioning, rotation, and persistence.
- Date pickers, formatting, keyboard interaction, and responsive behavior.

### F. Export and import

- Actual PDF/print generation and artifact quality.
- DOCX export and PDF/DOCX import, according to the agreed product scope.
- Clearly identify capabilities that are only foundations, not connected to the user interface.
- Implement missing in-scope features or explicitly document approved deferrals.

### G. Quality and release

- Automated tests, browser tests, regression checks, accessibility, privacy, security, and relevant SEO requirements.
- Verified Hostinger deployment target for V2 only.
- Controlled release, live smoke tests, rollback readiness, and final acceptance evidence.

## 5. Execution protocol for every phase

Every execution prompt must request one complete execution cycle:

1. Inspect the latest repository state and existing work relevant to the phase.
2. Define the exact acceptance criteria and dependencies.
3. Implement all feasible in-scope changes for that phase.
4. Add or update regression tests.
5. Run the available automated tests and browser checks.
6. Repair failures and rerun affected checks, using bounded repair-and-retest cycles.
7. Review the final diff for regressions, accidental changes, and scope violations.
8. Commit coherent changes and create or update the appropriate PR where supported.
9. Update the existing project tracker and supporting documentation.
10. Report the actual results and the next remaining task.

Do not abandon independent tasks merely because one task is blocked. Continue safe, independent work and document unresolved dependencies.

A phase may be marked complete only when its defined acceptance criteria are satisfied with evidence. Otherwise, mark it partially complete or blocked and explain why.

## 6. Continuous-development rules

- Do not wait until an entire project phase is finished to commit completed code.
- Use focused branches and small, reviewable changes.
- Avoid unnecessary PR proliferation; group related fixes when appropriate.
- Preserve a clean, auditable commit history.
- Do not rewrite unrelated files.
- Do not merge failing, unreviewed, or unverified changes.
- Do not deploy unvalidated code.
- Never bypass required safety gates simply to report progress.

## 7. End-of-execution report

Every execution chat must finish with a concise report containing:

1. Phase and objective.
2. Work completed.
3. Files or components changed.
4. Commit SHA and branch.
5. PR URL and current status, if applicable.
6. Automated test results with links or evidence.
7. Browser and live-site verification results, where applicable.
8. Remaining failures, limitations, and blockers.
9. Updated overall completion status, calculated only from the existing acceptance tracker.
10. The exact recommended next phase and a ready-to-copy execution prompt.

Clearly distinguish:

- Completed and verified.
- Implemented but not verified.
- Not implemented.
- Blocked by unavailable tools, permissions, or external dependencies.

Never invent test results, commit hashes, PR links, completion percentages, or deployment outcomes.

## 8. Final project completion standard

The project is complete only when:

- Every agreed in-scope acceptance criterion passes.
- Critical and high-severity issues are resolved.
- The required automated and browser checks pass.
- All nine templates are verified against the agreed matrix.
- Required export/import journeys are verified or explicitly accepted as deferred.
- The approved code is safely integrated.
- The V2 production target is confirmed.
- The deployed commit and live behavior are verified.
- The final completion register and handover report are current.

## 9. Immediate instruction

When a new execution prompt is provided, first follow this Master Prompt, inspect the exact current state, and complete the requested phase in one continuous execution cycle as far as the available tools permit.

Do not restart the entire project, repeat completed audits, or begin unrelated phases prematurely.

If a phase cannot be completed entirely, finish all safe work possible and provide a precise evidence-based handover identifying what remains.


## 10. Mandatory completion and merge protocol

Execute the assigned phase end-to-end in one continuous execution cycle.

1. Inspect the current repository, existing PRs, and verified starting commit.
2. Implement the requested work, write or update tests, and fix failures.
3. Commit the completed changes and run all available required checks.
4. Review the exact final diff and verify there are no unrelated or unsafe changes.
5. Merge the PR during the same execution cycle when the changes are validated, mergeable, and all required protections are satisfied.
6. Verify GitHub confirms the merge, record the merge commit SHA, and verify the change is present on the intended target branch.
7. Run relevant post-merge checks and verify deployment only when deployment is part of the phase and is authorized.
8. Update the existing project tracker and report completed work, merge status, test evidence, remaining blockers, and the next phase.

Do not stop merely because a branch, commit, or PR has been created.

Do not force a merge when required checks fail, conflicts remain, approval is required, or release safety is uncertain. In that case, continue fixing the blocker within the same cycle wherever possible. If it cannot be resolved with available tools or permissions, report the exact blocker and the work already completed.

Never report a task as fully complete while its required merge or verification remains outstanding.
