import React, { useState } from 'react';
import { Save, Lock, Plus, Trash2, Eye, EyeOff, Server, ShieldAlert, Bell, Smartphone, Globe, CheckSquare, Mail, Volume2, MessageSquare } from 'lucide-react';

interface ExchangeConfig {
  id: string;
  name: string;
  apiKey: string;
  secret: string;
  isVisible: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'API' | 'NOTIFICATIONS' | 'GENERAL'>('API');

  // Dynamic State for API Keys
  const [exchanges, setExchanges] = useState<ExchangeConfig[]>([
    { id: '1', name: 'Binance Futures', apiKey: 'vmPU...92x', secret: 'h72...9s', isVisible: false },
    { id: '2', name: 'Hyperliquid', apiKey: '0x4...a9', secret: 'prv...k2', isVisible: false },
  ]);

  const addExchange = () => {
    const newExchange: ExchangeConfig = {
      id: Date.now().toString(),
      name: '',
      apiKey: '',
      secret: '',
      isVisible: false
    };
    setExchanges([...exchanges, newExchange]);
  };

  const removeExchange = (id: string) => {
    setExchanges(exchanges.filter(ex => ex.id !== id));
  };

  const updateExchange = (id: string, field: keyof ExchangeConfig, value: string | boolean) => {
    setExchanges(exchanges.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-white">System Configuration</h2>
        <p className="text-slate-400">Manage connections, alerts, and system behaviors.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-6">
        <TabButton active={activeTab === 'API'} onClick={() => setActiveTab('API')} icon={<Server size={16} />} label="Exchange API" />
        <TabButton active={activeTab === 'NOTIFICATIONS'} onClick={() => setActiveTab('NOTIFICATIONS')} icon={<Bell size={16} />} label="Notifications" />
        <TabButton active={activeTab === 'GENERAL'} onClick={() => setActiveTab('GENERAL')} icon={<ShieldAlert size={16} />} label="Risk & General" />
      </div>

      {/* Content based on Tab */}
      {activeTab === 'API' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
           {/* Dynamic API Keys Section */}
            <div className="bg-surface rounded-xl border border-slate-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Server size={18} className="text-primary" /> Exchange Connections
                </h3>
                <button 
                  onClick={addExchange}
                  className="text-xs bg-slate-900 hover:bg-primary hover:text-white border border-slate-700 text-slate-300 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Add Connection
                </button>
              </div>

              <div className="space-y-4">
                {exchanges.length === 0 && (
                  <div className="text-center p-8 border border-dashed border-slate-700 rounded-lg text-slate-500 text-sm">
                    No exchanges connected. Click "Add Connection" to start trading.
                  </div>
                )}

                {exchanges.map((ex) => (
                  <div key={ex.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 group hover:border-slate-600 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      {/* Exchange Name */}
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Platform Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Bybit"
                          value={ex.name}
                          onChange={(e) => updateExchange(ex.id, 'name', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:border-primary outline-none"
                        />
                      </div>
                      {/* API Key */}
                      <div className="md:col-span-4 space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase">API Key / Address</label>
                        <input 
                          type="text" 
                          placeholder="Public Key"
                          value={ex.apiKey}
                          onChange={(e) => updateExchange(ex.id, 'apiKey', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:border-primary outline-none font-mono"
                        />
                      </div>
                      {/* Secret Key */}
                      <div className="md:col-span-4 space-y-1.5 relative">
                        <label className="text-xs font-semibold text-slate-400 uppercase">Secret / Private Key</label>
                        <div className="relative">
                          <input 
                            type={ex.isVisible ? "text" : "password"} 
                            placeholder="Private Secret"
                            value={ex.secret}
                            onChange={(e) => updateExchange(ex.id, 'secret', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-md pl-3 pr-8 py-2 text-sm text-white focus:border-primary outline-none font-mono"
                          />
                          <button 
                            onClick={() => updateExchange(ex.id, 'isVisible', !ex.isVisible)}
                            className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                          >
                            {ex.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      {/* Delete Action */}
                      <div className="md:col-span-1 flex justify-center pb-2">
                        <button 
                          onClick={() => removeExchange(ex.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Remove Connection"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      )}

      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
           <div className="bg-surface rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Smartphone size={18} className="text-primary" /> Alert Configuration
              </h3>
              
              <div className="space-y-8">
                
                {/* 1. Instant Messaging */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Instant Messaging Apps</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2"><Globe size={14} className="text-blue-400"/> Telegram Bot Token</label>
                            <input type="password" placeholder="123456:ABC-DEF..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2"><Globe size={14} className="text-blue-400"/> Telegram Chat ID</label>
                            <input type="text" placeholder="-100123456789" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                             <label className="text-sm font-medium text-slate-300 flex items-center gap-2"><MessageSquare size={14} className="text-indigo-400"/> Discord Webhook</label>
                             <input type="text" placeholder="https://discord.com/api/webhooks/..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none" />
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm font-medium text-slate-300 flex items-center gap-2"><MessageSquare size={14} className="text-purple-400"/> Slack Webhook</label>
                             <input type="text" placeholder="https://hooks.slack.com/services/..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none" />
                         </div>
                    </div>
                </div>

                {/* 2. Direct & Critical Alerts */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Direct & Critical Alerts</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2"><Mail size={14} className="text-green-400"/> Email Address</label>
                            <input type="email" placeholder="alerts@yourdomain.com" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2"><Smartphone size={14} className="text-amber-400"/> SMS / Phone (Twilio)</label>
                            <input type="text" placeholder="+1 234 567 8900" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                    </div>
                </div>

                {/* 3. Browser & Sound */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">Local Environment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <Bell size={18} className="text-yellow-400" />
                                 <div>
                                     <div className="text-sm font-medium text-white">Browser Push Notifications</div>
                                     <div className="text-[10px] text-slate-500">Alerts even when tab is hidden</div>
                                 </div>
                             </div>
                             <input type="checkbox" className="h-5 w-5 rounded border-slate-600 bg-slate-950 text-primary focus:ring-primary cursor-pointer" />
                         </div>

                         <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <Volume2 size={18} className="text-red-400" />
                                 <div>
                                     <div className="text-sm font-medium text-white">Audible Sound Alarm</div>
                                     <div className="text-[10px] text-slate-500">Play siren on critical errors</div>
                                 </div>
                             </div>
                             <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-slate-600 bg-slate-950 text-primary focus:ring-primary cursor-pointer" />
                         </div>
                     </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Event Triggers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Checkbox label="Trade Executed (Buy/Sell)" defaultChecked />
                      <Checkbox label="Stop Loss / Take Profit Hit" defaultChecked />
                      <Checkbox label="Liquidation Risk (>80%)" defaultChecked />
                      <Checkbox label="Bot Error / Crash" defaultChecked />
                      <Checkbox label="Daily Profit Report" />
                      <Checkbox label="New AI Signal Detected" />
                      <Checkbox label="Whale Movement Detected" />
                      <Checkbox label="High API Latency Warning" />
                    </div>
                </div>

              </div>
           </div>
        </div>
      )}

      {activeTab === 'GENERAL' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
           {/* Risk Management Section */}
            <div className="bg-surface rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-500" /> Global Risk Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup label="Max Portfolio Risk %" type="number" value="2.0" suffix="%" />
                <InputGroup label="Max Daily Loss Limit" type="number" value="500" suffix="USD" />
                <InputGroup label="Max Leverage" type="number" value="20" suffix="x" />
              </div>
              <div className="mt-4 p-4 bg-amber-900/10 border border-amber-900/30 rounded text-amber-500 text-sm flex gap-3">
                <Lock size={16} className="shrink-0 mt-0.5" />
                <span>Warning: Changes to risk parameters are broadcasted to all active bots immediately via WebSocket. Ensure all open positions are monitored.</span>
              </div>
            </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
};

const TabButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
      active ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
    }`}
  >
    {icon} {label}
  </button>
);

const InputGroup: React.FC<{label: string, type: string, value: string, suffix?: string}> = ({label, type, value, suffix}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-300">{label}</label>
    <div className="relative">
      <input 
        type={type} 
        defaultValue={value} 
        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
      />
      {suffix && <span className="absolute right-3 top-2.5 text-slate-500 text-sm">{suffix}</span>}
    </div>
  </div>
);

const Checkbox: React.FC<{label: string, defaultChecked?: boolean}> = ({label, defaultChecked}) => (
  <label className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
    <div className="relative flex items-center">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-950 checked:bg-primary checked:border-primary transition-all" />
      <CheckSquare size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
    </div>
    <span className="text-sm text-slate-300">{label}</span>
  </label>
);

export default SettingsPage;
