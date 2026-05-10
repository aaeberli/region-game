export const SCHEMA_VERSION = 1;

export type GameStatus = 'idle' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'phase5' | 'complete';

export interface TradeRound {
  round: number;          // 0..3
  revealedRegion: string;
  decision: 'keep' | 'trade';
  tradedTo?: string;
}

export interface GameResult {
  finalRegion: string;
  wonPrize: string;
  timestamp: number;
}

export interface AdminConfig {
  passwordHash: string;   // SHA-256 hex
  prizes: string[];       // exactly 7
}

// Prize map is stored as opaque tokens; the real mapping lives in sessionStorage (session-only key)
export interface ObfuscatedEntry {
  regionId: string;
  token: string;          // XOR-obfuscated prize index encoded as hex
}

export interface GameState {
  schemaVersion: number;
  status: GameStatus;
  selectedRegions: string[];        // 7 regions chosen in phase 1
  obfuscatedMap: ObfuscatedEntry[]; // prize-region map, obfuscated
  chosenRegion: string;             // player's current region
  tradeRounds: TradeRound[];        // 0–4 entries (phase 3 = 4, phase 4 = optional)
  revealedRegions: string[];        // all currently revealed (non-chosen) regions
  tradedAwayRegions: string[];      // regions the player has traded away (not revealed, not chosen)
  finalRegion: string;
  wonPrize: string;
}
