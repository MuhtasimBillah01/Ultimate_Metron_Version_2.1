import { create } from 'zustand';
import { apiClient } from '@/shared/api/client';

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
  fetchStatus: () => Promise<void>;
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
    try {
      const { data } = await apiClient.get('/config/');
      set({ config: data });
    } catch (error) {
      console.error('Failed to fetch config:', error);
    }
  },
  saveConfig: async () => {
    try {
      const config = get().config;
      await apiClient.post('/config/', config);
      console.log('Config saved successfully');
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  },
  startBot: async () => {
    try {
      await apiClient.post('/bot/start');
      set({ status: 'running' }); // Optimistic update
    } catch (error) {
      console.error('Failed to start bot:', error);
    }
  },
  stopBot: async () => {
    try {
      await apiClient.post('/bot/stop');
      set({ status: 'stopped' });
    } catch (error) {
      console.error('Failed to stop bot:', error);
    }
  },
  killBot: async () => {
    try {
      await apiClient.post('/bot/kill');
      set({ status: 'stopped' });
    } catch (error) {
      console.error('Failed to kill bot:', error);
    }
  },
  fetchStatus: async () => {
    try {
      const { data } = await apiClient.get('/status/');
      set({
        status: data.botStatus,
        pnL: data.pnL,
        isMarketOpen: data.marketOpen,
      });
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  },
}));
