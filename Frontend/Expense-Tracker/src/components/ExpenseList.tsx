import React from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';

interface ExpensesListProps {
  expenses: any[];
  isLoading?: boolean;
}

export function ExpensesList({ expenses, isLoading = false }: ExpensesListProps) {
  const { refreshExpenses, error } = useExpenses();

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-3"></div>
            <p className="text-slate-400 text-sm">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        </div>
        <button
          onClick={refreshExpenses}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-slate-300">Refresh</span>
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <p className="text-slate-400 text-sm mb-6">Your latest expenses with fraud detection analysis</p>
      
      {expenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No transactions yet</p>
          <p className="text-slate-600 text-sm mt-1">Add your first expense to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-white">{expense.merchant}</h4>
                  {expense.isFraud && (
                    <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                      Flagged
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">{expense.category} • {expense.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">${expense.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}