import React, { useState } from "react";
import italyMapImg from "../assets/italy-map.png";
import { REGION_DATA } from "../components/ItalyMap";

interface ClickPoint { cx: number; cy: number }

const CalibratePage: React.FC = () => {
  const [last, setLast] = useState<ClickPoint | null>(null);
  const [history, setHistory] = useState<ClickPoint[]>([]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
    const cy = Math.round(((e.clientY - rect.top) / rect.height) * 1250);
    setLast({ cx, cy });
    setHistory(prev => [{ cx, cy }, ...prev.slice(0, 29)]);
  };

  return (
    <div className="p-3 max-w-xl mx-auto">
      <h1 className="text-lg font-bold mb-1">Map Calibration</h1>
      <p className="text-xs text-gray-500 mb-2">
        Click any region center → copy the cx/cy into <code>REGION_DATA</code> in ItalyMap.tsx
      </p>
      {last && (
        <div className="mb-2 font-mono text-sm bg-yellow-100 px-3 py-1 rounded">
          cx={last.cx}, cy={last.cy}
        </div>
      )}

      <div className="relative" style={{ maxWidth: "560px", width: "100%" }}>
        <img
          src={italyMapImg}
          style={{ display: "block", width: "100%", userSelect: "none", pointerEvents: "none" }}
          draggable={false}
        />
        <svg
          viewBox="0 0 1000 1250"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", cursor: "crosshair" }}
          onClick={handleClick}
        >
          {/* Current region positions (white circles) */}
          {Object.entries(REGION_DATA).map(([id, { cx, cy }]) => (
            <g key={id}>
              <circle cx={cx} cy={cy} r={14} fill="rgba(255,255,255,0.6)" stroke="#6366f1" strokeWidth={2} />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize={12} fill="#312e81" style={{ userSelect: "none", pointerEvents: "none" }}>
                {id}
              </text>
            </g>
          ))}
          {/* Clicked crosshairs */}
          {history.map((p, i) => (
            <g key={i}>
              <circle cx={p.cx} cy={p.cy} r={8} fill="rgba(239,68,68,0.6)" stroke="#dc2626" strokeWidth={2} />
              <text x={p.cx + 14} y={p.cy + 5} fontSize={22} fill="#dc2626" style={{ userSelect: "none", pointerEvents: "none" }}>
                {p.cx},{p.cy}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {history.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-600 mb-1">Last clicks:</p>
          <div className="font-mono text-xs bg-gray-100 rounded p-2 max-h-36 overflow-y-auto space-y-0.5">
            {history.map((p, i) => (
              <div key={i} className="text-gray-700">cx={p.cx}, cy={p.cy}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalibratePage;
