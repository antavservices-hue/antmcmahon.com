// Renders one 1200x630 social preview card per song to
// assets/og/songs/<band id>/<song>.jpg: band logo, song title, band name,
// on a black card in a white-leopard frame. build-share-pages.js uses
// these as each song link's preview image.
//
// Needs Playwright + Chromium (not part of the site). Run from the repo root:
//   node scripts/build-share-images.js            (only songs missing a card)
//   node scripts/build-share-images.js --all      (redo every card)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const { SONGS } = vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8') + ';({ SONGS })');
const redoAll = process.argv.includes('--all');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function card({ entry, album, track }) {
  const len = track.title.length;
  const size = len > 40 ? 50 : len > 26 ? 60 : len > 16 ? 72 : 84;
  const meta = [album.title, album.year].filter(Boolean).join(' · ');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;background:#fff url(/assets/leopard.webp) center/640px auto;
    font-family:"Liberation Sans","DejaVu Sans",Helvetica,Arial,sans-serif;overflow:hidden}
  .card{position:absolute;inset:30px;background:#0a0304;border-radius:20px;display:flex;align-items:center;
    gap:44px;padding:40px 52px 40px 40px;box-shadow:0 0 0 4px #000}
  .logo{width:470px;height:470px;flex-shrink:0;object-fit:contain;background:#000;border-radius:12px}
  .txt{flex:1;min-width:0;color:#f4ede2;display:flex;flex-direction:column;gap:18px}
  .kicker{color:#ff5b46;font-weight:700;font-size:22px;letter-spacing:.16em;text-transform:uppercase}
  .title{font-weight:800;font-size:${size}px;line-height:1.06;letter-spacing:-.01em;overflow-wrap:break-word}
  .band{font-weight:700;font-size:34px;color:#fff}
  .meta{font-size:24px;opacity:.55}
  .site{margin-top:14px;display:flex;align-items:center;gap:14px;font-size:24px;font-weight:700;letter-spacing:.06em}
  .play{width:46px;height:46px;border-radius:50%;background:#e0392b;display:flex;align-items:center;justify-content:center}
  </style></head><body><div class="card">
  <img class="logo" src="/${entry.logo}">
  <div class="txt">
    <div class="kicker">${track.video ? 'Watch' : 'Listen'} in the club</div>
    <div class="title">${esc(track.title)}</div>
    <div class="band">${esc(entry.name)}</div>
    ${meta ? `<div class="meta">${esc(meta)}</div>` : ''}
    <div class="site"><span class="play"><svg width="18" height="20" viewBox="0 0 18 20"><path d="M2 1l15 9-15 9z" fill="#fff"/></svg></span>ANTMCMAHON.COM</div>
  </div></div></body></html>`;
}

(async () => {
  // tiny static server so the card can load the logo and leopard files
  const types = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg' };
  const pages = new Map();
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    if (pages.has(u)) { res.setHeader('content-type', 'text/html'); return res.end(pages.get(u)); }
    const f = path.join(root, u);
    if (!f.startsWith(root) || !fs.existsSync(f)) { res.statusCode = 404; return res.end(); }
    res.setHeader('content-type', types[path.extname(f)] || 'application/octet-stream');
    fs.createReadStream(f).pipe(res);
  }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  let made = 0;
  for (const song of SONGS) {
    const out = path.join(root, 'assets/og/songs', `${song.id}.jpg`);
    if (!redoAll && fs.existsSync(out)) continue;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    pages.set('/__card', card(song));
    await page.goto(`${base}/__card`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: out, type: 'jpeg', quality: 82 });
    made++;
  }
  await browser.close();
  server.close();
  console.log(`Made ${made} song cards (${SONGS.length} songs in total)`);
})();
