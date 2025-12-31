import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Edit, Save, Activity, AlertTriangle, PieChart as PieIcon, Calculator, ArrowRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'];

const RiskPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  // State for Allocation
  const [allocation, setAllocation] = useState([
    { name: 'BTC', value: 45 },
    { name: 'ETH', value: 30 },
    { name: 'USDT', value: 20 },
    { name: 'Alts', value: 5 },
  ]);

  // State for Metrics
  const [metrics, setMetrics] = useState({
    sharpe: '2.1',
    sortino: '2.8',
    drawdown: '-4.2',
    beta: '0.85'
  });

  // State for Risk Limits
  const [limits, setLimits] = useState({
    maxDailyLoss: 500,
    currentLoss: 124, // Preset value to demonstrate the bar
    riskBudget: 100 
  });

  // Derived Calculations
  const utilization = limits.maxDailyLoss > 0 ? (limits.currentLoss / limits.maxDailyLoss) * 100 : 0;
  const remainingBudget = Math.max(0, 100 - utilization).toFixed(1);
  const isCritical = Number(remainingBudget) < 20;

  const handleAllocationChange = (index: number, val: string) => {
    const newAlloc = [...allocation];
    newAlloc[index].value = Number(val);
    setAllocation(newAlloc);
  };

  const handleMetricChange = (key: keyof typeof metrics, val: string) => {
    setMetrics(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="text-amber-500" /> Risk & Performance
          </h2>
          <p className="text-slate-400">Monitor portfolio health and configure risk parameters.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
            isEditing 
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20' 
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {isEditing ? <Save size={18} /> : <Edit size={18} />}
          {isEditing ? 'Save Configuration' : 'Edit Configuration'}
        </button>
      </div>
      
      {isEditing && (
        <div className="bg-slate-900/50 border border-primary/30 p-4 rounded-xl mb-6 animate-in fade-in slide-in-from-top-2">
           <h3 className="text-primary font-bold mb-1 text-sm uppercase flex items-center gap-2">
             <Edit size={14}/> Manual Override Mode Active
           </h3>
           <p className="text-xs text-slate-400">Adjust the values below to simulate scenarios or correct data discrepancies. Charts will update instantly.</p>
        </div>
      )}

      {/* Risk Limits Control - Enhanced */}
      <div className={`border p-6 rounded-xl transition-all duration-300 ${
        isCritical ? 'bg-red-900/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-slate-900/30 border-slate-800'
      }`}>
        <div className="flex justify-between items-start mb-6">
           <h3 className={`font-bold flex items-center gap-2 text-lg ${isCritical ? 'text-red-400' : 'text-slate-200'}`}>
             <Calculator size={20} /> Daily Risk Budget Calculator
           </h3>
           <div className="flex items-center gap-2">
             {isEditing && <span className="text-[10px] uppercase bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-bold border border-blue-500/30">Interactive Mode</span>}
             <span className={`text-xs px-2 py-1 rounded font-bold border ${
               isCritical ? 'bg-red-500 text-white border-red-400' : 'bg-green-500/20 text-green-400 border-green-500/30'
             }`}>
               {isCritical ? 'CRITICAL LEVEL' : 'SAFE LEVEL'}
             </span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
           {/* Visual Connector for MD layout */}
           <div className="hidden md:block absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 text-slate-700"><ArrowRight /></div>
           <div className="hidden md:block absolute top-1/2 left-2/3 -translate-y-1/2 -translate-x-1/2 text-slate-700"><ArrowRight /></div>

           {/* Input 1: Max Loss */}
           <div className={`space-y-2 p-4 rounded-lg border transition-colors ${isEditing ? 'bg-slate-900 border-slate-600' : 'bg-transparent border-transparent'}`}>
             <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1">
                Max Daily Loss Limit ($)
             </label>
             {isEditing ? (
               <input 
                  type="number" 
                  min="1"
                  value={limits.maxDailyLoss}
                  onChange={(e) => setLimits({...limits, maxDailyLoss: Math.max(1, Number(e.target.value))})}
                  className="w-full bg-slate-950 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
               />
             ) : (
               <div className="text-2xl font-mono text-white tracking-tight">${limits.maxDailyLoss.toLocaleString()}</div>
             )}
             <p className="text-[10px] text-slate-500">Hard stop for all bot trading.</p>
           </div>

           {/* Input 2: Current Loss */}
           <div className={`space-y-2 p-4 rounded-lg border transition-colors ${isEditing ? 'bg-slate-900 border-slate-600' : 'bg-transparent border-transparent'}`}>
             <label className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1">
                Current Realized Loss ($)
             </label>
             {isEditing ? (
               <input 
                  type="number" 
                  value={limits.currentLoss}
                  onChange={(e) => setLimits({...limits, currentLoss: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
               />
             ) : (
               <div className="text-2xl font-mono text-red-400 tracking-tight">${limits.currentLoss.toLocaleString()}</div>
             )}
             <p className="text-[10px] text-slate-500">Updates via PnL stream.</p>
           </div>

           {/* Output: Remaining Budget */}
           <div className="space-y-2 p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
             <label className="text-xs text-slate-400 uppercase font-bold">Remaining Budget</label>
             <div className="flex items-end gap-2 mb-1">
                <span className={`text-3xl font-bold font-mono ${isCritical ? 'text-red-500' : 'text-green-500'}`}>
                    {remainingBudget}%
                </span>
                <span className="text-sm text-slate-500 mb-1.5">available</span>
             </div>
             
             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} 
                    style={{ width: `${Math.min(100, Number(remainingBudget))}%` }}
                ></div>
             </div>
           </div>
        </div>

        {isCritical && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 animate-pulse">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-xs text-red-300 font-bold">WARNING: Risk budget depleted. Trading engine will reject new open orders.</span>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation */}
        <div className="bg-surface rounded-xl border border-slate-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PieIcon size={18} className="text-purple-400"/> Portfolio Allocation
          </h3>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-[200px] w-[200px] shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} itemStyle={{color: '#fff'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-xs text-slate-500 font-bold">ASSETS</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-3">
              {allocation.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-sm text-slate-300 font-medium">{entry.name}</span>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        value={entry.value}
                        onChange={(e) => handleAllocationChange(index, e.target.value)}
                        className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right text-sm text-white outline-none focus:border-primary"
                      />
                      <span className="text-xs text-slate-500">%</span>
                    </div>
                  ) : (
                    <span className="text-sm font-mono text-white">{entry.value}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-2 gap-4">
           <MetricCard 
             title="Sharpe Ratio" 
             value={metrics.sharpe} 
             sub="Risk-adjusted return" 
             isEditing={isEditing} 
             onChange={(v) => handleMetricChange('sharpe', v)}
             color="text-white"
           />
           <MetricCard 
             title="Sortino Ratio" 
             value={metrics.sortino} 
             sub="Downside risk focus" 
             isEditing={isEditing} 
             onChange={(v) => handleMetricChange('sortino', v)}
             color="text-white"
           />
           <MetricCard 
             title="Max Drawdown" 
             value={metrics.drawdown} 
             sub="Limit: -10%" 
             isEditing={isEditing} 
             onChange={(v) => handleMetricChange('drawdown', v)}
             color="text-red-400"
             suffix="%"
           />
           <MetricCard 
             title="Beta" 
             value={metrics.beta} 
             sub="Correlation vs BTC" 
             isEditing={isEditing} 
             onChange={(v) => handleMetricChange('beta', v)}
             color="text-blue-400"
           />
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string, 
  value: string, 
  sub: string, 
  isEditing: boolean, 
  onChange: (val: string) => void,
  color: string,
  suffix?: string
}> = ({title, value, sub, isEditing, onChange, color, suffix}) => (
  <div className="bg-surface p-6 rounded-xl border border-slate-800 flex flex-col justify-center">
    <span className="text-slate-500 uppercase text-xs font-bold mb-2">{title}</span>
    {isEditing ? (
      <div className="flex items-center gap-1 mb-1">
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-lg font-bold text-white outline-none focus:border-primary"
        />
        {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
      </div>
    ) : (
      <span className={`text-3xl font-bold ${color}`}>{value}{suffix}</span>
    )}
    <span className="text-xs text-slate-500 mt-1">{sub}</span>
  </div>
);

export default RiskPage;
