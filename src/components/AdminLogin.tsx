import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { hashPassword } from '../crypto';
import DEFAULT_PRIZES from '../defaultPrizes.json';

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const { config, setConfig } = useAdminStore();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isFirstRun = !config?.passwordHash;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isFirstRun) {
        if (password.length < 4) { setError('Password must be at least 4 characters.'); return; }
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        const hash = await hashPassword(password);
        setConfig({ passwordHash: hash, prizes: [...DEFAULT_PRIZES] });
        onSuccess();
      } else {
        const hash = await hashPassword(password);
        if (hash !== config!.passwordHash) { setError('Incorrect password.'); return; }
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          {isFirstRun ? 'Admin Setup' : 'Admin Login'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              required
            />
          </div>
          {isFirstRun && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Checking…' : isFirstRun ? 'Set Password & Continue' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
