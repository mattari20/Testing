import test from 'node:test';
import assert from 'node:assert/strict';
import { createWordTemplateDownload, markWordTemplatePreparing, markWordTemplateReady, getWordTemplateDownloadHref } from '../../src/download/word-template-download.js';

test('word template download uses the shared catalog and delivery lifecycle', () => {
  let request = createWordTemplateDownload('t01-modern-minimalist-cv-design_modern');
  assert.equal(request.state, 'requested');
  assert.equal(request.requiresAdView, false);
  request = markWordTemplatePreparing(request);
  request = markWordTemplateReady(request);
  assert.equal(getWordTemplateDownloadHref(request), '/cv-builder/word-templates/T01-Modern-Minimalist-CV-Template.docx');
});

test('word template cannot expose a download URL before ready', () => {
  const request = createWordTemplateDownload('t02-professional-cv-design_modern');
  assert.throws(() => getWordTemplateDownloadHref(request), /not ready/);
});

test('word template cannot become ready without preparation', () => {
  const request = createWordTemplateDownload('t03-professional-cv-design_modern');
  assert.throws(() => markWordTemplateReady(request), /must be preparing/);
});