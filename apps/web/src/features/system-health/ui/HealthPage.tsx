import React from 'react';
import { SystemStatus } from '@/shared/kernel/types';
import { Cpu, Server, Wifi, HardDrive, Globe, Activity } from 'lucide-react';

const HealthPage: React.FC<{status: SystemStatus}> = ({status}) => {
  
  // Mock Data for API Endpoints
  const apiEndpoints = [
    { name: 'Binance Spot', latency: status.apiLatency, status: 'Operational', rpm: 450 },
    { name: 'Binance Futures', latency: status.apiLatency + 12, status: 'Operational', rpm: 820 },
    { name: 'Gemini Pro AI', latency: 210, status: 'Operational', rpm: 15 },
    { name: 'DeepSeek LLM', latency: 890, status: 'Degraded', rpm: 5 },
    { name: 'Hyperliquid RPC', latency: 120, status: 'Operational', rpm: 180 },
    { name: 'Telegram Bot', latency: 300, status: 'Operational', rpm: 2 },
    { name: 'Coinglass Data', latency: 450, status: 'Maintenance', rpm: 0 },
  ];

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'Operational': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
      case 'Degraded': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      default: return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Diagnostics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Infrastructure Stats */}
        <div className="bg-surface rounded-xl border border-slate-800 p-6 space-y-6">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Server size={18} className="text-primary" /> Infrastructure
          </h3>
          
          <div className="space-y-4">
            <MetricBar label="CPU Usage" value={status.cpuUsage} icon={<Cpu size={16} />} color="bg-blue-500" />
            <MetricBar label="RAM Usage" value={status.ramUsage} icon={<HardDrive size={16} />} color="bg-purple-500" />
            
            <div className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-800/50">
              <span className="text-slate-400 text-sm">VM Instance (Azure)</span>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${status.vmStatus === 'Running' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                 <span className={`text-xs font-bold ${status.vmStatus === 'Running' ? 'text-green-400' : 'text-red-400'}`}>
                   {status.vmStatus}
                 </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs text-slate-500 mb-2 flex justify-between">
                <span>Database Storage</span>
                <span>45GB / 100GB</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full w-[45%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Network & API Gateway - Updated Grid Layout */}
        <div className="bg-surface rounded-xl border border-slate-800 p-6 flex flex-col h-full max-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Wifi size={18} className="text-primary" /> API Gateway Status
            </h3>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              {apiEndpoints.length} Connected
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
             <div className="grid grid-cols-2 gap-3">
               {apiEndpoints.map((api, idx) => (
                 <div key={idx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate pr-2 group-hover:text-slate-200 transition-colors">
                          {api.name}
                        </span>
                        <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(api.status)}`}></div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-lg font-mono font-bold leading-none ${
                            api.latency > 500 ? 'text-amber-400' : api.latency > 1000 ? 'text-red-400' : 'text-white'
                          }`}>
                            {api.latency}
                          </span>
                          <span className="text-[10px] text-slate-600">ms</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{api.rpm} RPM</span>
                    </div>
                 </div>
               ))}
               
               {/* Add New Placeholder */}
               <button className="border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-600 hover:text-slate-400 hover:border-slate-600 hover:bg-slate-900/50 transition-all min-h-[70px]">
                  <Globe size={16} className="mb-1" />
                  <span className="text-[10px] font-bold uppercase">Add API</span>
               </button>
             </div>
          </div>
          
          <div className="pt-4 mt-2 border-t border-slate-800">
            <div className="flex justify-between items-center mb-1">
               <span className="text-xs text-slate-400 flex items-center gap-1">
                 <Activity size={12} /> Global Error Rate (1h)
               </span>
               <span className="text-xs text-green-400 font-mono">0.02%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
               <div className="bg-green-500 h-full w-[0.2%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-surface rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-900/50 uppercase text-xs text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Internal Service</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Uptime</th>
              <th className="px-6 py-4">Last Health Check</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr>
              <td className="px-6 py-4 font-medium text-white">Order Execution Engine</td>
              <td className="px-6 py-4 text-green-400">Operational</td>
              <td className="px-6 py-4 text-slate-400">14d 2h</td>
              <td className="px-6 py-4 text-slate-400">Just now</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-white">Market Data Stream</td>
              <td className="px-6 py-4 text-green-400">Operational</td>
              <td className="px-6 py-4 text-slate-400">14d 2h</td>
              <td className="px-6 py-4 text-slate-400">200ms ago</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-white">Risk Controller</td>
              <td className="px-6 py-4 text-green-400">Operational</td>
              <td className="px-6 py-4 text-slate-400">14d 2h</td>
              <td className="px-6 py-4 text-slate-400">1s ago</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MetricBar: React.FC<{label: string, value: number, icon: React.ReactNode, color: string}> = ({label, value, icon, color}) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-slate-300 flex items-center gap-2">{icon} {label}</span>
      <span className="text-sm font-bold text-white">{value.toFixed(1)}%</span>
    </div>
    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default HealthPage;
