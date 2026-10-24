#!/usr/bin/env node
// Generates the Ariadne logo set. Run from anywhere:
//   node logo/generate.mjs
// All geometry lives in a 512x512 space centred on (256, 256).

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

const INK = "#11162A";
const INK_DEEP = "#0E1222";
const INK_SOFT = "#1C2444";
const PAPER = "#E9E4D8";
const PAPER_BRIGHT = "#F5F2EA";
const GOLD = "#E8B04B";
const GOLD_DARK = "#B8791A";
const MUTED = "#AEB6CE";

const RAD = Math.PI / 180;
const C = 256;

const pt = (r, deg) => [C + r * Math.cos(deg * RAD), C + r * Math.sin(deg * RAD)];

// --- Geometry -------------------------------------------------------------

const R0 = 226; // outer start of the thread
const K = 3.55; // degrees of rotation per unit of radius
const TH0 = -90; // thread starts at the top
const thetaAt = (r) => TH0 + K * (R0 - r);

const RINGS = [214, 166, 118, 70];
const CORRIDOR = 56; // desired gap width in user units

function arcPath(r, gapCenter, gapWidth) {
  const start = gapCenter + gapWidth / 2;
  const end = gapCenter + 360 - gapWidth / 2;
  const [x1, y1] = pt(r, start);
  const [x2, y2] = pt(r, end);
  const large = end - start > 180 ? 1 : 0;
  return {
    d: `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
  };
}

function threadPath() {
  const pts = [];
  for (let r = R0; r >= 14; r -= 2) pts.push(pt(r, thetaAt(r)));
  return "M " + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ");
}

function mark({ ring, thread, ringWidth = 9, threadWidth = 11 }) {
  const rings = RINGS.map((r) => {
    const gapDeg = (CORRIDOR / r) * (180 / Math.PI);
    const { d } = arcPath(r, thetaAt(r), gapDeg);
    return `<path d="${d}" fill="none" stroke="${ring}" stroke-width="${ringWidth}" stroke-linecap="round"/>`;
  }).join("\n    ");

  const [ox, oy] = pt(R0, thetaAt(R0));
  const [ix, iy] = pt(14, thetaAt(14));

  return `<g>
    ${rings}
    <path d="${threadPath()}" fill="none" stroke="${thread}" stroke-width="${threadWidth}" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${ox.toFixed(2)}" cy="${oy.toFixed(2)}" r="9" fill="${thread}"/>
    <circle cx="${ix.toFixed(2)}" cy="${iy.toFixed(2)}" r="7" fill="${thread}"/>
  </g>`;
}

const FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">\n${body}\n</svg>\n`;

// --- Files ----------------------------------------------------------------

// Square icon (avatars, favicons, social)
const icon = svg(
  512,
  512,
  `  <rect x="8" y="8" width="496" height="496" rx="112" fill="${INK}"/>
  ${mark({ ring: PAPER, thread: GOLD })}`
);

// Horizontal lockup for light backgrounds
const logo = svg(
  760,
  220,
  `  <g transform="translate(2 2) scale(0.42)">${mark({ ring: INK, thread: GOLD_DARK })}</g>
  <text x="272" y="122" font-family='${FONT}' font-size="92" font-weight="700" letter-spacing="-1.5" fill="${INK}">Ariadne</text>
  <text x="278" y="166" font-family='${FONT}' font-size="20" font-weight="600" letter-spacing="6.5" fill="${GOLD_DARK}">PRODUCT DISCOVERY</text>`
);

// Horizontal lockup for dark backgrounds
const logoLight = svg(
  760,
  220,
  `  <g transform="translate(2 2) scale(0.42)">${mark({ ring: PAPER, thread: GOLD })}</g>
  <text x="272" y="122" font-family='${FONT}' font-size="92" font-weight="700" letter-spacing="-1.5" fill="${PAPER_BRIGHT}">Ariadne</text>
  <text x="278" y="166" font-family='${FONT}' font-size="20" font-weight="600" letter-spacing="6.5" fill="${GOLD}">PRODUCT DISCOVERY</text>`
);

// README hero banner
const hero = svg(
  1280,
  360,
  `  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${INK_DEEP}"/>
      <stop offset="1" stop-color="${INK_SOFT}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.2" r="0.7">
      <stop offset="0" stop-color="${GOLD}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="360" fill="url(#bg)"/>
  <rect width="1280" height="360" fill="url(#glow)"/>
  <g transform="translate(846 -96) scale(1.05)" opacity="0.10">${mark({ ring: PAPER, thread: GOLD, ringWidth: 7, threadWidth: 8 })}</g>
  <g transform="translate(78 52) scale(0.5)">${mark({ ring: PAPER, thread: GOLD })}</g>
  <text x="356" y="186" font-family='${FONT}' font-size="108" font-weight="700" letter-spacing="-2" fill="${PAPER_BRIGHT}">Ariadne</text>
  <text x="362" y="236" font-family='${FONT}' font-size="26" font-weight="400" fill="${MUTED}">The thread through the labyrinth of your product vision</text>
  <rect x="364" y="266" width="96" height="5" rx="2.5" fill="${GOLD}"/>`
);

for (const [name, content] of Object.entries({
  "ariadne-icon.svg": icon,
  "ariadne-logo.svg": logo,
  "ariadne-logo-light.svg": logoLight,
  "ariadne-hero.svg": hero,
})) {
  const out = join(HERE, name);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, content);
  console.log("wrote", out);
}
