# Manual Hostinger Deployment Checklist — CV Builder V2 Candidate 1e979b7

## Deployment target
- Repository: mattari20/Testing
- Exact application candidate: 1e979b736f78ced3a0b8b7c393290d646d64215a
- Target live path: /cv-builder-v2/
- Existing V1 path: /cv-builder/ — KEEP INTACT

## Before upload
- [ ] Create a complete backup/copy of the existing /cv-builder-v2/ directory.
- [ ] Confirm the backup can be restored before overwriting anything.
- [ ] Do not delete /cv-builder/.
- [ ] Do not change DNS, PHP version, database, or unrelated site files for this deployment.
- [ ] Deployment package source is the exact 1e979b7 candidate.

## Upload only
Upload these repository paths into the existing /cv-builder-v2/ target:
- index.html
- templates.html
- src/**

## Do not upload
- .git/
- .github/
- docs/
- tests/
- node_modules/
- package.json
- package-lock.json
- README.md
- compare.html
- scripts/

## Word template protection
Do not remove or replace /cv-builder/word-templates/. The Git candidate contains no .docx binaries. The seven production Word-template files are governed by the existing manifest and must be verified separately.

## Post-upload first checks
Open https://estudent.pk/cv-builder-v2/
1. Bare V2 URL redirects to Template Gallery.
2. Gallery displays Native V2 templates.
3. Build Online opens the editor with a template query.
4. Editor loads without module/import errors.
5. Live preview renders a CV.

## Stop conditions
Restore the backup if the V2 entrypoint is blank/broken, gallery fails, browser reports missing modules/assets, preview cannot load, V1 changes, or unrelated eStudent.pk pages are affected.

## Release gate
Upload alone does not make R6 PASS. R6 remains OPEN until all production smoke observations are directly verified. R7 V1 retirement and R8 final release remain blocked.