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


test('mobile More menu dismisses on outside click and after opening a tool', async () => {
  const { chromium } = await import('playwright');
  const port=await freePort();
  const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:390,height:844}});
    await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'networkidle'});
    await page.waitForSelector('#cv-document-list .cv-document');
    const menu=page.locator('.toolbar-menu');
    const more=menu.locator('summary');

    assert.equal(await menu.evaluate(node=>node.open),false,'More menu should start closed on mobile');
    assert.equal(await page.locator('#career-tools-btn').isVisible(),false,'mobile tools should not cover the page before More is opened');

    await more.click();
    assert.equal(await menu.evaluate(node=>node.open),true,'More control should open the menu');
    await page.locator('.brand').click();
    assert.equal(await menu.evaluate(node=>node.open),false,'outside tap should close More menu');

    await more.click();
    assert.equal(await menu.evaluate(node=>node.open),true,'More control should reopen the menu');
    await page.locator('#career-tools-btn').click();
    assert.equal(await menu.evaluate(node=>node.open),false,'choosing a tool should close More menu');
    await page.waitForFunction(()=>!document.querySelector('#career-tools-modal').hidden);
    await page.locator('[data-close-tool-modal="career-tools-modal"]').click();
  } finally {
    await browser.close();
    server.kill();
  }
});

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
      window.eStudentCVBuilderV2.surface.getState().session.application.masterProfile.careerData.identity.fullName
    );
    assert.equal(baselineName, 'Baseline Engineer');

    // Duplicate the edited original and verify the duplicate carries real content.
    await page.locator('#duplicate-cv-btn').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#cv-document-list .cv-document').count(),2);

    const duplicatedName = await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.masterProfile.careerData.identity.fullName
    );
    assert.equal(duplicatedName, 'Baseline Engineer');

    // Switch back to the original CV and verify its content remains intact.
    const originalCard = page.locator('#cv-document-list .cv-document').first();
    await originalCard.click();
    await page.waitForTimeout(100);
    const switchedName = await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.masterProfile.careerData.identity.fullName
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
    await page.locator('#cv-version-history button').filter({hasText:'View history'}).click();
    assert.ok((await page.locator('.cv-version-item').count()) >= 2);
    const versionCountBeforeNoOpSave = await page.locator('#cv-version-history .cv-version-item').count();
    await page.locator('#save-btn').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#cv-version-history .cv-version-item').count(), versionCountBeforeNoOpSave,
      'saving unchanged content should not create another version');

    const versionBeforeRestore = await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.masterProfile.careerData.identity.fullName
    );
    assert.equal(versionBeforeRestore, 'Edited Engineer');

    const restoreButtons = page.locator('.cv-version-item button');
    assert.ok((await restoreButtons.count()) >= 2);
    page.once('dialog', dialog => dialog.accept());
    await restoreButtons.nth(1).click();
    await page.waitForTimeout(150);
    const restoredName = await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.masterProfile.careerData.identity.fullName
    );
    assert.equal(restoredName, 'Baseline Engineer');
    assert.ok((await page.locator('#cv-version-history').textContent()).includes('Version History'));

    // Create a separate CV, then archive it to verify the active-document handoff.
    page.once('dialog',dialog=>dialog.accept('Second CV'));
    await page.locator('#new-cv-btn').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#cv-document-list .cv-document').count(),3);

    page.once('dialog',dialog=>dialog.accept());
    await page.locator('#archive-cv-btn').click();
    await page.waitForTimeout(100);
    assert.ok(await page.locator('.cv-document.archived').count() >= 1);
    assert.equal(await page.locator('#cv-document-list .cv-document').count(),3);

    await page.reload({waitUntil:'networkidle'});
    await page.waitForSelector('#cv-document-list .cv-document');
    assert.ok((await page.locator('#cv-document-list .cv-document').count()) >= 2);
  } finally {
    await browser.close();
    server.kill();
  }
});
