import puppeteer from 'puppeteer';

(async () => {
  console.log('Opening preview browser...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--window-size=1400,900']
  });
  
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:3002...');
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });
  
  // Wait for page to fully load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Preview is now open at http://localhost:3002');
  console.log('\n🔄 Keep this terminal open to keep the preview active');
  console.log('   Press Ctrl+C to close the preview\n');
  
  // Keep the script running to keep browser open
  await new Promise(() => {});
})();