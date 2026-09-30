# M238–M247 Production Smoke Record Validation

## Purpose

This batch makes the R6 production smoke-test record machine-checkable without pretending that synthetic tests are live production evidence.

## Completed

- Added `src/release/production-smoke-record.js`.
- Defined the observable checks behind each of the nine R6 production requirements.
- Required production identity: HTTPS production URL, full deployment commit SHA, production environment, and offset-aware observation time.
- Required at least one evidence reference.
- Mapped the smoke record into the existing M218–M227 production integration contract.
- Added automated tests for incomplete records, invalid deployment identity, and a complete synthetic record.
- Added the M238–M247 test command to the integration CI workflow.

## Safety rule

The validator checks the shape and completeness of evidence. It does not create live evidence, access production, or authorize R6 closure.

A complete synthetic test fixture therefore proves only that the validator works.

## R6 consequence

R6 remains **OPEN** until an operator executes the record against the actual deployed V2 application and records the observed evidence.

## Next step

The next batch should focus on assembling the controlled production evidence package and reconciling it with the release-gate tracker. No production credentials or secrets should be committed.
