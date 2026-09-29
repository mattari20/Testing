# M25 — Playwright Browser Adapter

## Purpose

M25 connects the generic M24 browser validation runner to Playwright without making Playwright part of the core template, rendering, or pagination engines.

## Responsibilities

The adapter:
- creates a controlled browser document;
- loads the native V2 renderer into the browser page;
- renders the supplied template source with the supplied canonical snapshot;
- waits for document fonts and two animation frames;
- measures semantic layout blocks using real DOM geometry;
- returns render diagnostics and measured evidence;
- closes the page through the adapter boundary.

## Architecture boundary

M24 owns orchestration. M25 owns the Playwright-specific page adapter. M4 remains authoritative for pagination. M23 owns evidence records. M21/M22 own Golden comparison decisions.

## Future templates

The adapter receives a template definition from the generic runner. It contains no template-specific ID list or per-template rendering branches. Any template accepted by the V2 native renderer can use the same adapter.

## Evidence policy

This adapter produces actual browser measurements. It does not declare visual equivalence and does not manufacture V1 evidence.
