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
    const consoleErrors=[];
    page.on('pageerror', error => pageErrors.push(String(error?.stack || error?.message || error)));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });

    await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'networkidle'});
    await page.waitForTimeout(3000);
    if (!(await page.evaluate(() => window.v2ProductionReady === true))) {
      const status = await page.locator('#app-status').textContent();
      throw new Error('V2 boot did not complete. status=' + JSON.stringify(status) + ' pageErrors=' + JSON.stringify(pageErrors));
    }
    assert.equal(await page.locator('#app-status').textContent(), 'V2 editor ready.');
    assert.ok((await page.locator('#template-select option').count()) >= 9);
    assert.ok((await page.locator('[data-v2-editor-form]').innerText()).includes('Personal Information'));
    if ((await page.locator('[data-v2-editor-preview-root] [data-v2-template-root]').count()) < 1) {
      throw new Error('V2 preview did not render. pageErrors=' + JSON.stringify(pageErrors) + ' consoleErrors=' + JSON.stringify(consoleErrors));
    }
    assert.ok((await page.locator('[data-v2-editor-preview-root] [data-v2-template-root]').count()) >= 1);
    assert.deepEqual(pageErrors, []);
  } finally {
    await browser.close();
    server.kill();
  }
});
