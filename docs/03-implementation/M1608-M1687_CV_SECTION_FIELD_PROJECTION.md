# M1608–M1687 — CV Section & Field Projection

## Purpose
Create a deterministic application projection from the master profile plus targeted-CV configuration for editor and rendering consumers.

## Contract
- Enforce master-profile ownership of the targeted CV.
- Apply targeted section, field, and entry visibility.
- Apply explicit section, field, and entry ordering.
- Preserve source values and metadata without mutating the master profile.
- Expose stable section/field/entry diagnostics.
- Keep the projection independent from presentation CSS and V1 runtime assets.

## Validation
The milestone suite covers visibility, section ordering, field ordering, entry preservation, and diagnostics.

## Next boundary
The projection becomes the input to a measured pagination runtime that coordinates measurement, pagination, overflow, and deterministic layout evidence.
