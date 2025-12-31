import React, { useState } from 'react';
import { Play, Pause, Square, Terminal, Cpu, Zap, Plus, X, Settings, Sliders, Activity } from 'lucide-react';
import { BotInstance } from '@/shared/kernel/types';

const BotPage: React.FC = () => {
  const [bots, setBots] = useState<BotInstance[]>([
    { id: '1', name: 'Alpha-Flow', strategy: 'Momentum Scalp', status: 'RUNNING', uptime: '14h 23m', dailyPnL: 340.50, lastAction: 'Bought 0.05 BTC @ 64320' },
    { id: '2', name: 'Grid-Master', strategy: 'Neutral Grid', status: 'PAUSED', uptime: '4d 2h', dailyPnL: 12.20, lastAction: 'Grid Rebalance' },
    { id: '3', name: 'Sniper-DeepSeek', strategy: 'AI Breakout', status: 'STOPPED', uptime: '0m', dailyPnL: 0, lastAction: 'Waiting for volatility' },
  ]);

  const [showWizard, setShowWizard] = useState(false);

  const toggleStatus = (id: string) => {
    setBots(prev => prev.map(b => {
      if (b.id !== id) return b;
      if (b.status === 'RUNNING') return { ...b, status: 'PAUSED' };
      if (b.status === 'PAUSED') return { ...b, status: 'RUNNING' };
      if (b.status === 'STOPPED') return { ...b, status: 'RUNNING' };
      return b;
    }));
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Bot Engine Control</h2>
          <p className="text-slate-400">Manage automated strategy instances and execution contexts.</p>
        </div>
        <button 
          onClick={() => setShowWizard(true)}
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus size={18} /> Create New Bot
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bot List */}
        <div className="lg:col-span-2 space-y-4">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-surface border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  bot.status === 'RUNNING' ? 'bg-green-500/20 text-green-500' : 
                  bot.status === 'PAUSED' ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-700/30 text-slate-500'
                }`}>
                  <Cpu size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    {bot.name}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      bot.status === 'RUNNING' ? 'border-green-500/50 text-green-400' :
                      bot.status === 'PAUSED' ? 'border-amber-500/50 text-amber-400' : 'border-slate-600 text-slate-400'
                    }`}>{bot.status}</span>
                  </h3>
                  <p className="text-sm text-slate-400">{bot.strategy} • Uptime: {bot.uptime}</p>
                </div>
              </div>

              <div className="flex flex-col md:items-end">
                <span className={`text-lg font-mono font-bold ${bot.dailyPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {bot.dailyPnL >= 0 ? '+' : ''}${bot.dailyPnL.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500">Daily PnL</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => toggleStatus(bot.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    bot.status === 'RUNNING' 
                      ? 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10' 
                      : 'border-green-500/50 text-green-500 hover:bg-green-500/10'
                  }`}
                  title={bot.status === 'RUNNING' ? "Pause" : "Start"}
                >
                  {bot.status === 'RUNNING' ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white" title="Configure">
                  <Settings size={20} />
                </button>
                <button className="p-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10" title="Stop Forcefully">
                  <Square size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Execution Logs */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-sm h-[400px] flex flex-col">
          <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-800 pb-2">
            <Terminal size={16} />
            <span className="font-semibold uppercase text-xs">Execution Engine Logs</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            <div className="text-slate-500">[10:42:01] <span className="text-blue-400">Alpha-Flow</span> scanning BTCUSDT...</div>
            <div className="text-slate-500">[10:42:05] <span className="text-blue-400">Alpha-Flow</span> signals BUY conf: 88%</div>
            <div className="text-slate-500">[10:42:06] <span className="text-green-400">EXECUTE</span> Order #8829 filled.</div>
            <div className="text-slate-500">[10:42:15] <span className="text-amber-400">Grid-Master</span> upper limit reached.</div>
            <div className="text-slate-500">[10:43:00] <span className="text-purple-400">Sniper-DeepSeek</span> analyzing market sentiment...</div>
            <div className="text-slate-500">[10:43:12] <span className="text-red-400">ERROR</span> Connection glitch on WebSocket (recovered)</div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></div>
            <span className="text-xs text-slate-500">Live Stream Active</span>
          </div>
        </div>
      </div>

      {/* Strategy Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-primary" /> Create New Bot Strategy
              </h3>
              <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Step 1: Basics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Bot Name</label>
                  <input type="text" placeholder="e.g. BTC Moon Scalper" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Target Pair</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none">
                    <option>BTC/USDT</option>
                    <option>ETH/USDT</option>
                    <option>SOL/USDT</option>
                  </select>
                </div>
              </div>

              {/* Step 2: Logic */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <Sliders size={16} /> Strategy Logic
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-xs text-slate-500 uppercase">Entry Trigger</label>
                     <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white">
                       <option>RSI (14) &lt; 30 (Oversold)</option>
                       <option>MACD Crossover</option>
                       <option>SuperTrend Flip</option>
                       <option>AI Sentiment &gt; 80%</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs text-slate-500 uppercase">Timeframe</label>
                     <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white">
                       <option>1 Minute (Scalping)</option>
                       <option>5 Minutes</option>
                       <option>15 Minutes</option>
                       <option>1 Hour (Swing)</option>
                     </select>
                   </div>
                </div>
              </div>

              {/* Step 3: Risk */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                  <Activity size={16} /> Risk Management
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Leverage</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="1" max="50" defaultValue="10" className="w-full accent-primary h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                      <span className="text-sm font-mono text-white w-8">10x</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Take Profit %</label>
                    <input type="number" defaultValue="1.5" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Stop Loss %</label>
                    <input type="number" defaultValue="0.5" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white" />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
              <button 
                onClick={() => setShowWizard(false)}
                className="px-4 py-2 text-slate-400 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Bot created successfully!");
                  setShowWizard(false);
                }}
                className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <Zap size={16} /> Launch Bot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotPage;
