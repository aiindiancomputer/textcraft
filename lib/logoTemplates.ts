import { shadeColor, hexWithAlpha } from "@/lib/colorUtils";

export interface BackgroundOptions {
  /** "Mask/Base Badge Color" — the template's main background tone. */
  baseColor: string;
  /** "Secondary Color" — pattern lines, orbs, and accent sweeps. */
  accentColor: string;
  /** 0–100, how visible the pattern (lines/orbs/rays) is. */
  patternOpacity: number;
  /** 0–100, how strongly the edges darken toward the border. */
  vignetteIntensity: number;
}

export interface LogoTemplate {
  id: string;
  label: string;
  /** Draws the background onto an already-sized canvas context. */
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, options: BackgroundOptions) => void;
}

function fillRect(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  const strength = Math.max(0, Math.min(100, intensity)) / 100;
  if (strength <= 0) return;
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, height * (0.32 - 0.08 * strength),
    width / 2, height / 2, height * 0.76
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, `rgba(0,0,0,${(0.12 + 0.65 * strength).toFixed(3)})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

// ---------------------------------------------------------------------------
// 1. Brand Gradient
// ---------------------------------------------------------------------------
function drawGradientTemplate(ctx: CanvasRenderingContext2D, width: number, height: number, opts: BackgroundOptions) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, shadeColor(opts.baseColor, 18));
  gradient.addColorStop(0.5, opts.baseColor);
  gradient.addColorStop(1, opts.accentColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  drawVignette(ctx, width, height, opts.vignetteIntensity);
}

// ---------------------------------------------------------------------------
// 2. Esports Shield
// ---------------------------------------------------------------------------
function drawShieldTemplate(ctx: CanvasRenderingContext2D, width: number, height: number, opts: BackgroundOptions) {
  fillRect(ctx, width, height, "#05060A");

  const cx = width / 2;
  const top = height * 0.08;
  const w = width * 0.74;
  const left = cx - w / 2;
  const right = cx + w / 2;
  const midY = height * 0.55;
  const bottom = height * 0.95;

  const shieldPath = () => {
    ctx.beginPath();
    ctx.moveTo(cx, top);
    ctx.lineTo(right, top + (midY - top) * 0.18);
    ctx.lineTo(right, midY);
    ctx.quadraticCurveTo(right, height * 0.78, cx, bottom);
    ctx.quadraticCurveTo(left, height * 0.78, left, midY);
    ctx.lineTo(left, top + (midY - top) * 0.18);
    ctx.closePath();
  };

  ctx.save();
  shieldPath();
  const shieldFill = ctx.createLinearGradient(0, top, 0, bottom);
  shieldFill.addColorStop(0, shadeColor(opts.baseColor, 20));
  shieldFill.addColorStop(1, shadeColor(opts.baseColor, -25));
  ctx.fillStyle = shieldFill;
  ctx.fill();

  ctx.clip();
  const streak = ctx.createLinearGradient(left, top, right, midY);
  streak.addColorStop(0, "rgba(255,255,255,0)");
  streak.addColorStop(0.45, "rgba(255,255,255,0.10)");
  streak.addColorStop(0.55, "rgba(255,255,255,0.02)");
  streak.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = streak;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  shieldPath();
  const borderGradient = ctx.createLinearGradient(left, top, right, bottom);
  borderGradient.addColorStop(0, shadeColor(opts.accentColor, 20));
  borderGradient.addColorStop(1, opts.accentColor);
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = Math.max(3, width * 0.008);
  ctx.stroke();

  drawVignette(ctx, width, height, opts.vignetteIntensity);
}

// ---------------------------------------------------------------------------
// 3. Neon Abstract
// ---------------------------------------------------------------------------
function drawNeonTemplate(ctx: CanvasRenderingContext2D, width: number, height: number, opts: BackgroundOptions) {
  fillRect(ctx, width, height, "#0A0A12");

  const alpha = Math.max(0.1, opts.patternOpacity / 100) * 0.55;
  const orbs: { x: number; y: number; r: number; color: string }[] = [
    { x: width * 0.18, y: height * 0.22, r: width * 0.32, color: opts.accentColor },
    { x: width * 0.85, y: height * 0.78, r: width * 0.34, color: "#EC4899" },
    { x: width * 0.75, y: height * 0.18, r: width * 0.2, color: shadeColor(opts.baseColor, 35) },
  ];

  for (const orb of orbs) {
    ctx.save();
    ctx.filter = "blur(40px)";
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
    ctx.fillStyle = orb.color;
    ctx.fill();
    ctx.restore();
  }

  const overlay = ctx.createLinearGradient(0, 0, 0, height);
  overlay.addColorStop(0, "rgba(10,10,18,0.25)");
  overlay.addColorStop(1, "rgba(10,10,18,0.55)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, width, height);

  drawVignette(ctx, width, height, opts.vignetteIntensity);
}

// ---------------------------------------------------------------------------
// 4. Dark Tech Grid
// ---------------------------------------------------------------------------
function drawGridTemplate(ctx: CanvasRenderingContext2D, width: number, height: number, opts: BackgroundOptions) {
  fillRect(ctx, width, height, opts.baseColor);

  ctx.strokeStyle = hexWithAlpha(opts.accentColor, Math.max(0.05, opts.patternOpacity / 100) * 0.5);
  ctx.lineWidth = 1;
  const step = Math.max(24, Math.floor(width / 20));
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const centerGlow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height * 0.65);
  centerGlow.addColorStop(0, hexWithAlpha(opts.accentColor, 0.35));
  centerGlow.addColorStop(1, "rgba(11,15,25,0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  drawVignette(ctx, width, height, opts.vignetteIntensity);
}

// ---------------------------------------------------------------------------
// 5. Transparent (PNG)
// ---------------------------------------------------------------------------
function drawTransparentTemplate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
}

// ---------------------------------------------------------------------------
// 6. Radial Sunburst — anime-style rays from center
// ---------------------------------------------------------------------------
function drawSunburstTemplate(ctx: CanvasRenderingContext2D, width: number, height: number, opts: BackgroundOptions) {
  fillRect(ctx, width, height, opts.baseColor);

  const cx = width / 2;
  const cy = height / 2;
  const rayCount = 28;
  const outerR = Math.max(width, height) * 1.1;
  const alpha = Math.max(0.05, opts.patternOpacity / 100) * 0.55;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = opts.accentColor;
  for (let i = 0; i < rayCount; i++) {
    if (i % 2 !== 0) continue;
    const angle = (i / rayCount) * Math.PI * 2;
    const nextAngle = ((i + 1) / rayCount) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, outerR, angle, nextAngle);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, height * 0.5);
  centerGlow.addColorStop(0, hexWithAlpha(opts.accentColor, 0.3));
  centerGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  drawVignette(ctx, width, height, opts.vignetteIntensity);
}

// ---------------------------------------------------------------------------
// 7. Neon Hexagon Grid
// ---------------------------------------------------------------------------
function hexagonPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawHexGridTemplate(ctx: CanvasRenderingContext2D, width: number, height: number, opts: BackgroundOptions) {
  fillRect(ctx, width, height, opts.baseColor);

  const r = 36;
  const hexW = Math.sqrt(3) * r;
  const hexH = r * 1.5;
  ctx.strokeStyle = hexWithAlpha(opts.accentColor, Math.max(0.05, opts.patternOpacity / 100) * 0.6);
  ctx.lineWidth = 1.5;

  let row = 0;
  for (let y = -hexH; y < height + hexH; y += hexH) {
    const offsetX = row % 2 !== 0 ? hexW / 2 : 0;
    for (let x = -hexW; x < width + hexW; x += hexW) {
      hexagonPath(ctx, x + offsetX, y, r);
      ctx.stroke();
    }
    row++;
  }

  const centerGlow = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height * 0.6);
  centerGlow.addColorStop(0, hexWithAlpha(opts.accentColor, 0.3));
  centerGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  drawVignette(ctx, width, height, opts.vignetteIntensity);
}

// ---------------------------------------------------------------------------
// 8. Cyberpunk Diagonal Scanlines
// ---------------------------------------------------------------------------
function drawScanlinesTemplate(ctx: CanvasRenderingContext2D, width: number, height: number, opts: BackgroundOptions) {
  fillRect(ctx, width, height, opts.baseColor);

  ctx.save();
  ctx.strokeStyle = hexWithAlpha(opts.accentColor, Math.max(0.04, opts.patternOpacity / 100) * 0.5);
  ctx.lineWidth = 2;
  const step = 16;
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 8);
  const span = Math.max(width, height) * 1.6;
  for (let x = -span; x < span; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, -span);
    ctx.lineTo(x, span);
    ctx.stroke();
  }
  ctx.restore();

  const band = ctx.createLinearGradient(0, height * 0.32, 0, height * 0.58);
  band.addColorStop(0, "rgba(255,255,255,0)");
  band.addColorStop(0.5, hexWithAlpha(opts.accentColor, 0.22));
  band.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, width, height);

  drawVignette(ctx, width, height, opts.vignetteIntensity);
}

// ---------------------------------------------------------------------------
// 9. Dual-tone Slash Gradient
// ---------------------------------------------------------------------------
function drawSlashTemplate(ctx: CanvasRenderingContext2D, width: number, height: number, opts: BackgroundOptions) {
  fillRect(ctx, width, height, opts.baseColor);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(width * 0.35, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, height);
  ctx.lineTo(width * 0.65, height);
  ctx.closePath();
  const slashGradient = ctx.createLinearGradient(width * 0.35, 0, width, height);
  slashGradient.addColorStop(0, opts.accentColor);
  slashGradient.addColorStop(1, shadeColor(opts.accentColor, -22));
  ctx.fillStyle = slashGradient;
  ctx.globalAlpha = Math.max(0.25, opts.patternOpacity / 100);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.moveTo(width * 0.35, 0);
  ctx.lineTo(width * 0.65, height);
  ctx.stroke();
  ctx.restore();

  drawVignette(ctx, width, height, opts.vignetteIntensity);
}

export const LOGO_TEMPLATES: LogoTemplate[] = [
  { id: "gradient", label: "Brand Gradient", draw: drawGradientTemplate },
  { id: "shield", label: "Esports Shield", draw: drawShieldTemplate },
  { id: "neon", label: "Neon Abstract", draw: drawNeonTemplate },
  { id: "grid", label: "Dark Tech Grid", draw: drawGridTemplate },
  { id: "sunburst", label: "Radial Sunburst", draw: drawSunburstTemplate },
  { id: "hexgrid", label: "Neon Hexagon Grid", draw: drawHexGridTemplate },
  { id: "scanlines", label: "Cyberpunk Scanlines", draw: drawScanlinesTemplate },
  { id: "slash", label: "Dual-Tone Slash", draw: drawSlashTemplate },
  { id: "transparent", label: "Transparent (PNG)", draw: drawTransparentTemplate },
];
