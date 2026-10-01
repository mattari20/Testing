# M2008–M2087 — CV Export Contract

## Purpose
Define a technology-neutral export request/result boundary for PDF, DOCX, print, and web outputs.

## Contract
- Export receives a document snapshot, selected template, and layout evidence.
- Supported formats are explicitly enumerated.
- Export validation occurs before any renderer/provider is invoked.
- The contract does not choose an implementation technology or provider.
- Export results retain source document and template lineage.

## Validation
The milestone suite covers format validation, request isolation, and result lineage.
