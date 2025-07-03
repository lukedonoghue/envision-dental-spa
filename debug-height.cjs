const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Find elements with unusual heights
    const heightAnalysis = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const problematicElements = [];
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        
        // Flag elements with heights > 1000px or unusual margins/padding
        if (rect.height > 1000 || 
            parseInt(style.marginTop) > 100 || 
            parseInt(style.marginBottom) > 100 ||
            parseInt(style.paddingTop) > 100 ||
            parseInt(style.paddingBottom) > 100) {
          
          problematicElements.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            rect: {
              height: rect.height,
              top: rect.top,
              bottom: rect.bottom
            },
            styles: {
              height: style.height,
              marginTop: style.marginTop,
              marginBottom: style.marginBottom,
              paddingTop: style.paddingTop,
              paddingBottom: style.paddingBottom,
              position: style.position
            }
          });
        }
      });
      
      return {
        totalBodyHeight: document.body.scrollHeight,
        totalDocumentHeight: document.documentElement.scrollHeight,
        problematicElements: problematicElements.slice(0, 20)
      };
    });
    
    console.log('Height Analysis:', JSON.stringify(heightAnalysis, null, 2));
    
    // Check floating button visibility
    const floatingButtonCheck = await page.evaluate(() => {
      const floatingBar = document.querySelector('.floating-trust-bar');
      if (!floatingBar) return { error: 'Floating bar not found' };
      
      const rect = floatingBar.getBoundingClientRect();
      const style = window.getComputedStyle(floatingBar);
      
      return {
        isVisible: rect.width > 0 && rect.height > 0,
        computedStyle: {
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          background: style.background,
          backgroundColor: style.backgroundColor,
          zIndex: style.zIndex,
          position: style.position,
          bottom: style.bottom,
          left: style.left,
          transform: style.transform
        },
        rect: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right
        }
      };
    });
    
    console.log('Floating Button Check:', JSON.stringify(floatingButtonCheck, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  await browser.close();
})();