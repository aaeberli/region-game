import React, { useState } from 'react';
import ItalyMap, { REGION_MAP } from './ItalyMap';
import { useGameStore } from '../store/gameStore';

const Phase4: React.FC = () => {
  const { selectedRegions, chosenRegion, revealedRegions, finalTrade } = useGameStore();
  const [pending, setPending] = useState('');

  // The two undiscovered regions (selected, not chosen, not revealed)
  const undiscoveredRegions = selectedRegions.filter(
    (r) => r !== chosenRegion && !revealedRegions.includes(r)
  );

  const handleKeep = () => finalTrade('keep');
  const handleTrade = () => {
    if (pending) finalTrade('trade', pending);
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="text-center px-2">
        <h2 className="text-xl font-bold text-gray-800">Phase 4: Final Trade</h2>
        <p className="text-sm text-gray-500 mt-1">
          Two undiscovered regions remain. Keep yours or trade it for one of them.
        </p>
      </div>

      <div className="mx-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-center text-sm">
        Your region: <span className="font-bold text-amber-800">{REGION_MAP[chosenRegion]}</span>
      </div>

      <div className="mx-4 grid grid-cols-2 gap-2">
        {undiscoveredRegions.map((r) => (
          <button
            key={r}
            onClick={() => setPending(r)}
            className={`rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
              pending === r
                ? 'border-purple-500 bg-purple-100 text-purple-800'
                : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
            }`}
          >
            {REGION_MAP[r]}
          </button>
        ))}
      </div>

      <div className="w-full">
        <ItalyMap
          phase="phase4"
          selectedRegions={selectedRegions}
          chosenRegion={chosenRegion}
          revealedRegions={revealedRegions}
          onRegionClick={(r) => undiscoveredRegions.includes(r) && setPending(r)}
          clickableRegions={undiscoveredRegions}
        />
      </div>

      <div className="mx-4 mb-2 flex gap-2">
        <button
          onClick={handleKeep}
          className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white hover:bg-amber-600"
        >
          Keep {REGION_MAP[chosenRegion]}
        </button>
        <button
          onClick={handleTrade}
          disabled={!pending}
          className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-40"
        >
          Trade → {pending ? REGION_MAP[pending] : '…'}
        </button>
      </div>
    </div>
  );
};

export default Phase4;
