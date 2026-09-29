# M87 — Real Editor Browser Validation

M87 adds a real Playwright browser test for the V2 editor runtime.

The test serves the repository over HTTP, loads the actual editor ES modules in Chromium, mounts the runtime, edits a generated field, and verifies that the canonical V2 state changed.

M87 deliberately reports only checks actually exercised by the test; preview and template-switch checks remain separate until their browser path is wired into the same fixture.
