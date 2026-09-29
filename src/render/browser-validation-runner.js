import fs from 'node:fs';
import path from 'node:path';
import { listNativeV2Templates } from '../templates/v2-native-template-catalog.js';
import { paginateBlocks } from '../layout/layout-pagination-engine.js';
import { createBrowserEvidenceCapture, recordBrowserMeasurement, finalizeBrowserEvidence } from '../validation/browser-evidence-capture.js';

export const M24_BROWSER_RUNNER_VERSION = '1.0.0';

export function createBrowserValidationPlan(input = {}) {
  const templates = Array.isArray(input.templates) ? input.templates : listNativeV2Templates();
  return {
    version: M24_BROWSER_RUNNER_VERSION,
    viewport: input.viewport || { width:794, height:1123, deviceScaleFactor:1 },
    pageModel: input.pageModel || { format:'A4', width:794, height:1123, margins:{top:0,right:0,bottom:0,left:0}, columns:1 },
    templates: templates.map(template => ({ id:String(template.id), version:String(template.version || template.templateVersion || 'unknown'), sourcePath:String(template.sourcePath || ''), v1BaselineId:template.v1BaselineId ? String(template.v1BaselineId) : null }))
  };
}

export async function runBrowserValidation(input = {}) {
  if (typeof input.pageFactory !== 'function') throw new Error('pageFactory is required.');
  const plan = createBrowserValidationPlan(input);
  const snapshot = input.snapshot || {};
  const capture = createBrowserEvidenceCapture({ templates: plan.templates, viewport: plan.viewport });
  for (const template of plan.templates) {
    const page = await input.pageFactory(plan.viewport);
    try {
      const sourceHtml = input.sourceLoader ? await input.sourceLoader(template.sourcePath) : fs.readFileSync(path.resolve(template.sourcePath), 'utf8');
      const screenshotPath = input.artifactDir ? path.join(input.artifactDir, `${template.id}.png`) : null;
      const measurement = await page.renderAndMeasure({ template, sourceHtml, snapshot, pageModel: plan.pageModel, screenshotPath });
      const blocks = Array.isArray(measurement.blocks) ? measurement.blocks : [];
      const pagination = paginateBlocks(blocks.map((block,index) => ({ ...block, order:index, minHeight:Number(block.measuredHeight || 0), preferredHeight:Number(block.measuredHeight || 0), keepTogether:true })), plan.pageModel);
      recordBrowserMeasurement(capture, template.id, {
        renderStatus: measurement.renderStatus || 'ready',
        renderDiagnostics: measurement.renderDiagnostics || [],
        blocks,
        pagination,
        screenshotArtifact: measurement.screenshotArtifact || null
      });
    } catch (error) {
      recordBrowserMeasurement(capture, template.id, { renderStatus:'error', renderDiagnostics:[String(error?.message || error)] });
    } finally {
      if (typeof page.close === 'function') await page.close();
    }
  }
  return finalizeBrowserEvidence(capture);
}

export function writeBrowserEvidenceArtifact(result, outputPath) {
  if (!outputPath) throw new Error('outputPath is required.');
  fs.mkdirSync(path.dirname(outputPath), { recursive:true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  return outputPath;
}