// Copy 404.html to build folder
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make sure the build directory exists
if (fs.existsSync(path.join(__dirname, 'dist'))) {  // Change 'build' to 'dist' for Vite
  // Copy the 404.html file to dist directory
  fs.copyFileSync(
    path.join(__dirname, '404.html'),
    path.join(__dirname, 'dist', '404.html')
  );
  console.log('404.html was copied to dist folder');
} else {
  console.error('dist folder does not exist');
}