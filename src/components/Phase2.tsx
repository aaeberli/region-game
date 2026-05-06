import React, { useState } from 'react';
import ItalyMap from './ItalyMap';
import { useGameStore } from '../store/gameStore';
import { REGION_MAP } from './ItalyMap';

const Phase2: React.FC = () => {
  const { selectedRegions, confirmChosenRegion } = useGameStore();
  const [pending, setPending] = useState('');

  const handleClick = (regionId: string) => {
    if (!selectedRegions.includes(regionId)) return;
    setPending(regionId);
  };

  const handleConfirm = () => {
    if (pending) confirmChosenRegion(pending);
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="text-center px-2">
        <h2 className="text-xl font-bold text-gray-800">Phase 2: Pick Your Region</h2>
        <p className="text-sm text-gray-500 mt-1">Tap one of your 7 selected regions to claim it.</p>
      </div>

      {pending && (
        <div className="mx-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-center">
          <p className="text-sm text-amber-800">
            Selected: <span className="font-bold">{REGION_MAP[pending]}</span>
          </p>
        </div>
      )}

      <div className="w-full">
        <ItalyMap
          phase="phase2"
          selectedRegions={selectedRegions}
          chosenRegion={pending}
          revealedRegions={[]}
          onRegionClick={handleClick}
          clickableRegions={selectedRegions}
        />
      </div>

      <button
        onClick={handleConfirm}
        disabled={!pending}
        className="mx-4 mb-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Claim {pending ? REGION_MAP[pending] : '…'} →
      </button>
    </div>
  );
};

export default Phase2;
