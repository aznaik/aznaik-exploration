# Demo Recorder

Records a smooth scroll-through of the portfolio site as video frames, then converts to MP4 or GIF.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [ffmpeg](https://ffmpeg.org/) (for converting frames to video)

## Usage

```bash
cd demo
npm install
npm run record
```

This captures PNG frames of the site scrolling from top to bottom.

## Convert to MP4

```bash
ffmpeg -framerate 10 -i output/frame-%04d.png -c:v libx264 -pix_fmt yuv420p demo.mp4
```

## Convert to GIF

```bash
ffmpeg -framerate 10 -i output/frame-%04d.png -vf "fps=10,scale=720:-1" demo.gif
```

## Configuration

Edit `record-demo.js` to adjust:
- `SCROLL_DURATION_MS` — total scroll time (default: 12s)
- `FRAME_INTERVAL_MS` — frame capture rate (default: 100ms = 10fps)
- `VIEWPORT` — browser window size (default: 1440×900)
