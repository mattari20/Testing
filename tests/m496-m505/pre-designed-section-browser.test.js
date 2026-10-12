import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const server = createServer(async (req, res) => {
  try {
    const clean = decodeURIComponent((req.url || '/').split('?')[0]);
    const file = clean === '/' ? '/tests/browser/m408-m417-preview-inline.html' : clean;
    const body = await readFile(path.join(root, file));
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': ext === '.js' ? 'text/javascript' : ext === '.html' ? 'text/html' : 'text/plain' });
    res.end(body);
  } catch (error) {
    res.writeHead(404);
    res.end(String(error));
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('http://127.0.0.1:' + address.port + '/tests/browser/m408-m417-preview-inline.html');
  await page.waitForFunction(() => window.testReady === true);
  await page.waitForFunction(() => document.querySelector('[data-v2-section-library-item="publications"]'));

  await page.evaluate(async () => {
    const library = await import('/src/ui/pre-designed-section-library.js');
    window.editorRuntime.surface.dispatch({
      type: 'add-section',
      target: {},
      payload: library.createPreDesignedSection('publications')
    });
    const profile = window.editorRuntime.surface.getState().session.application.masterProfile;
    const section = profile.careerData.sections.find(item => item.type === 'publications');
    window.editorRuntime.surface.dispatch({
      type: 'update-entry',
      target: { sectionId: section.id, entryId: section.entries[0].id },
      payload: { values: { title: 'A Research Article', authors: 'Ali Akbar', venue: 'Student Research Journal', date: '2026', link: 'https://example.org/article' } }
    });
  });

  await page.waitForFunction(() => {
    const block = document.querySelector('#preview [data-v2-dynamic-section="publications"]');
    return block && block.textContent.includes('A Research Article') && block.textContent.includes('Ali Akbar');
  });
  const previewText = await page.locator('#preview [data-v2-dynamic-section="publications"]').innerText();
  assert.match(previewText, /Publications/);
  assert.match(previewText, /A Research Article/);
  assert.match(previewText, /Ali Akbar/);

  await page.evaluate(() => {
    const state = window.editorRuntime.surface.getState();
    const section = state.session.application.masterProfile.careerData.sections.find(item => item.type === 'publications');
    window.editorRuntime.surface.dispatch({
      type: 'set-visibility',
      target: { kind: 'section', sectionId: section.id },
      payload: { visible: false }
    });
  });
  await page.waitForFunction(() => !document.querySelector('#preview [data-v2-dynamic-section="publications"]'));
  assert.deepEqual(pageErrors, []);
  console.log(JSON.stringify({ libraryInsert: 'passed', livePreview: 'passed', sectionVisibility: 'passed' }));
} finally {
  await browser.close();
  server.close();
}
