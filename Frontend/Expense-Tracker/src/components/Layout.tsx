import { Outlet } from 'react-router-dom';
import { DollarSign, CreditCard, AlertTriangle, BarChart3, RefreshCw } from 'lucide-react';
import { Header } from './Header';
import { StatCard } from './StatCard';
import { Navigation } from './Navigation';
import { useExpenses } from '../hooks/useExpenses';

export function Layout() {
  const { totalSpent, expenses, flaggedTransactions, avgTransaction, isLoading, refreshExpenses } = useExpenses();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading your expenses...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <button
            onClick={refreshExpenses}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Refresh</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Spent"
            value={`$${totalSpent.toFixed(2)}`}
            icon={DollarSign}
            iconColor="bg-emerald-500/20 text-emerald-400"
          />
          <StatCard
            title="Transactions"
            value={expenses.length.toString()}
            icon={CreditCard}
            iconColor="bg-blue-500/20 text-blue-400"
          />
          <StatCard
            title="Flagged"
            value={flaggedTransactions.toString()}
            icon={AlertTriangle}
            iconColor="bg-red-500/20 text-red-400"
          />
          <StatCard
            title="Avg Transaction"
            value={`$${avgTransaction.toFixed(2)}`}
            icon={BarChart3}
            iconColor="bg-purple-500/20 text-purple-400"
          />
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Page Content */}
        <Outlet />
      </main>
    </div>
  );
}