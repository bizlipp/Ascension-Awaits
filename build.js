import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
    try {
        // Create dist directory
        await fs.ensureDir(path.join(__dirname, '../dist'));
        
        // Copy HTML file
        await fs.copy(
            path.join(__dirname, '../public/index.html'),
            path.join(__dirname, '../dist/index.html')
        );
        
        // Copy JS files
        await fs.copy(
            path.join(__dirname, '../src/js'),
            path.join(__dirname, '../dist/js')
        );
        
        // Copy CSS files
        await fs.copy(
            path.join(__dirname, '../src/css'),
            path.join(__dirname, '../dist/css')
        );

        console.log('Build completed successfully');
    } catch (err) {
        console.error('Build failed:', err);
        process.exit(1);
    }
}

build(); 