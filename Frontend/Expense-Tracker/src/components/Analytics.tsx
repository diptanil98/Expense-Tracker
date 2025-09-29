import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

interface AnalyticsProps {
  expenses: any[];
  isLoading?: boolean;
}

export function Analytics({ expenses, isLoading = false }: AnalyticsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-3"></div>
              <p className="text-slate-400 text-sm">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avgTransaction = expenses.length > 0 ? totalSpent / expenses.length : 0;

  const categorySpending = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Spending Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">${totalSpent.toFixed(2)}</div>
            <div className="text-slate-400 text-sm mt-1">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{expenses.length}</div>
            <div className="text-slate-400 text-sm mt-1">Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">${avgTransaction.toFixed(2)}</div>
            <div className="text-slate-400 text-sm mt-1">Avg per Transaction</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <PieChart className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Top Categories</h3>
        </div>
        
        {topCategories.length > 0 ? (
          <div className="space-y-4">
            {topCategories.map(([category, amount], index) => {
              const amountNum = amount as number;
              const percentage = ((amountNum / totalSpent) * 100).toFixed(1);
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-emerald-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-white font-medium">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">${amountNum.toFixed(2)}</div>
                    <div className="text-slate-400 text-sm">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">No spending data available</p>
            <p className="text-slate-600 text-sm mt-1">Add some expenses to see analytics</p>
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Insights & Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <p className="text-slate-400">Start tracking expenses to get personalized insights</p>
          ) : (
            <>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-300 font-medium">Spending Pattern</p>
                <p className="text-slate-300 mt-1">
                  You've made {expenses.length} transaction{expenses.length !== 1 ? 's' : ''} with an average of ${avgTransaction.toFixed(2)} per transaction.
                </p>
              </div>
              
              {topCategories.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <p className="text-emerald-300 font-medium">Top Spending Category</p>
                  <p className="text-slate-300 mt-1">
                    Your highest spending is in {topCategories[0][0]} with ${((topCategories[0][1] as number).toFixed(2))} spent.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}