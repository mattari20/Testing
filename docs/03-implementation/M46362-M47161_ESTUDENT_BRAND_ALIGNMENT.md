# M46362–M47161 — eStudent Brand & Live CV Builder Alignment

## Objective

Align the V2 editor surface with the visual language of the live eStudent.pk CV Builder while preserving V1 as a frozen production baseline.

## Live audit

The current public CV Builder was reviewed on 2026-10-01.

Observed product structure:
- CV Builder gallery is organized around career level, industry, and style.
- Current gallery exposes Modern, ATS-oriented, and other template variants.
- The live flow includes template selection before entering the builder.
- The product messaging emphasizes editable sections, live preview, PDF export, and layout switching.
- The public CV Builder remains a separate V1 production surface and is not modified by this V2 workstream.

Source:
https://estudent.pk/cv-builder/

## Brand treatment

V2 now has a centralized brand token layer rather than scattering brand values through component CSS.

Primary visual direction:
- light page background
- white working surfaces
- dark neutral text
- blue primary action/accent
- restrained borders and shadows
- accessible success/warning/error states
- A4 preview remains visually distinct from the application chrome

The current public text crawl does not expose the exact site stylesheet hex values. Therefore this workstream does not claim pixel-perfect extraction of the live site's CSS. The V2 brand palette is centralized so exact values can be calibrated from an observed browser render later without changing component structure.

## Implementation

Updated:
- `src/application/cv-editor-design-tokens.js`
- `src/application/cv-editor-style-sheet.js`
- `tests/m45562-m46361/editor-css.test.js`

Changes:
- added explicit `brand` token group
- exposed centralized radius CSS variables
- removed the undefined preview-action radius dependency
- kept the blue/white/light neutral visual system coherent across toolbar, form, preview, template cards and status states
- extended CSS contract tests for brand tokens and radius variables

## Verification boundary

Source-level CSS contract coverage is testable in the repository.

Real visual/browser verification still requires an actual V2 browser render. No live V2 browser result is fabricated from the public V1 page.

## Completion

Implementation batch complete: 100%.
