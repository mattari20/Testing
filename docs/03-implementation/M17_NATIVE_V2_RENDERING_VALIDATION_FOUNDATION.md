# M17 — Native V2 Rendering Validation Foundation

## Completed

The next implementation step after native source conversion is now established: render the native templates through a dedicated V2 renderer instead of the legacy V1 compiler.

### Added

- Native V2 renderer aligned to the semantic template contract.
- Safe identity, section, entry and value bindings.
- Section visibility resolution.
- Repeat handling for entry-style and value-style sections.
- Safe asset/image binding.
- Native template root/version validation.
- A render fixture using a browser-like DOM environment.
- Test script `test:m16` for the render fixture.

### Binding grammar

Native repeats use:

- `data-v2-repeat="experience:entries"`
- `data-v2-repeat="education:entries"`
- `data-v2-repeat="projects:entries"`
- `data-v2-repeat="achievements:entries"`
- `data-v2-repeat="skills:values"`
- `data-v2-repeat="languages:values"`

The native renderer is the active path for V2 templates. The V1 compiler remains only as a compatibility/migration path.

## Important status

This is a rendering foundation, not a Golden Baseline compatibility approval.

The following evidence is still required:
1. all seven real templates rendered with representative snapshots;
2. browser DOM measurement;
3. semantic block extraction;
4. M4 pagination;
5. V1-vs-V2 visual comparison;
6. preview/export parity.

No template is marked published or fully compatible yet.

## Next batch

Build the consolidated seven-template rendering/measurement harness and connect its measured output to the existing M4 layout engine.
