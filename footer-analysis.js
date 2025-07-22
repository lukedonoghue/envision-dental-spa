import puppeteer from 'puppeteer';

async function analyzeFooter() {
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

    // Analyze the footer structure in detail
    const footerAnalysis = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return null;

      const footerRect = footer.getBoundingClientRect();
      const footerStyles = window.getComputedStyle(footer);
      
      // Get all direct children of footer
      const children = Array.from(footer.children);
      const childrenAnalysis = children.map((child, index) => {
        const childRect = child.getBoundingClientRect();
        const childStyles = window.getComputedStyle(child);
        
        return {
          index,
          tagName: child.tagName,
          className: child.className,
          dimensions: {
            width: childRect.width,
            height: childRect.height,
            top: childRect.top,
            left: childRect.left
          },
          styles: {
            display: childStyles.display,
            padding: childStyles.padding,
            margin: childStyles.margin,
            backgroundColor: childStyles.backgroundColor,
            visibility: childStyles.visibility,
            opacity: childStyles.opacity
          },
          textContent: child.textContent.trim().substring(0, 100) + '...',
          isEmpty: child.textContent.trim() === ''
        };
      });

      // Check for grid layout issues
      const gridContainer = footer.querySelector('.grid');
      let gridAnalysis = null;
      
      if (gridContainer) {
        const gridRect = gridContainer.getBoundingClientRect();
        const gridStyles = window.getComputedStyle(gridContainer);
        const gridChildren = Array.from(gridContainer.children);
        
        gridAnalysis = {
          containerDimensions: {
            width: gridRect.width,
            height: gridRect.height
          },
          containerStyles: {
            display: gridStyles.display,
            gridTemplateColumns: gridStyles.gridTemplateColumns,
            gap: gridStyles.gap,
            padding: gridStyles.padding,
            margin: gridStyles.margin
          },
          childrenCount: gridChildren.length,
          childrenAnalysis: gridChildren.map((child, index) => {
            const childRect = child.getBoundingClientRect();
            const childStyles = window.getComputedStyle(child);
            
            return {
              index,
              dimensions: {
                width: childRect.width,
                height: childRect.height,
                top: childRect.top,
                left: childRect.left
              },
              styles: {
                gridColumn: childStyles.gridColumn,
                gridRow: childStyles.gridRow,
                display: childStyles.display,
                visibility: childStyles.visibility,
                opacity: childStyles.opacity
              },
              textContent: child.textContent.trim().substring(0, 50) + '...',
              isEmpty: child.textContent.trim() === ''
            };
          })
        };
      }

      // Check for any elements that might be causing whitespace
      const allElements = footer.querySelectorAll('*');
      const suspiciousElements = [];
      
      allElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const styles = window.getComputedStyle(element);
        
        // Check for elements with unusual dimensions or spacing
        if (rect.height > 50 && element.textContent.trim() === '') {
          suspiciousElements.push({
            index,
            tagName: element.tagName,
            className: element.className,
            dimensions: {
              width: rect.width,
              height: rect.height
            },
            styles: {
              display: styles.display,
              padding: styles.padding,
              margin: styles.margin,
              backgroundColor: styles.backgroundColor
            },
            reason: 'Empty element with significant height'
          });
        }
        
        // Check for elements with excessive padding/margin
        const paddingTop = parseFloat(styles.paddingTop) || 0;
        const paddingBottom = parseFloat(styles.paddingBottom) || 0;
        const marginTop = parseFloat(styles.marginTop) || 0;
        const marginBottom = parseFloat(styles.marginBottom) || 0;
        
        if (paddingTop > 50 || paddingBottom > 50 || marginTop > 50 || marginBottom > 50) {
          suspiciousElements.push({
            index,
            tagName: element.tagName,
            className: element.className,
            dimensions: {
              width: rect.width,
              height: rect.height
            },
            styles: {
              paddingTop: styles.paddingTop,
              paddingBottom: styles.paddingBottom,
              marginTop: styles.marginTop,
              marginBottom: styles.marginBottom
            },
            reason: 'Excessive padding or margin'
          });
        }
      });

      return {
        footer: {
          dimensions: {
            width: footerRect.width,
            height: footerRect.height,
            top: footerRect.top,
            left: footerRect.left
          },
          styles: {
            display: footerStyles.display,
            padding: footerStyles.padding,
            margin: footerStyles.margin,
            backgroundColor: footerStyles.backgroundColor,
            visibility: footerStyles.visibility,
            opacity: footerStyles.opacity
          }
        },
        children: childrenAnalysis,
        gridAnalysis,
        suspiciousElements
      };
    });

    console.log('\n=== DETAILED FOOTER ANALYSIS ===');
    console.log(JSON.stringify(footerAnalysis, null, 2));

    // Take screenshots at different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewport(viewport);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Scroll to footer again after viewport change
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      const footerElement = await page.$('footer');
      if (footerElement) {
        await footerElement.screenshot({ path: `footer-${viewport.name}.png` });
        console.log(`Footer screenshot saved for ${viewport.name}: footer-${viewport.name}.png`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

analyzeFooter();