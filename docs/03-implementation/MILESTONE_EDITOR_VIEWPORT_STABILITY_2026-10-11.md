# Milestone — Stable Editor Viewport When Adding Fields

**Recorded:** 2026-10-11  
**Project:** CV Builder V2  
**Repository:** `mattari20/Testing`  
**Branch:** `release/cv-builder-v2-production`  
**Accepted checkpoint commit:** `9faf549ce714bd7e22bc266d5540ee886d9f0395`  
**Production deployment workflow:** [38159663645](https://github.com/mattari20/Testing/actions/runs/38159663645) — **success**  
**Template gallery validation:** [38159663581](https://github.com/mattari20/Testing/actions/runs/38159663581) — **success**  
**Workspace validation:** [38159663574](https://github.com/mattari20/Testing/actions/runs/38159663574) — **failed; see validation note below**

## Owner-accepted behavior / milestone freeze

The project owner tested the editor after the latest viewport change and explicitly confirmed that the result now matches the requested behavior. Preserve this as the accepted UX baseline before starting additional features.

When the user clicks **Add Skill**, **Add Language**, **Add Field**, or another supported add action:

1. The current viewport must remain completely still at its existing location.
2. There must be no visible scroll-up/scroll-down jolt, even if the page eventually returns to the same position.
3. The currently focused/input area and surrounding visual context must not appear to jump away.
4. New field content must extend the form downward; additional vertical space belongs below existing content.
5. Do not scroll to the top of the Skills/Languages group or automatically scroll to the newly created field.
6. Keep the form’s existing design and layout stable. This milestone is about interaction stability, not a visual redesign.

The owner’s latest confirmation: “बिल्कुल ये बहुत अच्छा हो गया, जो मैं चाह रहा था बिल्कुल एकदम सेम वही है.” Treat this as the user-accepted UX checkpoint for future work.

## Implementation recorded

Relevant source files:

- `src/ui/editor-dom-controller.js`
  - Captures existing scroll positions around editor actions.
  - Restores the scroll position synchronously after dispatch/rerender, rather than waiting for animation frames that can expose a visible intermediate jump.
- `src/ui/editor-runtime.js`
  - Disables browser scroll anchoring for the editor runtime lifetime to prevent browser compensation when the form is replaced.
  - Restores the previous `overflow-anchor` setting when the runtime is destroyed.
  - Uses versioned module query parameters to invalidate stale cached editor modules.

Relevant implementation commits during diagnosis:
- `cc20a0037c79bb939c8c954fb47f5190588b57a3` — disable browser scroll anchoring during editor rerenders.
- `15ec86c00c1b21b2ca43aa1807804d1c0bd2f571` — restore viewport before browser paint.
- `9faf549ce714bd7e22bc266d5540ee886d9f0395` — refresh editor-controller cache version.

## Validation and honest status

- Hostinger deployment for commit `9faf549`: **success**.
- Template Gallery Validation for commit `9faf549`: **success**.
- CV Workspace Validation: **failed**. The workflow reported failures in the mobile More-menu test, multi-CV lifecycle/reload persistence test, and the viewport browser test (the test measured a page-scroll difference on Add Skill). These failures must not be silently marked as passed.
- Despite the automated workspace test failure, the project owner has directly tested the deployed experience and accepted the visible interaction as matching the desired behavior.

Therefore:
- **UX acceptance:** accepted by owner; freeze as the baseline.
- **Automated workspace regression gate:** still red; investigate separately when the project resumes.
- **Deployment:** successful for the accepted checkpoint commit.
- Do not claim that all workspace tests are green.

## Resume instructions

Continue future work from this checkpoint and preserve the accepted no-jump behavior. Before adding unrelated features, do not casually refactor the editor render/scroll lifecycle. If any future change touches `editor-runtime.js`, `editor-dom-controller.js`, form rendering, focus handling, or editor actions, rerun targeted mobile browser checks for Add Skill, Add Language, Add Field, and Add Custom Section.

Regression acceptance should check both:
- viewport/scroll coordinates do not visibly move during the action; and
- the focused input and the user’s editing context remain stable.

Keep this milestone as a reference point; later features should build on it rather than reset the behavior.
