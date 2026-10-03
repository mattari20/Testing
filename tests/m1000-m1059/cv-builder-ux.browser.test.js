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
    assert.equal(await page.locator('[data-v2-editor-photo-remove="profile-photo"]').count(),1);

    // Verify real identity editing reaches the live application state.
    const fullName = page.locator('[data-v2-editor-identity-field="fullName"]');
    await fullName.fill('Ali Akbar');
    await fullName.blur();
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(() =>
      window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.careerData.identity.fullName
    ), 'Ali Akbar');

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

    // Verify section visibility controls persist through a real UI command.
    const summarySection = page.locator('[data-v2-editor-section="summary"]');
    await summarySection.locator('[data-v2-editor-command="set-visibility"]').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('[data-v2-editor-section="summary"]').getAttribute('data-v2-editor-section-hidden'), 'true');

    await page.locator('[data-v2-editor-section="summary"] [data-v2-editor-command="set-visibility"]').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('[data-v2-editor-section="summary"]').getAttribute('data-v2-editor-section-hidden'), 'false');

    // Duplicate an experience entry and verify the editor rerenders the new entry.
    const experienceEntriesBefore = await page.locator('[data-v2-editor-section="experience"] [data-v2-editor-entry]').count();
    await page.locator('[data-v2-editor-section="experience"] [data-v2-editor-command="duplicate-entry"]').first().click();
    await page.waitForTimeout(100);
    assert.equal(
      await page.locator('[data-v2-editor-section="experience"] [data-v2-editor-entry]').count(),
      experienceEntriesBefore + 1
    );

    // Add a field and a section through the actual editor controls.
    const summaryFieldsBefore = await page.locator('[data-v2-editor-section="summary"] [data-v2-editor-field-wrapper]').count();
    await page.locator('[data-v2-editor-section="summary"] [data-v2-editor-command="add-field"]').click();
    await page.waitForTimeout(100);
    assert.equal(
      await page.locator('[data-v2-editor-section="summary"] [data-v2-editor-field-wrapper]').count(),
      summaryFieldsBefore + 1
    );

    const sectionsBefore = await page.locator('[data-v2-editor-section]').count();
    await page.locator('[data-v2-editor-command="add-section"]').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('[data-v2-editor-section]').count(), sectionsBefore + 1);

    // Verify uploaded photo can be removed from the same live editor state.
    await page.locator('[data-v2-editor-photo-remove="profile-photo"]').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.editor-photo-preview').count(),0);
    assert.equal(await page.locator('[data-v2-editor-photo-remove="profile-photo"]').count(),0);

    await page.locator('#variant-select').selectOption('academic');
    await page.waitForTimeout(100);
    const state=await page.evaluate(()=>window.eStudentCVBuilderV2.surface.getState().session.application.targetedCV.configuration.presentation?.variant);
    assert.equal(state,'academic');

    const pageCount=await page.locator('[data-page-number]').count();
    assert.ok(pageCount>=1);
    await page.locator('#preview-next').click();

    // Real mobile editor/preview view switching and fit-to-width behavior.
    await page.setViewportSize({width:390,height:844});
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#mobile-edit-tab').isVisible(),true);
    assert.equal(await page.locator('#mobile-preview-tab').isVisible(),true);
    assert.equal(await page.locator('#v2-editor').getAttribute('data-mobile-view'),'edit');
    assert.notEqual(await page.locator('#v2-editor > section').nth(0).evaluate(el=>getComputedStyle(el).display),'none');
    assert.equal(await page.locator('#v2-editor > section').nth(1).evaluate(el=>getComputedStyle(el).display),'none');

    await page.locator('#mobile-preview-tab').click();
    await page.waitForTimeout(150);
    assert.equal(await page.locator('#v2-editor').getAttribute('data-mobile-view'),'preview');
    assert.equal(await page.locator('#v2-editor > section').nth(0).evaluate(el=>getComputedStyle(el).display),'none');
    assert.notEqual(await page.locator('#v2-editor > section').nth(1).evaluate(el=>getComputedStyle(el).display),'none');
    const mobilePreview = await page.evaluate(() => {
      const root=document.querySelector('[data-v2-editor-preview-root]');
      const page=document.querySelector('[data-v2-template-root]');
      return {rootWidth:root?.getBoundingClientRect().width || 0,pageWidth:page?.getBoundingClientRect().width || 0,overflow:root?.scrollWidth || 0};
    });
    assert.ok(mobilePreview.rootWidth>0);
    assert.ok(mobilePreview.pageWidth>0);
    assert.ok(mobilePreview.pageWidth <= mobilePreview.rootWidth + 2);

    await page.locator('#mobile-edit-tab').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('#v2-editor').getAttribute('data-mobile-view'),'edit');
    const active=await page.locator('[data-page-number][data-page-active="true"]').count();
    assert.equal(active,1);
  }finally{await browser.close();server.kill();}
});
