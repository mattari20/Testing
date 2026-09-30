# M268–M277 Production Source Bridge

## Purpose

Establish an explicit, V1-safe boundary between the observed production CV Builder entry flow and the V2 application entry boundary.

## Observed production source flow

The currently observable public production flow is:

1. Template gallery
2. `bridge.php`
3. Template/style selection
4. Build Online or Word-file action

The repository does not contain the current live PHP bridge or builder source. Therefore this milestone does not claim to have recovered or replaced the live production implementation.

## Repository implementation

Added:

- `src/application/v1-production-bridge.js`
- `tests/m268-m277/v1-production-bridge.test.js`

The bridge exposes three explicit states:

- `v1` — preserve the current V1 production path.
- `v2` — explicitly request a V2 handoff with a template identifier.
- `blocked` — explicitly prevent production handoff while release evidence is incomplete.

No route is inferred from a missing file, URL, template, or deployment configuration.

## Safety rules

- V1 remains the default state.
- V2 handoff must be explicit.
- Blocked state cannot silently fall back to V1.
- The bridge contains no production credentials.
- No unverified production URL, deployment SHA, framework, hosting configuration, or live PHP implementation is embedded in the repository.
- R6 remains OPEN until the bridge is executed against the actual production deployment and the nine-point production evidence contract is completed.

## Validation

The batch adds a dedicated Node test suite and registers it in the V2 Integration Validation workflow.

The tests cover:

- observed production flow declaration
- explicit V1 preservation
- explicit V2 handoff
- blocked-state safety
- invalid-state rejection

## Release-gate impact

This milestone improves the implementation boundary for R6 but does not change R6 to PASS.

R7 remains OPEN because V1 retirement is not authorized until R6 and the other release gates are closed.

## Remaining evidence

1. Identify the exact deployed V2 production entrypoint.
2. Execute real CV create/edit against production.
3. Verify template selection and live preview.
4. Verify pagination/fragmentation in production.
5. Verify PDF/print and DOCX exports.
6. Verify V1 data/migration path.
7. Verify no unexpected V1 fallback.
8. Review production configuration and credential handling.
9. Record production URL, deployment SHA, environment, timestamp, and evidence references.

