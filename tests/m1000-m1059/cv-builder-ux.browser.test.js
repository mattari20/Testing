import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';

async function freePort(){const s=createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;s.close();await once(s,'close');return p;}

test('production builder exposes page navigation, zoom, variants and accessibility controls', async()=>{
  const {chromium}=await import('playwright');
  const port=await freePort();
  const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    await page.goto('http://127.0.0.1:'+port+'/?template=t01-modern-minimalist-cv-design_modern',{waitUntil:'networkidle'});
    await page.waitForSelector('#v2-editor');
    assert.equal(await page.locator('#preview-prev').count(),1);
    assert.equal(await page.locator('#preview-next').count(),1);
    assert.equal(await page.locator('#zoom-in').count(),1);
    assert.equal(await page.locator('#zoom-out').count(),1);
    assert.equal(await page.locator('#variant-select').count(),1);
    assert.equal(await page.locator('[data-editor-announcer]').count(),1);
    assert.equal(await page.locator('[data-v2-editor-photo]').count(),1);
    assert.equal(await page.locator('[data-v2-editor-photo-input]').count(),1);
    await page.locator('[data-v2-editor-photo-input]').setInputFiles({
      name:'profile.png',
      mimeType:'image/png',
      buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64')
    });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.editor-photo-preview').count(),1);

    assert.equal(await page.locator('[data-v2-editor-identity-field="fullName"]').count(),1);
    assert.match(await page.locator('[data-v2-editor-identity-wrapper="fullName"]').innerText(),/Full Name/);
    assert.doesNotMatch(await page.locator('[data-v2-editor-section="summary"]').innerText(),/fullName|jobTitle/);


    await page.locator('#zoom-in').click();
    assert.equal(await page.locator('[data-v2-editor-preview-root]').getAttribute('data-preview-zoom'),'1.1');
    await page.locator('#zoom-reset').click();
    await page.evaluate(() => localStorage.setItem('estudent_cv_builder_v2_2027','{broken-json'));
    await page.reload({waitUntil:'networkidle'});
    await page.waitForSelector('#v2-editor');
    assert.doesNotMatch(await page.locator('#app-status').innerText(),/startup error/i);
    assert.equal(await page.locator('[data-v2-editor-preview-root]').getAttribute('data-preview-zoom'),'1');

    await page.locator('#variant-select').selectOption('academic');
    await page.waitForTimeout(100);
    const state=await page.evaluate(()=>window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.configuration.presentation?.variant);
    assert.equal(state,'academic');

    const pageCount=await page.locator('[data-page-number]').count();
    assert.ok(pageCount>=1);
    await page.locator('#preview-next').click();
    const active=await page.locator('[data-page-number][data-page-active="true"]').count();
    assert.equal(active,1);
  }finally{await browser.close();server.kill();}
});
