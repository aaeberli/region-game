import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import { REGION_MAP } from './ItalyMap';
import { deobfuscatePrizeIndex } from '../crypto';

const Phase5: React.FC = () => {
  const { finalRegion, selectedRegions, revealedRegions, tradedAwayRegions, obfuscatedMap, completeGame, resetGame, status } = useGameStore();
  const { config } = useAdminStore();
  const [otherPrize, setOtherPrize] = useState('');
  const [otherRegion, setOtherRegion] = useState('');
  const [step, setStep] = useState<'other' | 'mine'>('other');
  const [prize, setPrize] = useState('');
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!finalRegion || !config) return;

    // Find the one remaining undiscovered region (not finalRegion, not revealed, not traded away)
    const remaining = selectedRegions.find(
      (r) => r !== finalRegion && !revealedRegions.includes(r) && !tradedAwayRegions.includes(r)
    );
    if (remaining) {
      const entry = obfuscatedMap.find((e) => e.regionId === remaining);
      if (entry) {
        const idx = deobfuscatePrizeIndex(entry.token);
        setOtherRegion(remaining);
        setOtherPrize(config.prizes[idx] ?? '?');
      }
    }

    // Decode own prize (don't reveal yet)
    const ownEntry = obfuscatedMap.find((e) => e.regionId === finalRegion);
    if (ownEntry) {
      const idx = deobfuscatePrizeIndex(ownEntry.token);
      setPrize(config.prizes[idx] ?? '?');
    }
  }, [finalRegion, selectedRegions, revealedRegions, obfuscatedMap, config]);

  const handleRevealMine = () => {
    setStep('mine');
    setTimeout(() => {
      setRevealed(true);
      if (status !== 'complete') completeGame(prize);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-6 px-4 bg-gradient-to-b from-amber-50 to-white">
      <AnimatePresence mode="wait">
        {step === 'other' && otherRegion && (
          <motion.div
            key="other"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-5"
          >
            <p className="text-sm text-gray-500 text-center">The other region contained…</p>
            <h2 className="text-xl font-bold text-gray-700 text-center">
              {REGION_MAP[otherRegion] ?? otherRegion}
            </h2>
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}
            >
              <span className="text-center text-lg font-extrabold text-white px-5 leading-tight">
                {otherPrize}
              </span>
            </div>
            <button
              onClick={handleRevealMine}
              className="mt-2 rounded-2xl bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-amber-600 active:scale-95 transition-all"
            >
              Now reveal mine →
            </button>
          </motion.div>
        )}

        {(step === 'mine' || !otherRegion) && (
          <motion.div
            key="mine"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              {REGION_MAP[finalRegion] ?? finalRegion}
            </h2>

            <motion.div
              className="w-56 h-56 rounded-full flex items-center justify-center shadow-xl"
              initial={{ scale: 0.3, rotate: -15, opacity: 0 }}
              animate={revealed ? { scale: 1, rotate: 0, opacity: 1 } : {}}
              transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
            >
              {revealed ? (
                <span className="text-center text-xl font-extrabold text-white px-6 leading-tight">
                  {prize}
                </span>
              ) : (
                <span className="text-5xl">🎁</span>
              )}
            </motion.div>

            {revealed && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-semibold text-gray-700 text-center"
              >
                Congratulations! You won:<br />
                <span className="text-2xl font-extrabold text-amber-600">{prize}</span>
              </motion.p>
            )}

            {!revealed && (
              <p className="text-gray-400 text-sm animate-pulse">Revealing your prize…</p>
            )}

            {revealed && (
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={() => { resetGame(); navigate('/'); }}
                className="mt-2 rounded-2xl bg-green-600 px-10 py-4 text-lg font-bold text-white shadow-lg hover:bg-green-700 active:scale-95 transition-all"
              >
                Accept
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Phase5;
