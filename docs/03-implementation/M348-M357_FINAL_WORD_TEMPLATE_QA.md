# M348–M357 — Final Word Template QA Record

## Result

Seven production static Word-template assets were assembled from the supplied T01–T07 package and prepared for the public download path.

### Machine checks

| Template | A4 | Render pages | Editable replacement | Demo/production-domain sanitization |
|---|---|---:|---|---|
| T01 | PASS | 1 | PASS | PASS |
| T02 | PASS | 1 | PASS | PASS |
| T03 | PASS | 1 | PASS | PASS |
| T04 | PASS | 1 | PASS | PASS |
| T05 | PASS | 1 | PASS | PASS |
| T06 | PASS | 1 | PASS | PASS |
| T07 | PASS | 1 | PASS | PASS |

The editable replacement check uses a representative editable text node in each template and verifies that the replacement survives DOCX-to-PDF rendering. T01 was tested with the name token; T03 used the Technical Skills field because its title is stored across drawing/text structures.

The final assets were rendered through LibreOffice and checked as A4 PDF pages. All seven render to one page.

The final public/demo sanitization removed eStudent production-domain references, replaced contact details with example values, and replaced CNIC-like demo identifiers with placeholders. This is intended to prevent the static downloadable templates from shipping production contact/tracking information.

## Final package

- Package: CV-Builder-V2-Final-Word-Templates-T01-T07-RELEASE.zip
- SHA-256: a46a8c26d673dab518d51662d38e6c80603dc8e0869b38218517625703016177
- Production URL base: /cv-builder/word-templates/

Individual hashes and byte sizes are recorded in FINAL_WORD_TEMPLATE_ASSET_MANIFEST.json.

## Remaining release boundary

The binary assets are still not committed to GitHub because the connected repository write path does not provide a binary-file upload operation directly. The release ZIP is the authoritative deployment package for the seven static assets.

The remaining external action is to upload the seven DOCX files to:

/cv-builder/word-templates/

Then perform one live HTTP download test per template and confirm the returned files match the manifest hashes.

The repository catalog must remain PLANNED until that production deployment and live verification are complete. No READY status is inferred from local rendering alone.

## CI

M348–M357 manifest validation has been added to the integration workflow. The prior URL-path fix was verified by successful V2 Integration and Native V2 Browser workflow runs on commit 91dc67d42d1ec655d5b00981ad42f30142c1283.

A new workflow run is triggered by the final manifest/test documentation commits and must be observed before the repository-side release evidence is updated again.
