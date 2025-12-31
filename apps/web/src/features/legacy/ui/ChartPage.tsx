import React, { useEffect, useRef } from 'react';

const ChartPage: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Avoid double injection in strict mode
    if (container.current && container.current.childElementCount === 0) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            "width": "100%",
            "height": "100%",
            "symbol": "BINANCE:BTCUSDT",
            "interval": "15",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "backgroundColor": "rgba(15, 23, 42, 1)",
            "gridColor": "rgba(30, 41, 59, 1)",
            "allow_symbol_change": true,
            "container_id": "tradingview_widget"
          });
        }
      };
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Live Market Chart</h2>
        <div className="text-sm text-slate-400">Data provided by TradingView</div>
      </div>
      <div className="flex-1 bg-surface rounded-xl border border-slate-800 overflow-hidden relative">
        <div id="tradingview_widget" ref={container} className="h-full w-full absolute inset-0" />
      </div>
    </div>
  );
};

// Add type definition for window.TradingView to avoid TS errors
declare global {
  interface Window {
    TradingView: any;
  }
}

export default ChartPage;
