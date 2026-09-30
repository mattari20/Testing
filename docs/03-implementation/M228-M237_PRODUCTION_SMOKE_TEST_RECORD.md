# M228–M237 — Production Smoke-Test Record

## Purpose

This batch defines the controlled record used to convert an observed production smoke test into R6 acceptance evidence.

It does not contain production credentials and does not invent deployment details.

## Required record

| Field | Required value |
|---|---|
| Production URL | Actual deployed V2 entrypoint |
| Deployment commit SHA | Exact deployed commit |
| Environment | Production environment identifier |
| Observed at | ISO-8601 observation time |
| V2 entrypoint | Explicit pass/fail observation |
| CV create/edit | Explicit pass/fail observation |
| Template/live preview | Explicit pass/fail observation |
| Multi-page pagination/fragmentation | Explicit pass/fail observation |
| PDF/print export | Explicit pass/fail observation |
| DOCX export | Explicit pass/fail observation |
| V1 data/migration path | Explicit pass/fail observation |
| Unexpected V1 fallback | Explicit negative check |
| Production credential/configuration review | Explicit pass/fail observation |
| Evidence references | Screenshots, recordings, logs, or equivalent |

## Acceptance rule

R6 is eligible for PASS only when all required observations are true and the record identifies the exact production deployment and observation time.

A missing observation is not equivalent to a pass.

## Execution boundary

The repository can define and validate the record structure, but it cannot manufacture live production evidence. The production URL, deployed commit, screenshots and runtime observations must come from the actual deployment environment.

## Relationship to R7

R7 V1 retirement remains blocked until R6 is accepted. This record therefore does not authorize removal of V1 runtime compatibility.

## Current status

**M228–M237: record specification complete.**

**R6: OPEN pending actual production smoke-test execution.**
