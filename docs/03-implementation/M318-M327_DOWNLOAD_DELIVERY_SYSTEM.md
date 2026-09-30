# M318-M327 — Download Delivery System

## Purpose
Provide a reusable download-preparation and delivery lifecycle for pre-designed Word templates and future downloadable CV artifacts.

## User flow
1. User selects Download Word Template.
2. The system enters a short Preparing state.
3. The real file becomes Ready.
4. The user receives a clearly identified Download action.
5. The file downloads.
6. A separate advertisement area may be displayed, but the download must not depend on viewing or interacting with the advertisement.

## Design rules
- No artificial waiting period solely to expose an advertisement.
- No ad presented as or positioned to resemble the download control.
- Ads do not determine whether the file is available.
- The lifecycle is reusable for future PDF/DOCX/resource downloads.
- No claim of successful download is made until actual browser delivery is observed.

## States
REQUESTED -> PREPARING -> READY -> DOWNLOADING -> COMPLETED

Any state may transition to BLOCKED when delivery cannot safely continue.

## Initial implementation
The repository contains the deterministic lifecycle contract and tests. Actual browser wiring and real DOCX assets remain subsequent acceptance work.

## Word-template integration

The Word-template adapter now resolves a shared V2 template ID through the Word-template catalog, creates the reusable delivery request, and prevents a public download href from being exposed before the request reaches READY. The adapter does not require or infer ad completion.
