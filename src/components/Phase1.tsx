import React from 'react';
import ItalyMap from './ItalyMap';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import { REGION_MAP } from './ItalyMap';
import { obfuscatePrizeIndex, secureShuffle } from '../crypto';
import type { ObfuscatedEntry } from '../types';

const Phase1: React.FC = () => {
  const { selectedRegions, toggleRegionSelection, confirmPhase1 } = useGameStore();
  const { config } = useAdminStore();

  const handleConfirm = () => {
    if (selectedRegions.length !== 7 || !config) return;
    // Securely shuffle prize indices and assign to the 7 selected regions
    const prizeIndices = secureShuffle([0, 1, 2, 3, 4, 5, 6]);
    const obfuscatedMap: ObfuscatedEntry[] = selectedRegions.map((regionId, i) => ({
      regionId,
      token: obfuscatePrizeIndex(prizeIndices[i]),
    }));
    confirmPhase1(obfuscatedMap);
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="text-center px-2">
        <h2 className="text-xl font-bold text-gray-800">Phase 1: Choose 7 Regions</h2>
        <p className="text-sm text-gray-500 mt-1">
          Selected: <span className="font-semibold text-blue-600">{selectedRegions.length}/7</span>
        </p>
      </div>

      {selectedRegions.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center px-2">
          {selectedRegions.map((id) => (
            <span key={id} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 font-medium">
              {REGION_MAP[id]}
            </span>
          ))}
        </div>
      )}

      <div className="w-full">
        <ItalyMap
          phase="phase1"
          selectedRegions={selectedRegions}
          chosenRegion=""
          revealedRegions={[]}
          onRegionClick={toggleRegionSelection}
        />
      </div>

      <button
        onClick={handleConfirm}
        disabled={selectedRegions.length !== 7}
        className="mx-4 mb-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Confirm Selection →
      </button>
    </div>
  );
};

export default Phase1;
