import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ItalyMap from './ItalyMap';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import { REGION_MAP } from './ItalyMap';
import { deobfuscatePrizeIndex } from '../crypto';

type SubState = 'pick-reveal' | 'show-revealed' | 'pick-trade';

const Phase3: React.FC = () => {
  const { selectedRegions, chosenRegion, revealedRegions, obfuscatedMap, tradeRounds, revealRegion, decideTrade } = useGameStore();
  const { config } = useAdminStore();
  const [subState, setSubState] = useState<SubState>('pick-reveal');
  const [pendingReveal, setPendingReveal] = useState('');
  const [revealedPrize, setRevealedPrize] = useState('');
  const [pendingTrade, setPendingTrade] = useState('');

  const currentRound = tradeRounds.length; // 0-based; complete rounds already in tradeRounds
  const totalRounds = 4;

  // Regions available to reveal: selected, not chosen, not yet revealed
  const revealableRegions = selectedRegions.filter(
    (r) => r !== chosenRegion && !revealedRegions.includes(r)
  );
  // Regions available to trade to: selected, not chosen, not yet revealed, not the just-revealed one
  const tradableRegions = revealableRegions.filter((r) => r !== pendingReveal);

  const getPrize = (regionId: string): string => {
    const entry = obfuscatedMap.find((e) => e.regionId === regionId);
    if (!entry || !config) return '?';
    const idx = deobfuscatePrizeIndex(entry.token);
    return config.prizes[idx] ?? '?';
  };

  const handleRevealClick = (regionId: string) => {
    if (subState !== 'pick-reveal') return;
    if (!revealableRegions.includes(regionId)) return;
    setPendingReveal(regionId);
  };

  const handleConfirmReveal = () => {
    if (!pendingReveal) return;
    revealRegion(pendingReveal);
    const prize = getPrize(pendingReveal);
    setRevealedPrize(prize);
    setSubState('show-revealed');
  };

  const handleDecide = (decision: 'keep' | 'trade') => {
    if (decision === 'keep') {
      decideTrade('keep');
      setPendingReveal('');
      setRevealedPrize('');
      setPendingTrade('');
      setSubState('pick-reveal');
    } else {
      setSubState('pick-trade');
    }
  };

  const handleTradeClick = (regionId: string) => {
    if (subState !== 'pick-trade') return;
    if (!tradableRegions.includes(regionId)) return;
    setPendingTrade(regionId);
  };

  const handleConfirmTrade = () => {
    if (!pendingTrade) return;
    decideTrade('trade', pendingTrade);
    setPendingReveal('');
    setRevealedPrize('');
    setPendingTrade('');
    setSubState('pick-reveal');
  };

  // Determine clickable regions for the map
  const clickableOnMap =
    subState === 'pick-reveal'
      ? revealableRegions
      : subState === 'pick-trade'
      ? tradableRegions
      : [];

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="text-center px-2">
        <h2 className="text-xl font-bold text-gray-800">Phase 3: Trading</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Round <span className="font-semibold text-blue-600">{currentRound + 1}</span> of {totalRounds}
        </p>
      </div>

      {/* Current chosen region */}
      <div className="mx-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 text-center text-sm">
        Your region: <span className="font-bold text-amber-800">{REGION_MAP[chosenRegion]}</span>
      </div>

      {/* Sub-state instructions */}
      <AnimatePresence mode="wait">
        {subState === 'pick-reveal' && (
          <motion.div
            key="pick-reveal"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-blue-800 text-center"
          >
            {pendingReveal
              ? <>Reveal <strong>{REGION_MAP[pendingReveal]}</strong>?</>
              : 'Tap one of your remaining regions to reveal its prize.'}
          </motion.div>
        )}
        {subState === 'show-revealed' && (
          <motion.div
            key="show-revealed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center"
          >
            <p className="text-sm text-green-700"><strong>{REGION_MAP[pendingReveal]}</strong> hides:</p>
            <p className="text-lg font-bold text-green-800 mt-1">{revealedPrize}</p>
            <p className="text-xs text-gray-500 mt-1">Do you want to keep your region or swap it with one of the remaining unrevealed ones?</p>
          </motion.div>
        )}
        {subState === 'pick-trade' && (
          <motion.div
            key="pick-trade"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4 rounded-xl bg-purple-50 border border-purple-200 px-4 py-2 text-sm text-purple-800 text-center"
          >
            {pendingTrade
              ? <>Trade to <strong>{REGION_MAP[pendingTrade]}</strong>?</>
              : 'Tap a region to trade your current region for it.'}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full">
        <ItalyMap
          phase="phase3"
          selectedRegions={selectedRegions}
          chosenRegion={chosenRegion}
          revealedRegions={revealedRegions}
          onRegionClick={subState === 'pick-reveal' ? handleRevealClick : handleTradeClick}
          clickableRegions={clickableOnMap}
        />
      </div>

      {/* Action buttons */}
      <div className="mx-4 mb-2 flex gap-2">
        {subState === 'pick-reveal' && (
          <button
            onClick={handleConfirmReveal}
            disabled={!pendingReveal}
            className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40"
          >
            Reveal Region →
          </button>
        )}
        {subState === 'show-revealed' && (
          <>
            <button
              onClick={() => handleDecide('keep')}
              className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white hover:bg-amber-600"
            >
              Keep My Region
            </button>
            <button
              onClick={() => handleDecide('trade')}
              className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-700"
            >
              Trade It
            </button>
          </>
        )}
        {subState === 'pick-trade' && (
          <button
            onClick={handleConfirmTrade}
            disabled={!pendingTrade}
            className="flex-1 rounded-xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-40"
          >
            Confirm Trade →
          </button>
        )}
      </div>
    </div>
  );
};

export default Phase3;
