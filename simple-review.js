import { chromium } from 'playwright';

async function reviewPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  await page.goto('http://localhost:3001');
  
  // Take a full page screenshot
  await page.screenshot({ 
    path: 'page-review.png',
    fullPage: true 
  });
  
  console.log('Screenshot saved as page-review.png');
  
  await browser.close();
}

reviewPage().catch(console.error);