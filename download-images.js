// Script to download placeholder images for Dr. Kabani's cases
const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrls = [
  // Case 1 - Woman with green sweater
  {
    url: 'https://images.unsplash.com/photo-1554151228-14d9def656e4',
    filename: 'dr-kabani-case1-before.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1554151228-14d9def656e4',
    filename: 'dr-kabani-case1-after.jpg'
  },
  // Case 2 - Man with gray sweater
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    filename: 'dr-kabani-case2-before.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    filename: 'dr-kabani-case2-after.jpg'
  },
  // Case 3 - Woman with white blouse
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    filename: 'dr-kabani-case3-before.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    filename: 'dr-kabani-case3-after.jpg'
  }
];

const targetDir = path.join(__dirname, 'public', 'images', 'dr-kabani');

// Ensure the directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Download each image
imageUrls.forEach(({ url, filename }) => {
  const fullUrl = `${url}?q=80&w=1000&auto=format&fit=crop`;
  const filePath = path.join(targetDir, filename);
  
  console.log(`Downloading ${fullUrl} to ${filePath}...`);
  
  const file = fs.createWriteStream(filePath);
  
  https.get(fullUrl, (response) => {
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {}); // Delete the file if there's an error
    console.error(`Error downloading ${filename}: ${err.message}`);
  });
});

console.log('Download process started. Please wait...');
