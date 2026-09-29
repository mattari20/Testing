# M53 — V2 Editor Command Contract

**Status: Implementation complete; runtime tests pending.**

M53 defines a stable command vocabulary between the future UI and the V2 document/application layer.

Commands cover:
- field updates;
- visibility;
- repeatable entries;
- ordering;
- template/variant selection;
- assets;
- undo/redo.

The contract prevents UI-specific DOM state from becoming the canonical document model.