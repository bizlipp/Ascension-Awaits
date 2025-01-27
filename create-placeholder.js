const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

async function createPlaceholder() {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    // Create a simple placeholder image
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#666666';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Character Image', 100, 100);

    const buffer = canvas.toBuffer('image/png');
    const placeholderPath = path.join(__dirname, '../src/assets/images/characters/placeholder.png');
    
    await fs.ensureDir(path.dirname(placeholderPath));
    await fs.writeFile(placeholderPath, buffer);
    
    console.log('Placeholder image created successfully');
}

createPlaceholder(); 