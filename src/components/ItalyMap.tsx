import React from "react";
import type { GameStatus } from "../types";
import italyMapImg from "../assets/italy-map.png";

// Pixel coordinates in the 1000x1250 source image.
// Use /#/calibrate to click the map and get exact cx/cy values.
export const REGION_DATA: Record<string, { cx: number; cy: number; name: string }> = {
  VDA: { cx: 98, cy: 196, name: "Valle d'Aosta" },
  PIE: { cx: 147, cy: 275, name: "Piemonte" },
  LIG: { cx: 232, cy: 328, name: "Liguria" },
  LOM: { cx: 284, cy: 203, name: "Lombardia" },
  TAA: { cx: 400, cy: 112, name: "Trentino-A.A." },
  VEN: { cx: 429, cy: 221, name: "Veneto" },
  FVG: { cx: 524, cy: 149, name: "Friuli-V.G." },
  EMR: { cx: 375, cy: 315, name: "Emilia-R." },
  TOS: { cx: 399, cy: 431, name: "Toscana" },
  MAR: { cx: 540, cy: 444, name: "Marche" },
  UMB: { cx: 482, cy: 487, name: "Umbria" },
  LAZ: { cx: 489, cy: 587, name: "Lazio" },
  ABR: { cx: 594, cy: 565, name: "Abruzzo" },
  MOL: { cx: 652, cy: 620, name: "Molise" },
  CAM: { cx: 665, cy: 699, name: "Campania" },
  PUG: { cx: 803, cy: 688, name: "Puglia" },
  BAS: { cx: 764, cy: 737, name: "Basilicata" },
  CAL: { cx: 786, cy: 859, name: "Calabria" },
  SIC: { cx: 614, cy: 1020, name: "Sicilia" },
  SAR: { cx: 217, cy: 779, name: "Sardegna" },
};

export const REGION_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(REGION_DATA).map(([id, { name }]) => [id, name])
);

type RegionState = "selectable" | "selected" | "chosen" | "revealed" | "disabled";

function getState(
  id: string,
  phase: GameStatus,
  selected: string[],
  chosen: string,
  revealed: string[],
  clickable: string[]
): RegionState {
  switch (phase) {
    case "phase1":
      return selected.includes(id) ? "selected" : "selectable";
    case "phase2":
      if (!selected.includes(id)) return "disabled";
      return id === chosen ? "chosen" : "selected";
    case "phase3":
    case "phase4":
      if (id === chosen) return "chosen";
      if (revealed.includes(id)) return "revealed";
      if (clickable.includes(id)) return "selectable";
      if (selected.includes(id)) return "selected";
      return "disabled";
    case "phase5":
      if (id === chosen) return "chosen";
      if (revealed.includes(id)) return "revealed";
      return "disabled";
    default:
      return "selectable";
  }
}

const STATE_FILL: Record<RegionState, string> = {
  selectable: "rgba(255,255,255,0.75)",
  selected:   "#3b82f6",
  chosen:     "#f59e0b",
  revealed:   "#4ade80",
  disabled:   "transparent",
};
const STATE_STROKE: Record<RegionState, string> = {
  selectable: "#3b82f6",
  selected:   "#1d4ed8",
  chosen:     "#d97706",
  revealed:   "#16a34a",
  disabled:   "transparent",
};

interface ItalyMapProps {
  phase: GameStatus;
  selectedRegions: string[];
  chosenRegion: string;
  revealedRegions: string[];
  onRegionClick: (id: string) => void;
  clickableRegions?: string[];
}

const ItalyMap: React.FC<ItalyMapProps> = ({
  phase,
  selectedRegions,
  chosenRegion,
  revealedRegions,
  onRegionClick,
  clickableRegions = [],
}) => {
  return (
    <div className="flex justify-center w-full">
      <div className="relative" style={{ maxWidth: "560px", width: "100%" }}>
        {/* Base map — width follows container, height auto (aspect ratio preserved) */}
        <img
          src={italyMapImg}
          alt="Mappa delle regioni italiane"
          draggable={false}
          style={{ display: "block", width: "100%", userSelect: "none", pointerEvents: "none" }}
        />
        {/* SVG overlay — viewBox matches image pixel dimensions exactly, scales 1:1 */}
        <svg
          viewBox="0 0 1000 1250"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {Object.entries(REGION_DATA).map(([id, { cx, cy }]) => {
            const state = getState(
              id, phase, selectedRegions, chosenRegion, revealedRegions, clickableRegions
            );
            if (state === "disabled") return null;

            const isClickable =
              phase === "phase1" ||
              (phase === "phase2" && selectedRegions.includes(id)) ||
              ((phase === "phase3" || phase === "phase4") && clickableRegions.includes(id));

            return (
              <circle
                key={id}
                cx={cx}
                cy={cy}
                r={22}
                fill={STATE_FILL[state]}
                stroke={STATE_STROKE[state]}
                strokeWidth={3}
                onClick={isClickable ? () => onRegionClick(id) : undefined}
                style={{ cursor: isClickable ? "pointer" : "default" }}
              >
                <title>{REGION_MAP[id]}</title>
              </circle>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ItalyMap;
