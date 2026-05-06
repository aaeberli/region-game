import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminConfig } from '../types';

interface AdminStore {
  config: AdminConfig | null;
  setConfig: (config: AdminConfig) => void;
  updatePrizes: (prizes: string[]) => void;
  clearConfig: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      config: null,
      setConfig: (config) => set({ config }),
      updatePrizes: (prizes) => {
        const existing = get().config;
        if (existing) set({ config: { ...existing, prizes } });
      },
      clearConfig: () => set({ config: null }),
    }),
    { name: 'ptg_v1_admin' }
  )
);
