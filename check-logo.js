import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkLogo() {
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    const page = await browser.newPage();
    
    try {
        // Navigate to the page
        await page.goto('file://' + path.resolve(__dirname, './index.html'), { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });
        
        console.log('✅ Page loaded successfully');
        
        // Check if logo loads
        const logoExists = await page.evaluate(() => {
            const logo = document.querySelector('header img');
            return {
                exists: !!logo,
                src: logo ? logo.src : null,
                naturalWidth: logo ? logo.naturalWidth : 0,
                naturalHeight: logo ? logo.naturalHeight : 0,
                complete: logo ? logo.complete : false
            };
        });
        
        console.log('Logo status:', logoExists);
        
        // Check what files exist in images directory
        const imagesDir = path.resolve(__dirname, './public/images/');
        const imageFiles = fs.readdirSync(imagesDir);
        console.log('Files in images directory:', imageFiles);
        
        // Screenshot the header
        await page.setViewport({ width: 1200, height: 800 });
        await page.screenshot({ 
            path: 'header-check.png',
            clip: { x: 0, y: 0, width: 1200, height: 100 }
        });
        
        console.log('Header screenshot saved as header-check.png');
        
        // Wait for user to see
        await page.waitForTimeout(5000);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

checkLogo();