# M138–M147 — Fragmentation Quality and Regression

## Scope
This batch hardens rendered-DOM pagination after M128–M137.

- M138: fragment ordering and geometry integrity.
- M139: repeated header/section continuation metadata.
- M140: explicit page-break handling boundary.
- M141: orphan/widow protection.
- M142: keep-with-next enforcement.
- M143: fragment slice/height validation.
- M144: long-CV browser scenario contract.
- M145: validation evidence boundary.
- M146: pagination regression matrix.
- M147: integrated batch contract and status reconciliation.

## Architectural boundary
The current fragmentation mechanism remains rendered-DOM vertical slicing. It does not claim semantic text reflow. Real browser evidence remains required for production confidence.

## Important limitation
The quality helpers in this batch are deterministic contracts and post-processing guards. They do not replace browser measurement or Golden Baseline comparison.

## Validation
Node-level tests should cover contracts. A real Chromium run is required before claiming visual correctness across the template library.
