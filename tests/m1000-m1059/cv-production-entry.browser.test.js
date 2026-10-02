import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';

async function freePort(){
  const server=createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const port=server.address().port;
  server.close();
  await once(server,'close');
  return port;
}

test('production V2 entry boots the editor, template catalog and live preview', async () => {
  const { chromium } = await import('playwright');
  const port=await freePort();
  const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    const pageErrors=[];
    page.on('pageerror', error => pageErrors.push(String(error?.stack || error?.message || error)));

    await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'networkidle'});
    await page.waitForFunction(() => window.v2ProductionReady === true, null, {timeout:10000});
    assert.equal(await page.locator('#app-status').textContent(), 'V2 editor ready.');
    assert.ok((await page.locator('#template-select option').count()) >= 9);
    assert.ok((await page.locator('[data-v2-editor-form]').innerText()).includes('Personal Information'));
    await page.waitForSelector('[data-v2-editor-preview-root] [data-v2-template-root]');
    assert.ok((await page.locator('[data-v2-editor-preview-root] [data-v2-template-root]').count()) >= 1);
    assert.deepEqual(pageErrors, []);
  } finally {
    await browser.close();
    server.kill();
  }
});
