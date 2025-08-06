import React from 'react';
import { Outlet } from 'react-router-dom';
import { DollarSign, CreditCard, AlertTriangle, BarChart3 } from 'lucide-react';
import { Header } from './Header';
import { StatCard } from './StatCard';
import { Navigation } from './Navigation';
import { useExpenses } from '../hooks/useExpenses';

export function Layout() {
  const { totalSpent, expenses, flaggedTransactions, avgTransaction } = useExpenses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
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