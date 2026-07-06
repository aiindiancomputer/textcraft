export interface LogoTemplate {
  id: string;
  label: string;
  /** Draws the background onto an already-sized canvas context. */
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

function fillRect(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

// Brand gradient — the same indigo/violet used across the rest of the
// site's UI, so a logo made here still feels like it belongs to FancyCraft.
function drawGradientTemplate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#818CF8");
  gradient.addColorStop(0.5, "#6366F1");
  gradient.addColorStop(1, "#7C3AED");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.2,
    width / 2, height / 2, height * 0.78
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

// A classic 5-point esports/clan crest shield, for the "Free Fire guild
// logo" / "BGMI clan logo" look.
function drawShieldTemplate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  fillRect(ctx, width, height, "#05060A");

  const cx = width / 2;
  const top = height * 0.08;
  const w = width * 0.74;
  const left = cx - w / 2;
  const right = cx + w / 2;
  const midY = height * 0.55;
  const bottom = height * 0.95;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.lineTo(right, top + (midY - top) * 0.18);
  ctx.lineTo(right, midY);
  ctx.quadraticCurveTo(right, height * 0.78, cx, bottom);
  ctx.quadraticCurveTo(left, height * 0.78, left, midY);
  ctx.lineTo(left, top + (midY - top) * 0.18);
  ctx.closePath();

  const shieldFill = ctx.createLinearGradient(0, top, 0, bottom);
  shieldFill.addColorStop(0, "#1F2937");
  shieldFill.addColorStop(1, "#0B0F19");
  ctx.fillStyle = shieldFill;
  ctx.fill();

  // Metallic diagonal highlight streak, clipped to the shield shape.
  ctx.clip();
  const streak = ctx.createLinearGradient(left, top, right, midY);
  streak.addColorStop(0, "rgba(255,255,255,0)");
  streak.addColorStop(0.45, "rgba(255,255,255,0.10)");
  streak.addColorStop(0.55, "rgba(255,255,255,0.02)");
  streak.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = streak;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Accent-gradient border tracing the crest outline.
  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.lineTo(right, top + (midY - top) * 0.18);
  ctx.lineTo(right, midY);
  ctx.quadraticCurveTo(right, height * 0.78, cx, bottom);
  ctx.quadraticCurveTo(left, height * 0.78, left, midY);
  ctx.lineTo(left, top + (midY - top) * 0.18);
  ctx.closePath();
  const borderGradient = ctx.createLinearGradient(left, top, right, bottom);
  borderGradient.addColorStop(0, "#8B5CF6");
  borderGradient.addColorStop(1, "#6366F1");
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = Math.max(3, width * 0.008);
  ctx.stroke();
}

// Dark background with soft glowing neon orbs — the "abstract neon
// background" look for a modern esports/streamer emblem.
function drawNeonTemplate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  fillRect(ctx, width, height, "#0A0A12");

  const orbs: { x: number; y: number; r: number; color: string }[] = [
    { x: width * 0.18, y: height * 0.22, r: width * 0.32, color: "#22D3EE" },
    { x: width * 0.85, y: height * 0.78, r: width * 0.34, color: "#EC4899" },
    { x: width * 0.75, y: height * 0.18, r: width * 0.2, color: "#8B5CF6" },
  ];

  for (const orb of orbs) {
    ctx.save();
    ctx.filter = "blur(40px)";
    ctx.globalAlpha = 0.55;
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
}

// Dark tech grid with a center glow band — the "dark gaming pattern"
// backdrop popular for clan tags and stream overlays.
function drawGridTemplate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  fillRect(ctx, width, height, "#0B0F19");

  ctx.strokeStyle = "rgba(99,102,241,0.25)";
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

  const glow = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, height * 0.65
  );
  glow.addColorStop(0, "rgba(99,102,241,0.35)");
  glow.addColorStop(1, "rgba(11,15,25,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.3,
    width / 2, height / 2, height * 0.8
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

// NEW: Anime Sunburst Ray Background (Perfect for high energy gaming logos)
function drawSunburstTemplate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  fillRect(ctx, width, height, "#7C2D12"); // Dark base rust red

  ctx.save();
  ctx.translate(width / 2, height / 2);
  const numRays = 28;
  const angleStep = (Math.PI * 2) / numRays;
  ctx.fillStyle = "#EA580C"; // Vibrant orange rays
  
  for (let i = 0; i < numRays; i++) {
    if (i % 2 === 0) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.max(width, height) * 1.5, i * angleStep, (i + 1) * angleStep);
      ctx.lineTo(0, 0);
      ctx.fill();
    }
  }
  ctx.restore();

  // Dark vignette blend
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.2,
    width / 2, height / 2, height * 0.75
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.65)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

// NEW: Cyber Scanline Matrix Glow (Cyberpunk style)
function drawCyberpunkTemplate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  fillRect(ctx, width, height, "#0F172A"); // Slate-900 baseline

  ctx.save();
  ctx.strokeStyle = "#FF0055"; // Hot pink cyberpunk lines
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 2;
  const spacing = 15;
  for (let x = 0; x < width * 2; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - height, height);
    ctx.stroke();
  }
  ctx.restore();

  const glow = ctx.createRadialGradient(
    width / 2, height / 2, 10,
    width / 2, height / 2, height * 0.6
  );
  glow.addColorStop(0, "rgba(236,72,153,0.25)");
  glow.addColorStop(1, "rgba(15,23,42,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

// No background fill at all — useful for exporting a logo/watermark with
// a transparent PNG background to drop onto a profile picture elsewhere.
function drawTransparentTemplate(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
}

export const LOGO_TEMPLATES: LogoTemplate[] = [
  { id: "gradient", label: "Brand Gradient", draw: drawGradientTemplate },
  { id: "shield", label: "Esports Shield", draw: drawShieldTemplate },
  { id: "neon", label: "Neon Abstract", draw: drawNeonTemplate },
  { id: "grid", label: "Dark Tech Grid", draw: drawGridTemplate },
  { id: "sunburst", label: "Anime Sunburst", draw: drawSunburstTemplate },
  { id: "cyberpunk", label: "Cyber Scanline", draw: drawCyberpunkTemplate },
  { id: "transparent", label: "Transparent (PNG)", draw: drawTransparentTemplate },
];