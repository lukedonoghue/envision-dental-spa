import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: false }); // Launch with UI
const page = await browser.newPage();

try {
  console.log('Navigating to http://localhost:3000...');
  const response = await page.goto('http://localhost:3000', { 
    waitUntil: 'domcontentloaded',
    timeout: 30000 
  });
  
  console.log('Response status:', response.status());
  console.log('Response URL:', response.url());
  
  // Wait a bit for any JavaScript to load
  await page.waitForTimeout(3000);
  
  // Get page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check if body has content
  const bodyContent = await page.evaluate(() => document.body.innerHTML.substring(0, 200));
  console.log('Body content preview:', bodyContent);
  
  // Take screenshot
  await page.screenshot({ path: 'page-screenshot.png', fullPage: true });
  console.log('Full page screenshot saved as page-screenshot.png');
  
  await page.screenshot({ path: 'viewport-screenshot.png' });
  console.log('Viewport screenshot saved as viewport-screenshot.png');
  
} catch (error) {
  console.error('Error occurred:', error);
}

await browser.close();
console.log('Done!');