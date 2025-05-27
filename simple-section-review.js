import { chromium } from 'playwright';

async function reviewSections() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(2000);
  
  // Scroll through page and take screenshots at intervals
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = 1080;
  const scrollSteps = Math.ceil(pageHeight / (viewportHeight * 0.8));
  
  for (let i = 0; i < scrollSteps; i++) {
    const scrollY = i * viewportHeight * 0.8;
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: `page-section-${i + 1}.png`,
      fullPage: false 
    });
    
    console.log(`Screenshot ${i + 1}/${scrollSteps} taken at scroll position ${scrollY}`);
  }
  
  console.log('Review complete. Check page-section-*.png files');
  await browser.close();
}

reviewSections().catch(console.error);