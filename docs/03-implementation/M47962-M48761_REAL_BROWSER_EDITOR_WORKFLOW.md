# M47962–M48761 — Real Browser Editor Workflow QA

## Objective
Extend visual QA into a continuous browser workflow covering editing, preview synchronization, responsive layout and print-boundary availability.

## Acceptance flow
1. Mount the V2 editor surface.
2. Edit a real form field.
3. Confirm the edited value remains in the DOM.
4. Synchronize the corresponding preview content.
5. Run the browser visual inspector.
6. Switch to a mobile viewport and verify the single-column layout.
7. Verify print CSS is present.

## Evidence boundary
This test executes Chromium through Playwright. It validates the browser contract using a controlled in-memory fixture; it does not represent Hostinger deployment evidence and does not replace testing against the deployed V2 application.

## Completion
Implementation: 100%.
Deployment-backed evidence: pending.
