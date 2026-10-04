import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ============================================================
   THE CLUB — scene + interaction
   Content lives in data.js (BANDS, SOLO, LATEST_RELEASES, WALL_ORDER).
   See the readme block at the bottom of this file for how to wire
   in real performance clips once you have them.
   ============================================================ */

const ROOM_W = 11;      // left-right
const ROOM_D = 26;      // entrance-to-stage
const ROOM_H = 5.4;
const STAGE_Z = -ROOM_D / 2 + 2.4;
const ENTRANCE_Z = ROOM_D / 2 - 2.2;

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
renderer.shadowMap.enabled = false;
renderer.useLegacyLights = true; // keeps point/spot light intensities on an intuitive 0–20-ish scale

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c0505);
scene.fog = new THREE.FogExp2(0x0c0505, 0.02);

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.6, ENTRANCE_Z - 1);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, STAGE_Z + 3);
controls.enablePan = false;
controls.enableZoom = true;
controls.zoomSpeed = 0.6;
const initialDist = camera.position.distanceTo(controls.target);
controls.minDistance = initialDist * 0.45;
controls.maxDistance = initialDist * 1.7;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.55;
controls.minPolarAngle = Math.PI * 0.22;
controls.maxPolarAngle = Math.PI * 0.72;
controls.update();

let walking = false;
const walkTarget = new THREE.Vector3();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------------- Grungy wall texture (procedural, no image assets needed) ---------------- */
function makeGraffitiCanvas({ dense = true } = {}) {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0a0707';
  ctx.fillRect(0, 0, size, size);

  // grime / stains
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const r = 20 + Math.random() * 90;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,0.35)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  const reds = ['rgba(200,45,35,0.85)', 'rgba(150,30,25,0.6)', 'rgba(220,60,45,0.5)'];
  const whites = ['rgba(230,225,215,0.5)', 'rgba(200,195,185,0.35)'];

  function scribbleLine(x, y, len, colorSet) {
    ctx.strokeStyle = colorSet[Math.floor(Math.random() * colorSet.length)];
    ctx.lineWidth = 2 + Math.random() * 4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    let cx = x, cy = y;
    for (let i = 0; i < 4; i++) {
      cx += (Math.random() - 0.5) * len;
      cy += (Math.random() - 0.5) * len;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  function circleA(x, y, r) {
    ctx.strokeStyle = reds[Math.floor(Math.random() * reds.length)];
    ctx.lineWidth = 3 + Math.random() * 2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - r * 0.7);
    ctx.lineTo(x - r * 0.6, y + r * 0.5);
    ctx.lineTo(x + r * 0.6, y + r * 0.5);
    ctx.closePath();
    ctx.stroke();
  }

  function doodle(x, y, r) {
    // small filled/outlined shape — square, diamond, blob, or crude face,
    // the kind of dense little tags that fill wall-to-wall in the reference
    ctx.strokeStyle = Math.random() > 0.5 ? reds[Math.floor(Math.random() * reds.length)] : whites[Math.floor(Math.random() * whites.length)];
    ctx.lineWidth = 1.5 + Math.random() * 2.5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    const kind = Math.floor(Math.random() * 4);
    ctx.beginPath();
    if (kind === 0) {
      ctx.rect(-r / 2, -r / 2, r, r);
    } else if (kind === 1) {
      ctx.moveTo(0, -r); ctx.lineTo(r, 0); ctx.lineTo(0, r); ctx.lineTo(-r, 0); ctx.closePath();
    } else if (kind === 2) {
      ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
    } else {
      ctx.moveTo(-r, -r * 0.4); ctx.lineTo(r, -r * 0.4);
      ctx.moveTo(0, -r * 0.4); ctx.lineTo(0, r * 0.5);
      ctx.moveTo(-r * 0.6, r * 0.5); ctx.lineTo(r * 0.6, r * 0.5);
    }
    ctx.stroke();
    ctx.restore();
  }

  // wall-to-wall coverage: fill the whole tile densely, reference-style
  const count = dense ? 420 : 220;
  for (let i = 0; i < count; i++) {
    scribbleLine(Math.random() * size, Math.random() * size, 20 + Math.random() * 55, Math.random() > 0.45 ? reds : whites);
  }
  const doodleCount = dense ? 260 : 140;
  for (let i = 0; i < doodleCount; i++) {
    doodle(Math.random() * size, Math.random() * size, 8 + Math.random() * 22);
  }
  for (let i = 0; i < (dense ? 16 : 8); i++) {
    circleA(Math.random() * size, Math.random() * size, 16 + Math.random() * 26);
  }

  const phrases = ['NO FUTURE', 'PUNK ROCK NOT DEAD', 'NO GODS NO MASTERS', 'STILL HERE', 'LOUD & LIVE', 'NO CURE', 'DISEASES'];
  ctx.font = '700 30px Impact, "Arial Narrow", sans-serif';
  for (let i = 0; i < (dense ? 8 : 4); i++) {
    ctx.save();
    const x = Math.random() * size, y = Math.random() * size;
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.25);
    ctx.fillStyle = Math.random() > 0.5 ? reds[0] : whites[0];
    ctx.fillText(phrases[Math.floor(Math.random() * phrases.length)], 0, 0);
    ctx.restore();
  }
  return c;
}

function makeWallMaterial(repeatX, repeatY, opts) {
  const tex = new THREE.CanvasTexture(makeGraffitiCanvas(opts));
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshStandardMaterial({ map: tex, color: 0x9a9a9a, roughness: 0.97, metalness: 0.0 });
}

/* ---------------- Room shell ---------------- */
const matteBlack = new THREE.MeshStandardMaterial({ color: 0x0a0808, roughness: 0.95, metalness: 0.0 });
const wallGrungeMat = makeWallMaterial(ROOM_D / 3.2, ROOM_H / 3.2, { dense: true });
const wallGrungeMatEnd = makeWallMaterial(ROOM_W / 3.2, ROOM_H / 3.2, { dense: false });
const ceilingGrungeMat = makeWallMaterial(ROOM_W / 3.2, ROOM_D / 3.2, { dense: true });

// Plain wooden floor — worn dive-bar boards, no reflections (flat MeshStandardMaterial,
// not a mirror render target), so it reads clearly as a single-level room.
function makeWoodFloorTexture() {
  const s = 1024;
  const c = document.createElement('canvas');
  c.width = s; c.height = s;
  const ctx = c.getContext('2d');
  const plankW = 68;
  // darker, patchier, less uniform than a "nice" floor — decades of spills,
  // replaced boards, and never being refinished
  const tones = ['#241408', '#2c1a0d', '#1e1006', '#33200f', '#221306', '#2a170a'];
  for (let x = 0; x < s; x += plankW) {
    const base = tones[Math.floor(Math.random() * tones.length)];
    ctx.fillStyle = base;
    ctx.fillRect(x, 0, plankW, s);

    // long grain streaks running the length of the plank
    for (let i = 0; i < 26; i++) {
      const gx = x + Math.random() * plankW;
      ctx.strokeStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.14})`;
      ctx.lineWidth = 0.6 + Math.random() * 1.6;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      let cx = gx;
      for (let y = 0; y <= s; y += 40) {
        cx += (Math.random() - 0.5) * 12;
        ctx.lineTo(cx, y);
      }
      ctx.stroke();
    }

    // ragged, uneven plank seam (some boards gappier/darker than others)
    ctx.fillStyle = `rgba(0,0,0,${0.5 + Math.random() * 0.3})`;
    ctx.fillRect(x, 0, 1 + Math.random() * 2, s);

    // big uneven damp/stain patches — spilled drinks soaked into the wood
    if (Math.random() < 0.65) {
      const wy = Math.random() * s, wh = 60 + Math.random() * 220;
      ctx.fillStyle = `rgba(10,5,0,${0.12 + Math.random() * 0.18})`;
      ctx.fillRect(x, wy, plankW, wh);
    }

    // a lighter, worn/polished strip where feet shuffle constantly —
    // patchy, not a clean gradient
    if (Math.random() < 0.4) {
      const wy = Math.random() * s, wh = 30 + Math.random() * 80;
      ctx.fillStyle = `rgba(120,90,55,${0.05 + Math.random() * 0.07})`;
      ctx.fillRect(x, wy, plankW, wh);
    }
  }

  // scattered dark grime / sticky-floor blotches
  for (let i = 0; i < 260; i++) {
    const r = 2 + Math.random() * 11;
    ctx.fillStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.22})`;
    ctx.beginPath();
    ctx.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // drink rings — pale rough circles, never quite mopped off
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * s, ry = Math.random() * s, rr = 6 + Math.random() * 14;
    ctx.strokeStyle = `rgba(160,130,90,${0.12 + Math.random() * 0.15})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.ellipse(rx, ry, rr, rr * (0.85 + Math.random() * 0.3), Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.stroke();
  }

  // cigarette burns — small dark scorch dots with a faint halo
  for (let i = 0; i < 55; i++) {
    const bx = Math.random() * s, by = Math.random() * s;
    ctx.fillStyle = `rgba(10,6,3,${0.3 + Math.random() * 0.25})`;
    ctx.beginPath();
    ctx.arc(bx, by, 1.2 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // scuffs and scratches cutting across the grain — lighter, raw-wood streaks
  for (let i = 0; i < 90; i++) {
    const sx = Math.random() * s, sy = Math.random() * s;
    const len = 8 + Math.random() * 28;
    const ang = Math.random() * Math.PI;
    ctx.strokeStyle = `rgba(150,120,80,${0.08 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
    ctx.stroke();
  }

  // dark vignette-y grime pooling in patches (never evenly lit/cleaned)
  for (let i = 0; i < 10; i++) {
    const gx = Math.random() * s, gy = Math.random() * s, gr = 80 + Math.random() * 160;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    grad.addColorStop(0, `rgba(0,0,0,${0.18 + Math.random() * 0.12})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }

  return c;
}
const woodFloorTex = new THREE.CanvasTexture(makeWoodFloorTexture());
woodFloorTex.colorSpace = THREE.SRGBColorSpace;
woodFloorTex.wrapS = woodFloorTex.wrapT = THREE.RepeatWrapping;
woodFloorTex.repeat.set(ROOM_W / 3.4, ROOM_D / 5.5);
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(ROOM_W, ROOM_D),
  new THREE.MeshStandardMaterial({ map: woodFloorTex, roughness: 0.88, metalness: 0.0 })
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.y = 0;
scene.add(floorMesh);

const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), ceilingGrungeMat);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = ROOM_H;
scene.add(ceiling);

function makeWall(w, h, mat) {
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
}
const wallL = makeWall(ROOM_D, ROOM_H, wallGrungeMat);
wallL.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
wallL.rotation.y = Math.PI / 2;
scene.add(wallL);

const wallR = makeWall(ROOM_D, ROOM_H, wallGrungeMat);
wallR.position.set(ROOM_W / 2, ROOM_H / 2, 0);
wallR.rotation.y = -Math.PI / 2;
scene.add(wallR);

const wallBack = makeWall(ROOM_W, ROOM_H, wallGrungeMatEnd); // behind stage
wallBack.position.set(0, ROOM_H / 2, -ROOM_D / 2);
scene.add(wallBack);

const wallFront = makeWall(ROOM_W, ROOM_H, wallGrungeMatEnd); // behind entrance
wallFront.position.set(0, ROOM_H / 2, ROOM_D / 2);
wallFront.rotation.y = Math.PI;
scene.add(wallFront);

/* ---------------- Lighting ---------------- */
scene.add(new THREE.HemisphereLight(0x5a3644, 0x241014, 0.55));
scene.add(new THREE.AmbientLight(0x66363e, 0.42));

const redSpot1 = new THREE.SpotLight(0xff3b30, 11, 24, Math.PI / 5.2, 0.5, 1.1);
redSpot1.position.set(-2.2, ROOM_H - 0.3, STAGE_Z + 3);
redSpot1.target.position.set(-1.2, 0, STAGE_Z);
scene.add(redSpot1, redSpot1.target);

const purpleSpot = new THREE.SpotLight(0x9b4bff, 11, 24, Math.PI / 5.2, 0.5, 1.1);
purpleSpot.position.set(2.2, ROOM_H - 0.3, STAGE_Z + 3);
purpleSpot.target.position.set(1.2, 0, STAGE_Z);
scene.add(purpleSpot, purpleSpot.target);

const stageFill = new THREE.PointLight(0xff5b46, 3.2, 14, 2);
stageFill.position.set(0, 2.4, STAGE_Z + 1.5);
scene.add(stageFill);

// bar underglow
const barGlow = new THREE.PointLight(0xffb347, 3, 11, 2);
barGlow.position.set(ROOM_W / 2 - 0.6, 0.6, STAGE_Z + 8);
scene.add(barGlow);

// general room wash so the black walls and floor read as a space,
// not a void, along the full length of the room
const washColors = [0xff3b30, 0x9b4bff, 0xffb347];
for (let i = 0; i < 6; i++) {
  const z = ENTRANCE_Z - (i * ROOM_D) / 5.2;
  const wash = new THREE.PointLight(washColors[i % washColors.length], 3.4, 10, 2);
  wash.position.set(i % 2 === 0 ? -ROOM_W / 2 + 1.2 : ROOM_W / 2 - 1.2, 2.3, z);
  scene.add(wash);
}

// string lights along both walls
const stringLightGeo = new THREE.SphereGeometry(0.035, 8, 8);
const stringColors = [0xff5b46, 0x9b4bff, 0x35d07f, 0xffd23f];
function addStringLights(xSide) {
  const group = new THREE.Group();
  for (let i = 0; i < 22; i++) {
    const c = stringColors[i % stringColors.length];
    const bulb = new THREE.Mesh(stringLightGeo, new THREE.MeshBasicMaterial({ color: c }));
    const z = ROOM_D / 2 - 0.6 - i * (ROOM_D - 1.2) / 21;
    bulb.position.set(xSide * (ROOM_W / 2 - 0.15), ROOM_H - 0.35 + Math.sin(i * 1.3) * 0.05, z);
    group.add(bulb);
  }
  scene.add(group);
}
addStringLights(-1);
addStringLights(1);

/* ---------------- Leopard print ---------------- */
// Red-and-black leopard (assets/leopard.svg, a seamless tile) to match the
// leopard in the Ant McMahon logo. Each surface gets its own clone so the
// spots stay the same size whatever shape the surface is.
const leopardBaseTex = new THREE.TextureLoader().load('assets/leopard.svg');
leopardBaseTex.colorSpace = THREE.SRGBColorSpace;
leopardBaseTex.wrapS = leopardBaseTex.wrapT = THREE.RepeatWrapping;
const LEOPARD_TILE_M = 1.1; // one tile covers ~1.1m
function leopardMaterial(w, h) {
  const t = leopardBaseTex.clone();
  t.repeat.set(w / LEOPARD_TILE_M, h / LEOPARD_TILE_M);
  t.needsUpdate = true;
  // a touch of emissive so it still reads in the dark club
  return new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.18, roughness: 0.75 });
}

/* ---------------- Stage ---------------- */
// Declared here (ahead of the wall-art section below) because the stage
// fascia sign and amp badges built just below are click targets too —
// see the raycast hits against artMeshes further down the file.
const artMeshes = [];
const stageGroup = new THREE.Group();
scene.add(stageGroup);

// Proper raised stage — solid box (sides + front skirt), so you can't see
// or walk underneath it, just a clean vertical drop to the floor.
const STAGE_TOP = 1.0;
const stageTopMat = new THREE.MeshStandardMaterial({ color: 0x050303, roughness: 0.9 });
const stageSideLeopard = leopardMaterial(3.4, STAGE_TOP);
const stageFrontLeopard = leopardMaterial(6.4, STAGE_TOP);
// box face order: +x, -x, +y, -y, +z (audience side), -z
const stagePlatform = new THREE.Mesh(
  new THREE.BoxGeometry(6.4, STAGE_TOP, 3.4),
  [stageSideLeopard, stageSideLeopard, stageTopMat, stageTopMat, stageFrontLeopard, stageTopMat]
);
stagePlatform.position.set(0, STAGE_TOP / 2, STAGE_Z);
stageGroup.add(stagePlatform);

// A small early-instantiated loader just for the two branding bits below
// (the main wall-art `textureLoader` is declared further down the file,
// after this stage-building code already runs).
const stageTextureLoader = new THREE.TextureLoader();

// Stage fascia — a lit sign on the front (audience-facing) skirt of the
// stage so a first-time visitor immediately understands whose club this
// is, without having to open a wall panel first.
function makeStageFasciaTexture() {
  const c = document.createElement('canvas');
  c.width = 1792; c.height = 240;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#050303';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#e0392b';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#f4ede2';
  ctx.font = '700 104px -apple-system, Helvetica, Arial, sans-serif';
  ctx.fillText('ANT McMAHON', c.width / 2, 92);
  ctx.shadowBlur = 16;
  ctx.fillStyle = '#ff8a7a';
  ctx.font = '600 52px -apple-system, Helvetica, Arial, sans-serif';
  ctx.fillText('… THRU THE YEARS', c.width / 2, 178);
  return c;
}
const stageFasciaTex = new THREE.CanvasTexture(makeStageFasciaTexture());
const stageFasciaMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(5.6, 0.75),
  new THREE.MeshBasicMaterial({ map: stageFasciaTex })
);
// stagePlatform's audience-facing side is its +Z face (the room's entrance
// is at +Z, the stage at -Z, so this is the side people walk toward).
stageFasciaMesh.position.set(0, STAGE_TOP / 2, STAGE_Z + 3.4 / 2 + 0.02);
stageGroup.add(stageFasciaMesh);

// The stage sign IS the entry point for the solo catalogue — Ant McMahon
// doesn't get a wall panel, he gets top billing on the marquee. Clickable
// the same way the wall logos are (see the raycast hits against artMeshes
// further down), with the amp badges either side as extra, generous
// click target since the fascia text itself is a fairly thin strip.
stageFasciaMesh.userData.entry = SOLO;
artMeshes.push(stageFasciaMesh);

// amps either side — badged with the logo so the stage reads as branded
// even before anyone's clicked through, and doubles the click target for
// opening the solo catalogue
const ampLogoTex = stageTextureLoader.load('assets/ant-mcmahon.webp');
ampLogoTex.colorSpace = THREE.SRGBColorSpace;
function makeAmp(x) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 0.7), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }));
  body.position.y = 0.55;
  const grille = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1 }));
  grille.position.set(0, 0.55, 0.35);
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ map: ampLogoTex, transparent: true }));
  badge.position.set(0, 0.55, 0.36);
  badge.userData.entry = SOLO;
  g.add(body, grille, badge);
  g.position.set(x, STAGE_TOP, STAGE_Z - 0.6);
  artMeshes.push(badge);
  return g;
}
stageGroup.add(makeAmp(-2.6), makeAmp(2.6));

/* Performer placeholder — a soft glowing silhouette standing front of
   stage. Swap this for a keyed video plane once you have era clips:
   see the readme block at the bottom of this file. */
const performerMat = new THREE.MeshStandardMaterial({
  color: 0xe0392b, emissive: 0xe0392b, emissiveIntensity: 0.6, roughness: 0.5, transparent: true, opacity: 0.8
});
const performerGroup = new THREE.Group();
const pBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.8, 6, 12), performerMat);
pBody.position.y = 0.8;
const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), performerMat);
pHead.position.y = 1.34;
performerGroup.add(pBody, pHead);
performerGroup.position.set(0, STAGE_TOP, STAGE_Z + 0.9);
stageGroup.add(performerGroup);

const performerLight = new THREE.PointLight(0xe0392b, 1.1, 4, 2);
performerLight.position.set(0, 1.6, STAGE_Z + 1.3);
scene.add(performerLight);

/* Performer video — a live chroma-keyed clip standing in the same
   spot as the placeholder, shown instead of it whenever the open
   band has a `performerVideo` set in data.js. Green (or blue) is
   keyed out live in a shader so any clip on a plain green/blue
   background just works — no pre-baked alpha video needed. */
const performerVideoEl = document.createElement('video');
performerVideoEl.muted = true;
performerVideoEl.loop = true;
performerVideoEl.playsInline = true;
performerVideoEl.setAttribute('playsinline', '');
performerVideoEl.setAttribute('webkit-playsinline', '');
performerVideoEl.crossOrigin = 'anonymous';
performerVideoEl.preload = 'auto';
performerVideoEl.style.display = 'none';
document.body.appendChild(performerVideoEl);

const performerVideoTexture = new THREE.VideoTexture(performerVideoEl);
// Deliberately NOT setting colorSpace = SRGBColorSpace here: that flag makes
// the GPU auto-linearize every texel before our shader ever sees it, which
// silently shifts the chroma-key math's input range and can leave green
// mostly un-keyed (a solid blocky clip instead of a clean cutout). We want
// the raw encoded pixel values for keying, so colour space stays default.
performerVideoTexture.minFilter = THREE.LinearFilter;
performerVideoTexture.magFilter = THREE.LinearFilter;

// Default crop (fractions of the raw video frame: left, top, right, bottom)
// trims a little dead space around a typical portrait performance clip —
// headroom above, floor below, air either side — so the keyed figure
// fills the stage spot instead of floating in a sea of screen. Override
// per band with `performerVideoCrop` in data.js if a clip needs different
// framing.
const DEFAULT_PERFORMER_CROP = { left: 0.14, top: 0.08, right: 0.86, bottom: 0.985 };

const performerVideoMat = new THREE.ShaderMaterial({
  uniforms: {
    map: { value: performerVideoTexture },
    texel: { value: new THREE.Vector2(1 / 720, 1 / 1280) },
    uvMin: { value: new THREE.Vector2(DEFAULT_PERFORMER_CROP.left, DEFAULT_PERFORMER_CROP.top) },
    uvMax: { value: new THREE.Vector2(DEFAULT_PERFORMER_CROP.right, DEFAULT_PERFORMER_CROP.bottom) },
    keyThreshold: { value: 0.04 },
    keySmoothing: { value: 0.12 },
    spillSuppress: { value: 0.6 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    uniform vec2 texel;
    uniform vec2 uvMin;
    uniform vec2 uvMax;
    uniform float keyThreshold;
    uniform float keySmoothing;
    uniform float spillSuppress;
    varying vec2 vUv;

    float chromaAt(vec2 uv) {
      vec3 c = texture2D(map, uv).rgb;
      return c.g - max(c.r, c.b);
    }

    void main() {
      vec2 uv = mix(uvMin, uvMax, vUv);
      vec3 baseColor = texture2D(map, uv).rgb;

      // Note: we don't guard against an all-black "undecoded" frame here
      // any more — a per-pixel darkness check can't tell that apart from
      // legitimately dark content (a black hat, black clothing, shadow),
      // and ends up punching holes through it. The mesh is never revealed
      // until the video element proves it's actually decoding real frames
      // (see revealPerformerVideoIfReady()), so by the time this shader
      // ever runs on screen, "flat black because nothing loaded yet" is
      // already ruled out — any black we see here is real black content.

      // Average the key signal over a small neighbourhood — real-world
      // greenscreen footage (uneven lighting, video compression) is
      // noisy pixel-to-pixel, and blurring just the keying decision
      // (not the visible colour) keeps edges clean without speckling.
      float chroma = chromaAt(uv) * 2.0;
      chroma += chromaAt(uv + vec2(texel.x, 0.0));
      chroma += chromaAt(uv - vec2(texel.x, 0.0));
      chroma += chromaAt(uv + vec2(0.0, texel.y));
      chroma += chromaAt(uv - vec2(0.0, texel.y));
      chroma /= 6.0;

      float alpha = 1.0 - smoothstep(keyThreshold, keyThreshold + keySmoothing, chroma);
      vec3 color = baseColor;
      float spill = max(chroma, 0.0);
      color.g -= spill * spillSuppress;
      if (alpha < 0.03) discard;
      gl_FragColor = vec4(color, alpha);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false
});

const PERFORMER_VIDEO_HEIGHT = 1.9;
const performerVideoMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(PERFORMER_VIDEO_HEIGHT * 0.5625, PERFORMER_VIDEO_HEIGHT),
  performerVideoMat
);
performerVideoMesh.position.set(0, STAGE_TOP + PERFORMER_VIDEO_HEIGHT / 2, STAGE_Z + 0.9);
performerVideoMesh.visible = false;
performerVideoMesh.renderOrder = 5;
stageGroup.add(performerVideoMesh);

function applyPerformerCrop(crop, vw, vh) {
  const c = Object.assign({}, DEFAULT_PERFORMER_CROP, crop || {});
  // Video textures sample with v=0 at the BOTTOM of the source frame and
  // v=1 at the TOP (the opposite of the top/bottom crop fields, which are
  // written in plain image terms: top=0 is the frame's top edge, bottom=1
  // is its bottom edge). Flip here so the crop fields mean what they say —
  // without this, "top" was actually controlling what shows near the
  // floor and "bottom" was controlling what shows near the head, which is
  // backwards and (for any crop that trims a lot off one end, like a tight
  // headroom crop) visibly chops off the wrong end of the performer.
  performerVideoMat.uniforms.uvMin.value.set(c.left, 1 - c.bottom);
  performerVideoMat.uniforms.uvMax.value.set(c.right, 1 - c.top);
  performerVideoMat.uniforms.texel.value.set(1 / vw, 1 / vh);
  const cropW = (c.right - c.left) * vw;
  const cropH = (c.bottom - c.top) * vh;
  const h = PERFORMER_VIDEO_HEIGHT;
  const w = h * (cropW / cropH);
  performerVideoMesh.geometry.dispose();
  performerVideoMesh.geometry = new THREE.PlaneGeometry(w, h);
}

let pendingPerformerCrop = null;
performerVideoEl.addEventListener('loadedmetadata', () => {
  const vw = performerVideoEl.videoWidth || 720;
  const vh = performerVideoEl.videoHeight || 1280;
  applyPerformerCrop(pendingPerformerCrop, vw, vh);
});

// Only ever swap the placeholder OUT once the video is actually decoding
// real frames — never on tap alone. That way a slow load, a bad path, or a
// format the browser can't play just quietly keeps the glowing placeholder
// on stage instead of showing a broken/blank block in its place.
let wantPerformerVideo = false;
function revealPerformerVideoIfReady() {
  if (!wantPerformerVideo) return;
  if (performerVideoEl.readyState >= performerVideoEl.HAVE_CURRENT_DATA) {
    performerGroup.visible = false;
    performerVideoMesh.visible = true;
  }
}
performerVideoEl.addEventListener('playing', revealPerformerVideoIfReady);
performerVideoEl.addEventListener('canplay', revealPerformerVideoIfReady);
performerVideoEl.addEventListener('error', () => {
  wantPerformerVideo = false;
  performerVideoMesh.visible = false;
  performerGroup.visible = true;
});

let currentPerformerSrc = null;
function showPerformerVideo(entry) {
  wantPerformerVideo = true;
  // Keep showing the placeholder until the video proves it can actually play.
  performerVideoMesh.visible = false;
  performerGroup.visible = true;
  const src = entry.performerVideo;
  if (currentPerformerSrc !== src) {
    currentPerformerSrc = src;
    pendingPerformerCrop = entry.performerVideoCrop || null;
    performerVideoEl.src = src;
    performerVideoEl.load();
  }
  performerVideoEl.play().then(revealPerformerVideoIfReady).catch(() => {});
  // Already loaded (e.g. reopening the same band) — reveal immediately.
  revealPerformerVideoIfReady();
}
function hidePerformerVideo() {
  wantPerformerVideo = false;
  performerVideoMesh.visible = false;
  performerGroup.visible = true;
  performerVideoEl.pause();
}

/* Big screen behind the stage */
const screenCanvas = document.createElement('canvas');
screenCanvas.width = 512; screenCanvas.height = 288;
const screenCtx = screenCanvas.getContext('2d');
const screenTexture = new THREE.CanvasTexture(screenCanvas);
screenTexture.colorSpace = THREE.SRGBColorSpace;

// Big screen fills almost the whole back wall (16:9, height-constrained so
// it never has to squash to fit) rather than floating as a small monitor
// above the stage — makes performer/lyric videos land with real impact
// instead of getting lost at a distance.
const SCREEN_H = 4.4;
const SCREEN_W = SCREEN_H * (16 / 9);
const SCREEN_Y = 2.5;
const SCREEN_Z = -ROOM_D / 2 + 0.08;
// Black backing, exactly frame-sized, sitting just behind the picture. When
// a track's video isn't itself 16:9 (a vertical phone clip, say) the picture
// mesh below is scaled down to the correct aspect ratio rather than
// stretched, and this backing shows through as proper letterbox/pillarbox
// bars instead of exposing whatever's behind the stage.
const screenBacking = new THREE.Mesh(
  new THREE.PlaneGeometry(SCREEN_W, SCREEN_H),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
screenBacking.position.set(0, SCREEN_Y, SCREEN_Z - 0.015);
stageGroup.add(screenBacking);

const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W, SCREEN_H), screenMat);
screenMesh.position.set(0, SCREEN_Y, SCREEN_Z);
stageGroup.add(screenMesh);

// Fit the picture mesh to a given aspect ratio (width/height) inside the
// fixed SCREEN_W x SCREEN_H frame, preserving it rather than stretching —
// "contain" behavior. Resets to filling the whole frame when aspect is null.
function fitScreenAspect(aspect) {
  if (!aspect) { screenMesh.scale.set(1, 1, 1); return; }
  const frameAspect = SCREEN_W / SCREEN_H;
  if (aspect > frameAspect) {
    screenMesh.scale.set(1, (SCREEN_W / aspect) / SCREEN_H, 1);
  } else {
    screenMesh.scale.set((SCREEN_H * aspect) / SCREEN_W, 1, 1);
  }
}

// A track can carry its own video (e.g. a full lyric video) instead of an
// audio-only file, in which case it plays — sound and all — on this same
// big screen behind the stage rather than through the hidden audio
// element. Swap screenMat's map between the canvas (band logo / track
// title) and this video texture depending on what's currently playing.
const screenVideoEl = document.createElement('video');
screenVideoEl.playsInline = true;
screenVideoEl.setAttribute('playsinline', '');
screenVideoEl.setAttribute('webkit-playsinline', '');
screenVideoEl.crossOrigin = 'anonymous';
screenVideoEl.preload = 'auto';
screenVideoEl.style.display = 'none';
document.body.appendChild(screenVideoEl);
const screenVideoTexture = new THREE.VideoTexture(screenVideoEl);
screenVideoTexture.colorSpace = THREE.SRGBColorSpace;
let screenShowingVideo = false;
// Portrait phone clips are just as likely here as landscape ones — size the
// picture to the file's real aspect ratio once it's known, rather than
// assuming 16:9 (fitScreenAspect is defined further down, after SCREEN_W/H).
screenVideoEl.addEventListener('loadedmetadata', () => {
  if (screenShowingVideo && screenVideoEl.videoWidth && screenVideoEl.videoHeight) {
    fitScreenAspect(screenVideoEl.videoWidth / screenVideoEl.videoHeight);
  }
});
// thin frame, sitting a touch further back so its edge peeks out all round
const screenFrame = new THREE.Mesh(
  new THREE.PlaneGeometry(SCREEN_W + 0.2, SCREEN_H + 0.2),
  new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.7 })
);
screenFrame.position.set(0, SCREEN_Y, SCREEN_Z - 0.03);
stageGroup.add(screenFrame);

/* ---------------- Bar ---------------- */
const barGroup = new THREE.Group();
const barLen = 9;
const barTopMat = new THREE.MeshStandardMaterial({ color: 0x140b08, roughness: 0.35, metalness: 0.15 });
// leopard-print bar front (the -x face looks out into the room)
const barCounter = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 0.95, barLen),
  [barTopMat, leopardMaterial(barLen, 0.95), barTopMat, barTopMat, leopardMaterial(0.7, 0.95), leopardMaterial(0.7, 0.95)]
);
barCounter.position.set(ROOM_W / 2 - 0.55, 0.48, STAGE_Z + 8.5);
barGroup.add(barCounter);

const barUnderglow = new THREE.Mesh(
  new THREE.BoxGeometry(0.74, 0.06, barLen),
  new THREE.MeshBasicMaterial({ color: 0xffb347 })
);
barUnderglow.position.set(ROOM_W / 2 - 0.55, 0.06, STAGE_Z + 8.5);
barGroup.add(barUnderglow);

// shelves with bottle-like cylinders
for (let shelf = 0; shelf < 3; shelf++) {
  const shelfMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.03, barLen - 1),
    new THREE.MeshStandardMaterial({ color: 0x1a1210, roughness: 0.6 })
  );
  shelfMesh.position.set(ROOM_W / 2 - 0.06, 1.15 + shelf * 0.45, STAGE_Z + 8.5);
  barGroup.add(shelfMesh);
  for (let b = 0; b < 14; b++) {
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.045, 0.28, 8),
      new THREE.MeshStandardMaterial({ color: [0x2a6b3a, 0x7a1e1e, 0xc9a227, 0x1a1a1a][b % 4], roughness: 0.2, metalness: 0.1 })
    );
    bottle.position.set(ROOM_W / 2 - 0.06, 1.15 + shelf * 0.45 + 0.16, STAGE_Z + 8.5 - (barLen - 1) / 2 + 0.35 + b * 0.32);
    barGroup.add(bottle);
  }
}
scene.add(barGroup);

// hanging pendant lights over the bar
for (let i = 0; i < 3; i++) {
  const z = STAGE_Z + 6 + i * 2.5;
  const cordTop = ROOM_H, bulbY = ROOM_H - 0.9;
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, cordTop - bulbY, 6), new THREE.MeshBasicMaterial({ color: 0x111111 }));
  cord.position.set(ROOM_W / 2 - 0.9, (cordTop + bulbY) / 2, z);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.14, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0x120a08, side: THREE.DoubleSide }));
  shade.position.set(ROOM_W / 2 - 0.9, bulbY + 0.1, z);
  const bulb = new THREE.PointLight(0xffb347, 1.1, 3, 2);
  bulb.position.set(ROOM_W / 2 - 0.9, bulbY, z);
  scene.add(cord, shade, bulb);
}

/* ---------------- Wall art ---------------- */
const textureLoader = new THREE.TextureLoader();
const loadedLogoImages = {}; // for the big-screen canvas idle cycle

function makeNeonTextTexture(text, sub) {
  const c = document.createElement('canvas');
  c.width = 900; c.height = 900;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff2d55'; ctx.shadowBlur = 40;
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 92px -apple-system, Helvetica, Arial, sans-serif';
  wrapText(ctx, text, c.width / 2, c.height / 2 - 20, 780, 100);
  if (sub) {
    ctx.shadowBlur = 18;
    ctx.font = '600 34px -apple-system, Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#ff8a7a';
    ctx.fillText(sub, c.width / 2, c.height / 2 + 110);
  }
  return c;
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '', lines = [];
  for (const w of words) {
    const test = line + w + ' ';
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w + ' '; }
    else line = test;
  }
  lines.push(line);
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l.trim(), x, startY + i * lineHeight));
}

function placeArt(entry, index, total) {
  const isLeft = index % 2 === 0;
  const sideX = (ROOM_W / 2 - 0.06) * (isLeft ? -1 : 1);
  const usableLen = ROOM_D - 6.5; // leave room near stage & entrance
  const startZ = ENTRANCE_Z - 1.6;
  const step = usableLen / (Math.ceil(total / 2) - 1 || 1);
  const rowIndex = Math.floor(index / 2);
  const z = startZ - rowIndex * step;

  let texture;
  if (entry.isTextSign) {
    texture = new THREE.CanvasTexture(makeNeonTextTexture(entry.name.toUpperCase(), entry.years));
  } else {
    texture = textureLoader.load(entry.logo);
    texture.colorSpace = THREE.SRGBColorSpace;
    const img = new Image();
    img.src = entry.logo;
    loadedLogoImages[entry.id] = img;
  }

  const frameW = 1.75, frameH = 1.75;
  // a plain dark backing panel, oversized, so the logo reads clearly
  // against the busy graffiti instead of blending into it
  const backing = new THREE.Mesh(
    new THREE.PlaneGeometry(frameW + 0.5, frameH + 0.5),
    new THREE.MeshStandardMaterial({ color: 0x040404, roughness: 0.8 })
  );
  backing.position.z = 0.02;
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(frameW + 0.12, frameH + 0.12, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x060606, roughness: 0.6 })
  );
  frame.position.z = 0.03;
  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(frameW, frameH),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  const group = new THREE.Group();
  art.position.z = 0.07;
  group.add(backing, frame, art);
  group.position.set(sideX, 1.85, z);
  group.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
  group.userData.entry = entry;
  scene.add(group);
  art.userData.entry = entry;
  frame.userData.entry = entry;
  backing.userData.entry = entry;
  artMeshes.push(art, frame, backing);

  // spotlight picking it out of the busy wall — brighter and wider than
  // before so the artwork wins against the graffiti behind it
  const spot = new THREE.SpotLight(0xffffff, 3.2, 4.5, Math.PI / 6, 0.45, 1.3);
  spot.position.set(sideX * 0.6, 2.9, z + 0.2);
  spot.target.position.set(sideX, 1.85, z);
  scene.add(spot, spot.target);
}

WALL_ORDER.forEach((entry, i) => placeArt(entry, i, WALL_ORDER.length));

/* ---------------- Scattered posters / flyers ---------------- */
const posterPhrases = [
  ['LIVE', 'THIS SATURDAY'],
  ['NO', 'REFUNDS'],
  ['LOUD', 'FAST', 'RULES'],
  ['SOLD', 'OUT'],
  ['GIG', 'NIGHT'],
  ['GUEST', 'LIST', "DOESN'T", 'EXIST'],
  ['GENUINE', 'DIVE', 'BAR'],
  ['STAY', 'FERAL']
];

function makePosterTexture(lines) {
  const w = 480, h = 620;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');

  // torn/aged paper base
  ctx.fillStyle = '#e7e0cf';
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = `rgba(120,105,80,${Math.random() * 0.08})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 3, Math.random() * 3);
  }
  // ragged dark border to fake a torn edge
  ctx.strokeStyle = 'rgba(30,20,15,0.5)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 14) ctx.lineTo(x, (x === 0 ? 0 : Math.random() * 8));
  for (let y = 0; y <= h; y += 14) ctx.lineTo(w - Math.random() * 8, y);
  ctx.stroke();

  ctx.fillStyle = '#1a1310';
  ctx.textAlign = 'center';
  const fontSize = lines.length > 2 ? 62 : 84;
  ctx.font = `900 ${fontSize}px Impact, "Arial Narrow", sans-serif`;
  const lineH = fontSize * 1.05;
  const startY = h / 2 - ((lines.length - 1) * lineH) / 2;
  lines.forEach((l, i) => {
    ctx.save();
    ctx.translate(w / 2 + (Math.random() - 0.5) * 6, startY + i * lineH);
    ctx.rotate((Math.random() - 0.5) * 0.05);
    ctx.fillText(l, 0, 0);
    ctx.restore();
  });

  // a couple of staple/tape marks
  ctx.fillStyle = 'rgba(200,195,180,0.7)';
  ctx.fillRect(w * 0.15 - 18, 6, 36, 14);
  ctx.fillRect(w * 0.85 - 18, 6, 36, 14);

  return c;
}

// Real gig-poster photos (data.js: POSTER_IMAGES) get mixed in with the
// generated placeholder posters below — same loader the wall-art logos use
// further down the file, just declared here since this code runs first.
const posterImageLoader = new THREE.TextureLoader();
const posterImagePool = (typeof POSTER_IMAGES !== 'undefined' ? POSTER_IMAGES.slice() : []);
// shuffle once so repeated runs/reloads don't always show the same handful
for (let i = posterImagePool.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [posterImagePool[i], posterImagePool[j]] = [posterImagePool[j], posterImagePool[i]];
}
let posterImageIndex = 0;
function nextPosterImage() {
  if (!posterImagePool.length) return null;
  const src = posterImagePool[posterImageIndex % posterImagePool.length];
  posterImageIndex++;
  return src;
}

function placePoster(sideSign, z, lines, yBase) {
  // Small random pull-in from the wall so densely packed/overlapping
  // posters don't sit perfectly coplanar — exact coplanar overlap is what
  // was causing the flicker/"fluttering" as the camera moved (z-fighting).
  const depthJitter = 0.01 + Math.random() * 0.05;
  const sideX = (ROOM_W / 2 - 0.04 - depthJitter) * sideSign;
  const realSrc = nextPosterImage();
  let w = 0.62, h = 0.8, texture;
  if (realSrc) {
    // real photos vary in aspect ratio — keep height consistent with the
    // generated posters and let width follow the source image once loaded.
    // Aspect is clamped so an unusually wide/landscape photo can't grow
    // past the spacing between posters and start overlapping its neighbour.
    h = 0.85;
    w = h * 0.7;
    texture = posterImageLoader.load(realSrc, (tex) => {
      const img = tex.image;
      if (img && img.width && img.height) {
        const aspect = Math.min(img.width / img.height, 0.8);
        poster.geometry.dispose();
        poster.geometry = new THREE.PlaneGeometry(h * aspect, h);
      }
    });
    texture.colorSpace = THREE.SRGBColorSpace;
  } else {
    texture = new THREE.CanvasTexture(makePosterTexture(lines));
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  const poster = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9 })
  );
  poster.position.set(sideX, (yBase != null ? yBase : 1.55) + (Math.random() - 0.5) * 0.2, z);
  poster.rotation.y = sideSign > 0 ? -Math.PI / 2 : Math.PI / 2;
  poster.rotation.z = (Math.random() - 0.5) * 0.04; // just a hint of crooked, not enough to overlap a neighbour
  scene.add(poster);
}

{
  // One real gig-poster photo each, spread out evenly along both side
  // walls in a single readable band above the row of band-logo frames
  // (frame tops sit around y=3.0; ceiling is at ROOM_H=5.4) — rather than
  // the old densely-overlapping, hard-to-read flyer wall. With only a
  // few dozen real photos, spread-out-and-readable beats stacked; add
  // more paths to POSTER_IMAGES in data.js any time to fill the row out
  // further — no other app.js changes needed.
  const usableLen = ROOM_D - 6.5;
  const startZ = ENTRANCE_Z - 1.6;
  const posterY = 3.55;
  const total = posterImagePool.length || posterPhrases.length;
  const perSide = Math.ceil(total / 2);
  [-1, 1].forEach((sideSign, sIdx) => {
    const sideCount = sIdx === 0 ? perSide : total - perSide;
    if (sideCount <= 0) return;
    const step = usableLen / (sideCount + 1);
    for (let n = 0; n < sideCount; n++) {
      const z = startZ - step * (n + 1);
      placePoster(sideSign, z, posterPhrases[n % posterPhrases.length], posterY);
    }
  });
}

/* ---------------- Idle screen cycle ---------------- */
let idleIndex = 0;
let idleTimer = 0;
const IDLE_INTERVAL = 4.2;
let screenMode = 'idle'; // 'idle' | 'band'
let activeEntry = null;
let activeTrack = null;

function drawScreen() {
  screenCtx.fillStyle = '#000';
  screenCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);

  const entry = screenMode === 'band' ? activeEntry : WALL_ORDER[idleIndex];
  const img = entry && !entry.isTextSign ? loadedLogoImages[entry.id] : null;

  if (img && img.complete && img.naturalWidth) {
    const size = 220;
    const x = screenCanvas.width / 2 - size / 2;
    const y = screenCanvas.height / 2 - size / 2 - (activeTrack ? 20 : 0);
    screenCtx.globalAlpha = 1;
    screenCtx.drawImage(img, x, y, size, size);
  } else if (entry && entry.isTextSign) {
    screenCtx.fillStyle = '#ff2d55';
    screenCtx.textAlign = 'center'; screenCtx.textBaseline = 'middle';
    screenCtx.font = '700 40px -apple-system, Helvetica, Arial, sans-serif';
    screenCtx.shadowColor = '#ff2d55'; screenCtx.shadowBlur = 20;
    screenCtx.fillText('LATEST RELEASES', screenCanvas.width / 2, screenCanvas.height / 2 - (activeTrack ? 20 : 0));
    screenCtx.shadowBlur = 0;
  }

  if (screenMode === 'band' && entry) {
    screenCtx.shadowBlur = 0;
    screenCtx.fillStyle = 'rgba(255,255,255,0.92)';
    screenCtx.textAlign = 'center';
    screenCtx.font = '600 26px -apple-system, Helvetica, Arial, sans-serif';
    screenCtx.fillText(entry.name, screenCanvas.width / 2, screenCanvas.height - (activeTrack ? 56 : 34));
    if (activeTrack) {
      screenCtx.font = '400 20px -apple-system, Helvetica, Arial, sans-serif';
      screenCtx.fillStyle = 'rgba(255,255,255,0.6)';
      screenCtx.fillText(activeTrack.title, screenCanvas.width / 2, screenCanvas.height - 28);
    }
  }
  screenTexture.needsUpdate = true;
}

/* ---------------- Panel / player UI ---------------- */
const panel = document.getElementById('panel');
const panelLogo = document.getElementById('panelLogo');
const panelName = document.getElementById('panelName');
const panelYears = document.getElementById('panelYears');
const panelAlbums = document.getElementById('panelAlbums');
const panelSpotify = document.getElementById('panelSpotify');
const panelClose = document.getElementById('panelClose');
const hint = document.getElementById('hint');

const player = document.getElementById('player');
const playerArt = document.getElementById('playerArt');
const playerTitle = document.getElementById('playerTitle');
const playerBand = document.getElementById('playerBand');
const playerBtn = document.getElementById('playerBtn');
const toast = document.getElementById('toast');

const audio = new Audio();
audio.preload = 'none';

let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function logoSrc(entry) {
  return entry.isTextSign ? 'assets/icon-192.png' : entry.logo;
}

function openPanel(entry) {
  activeEntry = entry;
  screenMode = 'band';
  panelLogo.src = logoSrc(entry);
  panelLogo.style.display = entry.isTextSign ? 'none' : 'block';
  panelName.textContent = entry.name;
  panelYears.textContent = entry.years;
  panelSpotify.style.display = entry.spotify ? 'inline-flex' : 'none';
  if (entry.spotify) panelSpotify.href = entry.spotify;
  panelAlbums.innerHTML = '';

  entry.albums.forEach((album, ai) => {
    const albumEl = document.createElement('div');
    albumEl.className = 'album';
    const h3 = document.createElement('h3');
    h3.textContent = `${album.title} — ${album.year}`;
    albumEl.appendChild(h3);
    // Videos (full clip + sound, plays on the big screen behind the stage)
    // and plain audio tracks are listed as two separate groups rather than
    // mixed together, each numbered from 1 within its own group.
    function renderTrackGroup(label, tracks) {
      if (!tracks.length) return;
      const groupLabel = document.createElement('div');
      groupLabel.className = 'trackGroupLabel';
      groupLabel.textContent = label;
      albumEl.appendChild(groupLabel);
      tracks.forEach((track, ti) => {
        const row = document.createElement('div');
        row.className = 'track';
        const hint = track.video
          ? '<small>Plays as a video on the big screen</small>'
          : (!track.url ? '<small>Tap to preview on screen · no audio file yet</small>' : '');
        row.innerHTML = `<div class="trackNum">${ti + 1}</div><div class="trackTitle">${track.title}${hint}</div><div class="trackDur">${track.duration}</div>`;
        row.addEventListener('click', () => selectTrack(entry, album, track, row));
        albumEl.appendChild(row);
      });
    }
    renderTrackGroup('On the big screen', album.tracks.filter((t) => t.video));
    renderTrackGroup('Audio', album.tracks.filter((t) => !t.video));
    panelAlbums.appendChild(albumEl);
  });

  panel.classList.add('open');
  applyEraColor(entry.color);
  if (entry.performerVideo) {
    showPerformerVideo(entry);
  } else {
    hidePerformerVideo();
  }
  drawScreen();
}
function closePanel() {
  panel.classList.remove('open');
  // Note: the stage performer (capsule or video) intentionally stays as
  // whichever era was last opened, same as the stage lighting colour —
  // it only changes when a different wall logo is tapped.
}
panelClose.addEventListener('click', closePanel);

let currentRowEl = null;
function selectTrack(entry, album, track, rowEl) {
  activeTrack = track;
  if (currentRowEl) currentRowEl.classList.remove('playing');
  rowEl.classList.add('playing');
  currentRowEl = rowEl;

  playerArt.src = logoSrc(entry);
  playerTitle.textContent = track.title;
  playerBand.textContent = entry.name;
  player.classList.add('show');

  if (track.video) {
    // Full video (sound included) takes over the big screen — stop the
    // plain audio element so the two don't play on top of each other.
    audio.pause();
    screenShowingVideo = true;
    screenMat.map = screenVideoTexture;
    fitScreenAspect(null); // reset to full frame until real dimensions arrive
    screenVideoEl.src = track.video;
    screenVideoEl.currentTime = 0;
    screenVideoEl.play().then(() => { playerBtn.textContent = '❚❚'; }).catch(() => { playerBtn.textContent = '▶'; });
  } else {
    screenShowingVideo = false;
    screenVideoEl.pause();
    screenMat.map = screenTexture;
    fitScreenAspect(null);
    drawScreen();
    if (track.url) {
      audio.src = track.url;
      audio.play().then(() => { playerBtn.textContent = '❚❚'; }).catch(() => { playerBtn.textContent = '▶'; });
    } else {
      audio.pause();
      playerBtn.textContent = '▶';
      showToast('No audio file yet for this track — add a URL in data.js');
    }
  }
}
playerBtn.addEventListener('click', () => {
  const media = screenShowingVideo ? screenVideoEl : audio;
  if (!media.src) return;
  if (media.paused) { media.play(); playerBtn.textContent = '❚❚'; }
  else { media.pause(); playerBtn.textContent = '▶'; }
});

function applyEraColor(hex) {
  const c = new THREE.Color(hex);
  performerMat.color.copy(c);
  performerMat.emissive.copy(c);
  performerLight.color.copy(c);
  stageFill.color.copy(c);
}
function resetEraColor() {
  const c = new THREE.Color(0xe0392b);
  performerMat.color.copy(c);
  performerMat.emissive.copy(c);
  performerLight.color.copy(c);
  stageFill.color.copy(c);
}

/* ---------------- Pointer interaction (tap vs drag, click art, walk-to) ---------------- */
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();
let downPos = null;
let downTime = 0;

function setPointerFromEvent(e) {
  const x = (e.clientX ?? e.touches?.[0]?.clientX);
  const y = (e.clientY ?? e.touches?.[0]?.clientY);
  pointerNDC.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
  return { x, y };
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  downPos = { x: e.clientX, y: e.clientY };
  downTime = performance.now();
});

renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downPos) return;
  const dx = e.clientX - downPos.x, dy = e.clientY - downPos.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const dt = performance.now() - downTime;
  downPos = null;
  if (dist > 8 || dt > 600) return; // treat as a drag, not a tap

  setPointerFromEvent(e);
  raycaster.setFromCamera(pointerNDC, camera);
  const hits = raycaster.intersectObjects(artMeshes, false);
  if (hits.length) {
    const entry = hits[0].object.userData.entry;
    if (entry) { openPanel(entry); hint.style.opacity = '0'; }
    return;
  }

  // otherwise, walk toward wherever the floor was tapped
  const floorHits = raycaster.intersectObject(floorMesh, false);
  if (floorHits.length) {
    const p = floorHits[0].point;
    const margin = 1.4;
    walkTarget.set(
      THREE.MathUtils.clamp(p.x, -ROOM_W / 2 + margin, ROOM_W / 2 - margin),
      controls.target.y,
      THREE.MathUtils.clamp(p.z, -ROOM_D / 2 + margin, ROOM_D / 2 - margin)
    );
    walking = true;
    hint.style.opacity = '0';
  }
});

/* ---------------- Enter flow ---------------- */
const enterOverlay = document.getElementById('enter');
const enterBtn = document.getElementById('enterBtn');
const loadingNote = document.getElementById('loadingNote');

enterBtn.style.opacity = '0.4';
enterBtn.style.pointerEvents = 'none';
loadingNote.textContent = 'Loading the room…';

let ready = false;
window.addEventListener('load', () => {
  setTimeout(() => {
    ready = true;
    enterBtn.style.opacity = '1';
    enterBtn.style.pointerEvents = 'auto';
    loadingNote.textContent = 'Best with sound on';
  }, 500);
});

enterBtn.addEventListener('click', () => {
  if (!ready) return;
  // unlock audio on iOS/Safari
  audio.play().catch(() => {});
  audio.pause();
  enterOverlay.classList.add('hidden');
  setTimeout(() => { hint.style.transition = 'opacity 1s ease'; }, 3500);
  setTimeout(() => { hint.style.opacity = '0'; }, 4500);
});

/* ---------------- Render loop ---------------- */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  const t = clock.getElapsedTime();

  performerGroup.position.y = STAGE_TOP + Math.sin(t * 0.9) * 0.02;

  if (walking) {
    const delta = new THREE.Vector3().subVectors(walkTarget, controls.target).multiplyScalar(0.055);
    if (delta.length() < 0.01) { walking = false; }
    else {
      controls.target.add(delta);
      camera.position.add(delta);
    }
  }

  if (screenMode === 'idle') {
    idleTimer += dt;
    if (idleTimer > IDLE_INTERVAL) {
      idleTimer = 0;
      idleIndex = (idleIndex + 1) % WALL_ORDER.length;
      drawScreen();
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
drawScreen();
animate();

/* ============================================================
   README — wiring in the real thing later
   ------------------------------------------------------------
   AUDIO
     In data.js, set a track's `url` to a hosted mp3/m4a/ogg link
     (or a relative path if you add the file to this project's
     folder, e.g. "audio/rockitts-track1.mp3"). No other code
     needs to change — the mini player and the tracklist rows pick
     it up automatically.

   ALBUM COVERS
     Set a track's parent album `cover` to an image path. Currently
     unused visually beyond the band logo — hook `album.cover` into
     drawScreen()/openPanel() if you want per-album art on the big
     screen instead of the band logo.

   PERFORMER CLIPS (the "you on stage" effect)
     Live. `performerGroup` (the glowing placeholder silhouette) is
     shown for any band with `performerVideo: null` in data.js. Set
     `performerVideo` to a video file/URL and, when that band's
     panel is open, a keyed video plane takes its place on stage
     instead — the green/blue background is removed live by a
     shader (see `performerVideoMat` above), no pre-baked alpha
     video needed. Just:
       1. Get a clip of you performing on a plain, evenly-lit
          green (or blue) background.
       2. Drop the file in assets/performers/ (or host it anywhere)
          and set that band's `performerVideo` in data.js to its
          path/URL.
     That's it — no other code changes. If a clip's green isn't
     keying out cleanly (patchy/uneven lighting), nudge
     `keyThreshold` / `keySmoothing` in `performerVideoMat`'s
     uniforms above (lower threshold = keys out more, at the risk
     of eating into the subject).

   ADDING/REMOVING WALL ART
     Add or remove entries from BANDS / WALL_ORDER in data.js —
     placeArt() auto-spaces whatever's in that list along the walls.
   ============================================================ */
