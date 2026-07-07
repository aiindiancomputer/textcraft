"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Sparkles, Ban } from "lucide-react";
import { FANCY_STYLES } from "@/lib/textUtils";
import { LOGO_TEMPLATES, type LogoTemplate, type BackgroundOptions } from "@/lib/logoTemplates";
import { MASCOTS, type MascotDef } from "@/lib/logoMascots";
import { layoutArcText, resolveArcRadius } from "@/lib/textArc";

// A curated slice of the app's existing font-transform engine — reusing
// FANCY_STYLES here (rather than inventing a second font system) means a
// style picked in the Fancy Text tool renders exactly the same way when
// used as logo text.
const TEXT_STYLE_IDS = [
  "bold", "italic", "bold-italic", "fraktur", "double-struck",
  "sans-bold", "small-caps", "bubble", "fullwidth", "monospace",
];
const TEXT_STYLES = [
  { id: "plain", label: "Plain", render: (t: string) => t },
  ...FANCY_STYLES.filter((s) => TEXT_STYLE_IDS.includes(s.id)),
];

const CANVAS_SIZE = 800; // internal render resolution — kept high for a
// crisp HD PNG export regardless of how small the preview is displayed.
const MAX_FONT_SIZE = 160;
const MIN_FONT_SIZE = 28;
const NONE_MASCOT_ID = "none";

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "logo"
  );
}

// --- Small live-preview thumbnails for the template/mascot pickers --------

function TemplateThumbnail({
  template,
  baseColor,
  accentColor,
}: {
  template: LogoTemplate;
  baseColor: string;
  accentColor: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const size = canvas.width;
    const options: BackgroundOptions = {
      baseColor,
      accentColor,
      patternOpacity: 70,
      vignetteIntensity: 25,
    };
    ctx.clearRect(0, 0, size, size);
    template.draw(ctx, size, size, options);
  }, [template, baseColor, accentColor]);
  return (
    <canvas
      ref={ref}
      width={56}
      height={56}
      className="h-9 w-9 rounded-md border"
      style={{ borderColor: "var(--border-color)" }}
    />
  );
}

function MascotThumbnail({
  mascot,
  color,
  accent,
}: {
  mascot: MascotDef | null;
  color: string;
  accent: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);
    if (!mascot) return;
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.scale((size * 0.42) / 100, (size * 0.42) / 100);
    mascot.draw(ctx, color, accent);
    ctx.restore();
  }, [mascot, color, accent]);
  return (
    <canvas
      ref={ref}
      width={56}
      height={56}
      className="h-9 w-9 rounded-md border"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-sunken)" }}
    />
  );
}

// --- Slider control (shared layout for the many range inputs below) ------

function SliderControl({
  label,
  value,
  min,
  max,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
      {label} ({value}{suffix})
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-[var(--accent)]"
      />
    </label>
  );
}

function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
      {label}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer rounded-lg border"
        style={{ borderColor: "var(--border-color)" }}
      />
    </label>
  );
}

export default function LogoGenerator({ onCopy }: { onCopy: (msg: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Text
  const [text, setText] = useState("CLAN");
  const [styleId, setStyleId] = useState("bold");
  const [fontSize, setFontSize] = useState(110);
  const [arcIntensity, setArcIntensity] = useState(0); // -100..100, 0 = plain

  // Theme colors (the 5 named roles from the spec)
  const [primaryColor, setPrimaryColor] = useState("#FFFFFF"); // text gradient top + mascot fill
  const [secondaryColor, setSecondaryColor] = useState("#8B5CF6"); // text gradient bottom + bg accent + mascot accent
  const [strokeColor, setStrokeColor] = useState("#111827");
  const [glowColor, setGlowColor] = useState("#8B5CF6");
  const [baseColor, setBaseColor] = useState("#0B0F19"); // background base / badge mask color

  const [strokeWidth, setStrokeWidth] = useState(5);
  const [glowEnabled, setGlowEnabled] = useState(true);

  // Background
  const [templateId, setTemplateId] = useState("shield");
  const [patternOpacity, setPatternOpacity] = useState(65);
  const [vignetteIntensity, setVignetteIntensity] = useState(45);

  // Mascot / avatar overlay
  const [mascotId, setMascotId] = useState<string>(NONE_MASCOT_ID);
  const [mascotScale, setMascotScale] = useState(100);
  const [mascotOffsetX, setMascotOffsetX] = useState(0);
  const [mascotOffsetY, setMascotOffsetY] = useState(-140);

  const activeTemplate = LOGO_TEMPLATES.find((t) => t.id === templateId) ?? LOGO_TEMPLATES[0];
  const activeStyle = TEXT_STYLES.find((s) => s.id === styleId) ?? TEXT_STYLES[0];
  const activeMascot = MASCOTS.find((m) => m.id === mascotId) ?? null;
  const displayText = activeStyle.render(text || "CLAN");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 1. Background
    activeTemplate.draw(ctx, CANVAS_SIZE, CANVAS_SIZE, {
      baseColor,
      accentColor: secondaryColor,
      patternOpacity,
      vignetteIntensity,
    });

    // 2. Mascot / avatar overlay — drawn in its own local -100..100 space,
    // then translated/scaled into position on the real canvas.
    if (activeMascot) {
      const mascotRadius = CANVAS_SIZE * 0.22 * (mascotScale / 100);
      ctx.save();
      ctx.translate(CANVAS_SIZE / 2 + mascotOffsetX, CANVAS_SIZE / 2 + mascotOffsetY);
      ctx.scale(mascotRadius / 100, mascotRadius / 100);
      activeMascot.draw(ctx, primaryColor, secondaryColor);
      ctx.restore();
    }

    // 3. Text
    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const maxTextWidth = CANVAS_SIZE * 0.86;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let renderSize = fontSize;
    const fontString = (size: number) => `900 ${size}px "Arial Black", "Segoe UI", system-ui, sans-serif`;
    ctx.font = fontString(renderSize);

    // Plain mode auto-shrinks to fit the canvas width. Arc mode instead
    // loosens the curve for long text (see resolveArcRadius) rather than
    // shrinking the font, since a badge-arc reads better with consistent
    // letter size than with tiny letters.
    if (arcIntensity === 0) {
      while (ctx.measureText(displayText).width > maxTextWidth && renderSize > MIN_FONT_SIZE) {
        renderSize -= 2;
        ctx.font = fontString(renderSize);
      }
    }

    const drawGlyph = (glyphText: string, x: number, y: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      const gradHeight = renderSize * 1.1;
      const textGradient = ctx.createLinearGradient(0, -gradHeight / 2, 0, gradHeight / 2);
      textGradient.addColorStop(0, primaryColor);
      textGradient.addColorStop(1, secondaryColor);

      // Pass 1: soft glow aura — blurred fill + a fatter blurred stroke,
      // both using the glow color, so a halo sits behind the crisp letter.
      if (glowEnabled) {
        ctx.save();
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = renderSize * 0.4;
        ctx.fillStyle = textGradient;
        ctx.fillText(glyphText, 0, 0);
        if (strokeWidth > 0) {
          ctx.lineWidth = strokeWidth + 6;
          ctx.strokeStyle = glowColor;
          ctx.lineJoin = "round";
          ctx.strokeText(glyphText, 0, 0);
        }
        ctx.restore();
      }

      // Pass 2: crisp primary stroke + gradient fill on top, shadow off
      // so this pass stays sharp regardless of the glow pass above it.
      if (strokeWidth > 0) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.lineJoin = "round";
        ctx.strokeText(glyphText, 0, 0);
      }
      ctx.fillStyle = textGradient;
      ctx.fillText(glyphText, 0, 0);

      ctx.restore();
    };

    if (arcIntensity === 0) {
      drawGlyph(displayText, cx, cy, 0);
    } else {
      const direction: "up" | "down" = arcIntensity > 0 ? "up" : "down";
      const radius = resolveArcRadius(ctx, displayText, Math.abs(arcIntensity));
      const placements = layoutArcText(ctx, displayText, cx, cy, radius, direction);
      for (const glyph of placements) {
        drawGlyph(glyph.char, glyph.x, glyph.y, glyph.rotation);
      }
    }
  }, [
    displayText, activeTemplate, activeMascot, baseColor, secondaryColor, primaryColor,
    patternOpacity, vignetteIntensity, mascotScale, mascotOffsetX, mascotOffsetY,
    fontSize, arcIntensity, glowEnabled, glowColor, strokeColor, strokeWidth,
  ]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(text)}-gaming-logo.png`;
    link.click();
    onCopy("HD logo downloaded");
  }

  const avatarMascots = MASCOTS.filter((m) => m.category === "avatar");
  const iconMascots = MASCOTS.filter((m) => m.category === "icon");

  return (
    <section aria-labelledby="logo-generator-heading" className="flex flex-col gap-6">
      <div>
        <h2 id="logo-generator-heading" className="text-2xl font-semibold tracking-tight">
          Free Fire Guild Logo Maker with Name &amp; BGMI Clan Logo Generator
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Design a 3D-style esports logo generator experience for free, right in your browser —
          perfect as a Free Fire or BGMI clan emblem, a gaming avatar, or an Instagram profile
          picture editor upgrade. Add a mascot, arch your clan name, and export instantly.
        </p>
      </div>

      {/* Live canvas preview */}
      <div className="mx-auto w-full max-w-sm">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          role="img"
          aria-label={`${text || "Clan"} gaming logo preview on a ${activeTemplate.label.toLowerCase()} background`}
          className="aspect-square w-full rounded-xl border shadow-glow"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-sunken)" }}
        />
        <p className="sr-only">
          Live preview of a custom gaming logo, clan emblem, or Instagram profile picture
          generated entirely in your browser.
        </p>
      </div>

      {/* Text input */}
      <div>
        <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Clan / Nickname Text
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 20))}
          placeholder="Enter your clan name or nickname..."
          className="focus-ring w-full rounded-xl border px-4 py-3 text-[15px] transition-colors"
          style={{
            backgroundColor: "var(--bg-sunken)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Font style */}
      <div>
        <h3 className="mb-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Gaming Avatar Text Maker Style
        </h3>
        <div className="flex flex-wrap gap-2">
          {TEXT_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setStyleId(style.id)}
              className="focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200"
              style={{
                backgroundColor: styleId === style.id ? "var(--accent)" : "transparent",
                borderColor: styleId === style.id ? "var(--accent)" : "var(--border-color)",
                color: styleId === style.id ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text arc */}
      <div>
        <h3 className="mb-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Text Path Effect
        </h3>
        <div className="mb-2 flex gap-2">
          {[
            { label: "Plain", value: 0 },
            { label: "Arched Upward", value: 55 },
            { label: "Arched Downward", value: -55 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => setArcIntensity(preset.value)}
              className="focus-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200"
              style={{
                backgroundColor:
                  (preset.value === 0 && arcIntensity === 0) ||
                  (preset.value > 0 && arcIntensity > 0) ||
                  (preset.value < 0 && arcIntensity < 0)
                    ? "var(--accent)"
                    : "transparent",
                borderColor:
                  (preset.value === 0 && arcIntensity === 0) ||
                  (preset.value > 0 && arcIntensity > 0) ||
                  (preset.value < 0 && arcIntensity < 0)
                    ? "var(--accent)"
                    : "var(--border-color)",
                color:
                  (preset.value === 0 && arcIntensity === 0) ||
                  (preset.value > 0 && arcIntensity > 0) ||
                  (preset.value < 0 && arcIntensity < 0)
                    ? "#ffffff"
                    : "var(--text-secondary)",
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <SliderControl
          label="Text Arc Intensity"
          value={arcIntensity}
          min={-100}
          max={100}
          onChange={setArcIntensity}
        />
      </div>

      {/* Background templates */}
      <div>
        <h3 className="mb-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Background Template
        </h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {LOGO_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setTemplateId(template.id)}
              className="focus-ring flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors duration-200"
              style={{
                backgroundColor: templateId === template.id ? "var(--accent)" : "var(--bg-raised)",
                borderColor: templateId === template.id ? "var(--accent)" : "var(--border-color)",
              }}
            >
              <TemplateThumbnail template={template} baseColor={baseColor} accentColor={secondaryColor} />
              <span
                className="text-[10px] font-semibold leading-tight"
                style={{ color: templateId === template.id ? "#ffffff" : "var(--text-secondary)" }}
              >
                {template.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mascot / avatar overlay */}
      <div>
        <h3 className="mb-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Mascot &amp; Avatar Overlay
        </h3>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          <button
            onClick={() => setMascotId(NONE_MASCOT_ID)}
            className="focus-ring flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors duration-200"
            style={{
              backgroundColor: mascotId === NONE_MASCOT_ID ? "var(--accent)" : "var(--bg-raised)",
              borderColor: mascotId === NONE_MASCOT_ID ? "var(--accent)" : "var(--border-color)",
            }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-md border"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-sunken)" }}
            >
              <Ban size={16} style={{ color: "var(--text-muted)" }} />
            </span>
            <span
              className="text-[10px] font-semibold"
              style={{ color: mascotId === NONE_MASCOT_ID ? "#ffffff" : "var(--text-secondary)" }}
            >
              None
            </span>
          </button>
          {[...avatarMascots, ...iconMascots].map((mascot) => (
            <button
              key={mascot.id}
              onClick={() => setMascotId(mascot.id)}
              className="focus-ring flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors duration-200"
              style={{
                backgroundColor: mascotId === mascot.id ? "var(--accent)" : "var(--bg-raised)",
                borderColor: mascotId === mascot.id ? "var(--accent)" : "var(--border-color)",
              }}
            >
              <MascotThumbnail mascot={mascot} color={primaryColor} accent={secondaryColor} />
              <span
                className="text-[10px] font-semibold leading-tight"
                style={{ color: mascotId === mascot.id ? "#ffffff" : "var(--text-secondary)" }}
              >
                {mascot.label}
              </span>
            </button>
          ))}
        </div>

        {activeMascot && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <SliderControl label="Icon Scale" value={mascotScale} min={40} max={220} onChange={setMascotScale} suffix="%" />
            <SliderControl label="Icon X Offset" value={mascotOffsetX} min={-250} max={250} onChange={setMascotOffsetX} />
            <SliderControl label="Icon Y Offset" value={mascotOffsetY} min={-250} max={250} onChange={setMascotOffsetY} />
          </div>
        )}
      </div>

      {/* Theme colors */}
      <div>
        <h3 className="mb-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Theme Colors
        </h3>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          <ColorControl label="Primary Color" value={primaryColor} onChange={setPrimaryColor} />
          <ColorControl label="Secondary Color" value={secondaryColor} onChange={setSecondaryColor} />
          <ColorControl label="Stroke Color" value={strokeColor} onChange={setStrokeColor} />
          <ColorControl label="Glow Aura Color" value={glowColor} onChange={setGlowColor} />
          <ColorControl label="Mask / Base Badge Color" value={baseColor} onChange={setBaseColor} />
        </div>
      </div>

      {/* Fine-tune sliders */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SliderControl label="Font Size" value={fontSize} min={MIN_FONT_SIZE} max={MAX_FONT_SIZE} onChange={setFontSize} suffix="px" />
        <SliderControl label="Stroke Width" value={strokeWidth} min={0} max={14} onChange={setStrokeWidth} suffix="px" />
        <SliderControl label="Pattern Opacity" value={patternOpacity} min={0} max={100} onChange={setPatternOpacity} suffix="%" />
        <SliderControl label="Vignette Intensity" value={vignetteIntensity} min={0} max={100} onChange={setVignetteIntensity} suffix="%" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={glowEnabled}
            onChange={(e) => setGlowEnabled(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          <Sparkles size={14} style={{ color: "var(--accent)" }} />
          Glow Effect
        </label>
      </div>

      <button
        onClick={handleDownload}
        className="focus-ring flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0 active:duration-75"
        style={{ backgroundColor: "var(--accent)" }}
      >
        <Download size={16} /> Download HD Logo
      </button>

      {/* SEO copy block — additional keyword coverage, kept scannable */}
      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Cool Gaming Logo Creator with Stylish Fonts</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Combine any of FancyCraft&rsquo;s Unicode font styles with a shield, neon, or dark
            grid backdrop — plus a mascot like a dragon crest or angry skull — to create a cool
            gaming logo that stands out on Discord, YouTube, and Instagram.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Free Online Emblem Generator for Gamers</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            No account, no watermark, no upload limits — this free online emblem generator runs
            entirely on your device and exports a full-resolution PNG you can use anywhere.
          </p>
        </div>
      </div>
    </section>
  );
}
