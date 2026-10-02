import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

test('resume intelligence product renders ATS, health, job match and skill evidence', async () => {
  const server = spawn('python3',['-m','http.server','4176'],{stdio:'ignore'});
  let browser=null;
  try {
    await delay(500);
    browser = await chromium.launch({headless:true});
    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:4176/index.html', {waitUntil:'networkidle'});
    await page.locator('#cv-intelligence-job').fill('communication problem solving microsoft office');
    await page.locator('[data-cv-intelligence-product] button').click();
    await page.locator('.cv-intelligence-results').waitFor({state:'visible'});
    const text = await page.locator('.cv-intelligence-results').innerText();
    assert.match(text,/ATS Readiness/);
    assert.match(text,/Job Match/);
    assert.match(text,/Skill \/ Keyword Evidence/);
    assert.match(text,/Resume Health/);
    assert.match(text,/100/);
  } finally {
    await browser?.close();
    server.kill();
  }
});
