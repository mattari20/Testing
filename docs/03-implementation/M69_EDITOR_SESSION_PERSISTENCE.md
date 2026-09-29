# M69 — Editor Session Persistence

M69 adds a replaceable persistence boundary for the active V2 editor session.

It serializes the canonical Master Profile and Targeted CV state needed to recover an editor session. Storage implementation remains injected through an adapter, preserving the local-first architecture and avoiding provider lock-in.