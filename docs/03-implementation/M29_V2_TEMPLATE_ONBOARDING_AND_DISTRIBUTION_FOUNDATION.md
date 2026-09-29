# M29 — V2 Template Onboarding and Distribution Foundation

## Status

**Implementation complete; runtime test execution pending.**

## Purpose

M29 establishes a V2-only onboarding gate for adding native templates without creating a permanent dependency on V1.

The V1 system remains only a Golden Baseline and migration-validation reference. New V2-native templates do not require a V1 baseline.

## Delivered

- Registry-driven template onboarding validation.
- Minimum metadata/source/capability validation.
- Explicit readiness state: ready or blocked.
- Evidence gate for native contract, browser measurement and pagination.
- Publication rule requiring V2 compatibility.
- Support for future V2-native templates with v1BaselineId set to null.
- Registry-driven onboarding plans with no hard-coded seven-template list.
- Publication assertion that returns explicit blocking reasons.

## Boundary

M29 does not:
- modify the V1 runtime;
- create a V1 compatibility dependency for new templates;
- implement payments or entitlement logic;
- implement the Template Library UI;
- implement a specific storage, hosting, rendering provider or payment provider;
- declare visual equivalence without evidence.

## Acceptance criteria

1. A native V2 template can be validated from registry metadata.
2. Missing required metadata is blocking.
3. Missing browser/pagination evidence is blocking.
4. A future V2-native template can be onboarded without a V1 baseline.
5. A published template cannot bypass the V2 compatibility gate.
6. Onboarding is registry-driven and extensible.

## Next V2 direction

Continue with V2-only production capability: complete runtime validation gates, then build the Template Library/distribution product layer and real export implementations. V1 adapters remain temporary and are retired after the seven-template migration evidence is accepted.
