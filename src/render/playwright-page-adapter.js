import fs from 'node:fs';
import path from 'node:path';
import { renderNativeTemplateSource } from './native-v2-template-renderer.js';

export function createPlaywrightPageAdapter(page, options = {}) {
  if (!page || typeof page.setContent !== 'function') throw new Error('A Playwright page is required.');
  const rendererSource = options.rendererSource || fs.readFileSync(path.resolve('src/render/native-v2-template-renderer.js'), 'utf8');
  return {
    async renderAndMeasure({ template, sourceHtml, snapshot, screenshotPath }) {
      await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>', { waitUntil:'domcontentloaded' });
      await page.addScriptTag({ content: rendererSource.replaceAll('export ', '') + '\nwindow.__nativeRender = renderNativeTemplateSource;' });
      const result = await page.evaluate(async ({ sourceHtml, template, snapshot }) => {
        const definition={id:template.id,templateVersion:template.version || '2.0.0',sourceHtml};
        const rendered=window.__nativeRender(definition,snapshot,document);
        document.body.innerHTML='';
        document.body.appendChild(rendered.root);
        if (document.fonts?.ready) await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const blocks=[...document.querySelectorAll('[data-v2-layout-block]')].map((element,index)=>{
          const rect=element.getBoundingClientRect();
          return {
            id:element.getAttribute('data-v2-layout-block-id') || 'block-'+index,
            kind:element.getAttribute('data-v2-layout-kind') || 'custom',
            measuredHeight:rect.height,
            measuredWidth:rect.width,
            top:rect.top,
            left:rect.left,
            right:rect.right,
            bottom:rect.bottom
          };
        });
        return {
          renderStatus:rendered.state,
          renderDiagnostics:rendered.diagnostics || [],
          blocks,
          rootHeight:document.body.scrollHeight,
          visibleTextLength:document.body.innerText.length
        };
      }, { sourceHtml, template, snapshot });
      if (screenshotPath) {
        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
        await page.screenshot({ path: screenshotPath, fullPage: true });
        result.screenshotArtifact = screenshotPath;
      }
      return result;
    },
    async close(){ await page.close(); }
  };
}

export function createPlaywrightPageFactory(browser, options = {}) {
  if (!browser || typeof browser.newPage !== 'function') throw new Error('A Playwright browser is required.');
  return async viewport => {
    const page=await browser.newPage({ viewport:{width:viewport.width,height:viewport.height}, deviceScaleFactor:viewport.deviceScaleFactor || 1 });
    return createPlaywrightPageAdapter(page, options);
  };
}

export function createPlaywrightRawPageAdapter(page) {
  if (!page || typeof page.setContent !== 'function') throw new Error('A Playwright page is required.');
  return {
    async renderAndMeasure({ sourceHtml, screenshotPath }) {
      await page.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>', { waitUntil:'domcontentloaded' });
      await page.evaluate(html => { document.body.innerHTML = html; }, sourceHtml);
      if (page.evaluate) {
        await page.evaluate(async () => {
          if (document.fonts?.ready) await document.fonts.ready;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
      }
      const result = await page.evaluate(() => {
        const root = document.body.firstElementChild || document.body;
        const candidates = [root, ...root.children];
        const blocks = candidates.map((element,index) => {
          const rect = element.getBoundingClientRect();
          return {
            id: element.id || element.className?.toString()?.split(/\s+/)[0] || 'v1-block-' + index,
            kind: element.tagName.toLowerCase() === 'aside' ? 'content' : element.tagName.toLowerCase() === 'main' ? 'content' : 'custom',
            measuredHeight: rect.height,
            measuredWidth: rect.width,
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom
          };
        });
        return { renderStatus:'ready', renderDiagnostics:[], blocks, rootHeight:document.body.scrollHeight, visibleTextLength:document.body.innerText.length };
      });
      if (screenshotPath) {
        fs.mkdirSync(path.dirname(screenshotPath), { recursive:true });
        await page.screenshot({ path:screenshotPath, fullPage:true });
        result.screenshotArtifact=screenshotPath;
      }
      return result;
    },
    async close(){ await page.close(); }
  };
}

export function createPlaywrightRawPageFactory(browser) {
  if (!browser || typeof browser.newPage !== 'function') throw new Error('A Playwright browser is required.');
  return async viewport => {
    const page=await browser.newPage({ viewport:{width:viewport.width,height:viewport.height}, deviceScaleFactor:viewport.deviceScaleFactor || 1 });
    return createPlaywrightRawPageAdapter(page);
  };
}
