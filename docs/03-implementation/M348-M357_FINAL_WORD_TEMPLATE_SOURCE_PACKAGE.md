# M348–M357 — Final Word Template Source Package & Download Path Integration

## Batch result

The project owner supplied the final seven static Word-template assets for the production download offering.

The supplied files are the source of truth for the static **Download Word Template** route. They are separate from user-generated DOCX export from the V2 editor.

## Final asset mapping

| Template | Production filename | Repository/catalog path | Production URL path |
|---|---|---|---|
| T01 | T01-Modern-Minimalist-CV-Template.docx | public/cv-builder/word-templates/T01-Modern-Minimalist-CV-Template.docx | /cv-builder/word-templates/T01-Modern-Minimalist-CV-Template.docx |
| T02 | T02-Professional-CV-Template.docx | public/cv-builder/word-templates/T02-Professional-CV-Template.docx | /cv-builder/word-templates/T02-Professional-CV-Template.docx |
| T03 | T03-Professional-CV-Template.docx | public/cv-builder/word-templates/T03-Professional-CV-Template.docx | /cv-builder/word-templates/T03-Professional-CV-Template.docx |
| T04 | T04-Modern-Blue-Corporate-CV-Template.docx | public/cv-builder/word-templates/T04-Modern-Blue-Corporate-CV-Template.docx | /cv-builder/word-templates/T04-Modern-Blue-Corporate-CV-Template.docx |
| T05 | T05-Graphic-Web-Designer-CV-Template.docx | public/cv-builder/word-templates/T05-Graphic-Web-Designer-CV-Template.docx | /cv-builder/word-templates/T05-Graphic-Web-Designer-CV-Template.docx |
| T06 | T06-Professional-Graphic-Designer-CV-Template.docx | public/cv-builder/word-templates/T06-Professional-Graphic-Designer-CV-Template.docx | /cv-builder/word-templates/T06-Professional-Graphic-Designer-CV-Template.docx |
| T07 | T07-Store-Manager-CV-Template.docx | public/cv-builder/word-templates/T07-Store-Manager-CV-Template.docx | /cv-builder/word-templates/T07-Store-Manager-CV-Template.docx |

## Download contract

The static Word download route is:

**Template → Download Word Template → preparation → download**

The download is independent of advertising. Ads, if later used, remain separate from the download entitlement.

The repository catalog continues to distinguish repository paths from public URL paths. The download runtime now converts a catalog path beginning with `public/` into the corresponding public URL path.

## Asset deployment boundary

The seven binary files are supplied as the final production source package. They still need to be uploaded to the intended Hostinger production directory before the catalog entries can be considered physically deployed.

The repository connector can write text and Git objects, but this batch does not encode the DOCX files into source code or alter their binary contents. Hostinger is the intended production storage location for these static download assets.

## Release status

- Source package received: PASS
- Seven filename mappings defined: PASS
- Download URL mapping fixed: PASS
- CI regression for the URL mapping: pending current workflow result
- Hostinger binary upload: PENDING
- Live download smoke test: PENDING
- Catalog status transition from PLANNED to READY: PENDING until the files exist at the production paths

This batch does not claim live production availability until the Hostinger upload and live HTTP download checks are completed.
