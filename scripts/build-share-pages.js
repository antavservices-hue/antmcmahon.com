// Writes one tiny page per song at s/<band id>/<song>/index.html, so a
// shared song link shows that song's title and band logo in WhatsApp,
// Facebook, iMessage etc., then forwards the visitor into the club
// with that song queued up (index.html?song=<band id>/<song>).
//
// Run after adding or renaming songs in data.js:   node scripts/build-share-pages.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = 'https://antmcmahon.com';
const root = path.join(__dirname, '..');
const { SONGS } = vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8') + ';({ SONGS })');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const outDir = path.join(root, 's');
fs.rmSync(outDir, { recursive: true, force: true });

for (const { entry, album, track, id } of SONGS) {
  const title = `${track.title} — ${entry.name}`;
  const desc = `${track.video ? 'Watch' : 'Listen to'} "${track.title}" by ${entry.name}${album.title ? ` (${album.title})` : ''} in Ant McMahon's club.`;
  const ogImage = fs.existsSync(path.join(root, 'assets/og', `${entry.id}.jpg`))
    ? `${SITE}/assets/og/${entry.id}.jpg`
    : `${SITE}/assets/og-image.jpg`;
  const target = `/?song=${encodeURIComponent(id)}`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${SITE}/s/${id}/" />
<meta property="og:type" content="${track.video ? 'video.other' : 'music.song'}" />
<meta property="og:site_name" content="Ant McMahon — The Club" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${SITE}/s/${id}/" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:image" content="${ogImage}" />
<meta http-equiv="refresh" content="0; url=${target}" />
<style>body{margin:0;background:#0a0304;color:#f4ede2;font-family:-apple-system,Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh}a{color:#ff5b46}</style>
</head>
<body>
<p><a href="${target}">${esc(title)}</a></p>
<script>location.replace(${JSON.stringify(target)});</script>
</body>
</html>
`;
  const dir = path.join(outDir, ...id.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
console.log(`Wrote ${SONGS.length} share pages to s/`);
