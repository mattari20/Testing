# M118–M127 — Content Fragmentation and Distribution

## Purpose
This batch advances the editor preview from page-container creation to measured semantic block distribution.

### M118 — Rendered block extraction
Browser-rendered elements carrying `data-v2-layout-block` are collected with geometry and semantic hints. Canonical CV data is not mutated.

### M119 — Semantic block normalization
Rendered block metadata is normalized into the existing layout engine vocabulary.

### M120 — Block pagination
The existing `paginateBlocks` contract remains the source of page assignment. No duplicate full-document rendering is used as a pagination substitute.

### M121 — Split/overflow semantics
Existing splittable, keep-together, keep-with-next, manual-break, and overflow states remain authoritative. True DOM splitting of an individual block is still constrained by the block's declared split points.

### M122 — Fragment descriptors
Page assignments become fragment descriptors that retain source block identity and page state.

### M123 — DOM distribution
Assigned rendered blocks are cloned into their page containers. The canonical document remains untouched.

### M124 — Runtime integration
A V2 distribution runtime connects extraction, pagination, fragment creation, page mounting, and distribution.

### M125 — Evidence contract
Evidence now records block count, page count, assignment status, and distribution status.

### M126 — Overflow evidence
Overflow is surfaced as an explicit diagnostic rather than silently shrinking content.

### M127 — Validation boundary
The batch establishes the browser-validation boundary for long-content scenarios. A green runtime result must only be reported when an actual browser execution provides evidence.

## Important limitation
This batch distributes measured DOM blocks. It does **not** claim arbitrary text-node fragmentation inside a block. Individual block splitting requires real split points supplied by the layout contract.

## Architecture
Canonical CV → Template Render → Browser Measurement → Semantic Pagination → Fragment Descriptors → Page Containers → Distributed Rendered Blocks
