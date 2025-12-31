import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, TrendingUp, TrendingDown, MessageSquare, Twitter, Radio, ExternalLink, Hash, Database, Zap, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface NewsItem {
  id: string;
  source: string;
  sourceType: 'TWITTER' | 'NEWS' | 'REDDIT';
  title: string;
  summary: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number; // 0 to 100
  timestamp: number;
  tags: string[];
}

const mockNews: NewsItem[] = [
  { 
    id: '1', 
    source: 'CoinDesk', 
    sourceType: 'NEWS',
    title: 'SEC approves new Bitcoin Spot ETF application from BlackRock', 
    summary: 'The Securities and Exchange Commission has given the green light...',
    sentiment: 'BULLISH', 
    score: 95, 
    timestamp: Date.now() - 1000 * 60 * 5, 
    tags: ['BTC', 'Regulation', 'ETF'] 
  },
  { 
    id: '2', 
    source: '@WhaleAlert', 
    sourceType: 'TWITTER',
    title: '🚨 5,000 BTC transferred from unknown wallet to Binance', 
    summary: 'Large movement detected on-chain. Potential sell pressure incoming.',
    sentiment: 'BEARISH', 
    score: 78, 
    timestamp: Date.now() - 1000 * 60 * 15, 
    tags: ['Whale', 'OnChain', 'Binance'] 
  },
  { 
    id: '3', 
    source: 'Bloomberg Crypto', 
    sourceType: 'NEWS',
    title: 'Ethereum developers confirm Dencun upgrade date', 
    summary: 'Core devs have finalized the slot for the mainnet launch...',
    sentiment: 'BULLISH', 
    score: 82, 
    timestamp: Date.now() - 1000 * 60 * 45, 
    tags: ['ETH', 'Upgrade', 'Tech'] 
  },
  { 
    id: '4', 
    source: 'r/CryptoCurrency', 
    sourceType: 'REDDIT',
    title: 'Solana network congestion reaching critical levels again', 
    summary: 'Users are reporting failed transactions due to high compute unit usage.',
    sentiment: 'BEARISH', 
    score: 65, 
    timestamp: Date.now() - 1000 * 60 * 120, 
    tags: ['SOL', 'FUD', 'Network'] 
  },
];

const sentimentHistory = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  score: 50 + Math.sin(i / 3) * 30 + (Math.random() * 10 - 5)
}));

const MarketPage: React.FC = () => {
  const [activeScrapers, setActiveScrapers] = useState({
    twitter: true,
    news: true,
    onchain: true,
    reddit: false
  });

  const [globalSentiment, setGlobalSentiment] = useState(72); // 0-100

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalSentiment(prev => Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="text-primary" /> Market Intelligence
          </h2>
          <p className="text-slate-400">Real-time news scraper & AI sentiment analysis engine.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                SCRAPER: ONLINE
            </button>
            <button className="bg-primary hover:bg-blue-600 text-white p-2 rounded-lg transition-colors">
                <RefreshCw size={18} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: News Feed */}
        <div className="lg:col-span-2 space-y-6">
            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <FilterButton label="All Sources" active />
                <FilterButton label="Major News" />
                <FilterButton label="Twitter/X" />
                <FilterButton label="On-Chain" />
                <FilterButton label="Reddit" />
            </div>

            {/* News List */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                {mockNews.map((news) => (
                    <div key={news.id} className="p-5 border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                {news.sourceType === 'TWITTER' ? <Twitter size={14} className="text-blue-400"/> : 
                                 news.sourceType === 'REDDIT' ? <MessageSquare size={14} className="text-orange-400"/> : 
                                 <Radio size={14} className="text-green-400"/>}
                                <span className="font-bold text-slate-300">{news.source}</span>
                                <span>•</span>
                                <span>{Math.floor((Date.now() - news.timestamp) / 60000)}m ago</span>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                news.sentiment === 'BULLISH' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                news.sentiment === 'BEARISH' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                'bg-slate-700 text-slate-400 border-slate-600'
                            }`}>
                                {news.sentiment} ({news.score}%)
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                            {news.title}
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                            {news.summary}
                        </p>
                        
                        <div className="flex gap-2">
                            {news.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Hash size={10} /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Column: Analytics & Control */}
        <div className="space-y-6">
            
            {/* Global Sentiment Gauge */}
            <div className="bg-surface rounded-xl border border-slate-800 p-6 text-center">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">AI Market Sentiment</h3>
                
                <div className="relative h-40 flex items-end justify-center mb-2 overflow-hidden">
                     {/* CSS Gauge Simulation */}
                     <div className="absolute bottom-0 w-64 h-32 bg-slate-800 rounded-t-full overflow-hidden">
                         <div 
                            className="absolute bottom-0 left-0 w-full h-full origin-bottom transition-all duration-1000"
                            style={{ 
                                background: `conic-gradient(from 180deg at 50% 100%, #ef4444 0deg, #f59e0b 60deg, #22c55e 120deg, #22c55e 180deg)`,
                                clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)'
                            }}
                         ></div>
                         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-surface rounded-t-full flex items-end justify-center pb-2">
                            <div className="text-center">
                                <div className={`text-4xl font-bold ${globalSentiment > 60 ? 'text-green-400' : globalSentiment < 40 ? 'text-red-400' : 'text-amber-400'}`}>
                                    {globalSentiment.toFixed(0)}
                                </div>
                                <div className="text-xs text-slate-500 font-bold uppercase">
                                    {globalSentiment > 60 ? 'Greed' : globalSentiment < 40 ? 'Fear' : 'Neutral'}
                                </div>
                            </div>
                         </div>
                     </div>
                     {/* Needle */}
                     <div 
                        className="absolute bottom-0 left-1/2 w-1 h-36 bg-white origin-bottom rounded-full z-10 transition-all duration-700"
                        style={{ transform: `translateX(-50%) rotate(${(globalSentiment / 100) * 180 - 90}deg)` }}
                     ></div>
                </div>
                <p className="text-xs text-slate-500">Based on 14,203 data points processed in last 24h.</p>
            </div>

            {/* Sentiment History Chart */}
            <div className="bg-surface rounded-xl border border-slate-800 p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-blue-400" /> Sentiment Trend (24h)
                </h3>
                <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sentimentHistory}>
                            <defs>
                                <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="url(#sentimentGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Data Pipeline Status (Scraper Control) */}
            <div className="bg-surface rounded-xl border border-slate-800 p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Database size={16} className="text-purple-400" /> Data Pipelines
                </h3>
                <div className="space-y-3">
                    <ScraperToggle 
                        label="Twitter / X Firehose" 
                        isActive={activeScrapers.twitter} 
                        onClick={() => setActiveScrapers(p => ({...p, twitter: !p.twitter}))} 
                    />
                    <ScraperToggle 
                        label="Crypto News Aggregator" 
                        isActive={activeScrapers.news} 
                        onClick={() => setActiveScrapers(p => ({...p, news: !p.news}))} 
                    />
                    <ScraperToggle 
                        label="On-Chain Whale Watch" 
                        isActive={activeScrapers.onchain} 
                        onClick={() => setActiveScrapers(p => ({...p, onchain: !p.onchain}))} 
                    />
                    <ScraperToggle 
                        label="Reddit Sentiment" 
                        isActive={activeScrapers.reddit} 
                        onClick={() => setActiveScrapers(p => ({...p, reddit: !p.reddit}))} 
                    />
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>API Usage</span>
                    <span>45,201 / 100,000 calls</span>
                </div>
            </div>

            {/* Trending Keywords */}
            <div className="bg-surface rounded-xl border border-slate-800 p-6">
                 <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" /> Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                    {['#BitcoinETF', '$SOL', 'Binance', 'Regulation', 'Powell', 'Inflation', 'Airdrop'].map((tag, i) => (
                        <span key={i} className={`text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 ${i === 0 ? 'text-green-400 border-green-900' : ''}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

const FilterButton: React.FC<{label: string, active?: boolean}> = ({label, active}) => (
    <button className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
        active ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
    }`}>
        {label}
    </button>
);

const ScraperToggle: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({label, isActive, onClick}) => (
    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50 border border-slate-800">
        <span className="text-sm text-slate-300">{label}</span>
        <button 
            onClick={onClick}
            className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? 'bg-primary' : 'bg-slate-700'}`}
        >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isActive ? 'left-6' : 'left-1'}`}></div>
        </button>
    </div>
);

export default MarketPage;
