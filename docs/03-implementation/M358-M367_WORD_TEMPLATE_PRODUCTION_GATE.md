# M358–M367 — Word Template Production Verification Gate

## Purpose

This batch closes the repository-side control gap between the final seven static DOCX assets and their actual public production deployment.

The final release ZIP and SHA-256 manifest already define the seven authoritative files. This batch adds a machine-checkable gate that consumes actual live HTTP observations without treating repository tests as production evidence.

## Required production evidence

For each of T01–T07, record:

1. exact public URL;
2. HTTP status;
3. downloaded file SHA-256;
4. downloaded byte size;
5. observation timestamp.

Expected filename, public path, SHA-256 and byte size come directly from FINAL_WORD_TEMPLATE_ASSET_MANIFEST.json.

## Acceptance rule

The Word-template production gate returns PASS only when:

- all seven template IDs have exactly one observation;
- every response is HTTP 200;
- every filename matches the manifest;
- every public URL matches /cv-builder/word-templates/<filename>;
- every downloaded SHA-256 matches the authoritative manifest;
- every downloaded byte size matches the manifest;
- every observation has a timestamp.

Any missing, duplicate, mismatched, or non-200 observation keeps the gate BLOCKED.

## Execution sequence

### A. Upload

Upload the seven DOCX files from the final release ZIP to:

/cv-builder/word-templates/

The ZIP is a deployment package; the individual DOCX files are the public assets.

### B. Verify

Download each public URL from the live production site.

Calculate SHA-256 and byte size from the downloaded bytes.

Record the HTTP status and observation timestamp.

### C. Evaluate

Use:

src/release/word-template-production-gate.js

The gate is PASS only when all seven observations match the manifest exactly.

### D. Catalog transition

Do not change the static catalog from PLANNED to READY until the production gate is PASS.

After the production gate passes, the catalog can be updated to READY in a separate controlled commit.

## Evidence template

{
  "observations": [
    {
      "templateId": "<manifest templateId>",
      "fileName": "<manifest fileName>",
      "url": "/cv-builder/word-templates/<manifest fileName>",
      "httpStatus": 200,
      "sha256": "<64 hex characters>",
      "sizeBytes": 0,
      "observedAt": "<ISO-8601 timestamp>"
    }
  ]
}

## Current status

- Final seven local DOCX QA: PASS
- Manifest integrity: PASS
- Production upload: PENDING
- Live HTTP verification: PENDING
- Catalog READY transition: PENDING
- This batch does not claim production availability.
