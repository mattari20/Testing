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

test('production CV workspace supports multi-CV lifecycle and reload persistence', async () => {
  const { chromium } = await import('playwright');
  const port=await freePort();
  const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
  const browser=await chromium.launch({headless:true});
  try {
    const context=await browser.newContext();
    const page=await context.newPage({viewport:{width:1440,height:1000}});
    await page.goto('http://127.0.0.1:'+port+'/?template=t01-modern-minimalist-cv-design_modern',{waitUntil:'networkidle'});
    await page.waitForSelector('#cv-document-list .cv-document');
    assert.equal(await page.locator('#cv-document-list .cv-document').count(),1);

    page.once('dialog',dialog=>dialog.accept('Second CV'));
    await page.locator('#new-cv-btn').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#cv-document-list .cv-document').count(),2);

    await page.locator('#duplicate-cv-btn').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#cv-document-list .cv-document').count(),3);

    page.once('dialog',dialog=>dialog.accept('Renamed CV'));
    await page.locator('#rename-cv-btn').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.cv-document-title', {hasText:'Renamed CV'}).count(),1);

    await page.locator('#save-btn').click();
    await page.waitForTimeout(200);
    assert.equal(await page.locator('#cv-version-history').getAttribute('hidden'),null);

    page.once('dialog',dialog=>dialog.accept());
    await page.locator('#archive-cv-btn').click();
    await page.waitForTimeout(100);
    const dialog=page.locator('body');
    assert.ok(await dialog.textContent().then(text=>text.includes('My CV') || text.includes('Second CV') || text.includes('Renamed CV')));

    await page.reload({waitUntil:'networkidle'});
    await page.waitForSelector('#cv-document-list .cv-document');
    assert.ok((await page.locator('#cv-document-list .cv-document').count()) >= 2);
  } finally {
    await browser.close();
    server.kill();
  }
});
