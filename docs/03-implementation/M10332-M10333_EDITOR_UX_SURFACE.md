# M10332–M10333 Editor UX Surface Workstream

## Purpose
This workstream advances the CV Builder from an application/model foundation into a coherent user-facing editor UX contract without disturbing the V1 production surface.

## 20 batches
1. Workspace layout state
2. Pane state
3. Section editor
4. Entry editor
5. Field controls
6. Document switcher
7. Document dialog actions
8. Template gallery
9. Template compatibility boundary
10. Save indicator
11. Recovery panel boundary
12. Export panel
13. ATS panel
14. Job-match panel
15. AI panel
16. Responsive layout mapping
17. Focus-flow surface
18. Accessibility surface
19. Integrated editor shell
20. UX acceptance contract

## Integration
The browser application now exposes the integrated shell and an acceptance inspector. Existing runtime, persistence, export, intelligence, AI-review, accessibility, keyboard, template, and preview boundaries remain authoritative.

## Scope discipline
This workstream does not add provider-specific AI integration, production CSS/theme assets, account/cloud services, or a production deployment entry point. Those remain later release work.

## Verification
A focused contract test was added at `tests/m10332-m10333/editor-ux-surface.test.js`. The repository connector does not execute Node test suites, so registration is recorded but execution is not claimed here.
