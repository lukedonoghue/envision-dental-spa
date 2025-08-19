// Script to rename Dr. Kabbani image files (correcting spelling)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;

// Files to rename in the root directory
const rootFiles = [
  { oldName: 'Dr.Kabani-Irma.jpg', newName: 'Dr.Kabbani-Irma.jpg' },
  { oldName: 'Dr.Kabani-Karla.jpg', newName: 'Dr.Kabbani-Karla.jpg' },
  { oldName: 'Dr.Kabani-Kendra.jpg', newName: 'Dr.Kabbani-Kendra.jpg' },
  { oldName: 'Dr.Kabani-Monica.jpg', newName: 'Dr.Kabbani-Monica.jpg' },
  { oldName: 'Dr.Kabani-Trey.jpg', newName: 'Dr.Kabbani-Trey.jpg' }
];

// Function to rename files
function renameFile(oldPath, newPath) {
  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${oldPath} -> ${newPath}`);
    } catch (err) {
      console.error(`Error renaming ${oldPath}: ${err.message}`);
    }
  } else {
    console.log(`File not found: ${oldPath}`);
  }
}

// Rename files in root directory
rootFiles.forEach(file => {
  const oldPath = path.join(rootDir, file.oldName);
  const newPath = path.join(rootDir, file.newName);
  renameFile(oldPath, newPath);
});

console.log('Image renaming completed.');
