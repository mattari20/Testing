# Project Status — CV Builder V2

## Current status

**Stage:** Production V1 code audit and architecture recovery

**Production V1:** Frozen in principle. No production changes are authorized during the audit/documentation stage.

**V2 repository:** `mattari20/CV-Builder-V2`

## Source baseline received

A complete working V1 archive was supplied for audit. The archive contains 42 filesystem entries, including:

- PHP entry/bridge files
- Main builder HTML
- Main builder JavaScript
- Desktop engine
- Mobile engine
- Central UI stylesheet
- API/reporting files
- Seven HTML template files
- DOCX template assets
- Template preview images
- Icon assets
- Sitemap
- Demo profile-image assets

## Immediate findings

The current code already contains a meaningful separation between:

- atomic CV state
- visibility state
- template registry
- template compilation
- live preview rendering
- desktop/mobile export engines

The current implementation is therefore a useful foundation for V2, but several parts are still tightly coupled to fixed field/section definitions and fixed template tokens.

## Important security gate

The supplied archive contains plaintext database credentials in an API PHP file. These credentials must **not** be committed to the V2 repository. Before any source-code baseline is pushed to GitHub, production credentials must be rotated/revoked as appropriate and configuration must be moved to a secure deployment mechanism.

This document intentionally does not reproduce the credential.

## Important completeness gate

The supplied archive references some local assets/template files that are not present in the archive inventory. These references must be reconciled before declaring the archive a complete reproducible production baseline.

Known examples include:

- two template HTML files referenced by the JavaScript registry but absent from the supplied archive
- an ATS preview image referenced by the bridge page but absent from the supplied archive
- a default JPG profile-image path referenced by the renderer while the supplied archive contains an extensionless demo image file

These may exist on production but were not present in the supplied archive and therefore require verification.

## Next controlled step

Complete the V1 code audit, then create the V1 architecture recovery and V1-to-V2 requirements documents before implementing V2 code.
