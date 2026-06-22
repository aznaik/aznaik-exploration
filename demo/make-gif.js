const GIFEncoder = require("gif-encoder-2");
const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "output");
const GIF_PATH = path.join(__dirname, "..", "demo.gif");
const FPS = 10;

async function createGif() {
  const files = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith(".png"))
    .sort();

  if (files.length === 0) {
    console.error("No frames found. Run 'npm run record' first.");
    process.exit(1);
  }

  console.log(`🎞️  Stitching ${files.length} frames into GIF...`);

  // Read first frame to get dimensions
  const firstFrame = PNG.sync.read(
    fs.readFileSync(path.join(OUTPUT_DIR, files[0]))
  );
  const width = Math.floor(firstFrame.width / 2); // Half size for smaller file
  const height = Math.floor(firstFrame.height / 2);

  const encoder = new GIFEncoder(width, height, "neuquant", true);
  encoder.setDelay(1000 / FPS);
  encoder.setQuality(10);
  encoder.start();

  // Use canvas-like downscale via simple nearest-neighbor
  for (let i = 0; i < files.length; i += 2) {
    // Skip every other frame for size
    const framePath = path.join(OUTPUT_DIR, files[i]);
    const png = PNG.sync.read(fs.readFileSync(framePath));

    // Downscale
    const scaled = Buffer.alloc(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcX = x * 2;
        const srcY = y * 2;
        const srcIdx = (srcY * png.width + srcX) * 4;
        const dstIdx = (y * width + x) * 4;
        scaled[dstIdx] = png.data[srcIdx];
        scaled[dstIdx + 1] = png.data[srcIdx + 1];
        scaled[dstIdx + 2] = png.data[srcIdx + 2];
        scaled[dstIdx + 3] = png.data[srcIdx + 3];
      }
    }

    encoder.addFrame(scaled);
    if (i % 20 === 0) {
      console.log(`  Processing frame ${i}/${files.length}`);
    }
  }

  encoder.finish();
  const buffer = encoder.out.getData();
  fs.writeFileSync(GIF_PATH, buffer);
  console.log(`\n✅ GIF saved to: ${GIF_PATH} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`);
}

createGif().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
