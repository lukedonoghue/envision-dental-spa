import puppeteer from 'puppeteer';

async function investigateChatWidget() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  try {
    const page = await browser.newPage();
    
    console.log('Navigating to http://localhost:3000/...');
    await page.goto('http://localhost:3000/', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait for the page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scroll to footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Look for the chat widget/overlay
    const chatWidgetAnalysis = await page.evaluate(() => {
      // Look for common chat widget selectors
      const possibleSelectors = [
        'iframe[src*="chat"]',
        'div[id*="chat"]',
        'div[class*="chat"]',
        'div[id*="widget"]',
        'div[class*="widget"]',
        'div[id*="bot"]',
        'div[class*="bot"]',
        'div[style*="position: fixed"]',
        'div[style*="z-index"]',
        '[data-testid*="chat"]',
        '[data-widget]',
        '.floating',
        '.sticky',
        '.overlay'
      ];

      const foundElements = [];
      
      possibleSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);
            
            foundElements.push({
              selector,
              tagName: element.tagName,
              id: element.id,
              className: element.className,
              textContent: element.textContent?.trim().substring(0, 100) || '',
              dimensions: {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
                bottom: rect.bottom,
                right: rect.right
              },
              styles: {
                position: styles.position,
                zIndex: styles.zIndex,
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                bottom: styles.bottom,
                right: styles.right,
                left: styles.left,
                top: styles.top,
                backgroundColor: styles.backgroundColor,
                boxShadow: styles.boxShadow
              },
              innerHTML: element.innerHTML.substring(0, 200) + '...'
            });
          });
        } catch (e) {
          // Ignore invalid selectors
        }
      });

      // Also look for elements that might be floating over footer
      const allElements = document.querySelectorAll('*');
      const floatingElements = [];
      
      allElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        if (styles.position === 'fixed' || styles.position === 'sticky') {
          floatingElements.push({
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            textContent: element.textContent?.trim().substring(0, 100) || '',
            dimensions: {
              width: rect.width,
              height: rect.height,
              top: rect.top,
              left: rect.left,
              bottom: rect.bottom,
              right: rect.right
            },
            styles: {
              position: styles.position,
              zIndex: styles.zIndex,
              display: styles.display,
              visibility: styles.visibility,
              opacity: styles.opacity,
              bottom: styles.bottom,
              right: styles.right,
              left: styles.left,
              top: styles.top,
              backgroundColor: styles.backgroundColor,
              boxShadow: styles.boxShadow
            }
          });
        }
      });

      return {
        foundElements,
        floatingElements
      };
    });

    console.log('\n=== CHAT WIDGET ANALYSIS ===');
    console.log('Found elements:', JSON.stringify(chatWidgetAnalysis.foundElements, null, 2));
    console.log('\n=== FLOATING ELEMENTS ===');
    console.log('Floating elements:', JSON.stringify(chatWidgetAnalysis.floatingElements, null, 2));

    // Look for specific text content that might indicate a chat widget
    const textAnalysis = await page.evaluate(() => {
      const textElements = [];
      const searchTexts = [
        'What do you want to change',
        'chat',
        'help',
        'support',
        'message',
        'talk',
        'contact'
      ];

      searchTexts.forEach(searchText => {
        const xpath = `//*[contains(text(), '${searchText}')]`;
        const result = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        
        for (let i = 0; i < result.snapshotLength; i++) {
          const element = result.snapshotItem(i);
          const rect = element.getBoundingClientRect();
          const styles = window.getComputedStyle(element);
          
          textElements.push({
            searchText,
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            textContent: element.textContent?.trim(),
            dimensions: {
              width: rect.width,
              height: rect.height,
              top: rect.top,
              left: rect.left,
              bottom: rect.bottom,
              right: rect.right
            },
            styles: {
              position: styles.position,
              zIndex: styles.zIndex,
              display: styles.display,
              visibility: styles.visibility,
              opacity: styles.opacity
            }
          });
        }
      });

      return textElements;
    });

    console.log('\n=== TEXT ANALYSIS ===');
    console.log('Text elements:', JSON.stringify(textAnalysis, null, 2));

    // Take a screenshot highlighting the problematic area
    await page.evaluate(() => {
      // Add a red border to all fixed/sticky elements
      const fixedElements = document.querySelectorAll('*');
      fixedElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        if (styles.position === 'fixed' || styles.position === 'sticky') {
          element.style.border = '3px solid red';
        }
      });
    });

    await page.screenshot({ 
      path: 'footer-with-overlay-highlighted.png', 
      fullPage: true 
    });
    console.log('\nScreenshot with highlighted overlays saved: footer-with-overlay-highlighted.png');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

investigateChatWidget();