import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Activity, DollarSign, AlertTriangle, Zap, BarChart2, Layers } from 'lucide-react';
import { Position, Side } from '@/shared/kernel/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

// Mock Data for Strategy Performance
const strategyData = [
  { name: 'Alpha-Flow', pnl: 450, trades: 12, color: '#3b82f6' }, // Blue
  { name: 'Grid-Master', pnl: 120, trades: 45, color: '#22c55e' }, // Green
  { name: 'Sniper-AI', pnl: -80, trades: 5, color: '#ef4444' },   // Red
  { name: 'HFT-Arb', pnl: 890, trades: 128, color: '#f59e0b' },   // Amber
];

const activePositions: Position[] = [
  { id: '1', symbol: 'BTCUSDT', size: 0.5, entryPrice: 64200, currentPrice: 64500, leverage: 10, unrealizedPnL: 150, liquidationPrice: 58000, side: Side.BUY },
  { id: '2', symbol: 'ETHUSDT', size: 4.0, entryPrice: 3400, currentPrice: 3380, leverage: 5, unrealizedPnL: -80, liquidationPrice: 2800, side: Side.BUY },
  { id: '3', symbol: 'SOLUSDT', size: 100, entryPrice: 145, currentPrice: 142, leverage: 2, unrealizedPnL: -300, liquidationPrice: 180, side: Side.SELL },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Equity" value="$12,450.00" subValue="+2.4% today" icon={<DollarSign className="text-green-400" />} />
        <SummaryCard title="Win Rate (24h)" value="68%" subValue="34 trades" icon={<TrendingUp className="text-primary" />} />
        <SummaryCard title="Active Drawdown" value="-1.2%" subValue="Max -3.5%" icon={<AlertTriangle className="text-amber-400" />} />
        <SummaryCard title="API Latency" value="45ms" subValue="Stable" icon={<Activity className="text-purple-400" />} />
      </div>

      {/* Main Analytics Section: Strategy Perf & Market Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Strategy Performance Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Strategy Performance (Today)</CardTitle>
              <p className="text-xs text-slate-400 mt-1">PnL distribution by active bot engines</p>
            </div>
            <Badge variant="success" className="bg-slate-900 border-slate-800">
              Net PnL: +$1,380
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strategyData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#e2e8f0" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip
                    cursor={{ fill: '#334155', opacity: 0.2 }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="pnl" radius={[0, 4, 4, 0]} barSize={30}>
                    {strategyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Live Market Vitals */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" /> Market Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400 uppercase font-bold">BTC Funding Rate</span>
                <span className="text-green-400 text-sm font-mono">+0.0100%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[60%]"></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Long bias detected. Smart money is buying.</p>
            </div>

            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-400 uppercase font-bold">24h Volatility</span>
                <span className="text-amber-400 text-sm font-mono">High (4.2%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[85%]"></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Ideal for Grid & Reversion bots.</p>
            </div>

            {/* Example Button Usage */}
            <Button variant="outline" size="sm" className="w-full mt-2">
              View Detailed Analysis
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Positions Table */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="border-b border-slate-800 py-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Layers size={18} className="text-blue-400" /> Active Positions
            </h3>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-400">
              <thead className="bg-slate-900/50 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Side</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Entry</th>
                  <th className="px-4 py-3">Mark</th>
                  <th className="px-4 py-3">PnL</th>
                </tr>
              </thead>
              <tbody>
                {activePositions.map((pos) => (
                  <tr key={pos.id} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{pos.symbol} <span className="text-xs text-slate-500 bg-slate-800 px-1 rounded">{pos.leverage}x</span></td>
                    <td className="px-4 py-3">
                      <Badge variant={pos.side === Side.BUY ? 'success' : 'danger'}>{pos.side}</Badge>
                    </td>
                    <td className="px-4 py-3">{pos.size}</td>
                    <td className="px-4 py-3">{pos.entryPrice}</td>
                    <td className="px-4 py-3">{pos.currentPrice}</td>
                    <td className={`px-4 py-3 font-bold ${pos.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pos.unrealizedPnL >= 0 ? '+' : ''}{pos.unrealizedPnL}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Signals (Mini) */}
        <Card className="p-0">
          <CardHeader className="py-4 border-b border-slate-800">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <BarChart2 size={18} className="text-purple-400" /> Recent Signals
            </h3>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">BTC/USDT</span>
                    <Badge variant="success" className="text-[10px] px-1.5 py-0 h-5">BUY</Badge>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">94% Confidence • Gemini</div>
                </div>
                <div className="text-xs text-slate-400 text-right">
                  2m ago
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-2 text-slate-400">View All Signals</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ title: string, value: string, subValue: string, icon: React.ReactNode }> = ({ title, value, subValue, icon }) => (
  <Card className="p-5 flex items-start justify-between">
    <div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
      <p className="text-xs text-slate-500">{subValue}</p>
    </div>
    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
      {icon}
    </div>
  </Card>
);

export default DashboardPage;
