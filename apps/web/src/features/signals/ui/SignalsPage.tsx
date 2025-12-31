import React from 'react';
import { Signal, Side } from '@/shared/kernel/types';
import { Filter, Download, Search } from 'lucide-react';

const mockSignals: Signal[] = [
  { id: '1', timestamp: Date.now(), symbol: 'BTCUSDT', type: Side.BUY, confidence: 92, reason: 'RSI Divergence + Whale Volume detected', source: 'Gemini' },
  { id: '2', timestamp: Date.now() - 120000, symbol: 'ETHUSDT', type: Side.SELL, confidence: 85, reason: 'Resistance rejection at 3400', source: 'DeepSeek' },
  { id: '3', timestamp: Date.now() - 300000, symbol: 'SOLUSDT', type: Side.SELL, confidence: 78, reason: 'MACD Bearish Crossover', source: 'Hybrid' },
  { id: '4', timestamp: Date.now() - 600000, symbol: 'DOGEUSDT', type: Side.BUY, confidence: 65, reason: 'Meme sentiment spike', source: 'Gemini' },
];

const SignalsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Signal Feed</h2>
          <p className="text-slate-400">AI-generated trading opportunities (Gemini + DeepSeek).</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search symbol..." 
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <button className="p-2 bg-surface border border-slate-800 rounded-lg text-slate-400 hover:text-white"><Filter size={20} /></button>
          <button className="p-2 bg-surface border border-slate-800 rounded-lg text-slate-400 hover:text-white"><Download size={20} /></button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-900/50 uppercase text-xs text-slate-500 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Confidence</th>
              <th className="px-6 py-4">AI Source</th>
              <th className="px-6 py-4">Reasoning</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {mockSignals.map((signal) => (
              <tr key={signal.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4 text-slate-400 font-mono">
                  {new Date(signal.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 font-bold text-white">{signal.symbol}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    signal.type === Side.BUY ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {signal.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${signal.confidence}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-300">{signal.confidence}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    signal.source === 'Gemini' ? 'border-blue-500/30 text-blue-400' : 
                    signal.source === 'DeepSeek' ? 'border-purple-500/30 text-purple-400' : 'border-amber-500/30 text-amber-400'
                  }`}>{signal.source}</span>
                </td>
                <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={signal.reason}>
                  {signal.reason}
                </td>
                <td className="px-6 py-4">
                  <button className="text-xs bg-slate-800 hover:bg-primary hover:text-white transition-colors px-3 py-1.5 rounded border border-slate-700">
                    Execute
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SignalsPage;
