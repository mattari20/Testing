# M338–M347 — T03/T04/T05 Word Template Normalization

## Batch result

Three available Word-template source documents were normalized as candidate final assets:

- T03 — `T03 format in MS Word(1).docx`
- T04 — `t04 WORD TEMPLATE.docx`
- T05 — `t05 WORD TEMPLATE.docx`

## Validation

| Template | Pages | A4 | Editable text test | Package inspection | Status |
|---|---:|---|---|---|---|
| T03 | 1 | PASS | PASS | PASS | REVIEW REQUIRED |
| T04 | 1 | PASS | PASS | PASS | REVIEW REQUIRED |
| T05 | 1 | PASS | PASS | PASS | REVIEW REQUIRED |

Normalization preserved the original DOCX drawing/text-box structures by modifying the package XML rather than reconstructing the documents through a document library.

The candidates were normalized to A4 and rendered to exactly one page using LibreOffice. Obvious demo contact strings were changed to non-production examples. No VBA or external-link payloads were detected during the package inspection.

## Release boundary

These candidates are **not** marked READY in the repository catalog yet.

Final acceptance still requires:

1. manual inspection in current Microsoft Word;
2. Word Online compatibility check;
3. replacement of demo name/contact/education/experience/skills;
4. confirmation that replacement does not break layout;
5. longer-content behavior review;
6. final visual review against the intended template design;
7. deployment to the exact catalog path;
8. only then status transition to READY.

The generated binary candidates are currently outside GitHub because the available repository write interface accepts UTF-8 text files only. A downloadable ZIP containing the three normalized candidates and their validation report was generated for repository asset upload.

## SHA-256

- T03: `87afc36f3ce53e083105ac276582866040aed8a10c25eaadc5776b9ec1089f7a`
- T04: `b78d828f37f745b4ff651728ec135708e44f111dd48943615540485c97d88778`
- T05: `a11ff100e58158ad44915fc83ca3c6948be025aa4830943cbd944f3d7269d8ed`

This batch is complete at the normalization boundary; the binary assets remain pending final manual acceptance and repository deployment.
