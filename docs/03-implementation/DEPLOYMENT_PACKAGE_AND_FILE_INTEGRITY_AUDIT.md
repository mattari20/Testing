# Deployment Package & File-Integrity Audit — Candidate 1e979b7

## Audit target

- Repository: `mattari20/Testing`
- Application candidate: `1e979b736f78ced3a0b8b7c393290d646d64215a`
- Audit purpose: prepare the exact manual Hostinger deployment package without changing application code.

## Findings

### 1. Runtime entrypoints

The candidate contains two production-facing HTML entrypoints:

- `index.html` — V2 builder entrypoint; redirects the bare `/cv-builder-v2/` path to `templates.html` unless a template query is present.
- `templates.html` — template gallery and Build Online entrypoint.

All direct local module imports declared by these two entrypoints resolve to tracked files in the candidate.

### 2. Native V2 template assets

The native V2 catalog declares nine template source variants:

- T01 ATS
- T01 Simple
- T01 Modern
- T02 Professional
- T03 Professional
- T04 Modern Blue Corporate
- T05 Graphic/Web Designer
- T06 Professional Graphic Designer
- T07 Store Manager/Incharge

All nine declared source paths are under `src/templates/assets/v2/` and are tracked in candidate `1e979b7`.

The gallery uses relative document-base fetching, so these assets belong inside the deployed `cv-builder-v2/src/` tree.

### 3. Word-template assets

`docs/03-implementation/FINAL_WORD_TEMPLATE_ASSET_MANIFEST.json` defines seven DOCX assets and records their filenames, SHA-256 hashes, sizes, and production base path:

`/cv-builder/word-templates/`

The candidate repository contains **zero tracked .docx files**. Therefore these seven DOCX binaries are not part of the V2 Git deployment package and must not be invented or regenerated during this deployment step.

Their production path is an existing/protected V1-era asset surface and must be verified on Hostinger separately before R6 acceptance.

### 4. Workflow deployment exclusions

The current GitHub FTPS workflow excludes:

- `.git/**`
- `.github/**`
- `node_modules/**`
- `docs/**`
- `tests/**`
- `package.json`
- `package-lock.json`

The workflow therefore is broader than the minimum runtime package. Because Actions minutes are exhausted, no further workflow execution should be used for this audit.

### 5. Recommended manual upload package

For a manual Hostinger deployment of the V2 candidate, the required application package is:

- `index.html`
- `templates.html`
- `src/**`

The following repository content is **not required for the V2 runtime package** and should not be uploaded during the manual production replacement:

- `.git/**`
- `.github/**`
- `docs/**`
- `tests/**`
- `node_modules/**`
- `package.json`
- `package-lock.json`
- `README.md`
- `compare.html`
- `scripts/**`

Keeping the manual package minimal also avoids replacing unrelated site files.

### 6. Configuration / secret scan

Targeted repository searches for common exposed-secret patterns (OpenAI-style keys, FTP password literals, generic `password=`, `api_key`, and PEM private-key markers) returned no matches.

This is a targeted scan, not a substitute for authoritative Git-history secret verification and credential rotation. Those remain release-gate items.

## Deployment structure

The intended production target is:

`/cv-builder-v2/`

After upload, the following should exist beneath that directory:

- `index.html`
- `templates.html`
- `src/` (including application/runtime modules and `src/templates/assets/v2/`)

Do **not** upload the repository root as a whole if doing the replacement manually.

## Important release boundary

This audit does not certify `1e979b7` as a final production release. Browser validation for this exact application candidate remains outstanding because GitHub Actions is quota-blocked.

The exact candidate SHA must remain frozen for the deployment attempt; do not substitute an older validated SHA or a later application-code commit.

## Next execution step

1. Back up the existing Hostinger `/cv-builder-v2/` directory.
2. Upload exactly `index.html`, `templates.html`, and `src/**` from candidate `1e979b7`.
3. Do not delete the V1 `/cv-builder/` surface.
4. Open `/cv-builder-v2/` and perform the production smoke sequence documented in `PRODUCTION_HANDOFF_PACKAGE.md`.
5. Separately verify the seven existing Word-template downloads against the manifest.
6. Record live evidence before any V1 retirement decision.
