import React from 'react';
import { Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between py-6 px-8 border-b border-slate-700/50">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Shield className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">ExpenseGuard AI</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30">
          AI-Powered
        </span>
        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
          Fraud Detection
        </span>
      </div>
    </header>
  );
}