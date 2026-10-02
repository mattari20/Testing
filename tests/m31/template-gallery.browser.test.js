import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
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
    assert.ok(await page.locator('[data-preview] [data-v2-template-root]').count() >= 9);

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
