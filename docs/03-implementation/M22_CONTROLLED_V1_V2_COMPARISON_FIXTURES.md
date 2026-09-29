# M22 — Controlled V1/V2 Comparison Fixtures

## Purpose

M22 provides a registry-driven comparison fixture system. The repository currently contains seven recovered templates, but **seven is not the architectural limit**.

The fixture system automatically covers every template registered in the V2 native template catalog and can accept an explicit future template set.

## Extension rule

New templates do not require an M22 hard-coded template-ID list.

When a new template is registered, comparison fixtures are generated from the registry. A V1 baseline identity may be supplied when the template is derived from an existing V1 template.

This supports:
- existing V1 templates;
- current native V2 templates;
- future native V2 templates;
- future templates without a V1 predecessor, where the baseline/evidence policy is explicitly defined.

## Legacy and native coexistence

V1 source remains immutable Golden Baseline/reference material. Native V2 source is the current presentation implementation. Adapters/migration remain compatibility mechanisms.

A future native template does not need to copy V1 syntax. It must satisfy the current V2 template contract and enter the same validation/evidence pipeline.

## Evidence

Every fixture uses controlled CV data, A4 page model, reference viewport, registry identity, and V1 baseline identity when applicable.

Required dimensions are typography, color, spacing, hierarchy, columns, photo, icons, background, page structure, content visibility, and pagination.

Every dimension starts as **insufficient evidence**. No compatibility result is manufactured.

## Current scope

Seven templates are currently registered. M22 treats this as the **current registered set**, not the permanent template count.
