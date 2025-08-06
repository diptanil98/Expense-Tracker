import React,  { createContext, useContext, useState}  from 'react';
import type { ReactNode } from 'react';
interface Expense {
  id: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  location?: string;
  description?: string;
  paymentMethod: string;
  flagged?: boolean;
}

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  totalSpent: number;
  flaggedTransactions: number;
  avgTransaction: number;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const flaggedTransactions = expenses.filter(expense => expense.flagged).length;
  const avgTransaction = expenses.length > 0 ? totalSpent / expenses.length : 0;

  return (
    <ExpensesContext.Provider value={{
      expenses,
      addExpense,
      totalSpent,
      flaggedTransactions,
      avgTransaction
    }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}