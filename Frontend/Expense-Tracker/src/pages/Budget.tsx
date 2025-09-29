import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../hooks/useExpenses';
import axios from 'axios';
import { ArrowLeft, Plus, AlertTriangle, Target, Shield, X } from 'lucide-react';

interface Budget {
  _id?: string;
  category: string;
  spent: number;
  limit: number;
  percentage: number;
  status: 'good' | 'warning' | 'over';
  period: string;
}

interface NewBudget {
  category: string;
  amount: string;
  period: string;
}

const Budgets = () => {
  const navigate = useNavigate();
  const { expenses } = useExpenses();
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [newBudget, setNewBudget] = useState<NewBudget>({
    category: '',
    amount: '',
    period: 'monthly'
  });

  const API_URL = "http://localhost:8765"; 

  const categories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Health & Fitness',
    'Bills & Utilities',
    'Travel',
    'Education',
    'Other',
  ];

  
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const savedUser = localStorage.getItem('expenseGuardUser');
        if (!savedUser) {
          console.error('User not authenticated');
          return;
        }
        const user = JSON.parse(savedUser);
        const res = await axios.get(`${API_URL}/budget/Budgets`);
        const userBudgets = res.data.filter((b: any) => b.user === user.id);
        setBudgets(userBudgets.map((b: any) => ({
          ...b,
          spent: 0,
          percentage: 0,
          status: 'good',
          period: 'Monthly budget'
        })));
      } catch (err) {
        console.error('Error fetching budgets:', err);
      }
    };
    fetchBudgets();
  }, []);

  const calculateSpentForCategory = (category: string) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const updatedBudgets = useMemo(() => {
    return budgets.map(budget => {
      const spent = calculateSpentForCategory(budget.category);
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

      let status: 'good' | 'warning' | 'over' = 'good';
      if (percentage > 100) status = 'over';
      else if (percentage > 80) status = 'warning';

      return {
        ...budget,
        spent,
        percentage,
        status
      };
    });
  }, [budgets, expenses]);

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(newBudget.amount);

    try {
  const savedUser = localStorage.getItem('expenseGuardUser');
  if (!savedUser) {
    console.error('User not authenticated');
    return;
  }
  const user = JSON.parse(savedUser);
  const userId = user.id;
  console.log("User ID:", userId);
  console.log("Budget data:", {
    user: userId,
    category: newBudget.category,
    limit: limit
  });

  const res = await axios.post(`${API_URL}/budget/Budget`, {
    user: userId, 
    category: newBudget.category,
    limit: limit
  });

      const savedBudget = res.data;

      setBudgets((prev) => [...prev, {
        ...savedBudget,
        spent: 0,
        percentage: 0,
        status: 'good',
        period: 'Monthly budget'
      }]);

      setNewBudget({ category: '', amount: '', period: 'monthly' });
      setShowAddBudget(false);
    } catch (err: any) {
      console.error('Error creating budget:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      }
    }
  };

  
  const handleRemoveBudget = async (budgetId?: string) => {
    if (!budgetId) return;
    try {
      await axios.delete(`${API_URL}/budget/${budgetId}`);
      setBudgets(budgets.filter(budget => budget._id !== budgetId));
    } catch (err) {
      console.error('Error deleting budget:', err);
    }
  };

  const getStatusColor = (status: 'good' | 'warning' | 'over') => {
    switch (status) {
      case 'over': return 'border-red-500/30 bg-red-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'good': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-slate-600/50 bg-slate-800/50';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage > 100) return 'bg-red-500';
    if (percentage > 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-slate-400" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">ExpenseGuard AI</h1>
          </div>
        </div>
        <div className="flex space-x-3">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full border border-green-500/30">
            AI-Powered
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full border border-blue-500/30">
            Fraud Detection
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Budget Management</h2>
            <p className="text-slate-400 mt-1">Set and track your spending limits</p>
          </div>
          <button
            onClick={() => setShowAddBudget(true)}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Budget</span>
          </button>
        </div>

        {/* Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updatedBudgets.map((budget) => (
            <div
              key={budget._id}
              className={`rounded-xl border p-6 transition-all duration-200 ${getStatusColor(budget.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-white text-lg">{budget.category}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-slate-400" />
                  <button
                    onClick={() => handleRemoveBudget(budget._id)}
                    className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors duration-200"
                    title="Remove budget"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm mb-4">{budget.period}</p>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Spent</span>
                  <span className="text-sm font-medium text-white">
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </span>
                </div>
                
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(budget.percentage)}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  ></div>
                </div>
                
                <p className="text-xs mt-2 text-slate-400">
                  {budget.percentage.toFixed(1)}% of budget used
                </p>
              </div>

              {budget.status === 'over' && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 font-medium text-sm">Over Budget!</span>
                  </div>
                  <p className="text-red-300 text-sm mt-1">
                    You've exceeded your monthly limit by ${(budget.spent - budget.limit).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Budget Modal */}
        {showAddBudget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Budget</h3>
              <p className="text-gray-600 text-sm mb-6">Set a monthly spending limit for a category</p>
              
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Limit
                  </label>
                  <input
                    type="number"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Create Budget
                  </button>
                </div>
              </form>
              
              <button
                onClick={() => setShowAddBudget(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Budget Overview */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Budget Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <h4 className="font-medium text-white mb-2">Total Budget</h4>
              <span className="text-2xl font-bold text-white">
                ${updatedBudgets.reduce((sum, budget) => sum + budget.limit, 0).toFixed(2)}
              </span>
              <p className="text-xs text-slate-400 mt-1">This month</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <h4 className="font-medium text-white mb-2">Total Spent</h4>
              <span className="text-2xl font-bold text-red-400">
                ${updatedBudgets.reduce((sum, budget) => sum + budget.spent, 0).toFixed(2)}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {updatedBudgets.length > 0 ? 
                  `${((updatedBudgets.reduce((sum, budget) => sum + budget.spent, 0) / 
                      updatedBudgets.reduce((sum, budget) => sum + budget.limit, 0)) * 100).toFixed(0)}% of budget` 
                  : 'No budgets set'
                }
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <h4 className="font-medium text-white mb-2">Remaining</h4>
              <span className={`text-2xl font-bold ${
                updatedBudgets.reduce((sum, budget) => sum + budget.limit, 0) - 
                updatedBudgets.reduce((sum, budget) => sum + budget.spent, 0) >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                ${(updatedBudgets.reduce((sum, budget) => sum + budget.limit, 0) - 
                   updatedBudgets.reduce((sum, budget) => sum + budget.spent, 0)).toFixed(2)}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {updatedBudgets.reduce((sum, budget) => sum + budget.limit, 0) - 
                 updatedBudgets.reduce((sum, budget) => sum + budget.spent, 0) >= 0 
                  ? 'Under budget' 
                  : 'Over budget'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Budget Tips */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-700/20 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Budget Tips</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-slate-300">Set realistic budgets based on your historical spending patterns</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-slate-300">Review and adjust budgets monthly to reflect changing needs</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className="text-slate-300">Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-slate-300">Enable smart rules to automatically manage your budgets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;