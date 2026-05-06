import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import { REGION_MAP } from './ItalyMap';
import { deobfuscatePrizeIndex } from '../crypto';

const Phase5: React.FC = () => {
  const { finalRegion, obfuscatedMap, completeGame, resetGame, status } = useGameStore();
  const { config } = useAdminStore();
  const [prize, setPrize] = useState('');
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!finalRegion || !config) return;
    const entry = obfuscatedMap.find((e) => e.regionId === finalRegion);
    if (!entry) return;
    const idx = deobfuscatePrizeIndex(entry.token);
    const p = config.prizes[idx] ?? '?';
    // Short delay for dramatic effect before reveal
    const t = setTimeout(() => {
      setPrize(p);
      setRevealed(true);
      if (status !== 'complete') completeGame(p);
    }, 800);
    return () => clearTimeout(t);
  }, [finalRegion, obfuscatedMap, config, completeGame, status]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-6 px-4 bg-gradient-to-b from-amber-50 to-white">
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
    </div>
  );
};

export default Phase5;
