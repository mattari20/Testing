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
    await page.goto('http://127.0.0.1:'+port+'/builder.html',{waitUntil:'networkidle'});
    await page.waitForSelector('#cv-document-list .cv-document');
    await page.waitForFunction(() => window.v2ProductionReady === true);
    assert.ok(await page.locator('[data-v2-editor-form] input, [data-v2-editor-form] textarea, [data-v2-editor-form] select').count() > 0,
      'editor form fields should mount instead of remaining blank');
    assert.ok(await page.locator('[data-v2-editor-preview-root] [data-v2-template-root]').count() > 0,
      'CV preview template should mount instead of remaining blank');
    assert.match(await page.locator('#app-status').textContent(), /V2 editor ready/i,
      'startup status should confirm the editor is ready');
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
    assert.equal(await menu.locator('.toolbar-secondary').evaluate(node=>getComputedStyle(node).position),'static',
      'open mobile More panel must stay in document flow instead of covering editor controls');

    // A control below the menu must remain clickable and close the menu.
    await page.locator('#mobile-preview-tab').click();
    assert.equal(await menu.evaluate(node=>node.open),false,'opening Preview should dismiss More menu');
    assert.equal(await page.locator('#v2-editor').getAttribute('data-mobile-view'),'preview',
      'Preview tab should still respond while More menu was open');

    // Save once so the Version History section is available, then verify
    // it remains reachable after opening More on a small viewport.
    await page.locator('#save-btn').click();
    await page.waitForSelector('#cv-version-history .cv-version-history-head');
    await more.click();
    assert.equal(await menu.evaluate(node=>node.open),true,'More control should reopen the menu');
    await page.locator('#cv-version-history .cv-version-history-head button').click();
    assert.equal(await menu.evaluate(node=>node.open),false,'opening Version History should dismiss More');
    assert.ok((await page.locator('#cv-version-history .cv-version-item').count()) > 0,
      'Version History should expand and show saved versions');

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
    const fullNameInput = page.locator('[data-v2-editor-identity-field="fullName"]').first();
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


test('adding editor items preserves the current viewport without jumping to the section top', async () => {
  const { chromium } = await import('playwright');
  const port = await freePort();
  const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {stdio:'ignore'});
  const browser = await chromium.launch({headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844}});
    const pageErrors=[];
    page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
    await page.goto('http://127.0.0.1:' + port + '/builder.html?template=t01-modern-minimalist-cv-design_modern', {waitUntil:'networkidle'});
    await page.waitForFunction(() => window.v2ProductionReady === true);

    await page.evaluate(() => {
      window.__editorRootClickCount=0;
      document.querySelector('[data-v2-editor-form]')?.addEventListener('click',()=>{window.__editorRootClickCount+=1;},true);
    });
    const checkViewportPreserved = async (button, countLocator, expectedCount, label) => {
      await button.scrollIntoViewIfNeeded();
      const before = await page.evaluate(() => ({x:window.scrollX,y:window.scrollY}));
      const buttonTop = await button.evaluate(node => node.getBoundingClientRect().top);
      await button.click();
      try {
        await page.waitForFunction(({selector,count}) => document.querySelectorAll(selector).length === count,
          {selector:countLocator, count:expectedCount});
      } catch (error) {
        const diagnostic=await page.evaluate(({selector})=>{
          const sections=window.eStudentCVBuilderV2?.surface?.getState?.().session?.application?.masterProfile?.careerData?.sections||[];
          const skill=sections.find(item=>item.type==='skills');
          const button=document.querySelector('[data-v2-editor-section="skills"] .editor-add-entry');
          const session=window.eStudentCVBuilderV2?.surface?.getState?.().session;
          const form=document.querySelector('[data-v2-editor-form]');
          return {formContainsButton:Boolean(form&&button&&form.contains(button)),closestForm:Boolean(button?.closest('[data-v2-editor-form]')),rootClickCount:window.__editorRootClickCount,domCount:document.querySelectorAll(selector).length,skillEntryCount:skill?.entries?.length,skillRepeatable:skill?.repeatable,status:document.querySelector('#app-status')?.textContent,buttonCount:document.querySelectorAll('[data-v2-editor-section="skills"] .editor-add-entry').length,buttonHtml:button?.outerHTML,lastCommand:session?.lastCommand,sessionRevision:session?.application?.masterProfile?.revision};
        },{selector:countLocator});
        throw new Error(label+' failed to insert expected content: '+JSON.stringify(diagnostic)+'; pageErrors='+JSON.stringify(pageErrors)+'; original='+String(error));
      }
      await page.waitForTimeout(100);
      const after = await page.evaluate(() => ({x:window.scrollX,y:window.scrollY}));
      const afterButton = page.locator(button).first();
      assert.ok(Math.abs(after.x-before.x) <= 1 && Math.abs(after.y-before.y) <= 1,
        label + ' must not change page scroll (before=' + JSON.stringify(before) + ', after=' + JSON.stringify(after) + ')');
      const newButtonTop = await button.evaluate(node => node.getBoundingClientRect().top);
      assert.ok(Math.abs(newButtonTop-buttonTop) <= 2,
        label + ' action must stay at the same viewport position');
    };

    const skillButton = page.locator('[data-v2-editor-section="skills"] .editor-add-entry');
    const skillsBefore = await page.locator('[data-v2-editor-section="skills"] [data-v2-editor-entry]').count();
    await checkViewportPreserved(skillButton, '[data-v2-editor-section="skills"] [data-v2-editor-entry]', skillsBefore + 1, 'Add Skill');

    const languageButton = page.locator('[data-v2-editor-section="languages"] .editor-add-entry');
    const languagesBefore = await page.locator('[data-v2-editor-section="languages"] [data-v2-editor-entry]').count();
    await checkViewportPreserved(languageButton, '[data-v2-editor-section="languages"] [data-v2-editor-entry]', languagesBefore + 1, 'Add Language');

    const addSection = page.locator('.editor-add-section');
    const sectionsBefore = await page.locator('[data-v2-editor-section]').count();
    await checkViewportPreserved(addSection, '[data-v2-editor-section]', sectionsBefore + 1, 'Add Custom Section');

    const customSection = page.locator('.editor-section-card:has(.editor-custom-title)').last();
    const addField = customSection.locator('.editor-add-field');
    await addField.scrollIntoViewIfNeeded();
    const fieldScrollBefore = await page.evaluate(() => ({x:window.scrollX,y:window.scrollY}));
    const fieldButtonTop = await addField.evaluate(node => node.getBoundingClientRect().top);
    await addField.click();
    await page.waitForSelector('.editor-section-card:has(.editor-custom-title) .editor-field-card');
    await page.waitForTimeout(100);
    const fieldScrollAfter = await page.evaluate(() => ({x:window.scrollX,y:window.scrollY}));
    const fieldButtonAfter = customSection.locator('.editor-add-field');
    const fieldButtonTopAfter = await fieldButtonAfter.evaluate(node => node.getBoundingClientRect().top);
    assert.ok(Math.abs(fieldScrollAfter.y-fieldScrollBefore.y) <= 1 && Math.abs(fieldScrollAfter.x-fieldScrollBefore.x) <= 1,
      'Add Field must preserve the page scroll position');
    assert.ok(Math.abs(fieldButtonTopAfter-fieldButtonTop) <= 2,
      'Add Field must keep the action at the same viewport position');
  } finally {
    await browser.close();
    server.kill();
  }
});
