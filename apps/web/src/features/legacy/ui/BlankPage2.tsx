import React from 'react';
import { CircleDashed, LayoutTemplate } from 'lucide-react';

const BlankPage2: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-slate-500 space-y-6">
      <div className="p-8 bg-slate-900/50 rounded-full border border-slate-800 shadow-2xl">
        <LayoutTemplate size={64} className="text-slate-600" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-300">Reserved Module 2</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          This is a placeholder for your next big idea. 
          Ready for integration with the trading engine or external APIs.
        </p>
      </div>
      <button className="px-6 py-2 border border-slate-700 rounded-lg text-sm hover:bg-slate-800 transition-colors">
        Initialize Module
      </button>
    </div>
  );
};

export default BlankPage2;
