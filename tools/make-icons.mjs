// Generates the cloud favicon (SVG) and the HTML pages Chrome renders into PNG icons and the share image.
// Usage: node tools/make-icons.mjs && sh tools/render.sh
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (p, s) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), s); };

// The same scalloped outline the app's CloudShape draws.
const pts = [];
for (let i = 0; i <= 120; i++) {
  const t = i / 120 * 2 * Math.PI;
  const lobe = Math.pow(Math.abs(Math.cos(4 * t + 0.2)), 0.7);
  const k = 0.93 + 0.043 * (2 * lobe - 1) + 0.012 * Math.sin(2 * t + 1);
  pts.push((i ? 'L' : 'M') + (50 + 50 * k * Math.cos(t)).toFixed(2) + ' ' + (50 + 50 * k * Math.sin(t)).toFixed(2));
}
const PATH = pts.join(' ') + ' Z';

const cloud = (id) => `<defs>
  <linearGradient id="${id}b" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#7FD0FF"/><stop offset=".5" stop-color="#B9B4FF"/><stop offset="1" stop-color="#F3B6EC"/></linearGradient>
  <radialGradient id="${id}c" cx=".44" cy=".62" r=".38"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
</defs>
<path d="${PATH}" fill="url(#${id}b)"/><path d="${PATH}" fill="url(#${id}c)"/>
<ellipse cx="48.5" cy="46" rx="6.6" ry="9.6" fill="#24163A"/><ellipse cx="67.5" cy="47" rx="6.6" ry="9.6" fill="#24163A"/>`;

// Favicon: just the cloud, readable at 16 px.
out('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 104 104">${cloud('f')}</svg>\n`);

// App-style icon on black, for the home screen and the web manifest.
const iconPage = (size) => `<!doctype html><html><head><style>html,body{margin:0;background:#000}
.t{width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,#1b1726,#000 70%)}
svg{width:${Math.round(size * .66)}px;height:${Math.round(size * .66)}px;filter:drop-shadow(0 0 ${Math.round(size * .06)}px #B07CFF)}</style></head>
<body><div class="t"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 104 104">${cloud('i')}</svg></div></body></html>`;
out('tools/build/icon-180.html', iconPage(180));
out('tools/build/icon-192.html', iconPage(192));
out('tools/build/icon-512.html', iconPage(512));
out('tools/build/favicon-32.html', `<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block;width:32px;height:32px}</style></head><body><svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 104 104">${cloud('s')}</svg></body></html>`);

// Share image, 1200 x 630.
out('tools/build/og.html', `<!doctype html><html><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=JetBrains+Mono:wght@400&display=block">
<style>html,body{margin:0;background:#000}
.c{width:1200px;height:630px;box-sizing:border-box;padding:0 96px;display:flex;align-items:center;gap:72px;color:#fff;
background:radial-gradient(520px 420px at 26% 50%,rgba(176,124,255,.28),transparent 70%),#000;font-family:Fredoka,sans-serif}
svg{width:340px;height:340px;flex-shrink:0;filter:drop-shadow(0 0 24px #B07CFF) drop-shadow(0 0 70px rgba(176,124,255,.55))}
.k{font-family:'JetBrains Mono',monospace;font-size:22px;letter-spacing:.14em;color:rgba(255,255,255,.5);text-transform:uppercase}
h1{margin:18px 0 0;font-weight:500;font-size:92px;line-height:.98;letter-spacing:-.02em}
.m{background:linear-gradient(90deg,#7FD0FF,#B9B4FF 50%,#F3B6EC);-webkit-background-clip:text;background-clip:text;color:transparent}
p{margin:26px 0 0;font-size:30px;color:rgba(255,255,255,.72);font-family:-apple-system,'SF Pro Text',system-ui,sans-serif}</style></head>
<body><div class="c"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 104 104">${cloud('o')}</svg>
<div><div class="k">nimbi</div><h1>Software with<br>a <span class="m">mood.</span></h1><p>Little clouds for your Mac.</p></div></div></body></html>`);

console.log('icons: wrote favicon.svg and render pages');
