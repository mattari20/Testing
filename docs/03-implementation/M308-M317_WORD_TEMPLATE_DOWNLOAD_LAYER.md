# M308-M317 — Word Template Download Layer

## Purpose

Provide a second, lightweight CV journey alongside the V2 online builder:

1. Build Online — enter data in the V2 editor.
2. Download Word Template — download a pre-designed, editable DOCX containing controlled demo data and replace that data in Microsoft Word.

## Contract

- Every approved V2 template has one stable Word-template record.
- The Word file is identified by the same V2 template ID used by the online template.
- Word downloads require no login.
- The Word document is a pre-designed asset, not a generated user CV.
- The initial release uses one prepared DOCX per template with realistic demo content.
- The download layer must never claim a file is ready until the actual DOCX asset has been created, reviewed, and deployed.
- A planned record is not a production download.

## Initial seven assets

| Template | DOCX |
|---|---|
| T01 | T01-Modern-Minimalist-CV-Template.docx |
| T02 | T02-Professional-CV-Template.docx |
| T03 | T03-Professional-CV-Template.docx |
| T04 | T04-Modern-Blue-Corporate-CV-Template.docx |
| T05 | T05-Graphic-Web-Designer-CV-Template.docx |
| T06 | T06-Professional-Graphic-Designer-CV-Template.docx |
| T07 | T07-Store-Manager-CV-Template.docx |

## Asset acceptance

Each DOCX must be checked for:

- A4 page setup and margins.
- Correct template design and section order.
- Editable text.
- Replacement of demo name/contact/education/experience/skills without breaking the design.
- Fonts and spacing.
- One-page behavior with normal demo content.
- Reasonable behavior when content becomes longer.
- No secrets, private information, tracking code, or hidden production data.
- Compatibility with current Microsoft Word and Word Online.

## Release rule

Until the seven binary DOCX assets exist and pass acceptance, their catalog status remains planned. This prevents the gallery from exposing broken download links.

The existing V2 generated-DOCX provider boundary remains separate. These files are static, pre-designed templates.
