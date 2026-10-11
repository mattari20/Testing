import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { once } from 'node:events';
import { createServer } from 'node:net';

async function freePort(){
  const server=createServer(); await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port; server.close(); await once(server,'close'); return port;
}

test('template gallery renders the native V2 collection and Build Online handoff', async () => {
  const { chromium } = await import('playwright');
  const port=await freePort();
  const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    await page.goto('http://127.0.0.1:'+port+'/templates.html',{waitUntil:'networkidle'});
    await page.waitForSelector('.card');
    assert.equal(await page.locator('.card').count(),9);
    assert.equal(await page.locator('[data-preview]').count(),9);
    await page.locator('[data-preview] [data-v2-template-root]').first().waitFor({state:'attached',timeout:10000});
    await page.waitForFunction(() => document.querySelectorAll('[data-preview] [data-v2-template-root]').length >= 9);

    await page.locator('#industry').selectOption({label:'Design'});
    assert.ok((await page.locator('.card').count()) >= 1);

    await page.locator('#reset').click();
    await page.locator('.card').first().locator('[data-build]').click();
    await page.waitForURL(/\/\?template=/);
    assert.match(page.url(), /template=/);
  } finally {
    await browser.close();
    server.kill();
  }
});

test('mobile More menu is viewport-bound and internally scrollable', async () => {
  const html=await readFile(new URL('../../builder.html',import.meta.url),'utf8');
  assert.match(html,/\.toolbar-menu\[open\] \.toolbar-secondary\{display:flex;position:fixed;z-index:9999;left:12px;right:12px;/);
  assert.match(html,/max-width:calc\(100vw - 24px\)/);
  assert.match(html,/max-height:calc\(100dvh - var\(--toolbar-menu-top,120px\) - 16px\)/);
  assert.match(html,/overflow-y:auto/);
  assert.match(html,/positionMobileToolbarMenu/);
});

test('PDF export stays directly visible outside the mobile More menu', async () => {
  const html=await readFile(new URL('../../builder.html',import.meta.url),'utf8');
  assert.match(html,/<button type="button" class="primary" id="print-btn">Export PDF<\/button>/);
  assert.doesNotMatch(html,/<details class="toolbar-menu" open>[\s\S]*?id="print-btn"/);
});

test('toolbar actions are ordered Export PDF, Share, Save CV, then More', async () => {
  const html=await readFile(new URL('../../builder.html',import.meta.url),'utf8');
  const pdf=html.indexOf('id="print-btn"');
  const share=html.indexOf('id="share-btn"');
  const save=html.indexOf('id="save-btn"');
  const more=html.indexOf('class="toolbar-menu"');
  assert.ok(pdf >= 0 && share > pdf && save > share && more > save, 'toolbar actions must appear in requested order');
  assert.match(html,/navigator\.share/);
  assert.match(html,/navigator\.clipboard\?\.writeText/);
});
