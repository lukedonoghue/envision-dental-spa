const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the site
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Take a full page screenshot first
    await page.screenshot({ path: 'full-page-debug.png', fullPage: true });
    console.log('Full page screenshot saved as full-page-debug.png');
    
    // Get the footer element and its computed styles
    const footerAnalysis = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return { error: 'Footer element not found' };
      
      const computedStyle = window.getComputedStyle(footer);
      const rect = footer.getBoundingClientRect();
      
      return {
        footerStyles: {
          paddingTop: computedStyle.paddingTop,
          paddingBottom: computedStyle.paddingBottom,
          marginTop: computedStyle.marginTop,
          marginBottom: computedStyle.marginBottom,
          height: computedStyle.height,
          backgroundColor: computedStyle.backgroundColor,
          display: computedStyle.display,
          position: computedStyle.position,
          classes: footer.className
        },
        footerRect: {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          width: rect.width
        },
        footerHTML: footer.outerHTML.substring(0, 500) + '...',
        bodyHeight: document.body.scrollHeight,
        windowHeight: window.innerHeight
      };
    });
    
    console.log('Footer Analysis:', JSON.stringify(footerAnalysis, null, 2));
    
    // Check for floating button
    const floatingButtonAnalysis = await page.evaluate(() => {
      const floatingButtons = document.querySelectorAll('[class*="fixed"], [class*="floating"], [style*="position: fixed"]');
      const results = [];
      
      floatingButtons.forEach((btn, index) => {
        const computedStyle = window.getComputedStyle(btn);
        const rect = btn.getBoundingClientRect();
        
        results.push({
          index,
          element: btn.tagName,
          classes: btn.className,
          styles: {
            position: computedStyle.position,
            bottom: computedStyle.bottom,
            right: computedStyle.right,
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            zIndex: computedStyle.zIndex,
            visibility: computedStyle.visibility,
            opacity: computedStyle.opacity
          },
          rect: {
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            height: rect.height
          },
          innerHTML: btn.innerHTML.substring(0, 100)
        });
      });
      
      return results;
    });
    
    console.log('Floating Button Analysis:', JSON.stringify(floatingButtonAnalysis, null, 2));
    
    // Scroll to footer and take focused screenshot
    await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'footer-focused-debug.png', fullPage: false });
    console.log('Footer focused screenshot saved as footer-focused-debug.png');
    
    // Get all elements in the footer area with their spacing
    const footerChildrenAnalysis = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return { error: 'Footer not found' };
      
      const children = Array.from(footer.children);
      const childrenData = children.map((child, index) => {
        const computedStyle = window.getComputedStyle(child);
        const rect = child.getBoundingClientRect();
        
        return {
          index,
          tagName: child.tagName,
          className: child.className,
          styles: {
            margin: computedStyle.margin,
            padding: computedStyle.padding,
            height: computedStyle.height,
            backgroundColor: computedStyle.backgroundColor,
            display: computedStyle.display
          },
          rect: {
            height: rect.height,
            top: rect.top,
            bottom: rect.bottom
          }
        };
      });
      
      return {
        footerChildren: childrenData,
        footerInnerHTML: footer.innerHTML.substring(0, 1000)
      };
    });
    
    console.log('Footer Children Analysis:', JSON.stringify(footerChildrenAnalysis, null, 2));
    
    // Check for any elements with excessive height or margins after the footer
    const bodyEndAnalysis = await page.evaluate(() => {
      const body = document.body;
      const bodyRect = body.getBoundingClientRect();
      const bodyStyle = window.getComputedStyle(body);
      
      // Find all elements that might be contributing to extra space
      const allElements = Array.from(document.querySelectorAll('*'));
      const suspiciousElements = allElements.filter(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        
        // Look for elements with large margins, padding, or height
        const hasLargeMargin = parseInt(style.marginTop) > 50 || parseInt(style.marginBottom) > 50;
        const hasLargePadding = parseInt(style.paddingTop) > 50 || parseInt(style.paddingBottom) > 50;
        const hasLargeHeight = rect.height > 200;
        
        return hasLargeMargin || hasLargePadding || hasLargeHeight;
      });
      
      return {
        bodyHeight: bodyRect.height,
        bodyScrollHeight: body.scrollHeight,
        bodyStyles: {
          margin: bodyStyle.margin,
          padding: bodyStyle.padding,
          height: bodyStyle.height,
          backgroundColor: bodyStyle.backgroundColor
        },
        suspiciousElements: suspiciousElements.slice(0, 10).map(el => ({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          rect: el.getBoundingClientRect(),
          styles: {
            margin: window.getComputedStyle(el).margin,
            padding: window.getComputedStyle(el).padding,
            height: window.getComputedStyle(el).height,
            backgroundColor: window.getComputedStyle(el).backgroundColor
          }
        }))
      };
    });
    
    console.log('Body End Analysis:', JSON.stringify(bodyEndAnalysis, null, 2));
    
  } catch (error) {
    console.error('Error during analysis:', error);
  }
  
  await browser.close();
})();