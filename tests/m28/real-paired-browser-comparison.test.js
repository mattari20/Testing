import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { listNativeV2Templates } from '../../src/templates/v2-native-template-catalog.js';
import { runPairedBrowserComparison } from '../../src/validation/paired-browser-comparison.js';
import { createPlaywrightPageFactory, createPlaywrightRawPageFactory } from '../../src/render/playwright-page-adapter.js';
import { createRepresentativeCareerSnapshot } from '../fixtures/representative-career-document-v1.js';

const browser=await chromium.launch({headless:true});
try {
 const result=await runPairedBrowserComparison({templates:listNativeV2Templates(),snapshot:createRepresentativeCareerSnapshot(),artifactDir:'artifacts/m28',nativePageFactory:createPlaywrightPageFactory(browser),v1PageFactory:createPlaywrightRawPageFactory(browser)});
 assert.equal(result.templateCount,7);
 assert.ok(result.results.every(x=>x.v1.renderStatus==='ready'&&x.v2.renderStatus==='ready'));
 assert.ok(result.results.every(x=>x.v1.screenshotArtifact&&x.v2.screenshotArtifact));
 assert.ok(result.results.every(x=>x.pairedEvidence.visualEquivalenceStatus==='insufficient-evidence'));
 console.log(`M28 paired comparison validated ${result.results.length} template pair(s).`);
} finally { await browser.close(); }
console.log('M28 real paired V1/V2 browser comparison completed.');