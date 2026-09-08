import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceSvg = path.join(process.cwd(), 'public', 'icons', 'icon-source.svg');
const outputDir = path.join(process.cwd(), 'public', 'icons');

async function generate() {
  const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-maskable-512.png', size: 512, maskable: true },
  ];

  for (const icon of sizes) {
    const svgBuffer = fs.readFileSync(sourceSvg);
    let pipeline = sharp(svgBuffer).resize(icon.size, icon.size);
    if (icon.maskable) {
      const safeSize = Math.round(icon.size * 0.8);
      const padding = Math.round((icon.size - safeSize) / 2);
      pipeline = pipeline.extend({ top: padding, bottom: padding, left: padding, right: padding, background: '#1A1A2E' });
    }
    await pipeline.png().toFile(path.join(outputDir, icon.name));
    console.log(`Generated ${icon.name}`);
  }
}

generate().catch(console.error);