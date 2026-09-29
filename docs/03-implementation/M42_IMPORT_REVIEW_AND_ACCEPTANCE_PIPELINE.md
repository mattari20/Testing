# M42 — Import Review and Acceptance Pipeline

**Status: Implementation complete; runtime tests pending.**

M42 establishes a human-reviewed import flow for structured data and future PDF/DOCX extraction.

Flow:

**Detect → Extract/Normalize → Review → Accept / Partial Accept / Reject → Canonical V2 Data**

No import is auto-applied to canonical career data by this layer.

V1 migration retains its existing provenance, fingerprint and no-silent-loss model. PDF/DOCX remain parser-adapter inputs rather than hard-coded parser implementations.