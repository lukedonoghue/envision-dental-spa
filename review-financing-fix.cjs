const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  const page = await browser.newPage();
  
  console.log('Loading page...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  
  // Scroll to bottom first
  console.log('Scrolling to bottom of page...');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find the financing section
  const financingSection = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const financingHeading = headings.find(h => h.textContent.includes('Making Your Dream Smile Affordable'));
    if (financingHeading) {
      const section = financingHeading.closest('section');
      if (section) {
        return {
          top: section.offsetTop,
          height: section.offsetHeight
        };
      }
    }
    return null;
  });
  
  if (financingSection) {
    console.log(`Financing section found at position: ${financingSection.top}px, height: ${financingSection.height}px`);
    
    // Slowly scroll up to the financing section
    console.log('Scrolling up to financing section...');
    await page.evaluate((targetTop) => {
      const currentScroll = window.pageYOffset;
      const scrollToPosition = targetTop - 100; // 100px offset from top
      const distance = currentScroll - scrollToPosition;
      const duration = 3000; // 3 seconds
      const start = Date.now();
      
      const scrollAnimation = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        
        window.scrollTo(0, currentScroll - (distance * easeProgress));
        
        if (progress < 1) {
          requestAnimationFrame(scrollAnimation);
        }
      };
      
      requestAnimationFrame(scrollAnimation);
    }, financingSection.top);
    
    await page.waitForTimeout(3500);
    
    // Take a screenshot of the financing section
    console.log('Taking screenshot of financing section...');
    const section = await page.$('section:has(h2:has-text("Making Your Dream Smile Affordable"))');
    if (section) {
      await section.screenshot({ path: 'financing-section-fixed.png' });
      console.log('Screenshot saved as financing-section-fixed.png');
    }
    
    // Get final measurements
    const finalMeasurements = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const financingHeading = headings.find(h => h.textContent.includes('Making Your Dream Smile Affordable'));
      if (financingHeading) {
        const section = financingHeading.closest('section');
        const prevSection = section.previousElementSibling;
        const nextSection = section.nextElementSibling;
        
        return {
          sectionHeight: section.offsetHeight,
          sectionPaddingTop: window.getComputedStyle(section).paddingTop,
          sectionPaddingBottom: window.getComputedStyle(section).paddingBottom,
          gapToPrevious: prevSection ? (section.offsetTop - (prevSection.offsetTop + prevSection.offsetHeight)) : 'N/A',
          gapToNext: nextSection ? (nextSection.offsetTop - (section.offsetTop + section.offsetHeight)) : 'N/A'
        };
      }
      return null;
    });
    
    console.log('\nFinal measurements:', JSON.stringify(finalMeasurements, null, 2));
  }
  
  console.log('\nKeeping browser open for visual inspection...');
  console.log('Press Ctrl+C to close when done reviewing.');
  
  // Keep browser open for manual inspection
  await new Promise(() => {});
})();