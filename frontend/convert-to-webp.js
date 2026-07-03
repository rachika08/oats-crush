// convert-to-webp.js
// Run locally in your project root (not in the browser/build).
//
// Setup:
//   npm install sharp --save-dev
// Run:
//   node convert-to-webp.js
//
// This converts every .png/.jpg/.jpeg in public/images to a .webp
// version SIDE BY SIDE (originals are kept, so nothing breaks until
// you update the <img> paths in your components).

import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const QUALITY = 80; // 80 is visually near-lossless, ~30-50% smaller than PNG/JPG

function walk(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }
    const ext = path.extname(entry).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;

    const outPath = fullPath.replace(ext, ".webp");
    sharp(fullPath)
      .webp({ quality: QUALITY })
      .toFile(outPath)
      .then(() => {
        const before = statSync(fullPath).size;
        const after = statSync(outPath).size;
        const savings = (((before - after) / before) * 100).toFixed(1);
        console.log(`✓ ${entry} -> ${path.basename(outPath)} (${savings}% smaller)`);
      })
      .catch((err) => console.error(`✗ Failed on ${entry}:`, err.message));
  }
}

walk(IMAGES_DIR);