const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Start dev server in background
  console.log('Navigating to home page...');
  await page.goto('http://localhost:3003');
  await page.screenshot({ path: 'screenshot_home.png', fullPage: true });

  console.log('Navigating to About page...');
  await page.goto('http://localhost:3003/#/about');
  await page.screenshot({ path: 'screenshot_about.png', fullPage: true });

  console.log('Navigating to Sources page...');
  await page.goto('http://localhost:3003/#/sources');
  await page.screenshot({ path: 'screenshot_sources.png', fullPage: true });

  await browser.close();
  console.log('Verification screenshots generated.');
})();
