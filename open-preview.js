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
  
  // Wait a moment for scroll to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Demonstrate the slider functionality
  console.log('Demonstrating the slider...');
  await page.evaluate(() => {
    const slider = document.querySelector('input[type="range"]');
    if (slider) {
      // Move slider to show transformation
      slider.value = 30;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      
      setTimeout(() => {
        slider.value = 70;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
      }, 1000);
    }
  });
  
  console.log('\n✅ Preview is now open!');
  console.log('\n📌 The Before/After section features:');
  console.log('   - Overlaid images with draggable slider');
  console.log('   - Drag the white line left/right to reveal transformation');
  console.log('   - Arrow buttons to navigate between different patients');
  console.log('   - Patient information displayed at the bottom');
  console.log('\n🔄 Keep this terminal open to keep the preview active');
  console.log('   Press Ctrl+C to close the preview\n');
  
  // Keep the script running to keep browser open
  await new Promise(() => {});
})();