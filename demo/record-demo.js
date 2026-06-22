const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const SITE_URL = "https://aznaik.github.io/aznaik-exploration/";
const OUTPUT_DIR = path.join(__dirname, "output");
const VIEWPORT = { width: 1440, height: 900 };
const SCROLL_DURATION_MS = 12000;
const FRAME_INTERVAL_MS = 100;

async function recordDemo() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("🚀 Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  console.log(`📸 Loading ${SITE_URL}...`);
  await page.goto(SITE_URL, { waitUntil: "networkidle2", timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));

  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const totalScroll = scrollHeight - VIEWPORT.height;
  const totalFrames = Math.floor(SCROLL_DURATION_MS / FRAME_INTERVAL_MS);

  console.log(`🎬 Recording ${totalFrames} frames...`);

  for (let i = 0; i <= totalFrames; i++) {
    const progress = i / totalFrames;
    const eased =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const scrollY = Math.floor(eased * totalScroll);

    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await new Promise((r) => setTimeout(r, FRAME_INTERVAL_MS));

    const frameNum = String(i).padStart(4, "0");
    await page.screenshot({
      path: path.join(OUTPUT_DIR, `frame-${frameNum}.png`),
      type: "png",
    });

    if (i % 20 === 0) {
      console.log(`  Frame ${i}/${totalFrames} (${Math.round(progress * 100)}%)`);
    }
  }

  await browser.close();
  console.log(`\n✅ Done! ${totalFrames + 1} frames saved to ${OUTPUT_DIR}/`);
  console.log(`\n📹 To create MP4:`);
  console.log(
    `   ffmpeg -framerate 10 -i output/frame-%04d.png -c:v libx264 -pix_fmt yuv420p demo.mp4`
  );
  console.log(`\n🎞️  To create GIF:`);
  console.log(
    `   ffmpeg -framerate 10 -i output/frame-%04d.png -vf "fps=10,scale=720:-1" demo.gif`
  );
}

recordDemo().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
