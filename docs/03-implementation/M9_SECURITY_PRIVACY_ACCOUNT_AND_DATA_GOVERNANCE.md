# M9 — Security, Privacy, Account and Data Governance Foundation

**Status:** Implementation foundation complete; deployment/authentication/storage adapters pending.

## 1. Objective

M9 establishes the V2 security and privacy boundary without coupling the core document engine to a specific authentication, database, cloud, or provider technology.

## 2. Implemented

Added:

- `src/security/security-privacy-engine.js`
- `tests/m9/security-privacy.test.js`

The foundation provides:

- data classification;
- ownership records;
- operation-level authorization boundary;
- private-by-default visibility;
- explicit public field projection;
- consent lifecycle;
- local-first storage boundary;
- optional cloud boundary;
- deletion planning;
- unpublish and sharing-revocation states;
- security-record validation.

## 3. Privacy Rules

The foundation enforces the architectural principles that:

1. private career data is the default;
2. public CVs are controlled projections;
3. sensitive fields do not become public automatically;
4. ownership is distinct from identity;
5. protected operations require an ownership/authorization decision;
6. cloud operation is optional and must remain behind a boundary;
7. external processing can be represented through explicit consent;
8. unpublishing/revocation does not mean source-data deletion.

## 4. Account Boundary

M9 deliberately does not implement a concrete authentication provider or account service. Account identity remains an external boundary that can later be connected to this authorization model.

The no-login/local-first path remains valid.

## 5. Deletion and Recovery

Deletion is represented as a planned lifecycle operation rather than an implicit data wipe. Scope, recovery preservation, and retained operational data can be recorded explicitly.

Actual retention schedules, physical deletion, backups, and account-deletion workflows remain later implementation/operations work.

## 6. Security Boundary

No production credentials, secrets, payment credentials, or provider-specific authentication mechanisms are introduced.

V1 exposed credentials remain a known blocker under the M0 security reconciliation and must be rotated/revoked before V1 production integrations are reused.

## 7. Acceptance Gate

M9 foundation is complete when:

- data classifications exist;
- ownership is explicit;
- authorization is a separate decision;
- private-by-default behavior exists;
- public projection is explicit;
- consent is trackable;
- local-first/cloud-optional boundary exists;
- deletion/revocation are distinct operations;
- no implementation provider is hard-coded.
