# V1 Golden Baseline Package Receipt

**Status:** Received and recorded  
**Purpose:** Preserve the authoritative V1 archive reference for future V2 work  
**Archive:** cv-builder 2026 10 26 final version(1).rar  
**SHA-256:** 45b8dd43c8792a1229b7446172725275a5f3d4fef124017740df757d9d20f2e9  
**Archive entries:** 42

## 1. Source Availability

The V1 archive has now been supplied again and verified as readable.

This archive is therefore an available V1 source reference for subsequent V2 implementation and regression work.

If a future task requires a V1 asset that is not present in this archive, the project must explicitly request the missing V1 source from the user rather than reconstructing it by assumption.

## 2. Confirmed Core Sources

The archive contains:

- bridge.php
- builder.html
- builder.js
- builder-mobile-engine.js
- builder-desktop-engine.js
- builder-ui-styles.css
- index.php
- api/.htaccess
- api/track-event.php
- api/report.php
- sitemap.xml
- icons/builder-icons.js
- icons/builder-icons.css
- favicon asset
- demo profile assets
- seven named HTML CV templates
- seven matching DOCX template assets
- template preview assets
- Word icon asset

## 3. Confirmed V1 Template Files

The archive contains these seven HTML templates:

1. t01-modern-minimalist-cv-design_modern.html
2. t02-professional-cv-design_modern.html
3. t03-professional-cv-design_modern.html
4. t04-modern-blue-corporate_modern.html
5. t05-simple-cv-graphic-web-designer_modern.html
6. t06-professional-cv-graphic-designer_modern.html
7. t07-professional-cv-store-manager-incharge_modern.html

Matching DOCX assets are present for these seven templates.

## 4. Previously Identified Missing V1 Assets

The following items remain absent from this supplied archive:

- t01-modern-minimalist-cv-design_ats.html
- t01-modern-minimalist-cv-design_simple.html
- previews/ats_preview.jpg

The previously identified demo-image extension mismatch should also remain tracked until the authoritative intended asset/reference is verified.

Therefore these items remain **Asset Reconciliation Required**.

## 5. Security Notice

The archive contains the previously audited server-side files:

- api/track-event.php
- api/report.php

The V1 security audit identified plaintext database credentials in those files.

This archive must therefore be treated as sensitive source material.

Before any source reuse:
- production credentials must be rotated/revoked as appropriate;
- secrets must not be copied into V2;
- repository history must be reviewed;
- secure configuration must replace embedded credentials.

This receipt does not claim that credential rotation has occurred.

## 6. Golden Baseline Usage Rule

The supplied archive is a **V1 system baseline**, not the V2 architecture.

V2 may reuse:
- V1 templates;
- visual assets;
- compatible presentation behavior;
- validated user-visible behavior.

V2 must not blindly reuse:
- V1 fixed-schema architecture;
- V1 rendering architecture;
- V1 pagination implementation;
- V1 storage architecture;
- V1 security weaknesses.

## 7. Future Retrieval Rule

For future V2 work:

1. Check the recorded V1 archive/baseline first.
2. If the required V1 source is present, use it as the reference.
3. If it is absent, explicitly tell the user which V1 source/asset is missing.
4. Do not invent, silently recreate, or assume missing V1 behavior.
5. If the user provides a newer/authoritative V1 version, record it as a new baseline candidate and compare it before replacing the existing reference.

## 8. M0 Impact

The V1 archive availability condition is now improved because the source package has been supplied and verified.

However, M0 is not automatically marked fully complete by archive receipt alone.

Still required before M1 implementation is formally opened:

- authoritative disposition/recovery of the three missing named assets;
- confirmation of production credential rotation/revocation;
- repository-history secret review;
- final Golden Baseline fixture/evidence package.

## 9. V1 Preservation Rule

This archive must remain associated with the V1 Golden Baseline for:

- migration testing;
- template adaptation;
- visual regression;
- functional regression;
- export comparison;
- compatibility verification;
- future debugging.

**No application code is introduced by this receipt.**
