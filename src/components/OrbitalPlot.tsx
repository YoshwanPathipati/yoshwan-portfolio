'use client';

import { useEffect, useRef } from 'react';
import { hero } from '@/lib/content';
import { useReducedMotion } from '@/lib/hooks';

/* ── Constellation model ──────────────────────────────────────────────────
   Real spherical geometry, not a decorative sine wave. A circular orbit at
   inclination i puts the sub-satellite point at

     lat = asin(sin i · sin u)
     lon = atan2(cos i · sin u, cos u) + Ω − ω⊕·t

   which is where the classic drifting sinusoid comes from. Twelve satellites,
   three planes, 53° inclination: a plausible LEO mesh.
   ───────────────────────────────────────────────────────────────────────── */

const DEG = Math.PI / 180;
const INC = 53 * DEG;
const PLANES = 3;
const PER_PLANE = 4;
const RAAN_SPACING = 60 * DEG;
const ORBIT_SECONDS = 30; // wall-clock seconds per simulated orbit
const ORBITS_PER_DAY = 15.1; // LEO; sets the westward drift per revolution
const TRACK_STEPS = 132;
const FRAME_MS = 1000 / 30;
const MAX_PULSES = 8;
const PULSE_MS = 1400;
const SPAWN_MS = 620;
const CURSOR_RADIUS = 120;
const LINK_MAX_ARC = 62 * DEG;
/** Packet positions used by the static plate (reduced motion, first paint). */
const STATIC_PULSE_T = [0.32, 0.58, 0.44, 0.71];

type Vec = { x: number; y: number; lat: number; lon: number };
type Link = { a: number; b: number };
type Pulse = { a: number; b: number; born: number };

const TAU = Math.PI * 2;

function wrapPi(a: number) {
  return ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI;
}

/** Great-circle angle between two lat/lon points, radians. */
function arc(p: Vec, q: Vec) {
  return Math.acos(
    Math.min(
      1,
      Math.max(
        -1,
        Math.sin(p.lat) * Math.sin(q.lat) +
          Math.cos(p.lat) * Math.cos(q.lat) * Math.cos(p.lon - q.lon),
      ),
    ),
  );
}

function readTokens(el: HTMLElement) {
  const cs = getComputedStyle(el);
  const get = (n: string, fallback: string) => cs.getPropertyValue(n).trim() || fallback;
  return {
    ink: get('--ink', '#101214'),
    muted: get('--ink-muted', '#5c6069'),
    accent: get('--accent', '#ff4f00'),
  };
}

export function OrbitalPlot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext('2d', { alpha: true });
    if (!context) return;

    // Everything below is set up behind an idle callback: the figure already
    // has a reserved box, so nothing moves, and the page's first paint does not
    // wait on canvas work.
    let teardown: (() => void) | undefined;
    let cancelled = false;
    const idle: number = (
      window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 1))
    )(() => {
      if (!cancelled) teardown = setup();
    });

    function setup() {
      const canvas = canvasEl!;
      const ctx = context!;

    let width = 0;
    let height = 0;
    let map = { x: 0, y: 0, w: 0, h: 0 };
    let tokens = readTokens(canvas);

    /* Graticule is identical every frame, so it is rendered once and blitted. */
    let grid: HTMLCanvasElement | null = null;

    const project = (lat: number, lon: number): Vec => ({
      x: map.x + ((wrapPi(lon) + Math.PI) / TAU) * map.w,
      y: map.y + ((Math.PI / 2 - lat) / Math.PI) * map.h,
      lat,
      lon: wrapPi(lon),
    });

    const buildGrid = () => {
      const g = document.createElement('canvas');
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      g.width = Math.round(width * dpr);
      g.height = Math.round(height * dpr);
      const gc = g.getContext('2d');
      if (!gc) return;
      gc.scale(dpr, dpr);
      gc.lineWidth = 1;
      gc.strokeStyle = tokens.muted;

      // Meridians and parallels every 30°, with a hand-plotted wobble so the
      // lines read as drawn rather than generated.
      for (let lon = -180; lon <= 180; lon += 30) {
        gc.globalAlpha = lon === 0 ? 0.34 : 0.17;
        gc.beginPath();
        for (let k = 0; k <= 24; k++) {
          const p = project((90 - (k / 24) * 180) * DEG, lon * DEG);
          const x = Math.round(p.x) + 0.5 + Math.sin(k * 0.7 + lon) * 0.4;
          if (k === 0) gc.moveTo(x, p.y);
          else gc.lineTo(x, p.y);
        }
        gc.stroke();
      }

      for (let lat = -90; lat <= 90; lat += 30) {
        gc.globalAlpha = lat === 0 ? 0.4 : 0.17;
        gc.beginPath();
        for (let k = 0; k <= 24; k++) {
          const p = project(lat * DEG, (-180 + (k / 24) * 360) * DEG);
          const y = Math.round(p.y) + 0.5 + Math.sin(k * 0.6 + lat) * 0.4;
          if (k === 0) gc.moveTo(p.x, y);
          else gc.lineTo(p.x, y);
        }
        gc.stroke();
      }

      // Plate border with corner ticks.
      gc.globalAlpha = 0.45;
      gc.strokeRect(
        Math.round(map.x) + 0.5,
        Math.round(map.y) + 0.5,
        Math.round(map.w),
        Math.round(map.h),
      );
      gc.globalAlpha = 1;
      grid = g;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Keep the 2:1 equirectangular aspect honest inside whatever box we get.
      const pad = 1;
      const availW = width - pad * 2;
      const availH = height - pad * 2;
      const w = Math.min(availW, availH * 2);
      const h = w / 2;
      map = { x: (width - w) / 2, y: (height - h) / 2, w, h };

      buildGrid();
    };

    /* ── State ────────────────────────────────────────────────────────── */

    const pulses: Pulse[] = [];
    let cursor: { x: number; y: number } | null = null;
    let lastSpawn = 0;

    const satellites = (elapsed: number): Vec[] => {
      const orbits = elapsed / ORBIT_SECONDS;
      const drift = -orbits * TAU * (1 / ORBITS_PER_DAY);
      const out: Vec[] = [];
      for (let p = 0; p < PLANES; p++) {
        for (let s = 0; s < PER_PLANE; s++) {
          const u = orbits * TAU + (s * TAU) / PER_PLANE + (p * TAU) / 9;
          const lat = Math.asin(Math.sin(INC) * Math.sin(u));
          const lon =
            Math.atan2(Math.cos(INC) * Math.sin(u), Math.cos(u)) + p * RAAN_SPACING + drift;
          out.push(project(lat, lon));
        }
      }
      return out;
    };

    const drawTracks = (elapsed: number) => {
      const orbits = elapsed / ORBIT_SECONDS;
      const drift = -orbits * TAU * (1 / ORBITS_PER_DAY);

      ctx.lineWidth = 1;
      ctx.strokeStyle = tokens.ink;

      for (let p = 0; p < PLANES; p++) {
        ctx.globalAlpha = 0.38;
        ctx.beginPath();
        let prevX = Number.NaN;
        for (let k = 0; k <= TRACK_STEPS; k++) {
          const u = (k / TRACK_STEPS) * TAU;
          const lat = Math.asin(Math.sin(INC) * Math.sin(u));
          const lon =
            Math.atan2(Math.cos(INC) * Math.sin(u), Math.cos(u)) + p * RAAN_SPACING + drift;
          const pt = project(lat, lon);
          if (!Number.isNaN(prevX) && Math.abs(pt.x - prevX) > map.w / 2) ctx.moveTo(pt.x, pt.y);
          else if (k === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
          prevX = pt.x;
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const buildLinks = (sats: Vec[]): Link[] => {
      const links: Link[] = [];
      // In-plane neighbours.
      for (let p = 0; p < PLANES; p++) {
        for (let s = 0; s < PER_PLANE; s++) {
          links.push({ a: p * PER_PLANE + s, b: p * PER_PLANE + ((s + 1) % PER_PLANE) });
        }
      }
      // Cross-plane, only where the geometry actually allows a shot.
      for (let p = 0; p < PLANES; p++) {
        const q = (p + 1) % PLANES;
        for (let s = 0; s < PER_PLANE; s++) {
          const a = p * PER_PLANE + s;
          let best = -1;
          let bestArc = LINK_MAX_ARC;
          for (let t = 0; t < PER_PLANE; t++) {
            const b = q * PER_PLANE + t;
            const d = arc(sats[a], sats[b]);
            if (d < bestArc) {
              bestArc = d;
              best = b;
            }
          }
          if (best >= 0) links.push({ a, b: best });
        }
      }
      return links.filter((l) => Math.abs(sats[l.a].x - sats[l.b].x) < map.w / 2);
    };

    const distToSegment = (px: number, py: number, a: Vec, b: Vec) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = dx * dx + dy * dy;
      const t = len === 0 ? 0 : Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / len));
      return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
    };

    const render = (elapsed: number, now: number, animate: boolean) => {
      ctx.clearRect(0, 0, width, height);
      if (grid) {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        ctx.drawImage(grid, 0, 0, grid.width / dpr, grid.height / dpr);
      }

      drawTracks(elapsed);

      const sats = satellites(elapsed);
      const links = buildLinks(sats);

      // Inter-satellite links, brightened near the pointer.
      for (const l of links) {
        const a = sats[l.a];
        const b = sats[l.b];
        let boost = 0;
        if (cursor) {
          const d = distToSegment(cursor.x, cursor.y, a, b);
          boost = Math.max(0, 1 - d / CURSOR_RADIUS);
        }
        ctx.strokeStyle = boost > 0.05 ? tokens.accent : tokens.muted;
        ctx.globalAlpha = 0.26 + boost * 0.7;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Packet pulses. The static plate seeds a fixed set so the reduced-motion
      // rendering still carries the accent, rather than reading as a plot with
      // the interesting part switched off.
      if (animate && links.length > 0 && now - lastSpawn > SPAWN_MS && pulses.length < MAX_PULSES) {
        const l = links[Math.floor(Math.random() * links.length)];
        pulses.push({ a: l.a, b: l.b, born: now });
        lastSpawn = now;
      }

      if (animate) {
        for (let i = pulses.length - 1; i >= 0; i--) {
          if ((now - pulses[i].born) / PULSE_MS >= 1) pulses.splice(i, 1);
        }
      }

      const shown = animate
        ? pulses.map((p) => ({ a: p.a, b: p.b, t: (now - p.born) / PULSE_MS }))
        : STATIC_PULSE_T.map((t, k) => {
            const l = links[(k * 3 + 1) % links.length];
            return l ? { a: l.a, b: l.b, t } : null;
          }).filter((p): p is { a: number; b: number; t: number } => p !== null);

      for (const pulse of shown) {
        const t = pulse.t;
        const a = sats[pulse.a];
        const b = sats[pulse.b];
        if (Math.abs(a.x - b.x) > map.w / 2) continue;
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;

        ctx.strokeStyle = tokens.accent;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(a.x + (b.x - a.x) * Math.max(0, t - 0.12), a.y + (b.y - a.y) * Math.max(0, t - 0.12));
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.fillStyle = tokens.accent;
        ctx.fillRect(x - 1.75, y - 1.75, 3.5, 3.5);
      }
      ctx.globalAlpha = 1;

      // Satellites: filled mark plus crosshair.
      for (const s of sats) {
        ctx.fillStyle = tokens.ink;
        ctx.fillRect(s.x - 2, s.y - 2, 4, 4);
        ctx.strokeStyle = tokens.ink;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x - 6, s.y);
        ctx.lineTo(s.x + 6, s.y);
        ctx.moveTo(s.x, s.y - 6);
        ctx.lineTo(s.x, s.y + 6);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    /* ── Static plate for reduced motion ──────────────────────────────── */

    if (reduced) {
      resize();
      render(ORBIT_SECONDS * 0.16, 0, false);
      const ro = new ResizeObserver(() => {
        resize();
        render(ORBIT_SECONDS * 0.16, 0, false);
      });
      ro.observe(canvas);
      const mo = new MutationObserver(() => {
        tokens = readTokens(canvas);
        buildGrid();
        render(ORBIT_SECONDS * 0.16, 0, false);
      });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return () => {
        ro.disconnect();
        mo.disconnect();
      };
    }


    /* ── Animated loop ────────────────────────────────────────────────── */

    let raf = 0;
    let running = false;
    let last = 0;
    let elapsed = 0;
    let lastFrame = 0;

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const dt = last === 0 ? 0 : (now - last) / 1000;
      last = now;
      elapsed += Math.min(dt, 0.1); // never fast-forward after a stall
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      render(elapsed, now, true);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    render(elapsed, performance.now(), true);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (canvas.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const ro = new ResizeObserver(() => {
      resize();
      render(elapsed, performance.now(), true);
    });
    ro.observe(canvas);

    const mo = new MutationObserver(() => {
      tokens = readTokens(canvas);
      buildGrid();
      render(elapsed, performance.now(), true);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onPointerLeave = () => {
      cursor = null;
    };
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
    }

    return () => {
      cancelled = true;
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
      teardown?.();
    };
  }, [reduced]);

  return (
    <figure className="m-0">
      <div className="relative border border-hairline bg-panel/40">
        {/* Corner ticks: this is a plate in a document, not a background. */}
        <span aria-hidden="true" className="absolute -top-px -left-px h-2 w-2 border-t border-l border-ink" />
        <span aria-hidden="true" className="absolute -top-px -right-px h-2 w-2 border-t border-r border-ink" />
        <span aria-hidden="true" className="absolute -bottom-px -left-px h-2 w-2 border-b border-l border-ink" />
        <span aria-hidden="true" className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-ink" />

        <canvas
          ref={canvasRef}
          role="img"
          aria-label={hero.figure.alt}
          className="aspect-3/2 w-full sm:aspect-2/1"
        />

        <span aria-hidden="true" className="t-stamp absolute top-1.5 left-2 text-muted">
          +90
        </span>
        <span aria-hidden="true" className="t-stamp absolute bottom-1.5 left-2 text-muted">
          −90
        </span>
        <span aria-hidden="true" className="t-stamp absolute right-2 bottom-1.5 text-muted">
          +180
        </span>
      </div>

      <figcaption className="t-stamp mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-muted">
        <span className="text-accent-text">{hero.figure.id}</span>
        <span>{hero.figure.caption}</span>
      </figcaption>
    </figure>
  );
}
