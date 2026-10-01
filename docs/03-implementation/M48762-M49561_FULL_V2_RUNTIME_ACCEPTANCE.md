# M48762–M49561 — Full V2 Runtime Browser Acceptance

Status: implementation complete.

This workstream closes the gap between controlled browser-surface tests and the actual V2 runtime stack.

## Covered
- Real CV workspace creation and validation.
- Real CV editor runtime projection, pagination and command history.
- Real browser adapter.
- Real V2 native template registry/catalog.
- Template selection, form editing, undo/redo and preview generation.
- 100 executable runtime acceptance groups.

## Evidence boundary
The acceptance test exercises production JavaScript modules directly. Browser rendering and Hostinger deployment remain separate external evidence gates. No deployment success is claimed here.

## Deployment rule
Hostinger deployment must occur only after repository validation is green and the V2 package is intentionally copied into an isolated V2 deployment path. V1 production files, routes and assets must remain untouched.

## Required post-deployment evidence
1. V2 URL loads.
2. Editor bootstrap succeeds.
3. Template selection works.
4. Form edit updates preview.
5. Undo/redo works.
6. Save/recovery works.
7. Print/PDF flow opens correctly.
8. Desktop and mobile layouts are usable.
9. Browser console has no blocking errors.
10. V1 public CV Builder remains unchanged.

Deployment gate: repository validation → isolated Hostinger upload → smoke test → acceptance sign-off.