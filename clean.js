import { rm } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function clean() {
    try {
        await rm(path.join(__dirname, '../dist'), { recursive: true, force: true });
        console.log('Cleaned dist directory');
    } catch (err) {
        console.error('Error cleaning dist directory:', err);
        process.exit(1);
    }
}

clean(); 