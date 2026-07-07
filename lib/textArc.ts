export interface GlyphPlacement {
  char: string;
  /** Canvas x/y for this glyph's baseline origin. */
  x: number;
  y: number;
  /** Additional ctx.rotate() to apply before drawing this glyph so it sits
   *  tangent to the arc. */
  rotation: number;
}

const MAX_RADIUS = 2000; // effectively flat — used as the ceiling, never hit directly
const MIN_RADIUS = 260; // tightest allowed curve for an 800px canvas
const MAX_ARC_SPAN = Math.PI * 0.92; // safety ceiling: ~165°, past this letters start overlapping themselves

/** Maps the 0–100 "Text Arc Intensity" slider magnitude onto a circle
 *  radius — bigger intensity means a smaller radius means a tighter
 *  curve. */
export function intensityToRadius(intensityMagnitude: number): number {
  const clamped = Math.max(0, Math.min(100, intensityMagnitude));
  return MAX_RADIUS - (clamped / 100) * (MAX_RADIUS - MIN_RADIUS);
}

/**
 * Lays out each character of `text` along a circular arc centered
 * horizontally at `centerX`, so the middle character sits at
 * (centerX, centerY) regardless of direction.
 *
 * direction "up"   → text bulges upward in the middle (a "smile" arc,
 *                     e.g. arcing over the top of a crest).
 * direction "down" → text dips downward in the middle (a "valley" arc,
 *                     e.g. following the bottom curve of a badge).
 *
 * Requires `ctx.font` to already be set, since it measures each
 * character with the currently active font.
 */
export function layoutArcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  direction: "up" | "down"
): GlyphPlacement[] {
  const chars = Array.from(text);
  if (chars.length === 0) return [];

  const widths = chars.map((c) => Math.max(ctx.measureText(c).width, 1));
  const angles = widths.map((w) => w / radius);
  const totalAngle = angles.reduce((a, b) => a + b, 0);

  let cursor = -totalAngle / 2;
  const originY = direction === "up" ? centerY + radius : centerY - radius;

  return chars.map((char, i) => {
    const half = angles[i] / 2;
    const angle = cursor + half;
    cursor += angles[i];

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const x = centerX + radius * sin;
    const y = direction === "up" ? originY - radius * cos : originY + radius * cos;
    const rotation = direction === "up" ? angle : -angle;

    return { char, x, y, rotation };
  });
}

/**
 * Picks a radius for the given text/font/intensity, shrinking the
 * effective radius (i.e. loosening the curve) if the literal request
 * would wrap the text past ~165° of the circle — which is the point
 * letters start visually overlapping themselves rather than reading as a
 * badge arc. Returns the radius to use; font-size shrinking on top of
 * this is handled by the caller for very long strings.
 */
export function resolveArcRadius(
  ctx: CanvasRenderingContext2D,
  text: string,
  intensityMagnitude: number
): number {
  const requested = intensityToRadius(intensityMagnitude);
  const chars = Array.from(text);
  if (chars.length === 0) return requested;

  const totalWidth = chars.reduce((sum, c) => sum + Math.max(ctx.measureText(c).width, 1), 0);
  const spanAtRequested = totalWidth / requested;
  if (spanAtRequested <= MAX_ARC_SPAN) return requested;

  // Loosen the curve (larger radius) just enough to respect the safety
  // ceiling, rather than silently ignoring the user's intensity choice.
  return Math.min(MAX_RADIUS, totalWidth / MAX_ARC_SPAN);
}
