"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Shield } from "lucide-react";
import { FANCY_STYLES } from "@/lib/textUtils";
import { LOGO_TEMPLATES } from "@/lib/logoTemplates";

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
const MAX_FONT_SIZE = 140;
const MIN_FONT_SIZE = 32;

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "logo"
  );
}

export default function LogoGenerator({ onCopy }: { onCopy: (msg: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [text, setText] = useState("CLAN");
  const [styleId, setStyleId] = useState("bold");
  const [templateId, setTemplateId] = useState("shield");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(96);
  const [strokeColor, setStrokeColor] = useState("#111827");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [glowEnabled, setGlowEnabled] = useState(true);
  const [glowColor, setGlowColor] = useState("#8B5CF6");

  const activeTemplate = LOGO_TEMPLATES.find((t) => t.id === templateId) ?? LOGO_TEMPLATES[0];
  const activeStyle = TEXT_STYLES.find((s) => s.id === styleId) ?? TEXT_STYLES[0];
  const displayText = activeStyle.render(text || "CLAN");

  // Redraws the full canvas any time an input changes. This is a plain
  // synchronous 2D-context draw — no external image loads, no network
  // calls — so it stays instant even at 800x800 internal resolution.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    activeTemplate.draw(ctx, CANVAS_SIZE, CANVAS_SIZE);

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;
    const maxTextWidth = CANVAS_SIZE * 0.86;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Auto-shrink font size only if the chosen text would overflow the
    // canvas at the user's requested size — the slider stays the upper
    // bound, not a fixed value that could clip long clan names.
    let renderSize = fontSize;
    ctx.font = `900 ${renderSize}px "Arial Black", "Segoe UI", system-ui, sans-serif`;
    while (ctx.measureText(displayText).width > maxTextWidth && renderSize > MIN_FONT_SIZE) {
      renderSize -= 2;
      ctx.font = `900 ${renderSize}px "Arial Black", "Segoe UI", system-ui, sans-serif`;
    }

    if (glowEnabled) {
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = CANVAS_SIZE * 0.045;
    } else {
      ctx.shadowBlur = 0;
    }

    if (strokeWidth > 0) {
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeColor;
      ctx.lineJoin = "round";
      ctx.strokeText(displayText, cx, cy);
    }

    ctx.fillStyle = textColor;
    ctx.fillText(displayText, cx, cy);

    // Reset shadow so it never bleeds into a future draw call (e.g. if a
    // template ever paints something after the text in a later change).
    ctx.shadowBlur = 0;
  }, [displayText, templateId, textColor, fontSize, strokeColor, strokeWidth, glowEnabled, glowColor, activeTemplate]);

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

  return (
    <section aria-labelledby="logo-generator-heading" className="flex flex-col gap-6">
      <div>
        <h2 id="logo-generator-heading" className="text-2xl font-semibold tracking-tight">
          Free Fire Guild Logo Maker with Name &amp; BGMI Clan Logo Generator
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Design a 3D-style esports logo generator experience for free, right in your browser —
          perfect as a Free Fire or BGMI clan emblem, a gaming avatar, or an Instagram profile
          picture editor upgrade. Type your name, pick a style, and export instantly.
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

      {/* Background templates */}
      <div>
        <h3 className="mb-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Background Template
        </h3>
        <div className="flex flex-wrap gap-2">
          {LOGO_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setTemplateId(template.id)}
              className="focus-ring flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200"
              style={{
                backgroundColor: templateId === template.id ? "var(--accent)" : "transparent",
                borderColor: templateId === template.id ? "var(--accent)" : "var(--border-color)",
                color: templateId === template.id ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              <Shield size={12} />
              {template.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fine-tune controls */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label className="flex flex-col gap-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Text Color
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border"
            style={{ borderColor: "var(--border-color)" }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Stroke Color
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border"
            style={{ borderColor: "var(--border-color)" }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Font Size ({fontSize}px)
          <input
            type="range"
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          Stroke Width ({strokeWidth}px)
          <input
            type="range"
            min={0}
            max={12}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={glowEnabled}
            onChange={(e) => setGlowEnabled(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Glow Effect
        </label>
        {glowEnabled && (
          <input
            type="color"
            value={glowColor}
            onChange={(e) => setGlowColor(e.target.value)}
            className="h-8 w-16 cursor-pointer rounded-lg border"
            style={{ borderColor: "var(--border-color)" }}
          />
        )}
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
            grid backdrop to create a cool gaming logo that stands out on Discord, YouTube, and
            Instagram.
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
