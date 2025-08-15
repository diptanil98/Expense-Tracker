import React,  { createContext, useContext, useState}  from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface Expense {
  id: string;
  user: string;
  amount: number;
  merchant: string;
  category: string;
  date: string;
  location?: string;
  description?: string;
  paymentMethod: string;
  isFraud?: boolean;
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

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'date'>) => {
   try{
    // Get user ID from localStorage
    const savedUser = localStorage.getItem('expenseGuardUser');
    if (!savedUser) {
      throw new Error('User not authenticated');
    }
    
    const user = JSON.parse(savedUser);
    const expenseWithUser = {
      ...expenseData,
      user: user.id
    };
    
    const res= await axios.post<Expense>('http://localhost:8765/expenses/expenses',expenseWithUser);
    const savedExpense=res.data;
    setExpenses(prev => [savedExpense, ...prev]);
   }catch (error) { 
    console.error('Error adding expense:', error);
    throw error; // Re-throw to handle in the component
  }
}

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const flaggedTransactions = expenses.filter(expense => expense.isFraud).length;
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