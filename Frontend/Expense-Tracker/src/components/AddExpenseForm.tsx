import React, { useState } from 'react';
import { Plus, Mic, Camera } from 'lucide-react';

interface AddExpenseFormProps {
  onAddExpense: (expense: any) => void;
}

export function AddExpenseForm({ onAddExpense }: AddExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    merchant: '',
    location: '',
    description: '',
    paymentMethod: 'Credit Card'
  });

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Healthcare',
    'Utilities',
    'Travel',
    'Other'
  ];

  const paymentMethods = [
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Debit Card', label: 'Debit Card' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Digital Wallet', label: 'Digital Wallet' },
    { value: 'Other', label: 'Other' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.category && formData.merchant) {
      onAddExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({
        amount: '',
        category: '',
        merchant: '',
        location: '',
        description: '',
        paymentMethod: 'Credit Card'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-4">
        <Plus className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Add New Expense</h3>
      </div>
      <p className="text-slate-400 text-sm mb-6">Track your spending with AI-powered fraud detection</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Merchant
            </label>
            <input
              type="text"
              name="merchant"
              placeholder="e.g., Starbucks"
              value={formData.merchant}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g., New York, NY"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Optional description..."
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Payment Method
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>{method.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Add Expense
          </button>
          <button
            type="button"
            className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}