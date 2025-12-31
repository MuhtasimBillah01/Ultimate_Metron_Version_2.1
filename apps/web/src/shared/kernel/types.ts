export type PageName = 'dashboard' | 'chart' | 'signals' | 'market' | 'positions' | 'logs' | 'risk' | 'bot' | 'backtest' | 'training' | 'blank1' | 'blank2' | 'settings' | 'health';

export enum Side {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface Position {
  id: string;
  symbol: string;
  size: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  unrealizedPnL: number;
  liquidationPrice: number;
  side: Side;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Signal {
  id: string;
  timestamp: number;
  symbol: string;
  type: Side;
  confidence: number; // 0-100
  reason: string; // "RSI Divergence confirmed by DeepSeek"
  source: 'Gemini' | 'DeepSeek' | 'Hybrid';
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  category: 'System' | 'Trade' | 'Signal' | 'API';
  message: string;
}

export interface BotInstance {
  id: string;
  name: string;
  strategy: string; // e.g., "Mean Reversion"
  status: 'RUNNING' | 'PAUSED' | 'STOPPED' | 'ERROR';
  uptime: string;
  dailyPnL: number;
  lastAction: string;
}

export interface SystemStatus {
  cpuUsage: number;
  ramUsage: number;
  apiLatency: number; // ms
  vmStatus: 'Running' | 'Stopping' | 'Stopped';
  connectionStatus: 'Connected' | 'Reconnecting' | 'Disconnected';
}