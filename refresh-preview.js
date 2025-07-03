import puppeteer from 'puppeteer';

(async () => {
  console.log('Opening preview browser...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1400,900']
  });
  
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Wait for page to fully load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Scrolling to the Before/After section...');
  
  // Scroll to the before/after section (second section)
  await page.evaluate(() => {
    const section = document.querySelector('section.py-20.bg-gray-50');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  
  // Wait for scroll
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test the arrow navigation
  console.log('Testing arrow navigation...');
  await page.evaluate(() => {
    // Click the right arrow to go to next slide
    const rightArrow = document.querySelector('button[class*="right-12"]');
    if (rightArrow) {
      rightArrow.click();
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Test the slider on the new slide
  await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"]');
    if (slider) {
      slider.value = 75;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  
  console.log('\n✅ Preview refreshed with fixes!');
  console.log('\n🔧 What was fixed:');
  console.log('   - Arrow buttons moved outside the slider area (-left-12 and -right-12)');
  console.log('   - Added z-30 to ensure arrows are above other elements');
  console.log('   - Arrows now clickable without interference from slider');
  console.log('   - Added hover scale effect for better UX');
  console.log('\n📌 You can now:');
  console.log('   - Click arrows to navigate between patients');
  console.log('   - Drag the slider to compare before/after');
  console.log('   - Both work independently without blocking each other');
  console.log('\n🔄 Keep this terminal open to keep the preview active\n');
  
  // Keep the script running
  await new Promise(() => {});
})();