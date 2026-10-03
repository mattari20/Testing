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

    // Establish a real content baseline and a version that can be restored.
    const fullNameInput = page.locator('[data-v2-editor-identity-wrapper="fullName"] input').first();
    await fullNameInput.fill('Baseline Engineer');
    await fullNameInput.blur();
    await page.locator('#save-btn').click();
    await page.waitForTimeout(150);
    assert.ok((await page.locator('#cv-version-history').textContent()).includes('Version History'));

    const baselineName = await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.careerData.identity.fullName
    );
    assert.equal(baselineName, 'Baseline Engineer');

    page.once('dialog',dialog=>dialog.accept('Second CV'));
    await page.locator('#new-cv-btn').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#cv-document-list .cv-document').count(),2);

    await page.locator('#duplicate-cv-btn').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#cv-document-list .cv-document').count(),3);

    // Duplicate must carry the actual edited CV content, not just the title.
    const duplicatedName = await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.careerData.identity.fullName
    );
    assert.equal(duplicatedName, 'Baseline Engineer');

    // Switch back to the original CV and verify its content remains intact.
    const originalCard = page.locator('#cv-document-list .cv-document').first();
    await originalCard.click();
    await page.waitForTimeout(100);
    const switchedName = await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.careerData.identity.fullName
    );
    assert.equal(switchedName, 'Baseline Engineer');

    page.once('dialog',dialog=>dialog.accept('Renamed CV'));
    await page.locator('#rename-cv-btn').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.cv-document-title', {hasText:'Renamed CV'}).count(),1);

    // Change real CV content, save a second version, then restore the first version.
    await fullNameInput.fill('Edited Engineer');
    await fullNameInput.blur();
    await page.locator('#save-btn').click();
    await page.waitForTimeout(200);
    assert.equal(await page.locator('#cv-version-history').getAttribute('hidden'),null);
    assert.ok((await page.locator('.cv-version-item').count()) >= 2);

    const versionBeforeRestore = await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.careerData.identity.fullName
    );
    assert.equal(versionBeforeRestore, 'Edited Engineer');

    const restoreButtons = page.locator('.cv-version-item button');
    assert.ok((await restoreButtons.count()) >= 2);
    await restoreButtons.nth(1).click();
    await page.waitForTimeout(150);
    const restoredName = await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.careerData.identity.fullName
    );
    assert.equal(restoredName, 'Baseline Engineer');

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
