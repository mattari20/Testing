# Source Baseline and Security Gate

## Baseline

The uploaded archive represents the working production V1 supplied for audit.

It must be treated as the source-of-truth snapshot for documentation recovery, subject to the completeness checks below.

## Security gate

The archive contains plaintext database credentials in server-side API code.

### Required before GitHub source commit

1. Do not commit the plaintext credential.
2. Rotate/revoke the exposed production credential as appropriate.
3. Replace hard-coded secrets with secure deployment configuration.
4. Ensure future commits cannot reintroduce secrets.
5. Review repository history before making the repository public or sharing the source.

No secret value is reproduced in this document.

## Completeness reconciliation

The archive contains references to local files that were not present in the supplied archive.

Known reconciliation items:

- template registry references HTML template variants not present in the archive;
- bridge references an ATS preview image not present in the archive;
- renderer references a JPG demo profile image while the supplied archive includes an extensionless demo image file.

These discrepancies may reflect production-only files, renamed assets, or an incomplete export. They must be resolved before a reproducible source baseline is declared complete.

## V1 freeze rule

No functional modification should be made to the production V1 while the audit is underway.

## V2 repository rule

The V2 repository may contain:

- audit documentation;
- sanitized V1 reference/baseline material;
- architecture documents;
- V2 implementation;
- tests;
- release documentation.

Production secrets, credentials, private keys, API secrets, and deployment-only sensitive configuration must never be committed.
