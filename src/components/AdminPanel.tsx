import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useGameStore } from '../store/gameStore';
import { hashPassword } from '../crypto';
import DEFAULT_PRIZES from '../defaultPrizes.json';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const { config, updatePrizes } = useAdminStore();
  const { status: gameStatus, startGame, resetGame } = useGameStore();
  const [prizes, setPrizes] = useState<string[]>(config?.prizes ?? DEFAULT_PRIZES);
  const [saved, setSaved] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [showReset, setShowReset] = useState(false);

  const handleSave = () => {
    if (prizes.some((p) => !p.trim())) {
      alert('All 7 prizes must be filled in.');
      return;
    }
    updatePrizes(prizes.map((p) => p.trim()));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleStartGame = () => {
    if (prizes.some((p) => !p.trim())) {
      alert('Save all 7 prizes before starting the game.');
      return;
    }
    if (gameStatus !== 'idle' && gameStatus !== 'complete') {
      alert('A game is already in progress. Reset it first.');
      return;
    }
    startGame();
    onLogout();
  };

  const handleReset = async () => {
    setResetError('');
    if (!resetPassword) { setResetError('Enter your admin password to confirm reset.'); return; }
    const hash = await hashPassword(resetPassword);
    if (hash !== config?.passwordHash) { setResetError('Incorrect password.'); return; }
    resetGame();
    setShowReset(false);
    setResetPassword('');
    alert('Game has been reset. A new game can now be started.');
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-700">
            Logout
          </button>
        </div>

        {/* Prizes editor */}
        <div className="rounded-2xl bg-white p-6 shadow mb-4">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Set Prizes (7 required)</h2>
          <div className="space-y-2">
            {prizes.map((prize, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 text-center text-sm font-medium text-gray-500">{i + 1}</span>
                <input
                  type="text"
                  value={prize}
                  onChange={(e) => {
                    const next = [...prizes];
                    next[i] = e.target.value;
                    setPrizes(next);
                  }}
                  placeholder={`Prize ${i + 1}`}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {saved ? 'Saved ✓' : 'Save Prizes'}
            </button>
            <button
              onClick={handleStartGame}
              className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Start Game
            </button>
          </div>
        </div>

        {/* Game status */}
        <div className="rounded-2xl bg-white p-4 shadow mb-4">
          <p className="text-sm text-gray-600">
            Game status: <span className="font-semibold capitalize text-gray-800">{gameStatus}</span>
          </p>
        </div>

        {/* Reset flow */}
        <div className="rounded-2xl bg-white p-4 shadow">
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="w-full rounded-lg bg-red-50 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Reset Game
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Enter admin password to confirm reset:</p>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                autoFocus
              />
              {resetError && <p className="text-sm text-red-600">{resetError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => { setShowReset(false); setResetPassword(''); setResetError(''); }}
                  className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
