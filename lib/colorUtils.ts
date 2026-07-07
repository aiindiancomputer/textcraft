function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const expanded =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean.padEnd(6, "0").slice(0, 6);
  const num = parseInt(expanded, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Lightens (positive percent) or darkens (negative percent) a hex color. */
export function shadeColor(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex);
  const amt = Math.round(2.55 * percent);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  return `rgb(${clamp(r + amt)}, ${clamp(g + amt)}, ${clamp(b + amt)})`;
}

/** Same hex color at a given opacity, as an rgba() string (works in every
 *  browser, unlike #RRGGBBAA which is a newer addition). */
export function hexWithAlpha(hex: string, alpha01: number): string {
  const [r, g, b] = hexToRgb(hex);
  const a = Math.max(0, Math.min(1, alpha01));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
