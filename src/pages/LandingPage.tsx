import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useAdminStore } from '../store/adminStore';
import DEFAULT_PRIZES from '../defaultPrizes.json';

const DEFAULT_PRIZES_READY = DEFAULT_PRIZES.every((p) => p.trim());

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { status, startGame } = useGameStore();
  const { config, setConfig } = useAdminStore();

  const prizesReady = config
    ? config.prizes.every((p: string) => p.trim())
    : DEFAULT_PRIZES_READY;
  const gameInProgress = prizesReady && ['phase1','phase2','phase3','phase4','phase5'].includes(status);
  const gameIdle = prizesReady && (status === 'idle');
  const gameComplete = status === 'complete';

  const handlePlay = () => {
    // Auto-init config with default prizes if admin has never logged in
    if (!config) {
      setConfig({ passwordHash: '', prizes: [...DEFAULT_PRIZES] });
    }
    if (gameIdle) startGame();
    navigate('/game');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-blue-50 to-white px-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">🗺️ Region Game</h1>
        <p className="mt-2 text-gray-500 text-sm">Italy Prize Trading Game</p>
      </div>

      {gameComplete && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-5 py-3 text-sm text-green-700 text-center max-w-xs">
          A game has been completed. Ask the admin to reset for the next player.
        </div>
      )}

      {(gameIdle || gameInProgress) && (
        <button
          onClick={handlePlay}
          className="w-full max-w-xs rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-700 active:scale-95 transition-transform"
        >
          {gameInProgress ? 'Continue Game' : 'Play Game'}
        </button>
      )}

      {!prizesReady && !gameComplete && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-3 text-sm text-amber-700 text-center max-w-xs">
          Waiting for admin to configure the prizes.
        </div>
      )}

      <button
        onClick={() => navigate('/admin')}
        className="text-sm text-gray-400 hover:text-gray-600 underline"
      >
        Admin
      </button>
    </div>
  );
};

export default LandingPage;
