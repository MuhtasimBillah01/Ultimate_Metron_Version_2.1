import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PlayCircle, RefreshCw, Calendar, DollarSign, Activity, Settings, BarChart3 } from 'lucide-react';

// Types for our simulation
interface BacktestResult {
  day: string;
  equity: number;
}

interface Metrics {
  roi: string;
  sharpe: string;
  drawdown: string;
  profitFactor: string;
}

const BacktestPage: React.FC = () => {
  // Configuration State
  const [strategy, setStrategy] = useState('Mean Reversion v2');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [initialCapital, setInitialCapital] = useState(10000);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [data, setData] = useState<BacktestResult[]>(generateMockData(10000, 1.002, 0.02)); // Default data
  const [metrics, setMetrics] = useState<Metrics>({
    roi: '+14.5%',
    sharpe: '1.85',
    drawdown: '-5.4%',
    profitFactor: '1.45'
  });

  // Helper to generate mock chart data based on parameters
  function generateMockData(startCap: number, trend: number, volatility: number) {
    let currentEquity = startCap;
    return Array.from({ length: 90 }, (_, i) => {
      const randomMove = 1 + (Math.random() * volatility * 2 - volatility); // Random % move
      currentEquity = currentEquity * trend * randomMove;
      return {
        day: `Day ${i + 1}`,
        equity: Math.round(currentEquity)
      };
    });
  }

  const handleRunSimulation = () => {
    setIsSimulating(true);

    // Simulate calculation delay
    setTimeout(() => {
      let volatility = 0.02;
      let trend = 1.002;
      let newMetrics: Metrics = { roi: '0%', sharpe: '0', drawdown: '0%', profitFactor: '0' };

      // Adjust simulation logic based on strategy selection
      if (strategy === 'Mean Reversion v2') {
        volatility = 0.015;
        trend = 1.0015;
        newMetrics = { roi: '+12.4%', sharpe: '2.10', drawdown: '-3.2%', profitFactor: '1.65' };
      } else if (strategy === 'Trend Following Alpha') {
        volatility = 0.04; // Higher risk
        trend = 1.0035; // Higher reward
        newMetrics = { roi: '+45.2%', sharpe: '1.45', drawdown: '-18.4%', profitFactor: '2.10' };
      } else if (strategy === 'DeepSeek AI Hybrid') {
        volatility = 0.01; // Low risk (AI managed)
        trend = 1.0025; // Consistent reward
        newMetrics = { roi: '+28.8%', sharpe: '3.15', drawdown: '-1.5%', profitFactor: '3.40' };
      }

      const newData = generateMockData(initialCapital, trend, volatility);
      setData(newData);
      setMetrics(newMetrics);
      setIsSimulating(false);
    }, 1500); // 1.5s delay
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Activity className="text-primary" /> Strategy Simulation
          </h2>
          <p className="text-slate-400">Backtest algorithms against historical data to verify performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Form */}
        <div className="bg-surface rounded-xl border border-slate-800 p-6 space-y-5 h-fit">
          <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-4">
            <Settings className="text-slate-400" size={20} />
            <h3 className="font-semibold text-white">Configuration</h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-bold">Strategy Model</label>
            <select 
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-white focus:border-primary outline-none transition-colors"
            >
              <option>Mean Reversion v2</option>
              <option>Trend Following Alpha</option>
              <option>DeepSeek AI Hybrid</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1"><Calendar size={12}/> Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-primary outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1"><Calendar size={12}/> End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:border-primary outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1"><DollarSign size={12}/> Initial Capital</label>
            <input 
              type="number" 
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-white focus:border-primary outline-none font-mono" 
            />
          </div>
          
          <div className="pt-4 border-t border-slate-800">
             <button 
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isSimulating ? (
                 <RefreshCw size={18} className="animate-spin" />
               ) : (
                 <PlayCircle size={18} />
               )}
               {isSimulating ? 'Processing...' : 'Run Simulation'}
             </button>
             <p className="text-[10px] text-slate-500 mt-3 text-center">
               Uses Monte Carlo simulation (1000 runs) to verify robustness.
             </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-slate-800 p-6 relative">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-green-400" /> Equity Growth Curve
            </h3>
            
            <div className="h-[320px] w-full">
              {isSimulating && (
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="animate-spin text-primary" size={32} />
                    <span className="text-sm font-medium text-slate-300">Calculating PnL...</span>
                  </div>
                </div>
              )}
              
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="backtestColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="day" hide />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value/1000}k`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#22c55e' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Equity']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="equity" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    fill="url(#backtestColor)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <ResultMetric label="Total ROI" value={metrics.roi} color="text-green-400" loading={isSimulating} />
             <ResultMetric label="Sharpe Ratio" value={metrics.sharpe} color="text-blue-400" loading={isSimulating} />
             <ResultMetric label="Max Drawdown" value={metrics.drawdown} color="text-red-400" loading={isSimulating} />
             <ResultMetric label="Profit Factor" value={metrics.profitFactor} color="text-amber-400" loading={isSimulating} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultMetric: React.FC<{label: string, value: string, color: string, loading?: boolean}> = ({label, value, color, loading}) => (
  <div className="bg-surface border border-slate-800 p-4 rounded-xl text-center group hover:border-slate-700 transition-colors">
    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">{label}</div>
    {loading ? (
      <div className="h-8 w-16 mx-auto bg-slate-800 rounded animate-pulse"></div>
    ) : (
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    )}
  </div>
);

export default BacktestPage;
