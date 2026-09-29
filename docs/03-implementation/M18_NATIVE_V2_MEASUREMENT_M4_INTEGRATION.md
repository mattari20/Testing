# M18 — Native V2 Measurement → M4 Integration

## Completed

The native rendering path now has a dedicated measurement boundary.

### Measurement contract

Rendered semantic elements marked with `data-v2-layout-block` are converted into M4 layout blocks.

The bridge records:
- semantic layout kind;
- stable block identifier;
- measured height;
- source template element;
- semantic section;
- keep-together / keep-with-next constraints;
- splittable state.

M4 remains the authoritative pagination engine.

### Important boundary

The measurement harness does not invent browser dimensions. In a real browser, it reads `getBoundingClientRect().height` / element dimensions after fonts, images and layout have settled.

In non-browser fixtures, dimensions must be supplied by the browser-like environment. A zero-height fixture must not be interpreted as visual compatibility evidence.

### Pagination

Measured blocks are passed directly into M4. Overflow and page-count diagnostics are preserved.

## Compatibility status

This milestone establishes the integration contract only. It does not declare any template compatible.

The next validation step is to run the seven templates in a real browser environment with representative data and collect measured Golden Baseline evidence.
