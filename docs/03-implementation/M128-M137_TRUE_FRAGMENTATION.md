# M128–M137 — True Rendered Block Fragmentation

## M128
The pagination engine now supports more than two split parts for a splittable block when valid split points are available.

## M129
Fragment geometry is represented explicitly by offset, height, bottom and source height.

## M130
A fragment slice style contract clips a rendered clone to its assigned vertical range and records the fragment part/offset.

## M131
A fragment planner converts pagination assignments into concrete fragment descriptors.

## M132
The distributor mounts normal blocks and clipped split fragments into page containers.

## M133
Continuity validation verifies sequential fragment parts for blocks spanning pages.

## M134
The fragmented preview runtime connects extraction, pagination, planning, distribution and continuity.

## M135
Fragment evidence records pages, fragment count, distribution, continuity and overflow-control status.

## M136
Long-content evidence explicitly distinguishes multi-page fragmentation from single-page rendering.

## M137
The architecture now supports visual splitting of declared splittable rendered blocks without mutating canonical CV data.

## Boundary
This is a rendered-DOM fragmentation mechanism based on measured vertical slices. It is not a semantic text reflow engine and does not invent split points. Blocks must opt into splitting and provide compatible split points through the layout contract.
