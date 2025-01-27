import fs from 'fs';
import path from 'path';

// Create necessary directories
const createDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Ensure dist/assets/images/characters exists
createDir('dist/assets/images/characters');

// Copy character images
fs.copyFileSync('src/assets/images/characters/billy.png', 'dist/assets/images/characters/billy.png');
fs.copyFileSync('src/assets/images/characters/nettie.png', 'dist/assets/images/characters/nettie.png');

console.log('Character images copied successfully'); 