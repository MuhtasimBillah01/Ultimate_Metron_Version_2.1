import React from 'react';
import { Position, Side } from '@/shared/kernel/types';
import { XCircle, Edit2 } from 'lucide-react';

const positions: Position[] = [
  { id: '1', symbol: 'BTCUSDT', size: 0.5, entryPrice: 64200, currentPrice: 64500, leverage: 10, unrealizedPnL: 150, liquidationPrice: 58000, side: Side.BUY },
  { id: '2', symbol: 'ETHUSDT', size: 4.0, entryPrice: 3400, currentPrice: 3380, leverage: 5, unrealizedPnL: -80, liquidationPrice: 2800, side: Side.BUY },
  { id: '3', symbol: 'SOLUSDT', size: 100, entryPrice: 145, currentPrice: 142, leverage: 2, unrealizedPnL: -300, liquidationPrice: 180, side: Side.SELL },
];

const PositionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Open Positions</h2>
      
      <div className="bg-surface rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-900/50 uppercase text-xs text-slate-500 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Side/Lev</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Entry Price</th>
              <th className="px-6 py-4">Mark Price</th>
              <th className="px-6 py-4">Liq. Price</th>
              <th className="px-6 py-4">Margin</th>
              <th className="px-6 py-4">PnL (ROE%)</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {positions.map((pos) => {
              const roe = ((pos.unrealizedPnL / (pos.entryPrice * pos.size / pos.leverage)) * 100).toFixed(2);
              const margin = (pos.entryPrice * pos.size / pos.leverage).toFixed(2);
              
              return (
                <tr key={pos.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{pos.symbol}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${pos.side === Side.BUY ? 'text-green-400' : 'text-red-400'}`}>{pos.side}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-1 rounded">{pos.leverage}x</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{pos.size}</td>
                  <td className="px-6 py-4 text-slate-300">{pos.entryPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-300">{pos.currentPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-orange-400">{pos.liquidationPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-400">${margin}</td>
                  <td className="px-6 py-4">
                    <div className={pos.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                      <div className="font-bold">{pos.unrealizedPnL >= 0 ? '+' : ''}{pos.unrealizedPnL.toFixed(2)}</div>
                      <div className="text-xs opacity-75">({roe}%)</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded hover:bg-slate-700" title="Edit TP/SL">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-red-400 hover:text-white bg-red-500/10 rounded hover:bg-red-600" title="Close Position">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-bold text-white mb-4">Order History</h3>
        <div className="bg-surface rounded-xl border border-slate-800 p-8 text-center text-slate-500">
          No recent orders in this session.
        </div>
      </div>
    </div>
  );
};

export default PositionsPage;
