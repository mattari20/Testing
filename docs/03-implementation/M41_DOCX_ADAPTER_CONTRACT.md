# M41 — DOCX Adapter Contract

**Status: Implementation complete; runtime tests pending.**

M41 isolates concrete DOCX generation from the V2 document/export architecture.

Generated and blank DOCX remain separate adapter modes. The provider is intentionally replaceable and is not selected by the core engine.