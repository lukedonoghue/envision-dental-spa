import puppeteer from 'puppeteer';

async function checkPageIssues() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Collect network failures
  const networkFailures = [];
  page.on('requestfailed', request => {
    networkFailures.push({
      url: request.url(),
      error: request.failure().errorText
    });
  });
  
  try {
    console.log('🔍 Loading page at http://localhost:3003...');
    await page.goto('http://localhost:3003', { waitUntil: 'networkidle0' });
    
    console.log('✅ Page loaded successfully');
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'page-check.png',
      fullPage: true 
    });
    console.log('📸 Full page screenshot saved as page-check.png');
    
    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const broken = [];
      images.forEach((img, index) => {
        if (!img.complete || img.naturalHeight === 0) {
          broken.push({
            index: index,
            src: img.src,
            alt: img.alt,
            id: img.id,
            class: img.className
          });
        }
      });
      return broken;
    });
    
    // Check for missing CSS/JS files
    const missingResources = await page.evaluate(() => {
      const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const missing = [];
      
      stylesheets.forEach(link => {
        if (link.sheet === null) {
          missing.push({ type: 'CSS', href: link.href });
        }
      });
      
      return missing;
    });
    
    // Check for JavaScript errors in Alpine.js or other components
    const alpineErrors = await page.evaluate(() => {
      return window.Alpine ? 'Alpine.js loaded' : 'Alpine.js NOT loaded';
    });
    
    // Check if Tailwind CSS is working
    const tailwindCheck = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.className = 'bg-blue-500';
      document.body.appendChild(testEl);
      const styles = getComputedStyle(testEl);
      const hasTailwind = styles.backgroundColor === 'rgb(59, 130, 246)';
      document.body.removeChild(testEl);
      return hasTailwind ? 'Tailwind CSS working' : 'Tailwind CSS NOT working';
    });
    
    // Report results
    console.log('\n📊 ANALYSIS RESULTS:');
    console.log('===================');
    
    console.log('\n🖼️  Image Status:');
    if (brokenImages.length > 0) {
      console.log('❌ Broken images found:');
      brokenImages.forEach(img => {
        console.log(`   - ${img.src} (alt: "${img.alt}", class: "${img.class}")`);
      });
    } else {
      console.log('✅ All images loading correctly');
    }
    
    console.log('\n🎨 CSS/JS Status:');
    console.log(`   ${tailwindCheck}`);
    console.log(`   ${alpineErrors}`);
    
    if (missingResources.length > 0) {
      console.log('❌ Missing resources:');
      missingResources.forEach(resource => {
        console.log(`   - ${resource.type}: ${resource.href}`);
      });
    } else {
      console.log('✅ All CSS/JS resources loaded');
    }
    
    console.log('\n🚨 Console Errors:');
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(error => {
        console.log(`   ❌ ${error}`);
      });
    } else {
      console.log('✅ No console errors');
    }
    
    console.log('\n🌐 Network Failures:');
    if (networkFailures.length > 0) {
      networkFailures.forEach(failure => {
        console.log(`   ❌ ${failure.url}: ${failure.error}`);
      });
    } else {
      console.log('✅ No network failures');
    }
    
  } catch (error) {
    console.error('❌ Error loading page:', error.message);
  }
  
  console.log('\n🔍 Check page-check.png for visual inspection');
  console.log('Browser will stay open for manual inspection...');
  
  // Keep browser open for manual inspection
  await new Promise(() => {});
}

checkPageIssues().catch(console.error);