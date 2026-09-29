# M66 — Editor Preview Integration

M66 connects the editor session to the existing V2 assembly and preview contracts.

The preview path is:
**Editor Session → Application Snapshot → Assembly → Layout Result → Preview Request**

Private My Data preview is explicitly authorized by the controller boundary. This is an application-layer decision; template rendering and layout remain downstream engines.