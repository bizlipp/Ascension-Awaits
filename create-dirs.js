const fs = require('fs-extra');
const path = require('path');

async function createDirs() {
    try {
        const dirs = [
            'dist/assets/images/characters',
            'dist/assets/images/icons',
            'dist/assets/images/emotions',
            'dist/assets/images/background',
            'dist/assets/images/effects',
            'dist/assets/characters',
            'dist/assets/dialogue',
            'dist/css',
            'dist/js'
        ];
        
        for (const dir of dirs) {
            await fs.mkdirp(path.join(__dirname, '..', dir));
        }
        console.log('Directories created successfully');
    } catch (err) {
        console.error('Failed to create directories:', err);
        process.exit(1);
    }
}

createDirs(); 