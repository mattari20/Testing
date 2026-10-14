# CV Builder V2 — Restoration Checkpoint
Date: 2026-10-14

## Frozen baseline
- Accepted commit: 9faf549ce714bd7e22bc266d5540ee886d9f0395
- Backup branch: backup/cv-builder-v2-milestone-20261014-final-checkpoint
- Production branch: release/cv-builder-v2-production
- Scope: preserve the accepted milestone exactly; all future fixes must be new commits/branches based on this checkpoint.
- Do not reintroduce the pre-designed section library or make unrelated template/design changes without explicit approval.
- Keep CV Builder V1 and the Institutes project untouched.

## Verification evidence at checkpoint
- Manual user report: website PASS; design PARTIAL; main editing features PARTIAL; three browser checks PASS.
- GitHub Actions deployment run 38490677809: SUCCESS for commit 9faf549.
- Template gallery validation run 38490677818: SUCCESS for commit 9faf549.
- CV Workspace Validation run 38490677821: FAILURE for commit 9faf549. Earlier recorded failures were:
  1. Mobile More menu / Preview view did not switch to preview.
  2. Duplicate CV control was present but not visible/clickable in the browser test.
  3. Adding a skill shifted the scroll position by 66 px instead of preserving it.
- These failures are automated test evidence from the milestone run; user later reported the three manual browser checks PASS. Re-run the automated checks to reconcile this difference.

## Outstanding issues to investigate on a new fix branch
1. Workspace management actions (New CV, Duplicate, Rename, Archive) appear missing or inaccessible in the live workspace screenshot. The buttons exist in builder.html; inspect responsive/visibility state before changing handlers.
2. Workspace persistence reports: Failed to execute 'setItem' on 'Storage': Setting the value of 'estudent_cv_workspace_v2_2027' exceeded the quota. The workspace controller currently calls localStorage.setItem without handling quota errors. Fix safely; never clear user data automatically and never report a failed save/switch as successful.
3. Live deployment target must be verified: the deployment workflow used FTP server-dir ./, which does not explicitly prove the target was /public_html/cv-builder-v2/. Confirm the FTP account root mapping before any future deployment. Keep V1 /public_html/cv-builder/ untouched.
4. Design is only PARTIAL by the user's manual report. Compare against the accepted milestone and fix only specific confirmed regressions; avoid broad template restyling.

## Next release gate
- Start a separate fix branch from the frozen checkpoint.
- Apply minimal workspace visibility and quota-handling changes only.
- Add/regress tests for create, duplicate, rename, archive, switch, save, reload, recovery, quota-full behaviour, and mobile menu visibility.
- Run CV Workspace Validation and Template Gallery Validation; require success.
- Deploy only after verifying the exact target directory and checking that the release SHA matches the tested SHA.
- Ask the user to hard-refresh and verify the live workspace, then record results before declaring full restoration.

## Status
Checkpoint saved. Full restoration is NOT certified yet. No new application-code fix or follow-up deployment is claimed by this document.