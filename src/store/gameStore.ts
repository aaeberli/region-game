import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, TradeRound, ObfuscatedEntry } from '../types';
import { SCHEMA_VERSION } from '../types';

const INITIAL_STATE: GameState = {
  schemaVersion: SCHEMA_VERSION,
  status: 'idle',
  selectedRegions: [],
  obfuscatedMap: [],
  chosenRegion: '',
  tradeRounds: [],
  revealedRegions: [],
  finalRegion: '',
  wonPrize: '',
};

interface GameStore extends GameState {
  // Phase 1
  startGame: () => void;
  toggleRegionSelection: (regionId: string) => void;
  confirmPhase1: (obfuscatedMap: ObfuscatedEntry[]) => void;
  // Phase 2
  confirmChosenRegion: (regionId: string) => void;
  // Phase 3
  revealRegion: (regionId: string) => void;
  decideTrade: (decision: 'keep' | 'trade', tradeTo?: string) => void;
  // Phase 4
  finalTrade: (decision: 'keep' | 'trade', tradeTo?: string) => void;
  // Phase 5
  completeGame: (wonPrize: string) => void;
  // Admin reset
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      startGame: () => set({ ...INITIAL_STATE, schemaVersion: SCHEMA_VERSION, status: 'phase1' }),

      toggleRegionSelection: (regionId) => {
        const { selectedRegions, status } = get();
        if (status !== 'phase1') return;
        if (selectedRegions.includes(regionId)) {
          set({ selectedRegions: selectedRegions.filter((r) => r !== regionId) });
        } else if (selectedRegions.length < 7) {
          set({ selectedRegions: [...selectedRegions, regionId] });
        }
      },

      confirmPhase1: (obfuscatedMap) => {
        const { status, selectedRegions } = get();
        if (status !== 'phase1' || selectedRegions.length !== 7) return;
        set({ obfuscatedMap, status: 'phase2' });
      },

      confirmChosenRegion: (regionId) => {
        const { status, selectedRegions } = get();
        if (status !== 'phase2' || !selectedRegions.includes(regionId)) return;
        set({ chosenRegion: regionId, status: 'phase3' });
      },

      revealRegion: (regionId) => {
        const { status, revealedRegions, chosenRegion, selectedRegions, tradeRounds } = get();
        if (status !== 'phase3') return;
        if (revealedRegions.includes(regionId) || regionId === chosenRegion) return;
        if (!selectedRegions.includes(regionId)) return;
        if (tradeRounds.length > 0 && tradeRounds[tradeRounds.length - 1].decision === undefined) return;
        // Start new round
        const newRound: Partial<TradeRound> = { round: tradeRounds.length, revealedRegion: regionId };
        set({
          revealedRegions: [...revealedRegions, regionId],
          tradeRounds: [...tradeRounds, newRound as TradeRound],
        });
      },

      decideTrade: (decision, tradeTo) => {
        const { status, tradeRounds, chosenRegion, revealedRegions } = get();
        if (status !== 'phase3') return;
        const rounds = [...tradeRounds];
        const current = rounds[rounds.length - 1];
        if (!current || current.decision) return;
        current.decision = decision;
        current.tradedTo = tradeTo;
        const newChosen = decision === 'trade' && tradeTo ? tradeTo : chosenRegion;
        // When trading away the current region, mark it as revealed so it doesn't
        // float as an undiscovered region in Phase 4/5.
        const newRevealed =
          decision === 'trade' && !revealedRegions.includes(chosenRegion)
            ? [...revealedRegions, chosenRegion]
            : revealedRegions;
        const nextStatus = rounds.length === 4 ? 'phase4' : 'phase3';
        set({ tradeRounds: rounds, chosenRegion: newChosen, revealedRegions: newRevealed, status: nextStatus });
      },

      finalTrade: (decision, tradeTo) => {
        const { status, chosenRegion } = get();
        if (status !== 'phase4') return;
        const finalRegion = decision === 'trade' && tradeTo ? tradeTo : chosenRegion;
        set({ finalRegion, status: 'phase5' });
      },

      completeGame: (wonPrize) => {
        const { finalRegion } = get();
        if (!finalRegion) return;
        set({ wonPrize, status: 'complete' });
        // Persist result to history
        try {
          const history = JSON.parse(localStorage.getItem('ptg_v1_history') ?? '[]');
          history.push({ finalRegion, wonPrize, timestamp: Date.now() });
          localStorage.setItem('ptg_v1_history', JSON.stringify(history));
        } catch { /* non-critical */ }
      },

      resetGame: () => set({ ...INITIAL_STATE, schemaVersion: SCHEMA_VERSION }),
    }),
    {
      name: 'ptg_v1_game',
      onRehydrateStorage: () => (state) => {
        if (state && state.schemaVersion !== SCHEMA_VERSION) {
          // Schema mismatch — reset game state silently
          Object.assign(state, INITIAL_STATE);
        }
      },
    }
  )
);
