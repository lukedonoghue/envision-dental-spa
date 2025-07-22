import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1400,900']
  });
  
  const page = await browser.newPage();
  
  // Navigate to the local development server
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Wait for the page to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Scroll to the Before/After Gallery section
  await page.evaluate(() => {
    const gallery = document.querySelector('h2.text-3xl.md\\:text-4xl.lg\\:text-5xl.font-bold.text-gray-900.mb-4');
    if (gallery && gallery.textContent.includes('Real Transformations')) {
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  
  // Wait to see the section
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Optionally interact with the slider
  await page.evaluate(() => {
    // Find the first slider and move it
    const firstSlider = document.querySelector('input[type="range"]');
    if (firstSlider) {
      firstSlider.value = 75;
      firstSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  
  console.log('Preview opened and scrolled to Before/After Gallery section');
  console.log('The gallery features:');
  console.log('- Draggable sliders on each image');
  console.log('- Category filters (All, Veneers, Crowns, Whitening, Full Makeover)');
  console.log('- Click any image for full-screen view');
  console.log('- Smooth animations and transitions');
  
  // Keep browser open
})();