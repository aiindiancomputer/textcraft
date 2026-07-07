export type MascotCategory = "avatar" | "icon";

export interface MascotDef {
  id: string;
  label: string;
  category: MascotCategory;
  /** Draws the mascot centered at the local origin (already translated
   *  and scaled by the caller), using `color` as the primary fill and
   *  `accent` for glowing/secondary details. */
  draw: (ctx: CanvasRenderingContext2D, color: string, accent: string) => void;
}

function glow(ctx: CanvasRenderingContext2D, color: string, blur: number, paint: () => void) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  paint();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Gamer avatars (profile-picture style busts)
// ---------------------------------------------------------------------------

function drawCyberpunkHeadphones(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -10, 55, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 10;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, -10, 68, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  for (const side of [-1, 1]) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(side * 62, -6, 20, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    glow(ctx, accent, 18, () => {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.ellipse(side * 62, -6, 11, 15, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-58, 40);
  ctx.quadraticCurveTo(0, 10, 58, 40);
  ctx.lineTo(58, 95);
  ctx.lineTo(-58, 95);
  ctx.closePath();
  ctx.fill();
}

function drawHoodedAssassin(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -85);
  ctx.quadraticCurveTo(70, -60, 62, 30);
  ctx.quadraticCurveTo(40, 70, 0, 78);
  ctx.quadraticCurveTo(-40, 70, -62, 30);
  ctx.quadraticCurveTo(-70, -60, 0, -85);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.beginPath();
  ctx.moveTo(0, -35);
  ctx.quadraticCurveTo(26, -20, 22, 20);
  ctx.quadraticCurveTo(0, 42, -22, 20);
  ctx.quadraticCurveTo(-26, -20, 0, -35);
  ctx.closePath();
  ctx.fill();

  glow(ctx, accent, 14, () => {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(-9, -2, 5, 3, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(9, -2, 5, 3, 0.2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-55, 55);
  ctx.quadraticCurveTo(0, 30, 55, 55);
  ctx.lineTo(55, 95);
  ctx.lineTo(-55, 95);
  ctx.closePath();
  ctx.fill();
}

function drawNeonVisor(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-55, 10);
  ctx.quadraticCurveTo(-58, -60, 0, -65);
  ctx.quadraticCurveTo(58, -60, 55, 10);
  ctx.quadraticCurveTo(55, 45, 0, 52);
  ctx.quadraticCurveTo(-55, 45, -55, 10);
  ctx.closePath();
  ctx.fill();

  glow(ctx, accent, 22, () => {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(-46, -8);
    ctx.quadraticCurveTo(0, -20, 46, -8);
    ctx.quadraticCurveTo(46, 14, 0, 20);
    ctx.quadraticCurveTo(-46, 14, -46, -8);
    ctx.closePath();
    ctx.fill();
  });

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-58, 60);
  ctx.quadraticCurveTo(0, 34, 58, 60);
  ctx.lineTo(58, 95);
  ctx.lineTo(-58, 95);
  ctx.closePath();
  ctx.fill();
}

function drawNinjaMask(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -15, 55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.ellipse(0, 8, 52, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  glow(ctx, accent, 10, () => {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(-38, -22);
    ctx.quadraticCurveTo(0, -32, 38, -22);
    ctx.quadraticCurveTo(0, -14, -38, -22);
    ctx.closePath();
    ctx.fill();
  });

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(48, -30);
  ctx.quadraticCurveTo(85, -20, 78, 20);
  ctx.quadraticCurveTo(70, 0, 46, -12);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-55, 45);
  ctx.quadraticCurveTo(0, 22, 55, 45);
  ctx.lineTo(55, 95);
  ctx.lineTo(-55, 95);
  ctx.closePath();
  ctx.fill();
}

function drawFutureSoldier(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -15, 52, Math.PI, 0);
  ctx.lineTo(50, 20);
  ctx.quadraticCurveTo(0, 40, -50, 20);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-52, -20);
  ctx.quadraticCurveTo(-68, -10, -60, 15);
  ctx.quadraticCurveTo(-56, -5, -50, -18);
  ctx.closePath();
  ctx.fill();

  glow(ctx, accent, 16, () => {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(-38, -4);
    ctx.quadraticCurveTo(0, 6, 38, -4);
    ctx.lineTo(38, 10);
    ctx.quadraticCurveTo(0, 20, -38, 10);
    ctx.closePath();
    ctx.fill();
  });

  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(30, -55);
  ctx.lineTo(38, -80);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(38, -83, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-60, 40);
  ctx.quadraticCurveTo(0, 15, 60, 40);
  ctx.lineTo(60, 95);
  ctx.lineTo(-60, 95);
  ctx.closePath();
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Esports crest icons
// ---------------------------------------------------------------------------

function drawAngrySkull(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -10, 55, Math.PI, 0);
  ctx.quadraticCurveTo(58, 40, 30, 55);
  ctx.lineTo(-30, 55);
  ctx.quadraticCurveTo(-58, 40, -55, -10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.beginPath();
  ctx.moveTo(-40, -18);
  ctx.lineTo(-8, -2);
  ctx.lineTo(-38, 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(40, -18);
  ctx.lineTo(8, -2);
  ctx.lineTo(38, 12);
  ctx.closePath();
  ctx.fill();

  glow(ctx, accent, 12, () => {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(-22, -2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(22, -2, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.lineTo(-7, 28);
  ctx.lineTo(7, 28);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = color;
  ctx.fillRect(-28, 36, 56, 14);
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 2;
  for (let x = -21; x <= 21; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, 36);
    ctx.lineTo(x, 50);
    ctx.stroke();
  }
}

function drawDragonCrest(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-60, 10);
  ctx.quadraticCurveTo(-70, -30, -20, -45);
  ctx.quadraticCurveTo(30, -55, 65, -20);
  ctx.quadraticCurveTo(50, -10, 55, 5);
  ctx.quadraticCurveTo(30, 0, 10, 10);
  ctx.quadraticCurveTo(-10, 30, -45, 35);
  ctx.quadraticCurveTo(-65, 30, -60, 10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(55, 5);
  ctx.lineTo(48, 20);
  ctx.lineTo(35, 8);
  ctx.lineTo(22, 22);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-15, -42);
  ctx.quadraticCurveTo(-5, -85, 20, -95);
  ctx.quadraticCurveTo(-2, -70, -2, -40);
  ctx.closePath();
  ctx.fill();

  glow(ctx, accent, 14, () => {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(-15, -18, 7, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGamingController(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-70, -10);
  ctx.quadraticCurveTo(-75, -35, -45, -35);
  ctx.lineTo(45, -35);
  ctx.quadraticCurveTo(75, -35, 70, -10);
  ctx.quadraticCurveTo(85, 30, 60, 45);
  ctx.quadraticCurveTo(40, 50, 30, 20);
  ctx.quadraticCurveTo(15, 10, 0, 10);
  ctx.quadraticCurveTo(-15, 10, -30, 20);
  ctx.quadraticCurveTo(-40, 50, -60, 45);
  ctx.quadraticCurveTo(-85, 30, -70, -10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(-52, -12, 10, 30);
  ctx.fillRect(-62, -2, 30, 10);

  glow(ctx, accent, 10, () => {
    ctx.fillStyle = accent;
    for (const [x, y] of [
      [38, -15],
      [52, -1],
      [38, 13],
      [24, -1],
    ]) {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.arc(-22, -20, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(15, 25, 12, 0, Math.PI * 2);
  ctx.fill();
}

function drawCrosshair(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 65, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, -95);
  ctx.lineTo(0, -50);
  ctx.moveTo(0, 50);
  ctx.lineTo(0, 95);
  ctx.moveTo(-95, 0);
  ctx.lineTo(-50, 0);
  ctx.moveTo(50, 0);
  ctx.lineTo(95, 0);
  ctx.stroke();

  glow(ctx, accent, 14, () => {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawWingedSword(ctx: CanvasRenderingContext2D, color: string, accent: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -95);
  ctx.lineTo(14, -20);
  ctx.lineTo(-14, -20);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(-8, -20, 16, 55);

  ctx.beginPath();
  ctx.moveTo(-40, -22);
  ctx.quadraticCurveTo(0, -32, 40, -22);
  ctx.quadraticCurveTo(0, -10, -40, -22);
  ctx.closePath();
  ctx.fill();

  ctx.fillRect(-6, 35, 12, 22);
  ctx.beginPath();
  ctx.arc(0, 62, 10, 0, Math.PI * 2);
  ctx.fill();

  glow(ctx, accent, 12, () => {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(-10, -20);
    ctx.quadraticCurveTo(-55, -35, -85, -10);
    ctx.quadraticCurveTo(-55, -12, -35, 0);
    ctx.quadraticCurveTo(-55, 5, -75, 20);
    ctx.quadraticCurveTo(-40, 15, -12, -5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, -20);
    ctx.quadraticCurveTo(55, -35, 85, -10);
    ctx.quadraticCurveTo(55, -12, 35, 0);
    ctx.quadraticCurveTo(55, 5, 75, 20);
    ctx.quadraticCurveTo(40, 15, 12, -5);
    ctx.closePath();
    ctx.fill();
  });
}

export const MASCOTS: MascotDef[] = [
  { id: "cyberpunk-headphones", label: "Cyberpunk Glowing Headphones", category: "avatar", draw: drawCyberpunkHeadphones },
  { id: "hooded-assassin", label: "Hooded Assassin", category: "avatar", draw: drawHoodedAssassin },
  { id: "neon-visor", label: "Neon Visor", category: "avatar", draw: drawNeonVisor },
  { id: "ninja-mask", label: "Ninja Mask", category: "avatar", draw: drawNinjaMask },
  { id: "future-soldier", label: "Future Soldier", category: "avatar", draw: drawFutureSoldier },
  { id: "angry-skull", label: "Angry Skull", category: "icon", draw: drawAngrySkull },
  { id: "dragon-crest", label: "Dragon Crest", category: "icon", draw: drawDragonCrest },
  { id: "gaming-controller", label: "Gaming Controller", category: "icon", draw: drawGamingController },
  { id: "crosshair", label: "Crosshair / Target", category: "icon", draw: drawCrosshair },
  { id: "winged-sword", label: "Winged Sword", category: "icon", draw: drawWingedSword },
];
