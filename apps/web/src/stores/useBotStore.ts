import { create } from 'zustand';

interface BotConfig {
  exchangeType: string;
  exchangeName: string;
  riskLimit: number;
  maxDrawdown: number;
  strategyMode: string; // e.g., "hybrid", "technical_only"
  // Future: আরো ফিল্ড অ্যাড করা যাবে
}

interface BotState {
  config: BotConfig;
  status: 'running' | 'stopped' | 'error' | 'initializing';
  pnL: number;
  isMarketOpen: boolean;
  setConfig: (config: Partial<BotConfig>) => void;
  setStatus: (status: BotState['status']) => void;
  setPnL: (pnl: number) => void;
  setMarketOpen: (open: boolean) => void;
  // API calls will update these
  fetchConfig: () => Promise<void>;
  saveConfig: () => Promise<void>;
  startBot: () => Promise<void>;
  stopBot: () => Promise<void>;
  killBot: () => Promise<void>;
}

export const useBotStore = create<BotState>((set, get) => ({
  config: {
    exchangeType: 'crypto',
    exchangeName: 'Binance',
    riskLimit: 2,
    maxDrawdown: 20,
    strategyMode: 'hybrid',
  },
  status: 'stopped',
  pnL: 0,
  isMarketOpen: true,
  setConfig: (newConfig) => set({ config: { ...get().config, ...newConfig } }),
  setStatus: (status) => set({ status }),
  setPnL: (pnL) => set({ pnL }),
  setMarketOpen: (open) => set({ isMarketOpen: open }),
  fetchConfig: async () => {
    // Later: API call to backend
    // const res = await fetch('/api/config');
    // set({ config: await res.json() });
  },
  saveConfig: async () => {
    // Later: POST to /api/config
    console.log('Saving config:', get().config);
  },
  startBot: async () => {
    // Later: POST /api/bot/start
    set({ status: 'initializing' });
  },
  stopBot: async () => {
    // Later: POST /api/bot/stop
    set({ status: 'stopped' });
  },
  killBot: async () => {
    // Later: POST /api/bot/kill
    set({ status: 'stopped' });
  },
}));
