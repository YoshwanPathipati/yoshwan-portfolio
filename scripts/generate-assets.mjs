/**
 * Generates the brand assets that are committed to the repo:
 *
 *   public/og.png        1200x630 social card
 *   src/app/icon.svg     YP monogram (letters are paths, so it renders the
 *                        same everywhere with no font dependency)
 *   src/app/apple-icon.png
 *   src/app/favicon.ico
 *   public/resume.pdf    placeholder, only if a real one is not already there
 *
 * Run with: npm run assets
 *
 * The social card is rasterised by sharp, which uses system fonts. Arial Black
 * stands in for Archivo Black here; it is the closest ubiquitous heavy
 * grotesque. The output is committed, so this only needs to run when the card
 * design changes.
 */

import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const appDir = join(root, 'src', 'app');

const PAPER = '#FAFAF8';
const INK = '#101214';
const MUTED = '#5C6069';
const HAIRLINE = '#D9D8D1';
const ACCENT = '#FF4F00';

const DISPLAY = 'Arial Black, Archivo, Helvetica, sans-serif';
const MONO = 'Consolas, IBM Plex Mono, DejaVu Sans Mono, monospace';

/* ── Ground-track band for the social card ─────────────────────────────── */

const DEG = Math.PI / 180;
const INC = 53 * DEG;

function trackPath(x, y, w, h, raan, samples = 200) {
  const pts = [];
  let prevX = Number.NaN;
  let d = '';
  for (let k = 0; k <= samples; k++) {
    const u = (k / samples) * Math.PI * 2;
    const lat = Math.asin(Math.sin(INC) * Math.sin(u));
    let lon = Math.atan2(Math.cos(INC) * Math.sin(u), Math.cos(u)) + raan;
    lon = ((((lon + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
    const px = x + ((lon + Math.PI) / (Math.PI * 2)) * w;
    const py = y + ((Math.PI / 2 - lat) / Math.PI) * h;
    d += !Number.isNaN(prevX) && Math.abs(px - prevX) > w / 2 ? ` M${px.toFixed(1)} ${py.toFixed(1)}` : `${k === 0 ? 'M' : ' L'}${px.toFixed(1)} ${py.toFixed(1)}`;
    prevX = px;
    pts.push([px, py, u]);
  }
  return { d, pts };
}

function satMarks(pts, count) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const p = pts[Math.round(((i + 0.35) / count) * (pts.length - 1))];
    if (!p) continue;
    out += `<rect x="${(p[0] - 3).toFixed(1)}" y="${(p[1] - 3).toFixed(1)}" width="6" height="6" fill="${INK}"/>`;
  }
  return out;
}

function ogSvg() {
  const W = 1200;
  const H = 630;
  const inset = 28;

  const bandX = inset + 26;
  const bandY = 372;
  const bandW = W - (inset + 26) * 2;
  const bandH = 168;

  const planes = [0, 60 * DEG, 120 * DEG];
  let tracks = '';
  let sats = '';
  for (const raan of planes) {
    const { d, pts } = trackPath(bandX, bandY, bandW, bandH, raan);
    tracks += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.6" opacity="0.42"/>`;
    sats += satMarks(pts, 4);
  }

  let grid = '';
  for (let i = 0; i <= 12; i++) {
    const gx = bandX + (i / 12) * bandW;
    grid += `<line x1="${gx.toFixed(1)}" y1="${bandY}" x2="${gx.toFixed(1)}" y2="${bandY + bandH}" stroke="${MUTED}" stroke-width="1" opacity="0.16"/>`;
  }
  for (let i = 0; i <= 4; i++) {
    const gy = bandY + (i / 4) * bandH;
    grid += `<line x1="${bandX}" y1="${gy.toFixed(1)}" x2="${bandX + bandW}" y2="${gy.toFixed(1)}" stroke="${MUTED}" stroke-width="1" opacity="${i === 2 ? 0.34 : 0.16}"/>`;
  }

  const tick = (x, y, sx, sy) =>
    `<path d="M${x + 14 * sx} ${y} H${x} V${y + 14 * sy}" fill="none" stroke="${INK}" stroke-width="3"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect x="${inset}" y="${inset}" width="${W - inset * 2}" height="${H - inset * 2}" fill="none" stroke="${HAIRLINE}" stroke-width="1"/>
  ${tick(inset, inset, 1, 1)}
  ${tick(W - inset, inset, -1, 1)}
  ${tick(inset, H - inset, 1, -1)}
  ${tick(W - inset, H - inset, -1, -1)}

  <rect x="${inset + 26}" y="76" width="10" height="10" fill="${ACCENT}"/>
  <text x="${inset + 48}" y="86" font-family="${MONO}" font-size="17" letter-spacing="2.2" fill="${MUTED}">YOSHWAN PATHIPATI · CS @ VIRGINIA TECH '27 · AWS CERTIFIED</text>

  <text x="${inset + 26}" y="186" font-family="${DISPLAY}" font-size="64" font-weight="900" letter-spacing="-1" fill="${INK}">I SECURE CLOUDS</text>
  <text x="${inset + 26}" y="254" font-family="${DISPLAY}" font-size="64" font-weight="900" letter-spacing="-1" fill="${INK}">AND SIMULATE SATELLITE</text>
  <text x="${inset + 26}" y="322" font-family="${DISPLAY}" font-size="64" font-weight="900" letter-spacing="-1" fill="${INK}">CONSTELLATIONS<tspan fill="${ACCENT}">.</tspan></text>

  ${grid}
  ${tracks}
  ${sats}
  <rect x="${bandX}" y="${bandY}" width="${bandW}" height="${bandH}" fill="none" stroke="${HAIRLINE}" stroke-width="1"/>

  <text x="${inset + 26}" y="${H - inset - 26}" font-family="${MONO}" font-size="17" letter-spacing="2" fill="${INK}">YOSHWANPATHIPATI@VT.EDU</text>
  <text x="${W - inset - 26}" y="${H - inset - 26}" text-anchor="end" font-family="${MONO}" font-size="17" letter-spacing="2" fill="${MUTED}">DOC NO. YP-2027 / REV S26</text>
</svg>`;
}

/* ── YP monogram ───────────────────────────────────────────────────────── */

const monogram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="56" height="56">
  <rect width="56" height="56" fill="${INK}"/>
  <g fill="none" stroke="${PAPER}" stroke-width="5.5" stroke-linecap="butt" stroke-linejoin="miter">
    <path d="M10 16 L18.5 29 L27 16"/>
    <path d="M18.5 29 V42"/>
    <path d="M32 42 V16 H39 A7.5 7.5 0 0 1 39 31 H32"/>
  </g>
  <rect x="0" y="52" width="56" height="4" fill="${ACCENT}"/>
</svg>`;

/* ── Minimal placeholder PDF ───────────────────────────────────────────── */

function placeholderPdf() {
  const lines = [
    ['BT /F1 22 Tf 72 700 Td (YOSHWAN PATHIPATI) Tj ET'],
    ['BT /F1 11 Tf 72 676 Td (DOC NO. YP-2027  /  REV S26  /  STATUS: PLACEHOLDER) Tj ET'],
    ['BT /F1 12 Tf 72 630 Td (This is a placeholder. Replace public/resume.pdf with the real) Tj ET'],
    ['BT /F1 12 Tf 72 612 Td (document; the filename is what the download buttons point at.) Tj ET'],
  ]
    .flat()
    .join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    null, // stream, built below
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    if (i === 3) {
      pdf += `4 0 obj\n<< /Length ${lines.length} >>\nstream\n${lines}\nendstream\nendobj\n`;
    } else {
      pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
    }
  });

  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

  return Buffer.from(pdf, 'latin1');
}

/* ── ICO container around a 32x32 PNG ──────────────────────────────────── */

function ico(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, png]);
}

/* ── Run ───────────────────────────────────────────────────────────────── */

mkdirSync(publicDir, { recursive: true });

await sharp(Buffer.from(ogSvg())).png({ compressionLevel: 9 }).toFile(join(publicDir, 'og.png'));
console.log('wrote public/og.png');

writeFileSync(join(appDir, 'icon.svg'), monogram);
console.log('wrote src/app/icon.svg');

const monoBuf = Buffer.from(monogram);
await sharp(monoBuf).resize(180, 180).png().toFile(join(appDir, 'apple-icon.png'));
console.log('wrote src/app/apple-icon.png');

const png32 = await sharp(monoBuf).resize(32, 32).png().toBuffer();
writeFileSync(join(appDir, 'favicon.ico'), ico(png32));
console.log('wrote src/app/favicon.ico');

const resumePath = join(publicDir, 'resume.pdf');
if (existsSync(resumePath)) {
  console.log('skipped public/resume.pdf (already present)');
} else {
  writeFileSync(resumePath, placeholderPdf());
  console.log('wrote public/resume.pdf (placeholder)');
}
