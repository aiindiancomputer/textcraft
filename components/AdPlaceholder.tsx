import { Megaphone } from "lucide-react";

export default function AdPlaceholder({
  orientation = "horizontal",
  compact = false,
}: {
  orientation?: "horizontal" | "vertical";
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed text-center transition-colors ${
        orientation === "horizontal" ? "w-full py-6" : "w-full py-8"
      } ${compact ? "py-4" : ""}`}
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-sunken)",
        color: "var(--text-muted)",
      }}
    >
      <Megaphone size={18} strokeWidth={1.5} />
      <p className="text-xs font-medium tracking-wide">
        Advertisement Area — Google AdSense Ready
      </p>
      <p className="text-[10px] opacity-70">728×90 / responsive slot</p>
    </div>
  );
}
