import React,  { createContext, useContext, useState, useEffect}  from 'react';
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
  fetchExpenses: () => void;
  refreshExpenses: () => void;
  clearExpenses: () => void;
  validateCurrentUserExpenses: () => boolean;
  totalSpent: number;
  flaggedTransactions: number;
  avgTransaction: number;
  isLoading: boolean;
  error: string | null;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const fetchExpenses = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const savedUser = localStorage.getItem('expenseGuardUser');
    if (!savedUser) {
      setError('User not authenticated. Please log in again.');
      setIsLoading(false);
      return;
    }
    
    const user = JSON.parse(savedUser);
    const res = await axios.get<Expense[]>(`http://localhost:8765/expenses/expenses/user/${user.id}`);
    
    // Double-check that all fetched expenses belong to the current user
    const userExpenses = res.data.filter(expense => expense.user === user.id);
    
    // Additional security check - if any expenses don't match the current user, don't set them
    if (userExpenses.length !== res.data.length) {
      console.warn('Some expenses were filtered out due to user ID mismatch');
    }
    
    setExpenses(userExpenses);
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    if (error.response?.status === 401) {
      setError('Authentication failed. Please log in again.');
    } else if (error.code === 'ERR_NETWORK') {
      setError('Cannot connect to server. Please check if the backend is running.');
    } else {
      setError('Failed to fetch expenses. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};

const refreshExpenses = () => {
  fetchExpenses();
};

const clearExpenses = () => {
  setExpenses([]);
  setError(null);
  setIsLoading(false);
};

const validateCurrentUserExpenses = () => {
  const savedUser = localStorage.getItem('expenseGuardUser');
  if (!savedUser) {
    return false;
  }
  
  try {
    const user = JSON.parse(savedUser);
    // If we have expenses but they don't belong to the current user, return false
    if (expenses.length > 0 && expenses.some(expense => expense.user !== user.id)) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return false;
  }
};

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'date'>) => {
   try {
    // Get user ID from localStorage
    const savedUser = localStorage.getItem('expenseGuardUser');
    if (!savedUser) {
      throw new Error('User not authenticated. Please log in again.');
    }
    
    const user = JSON.parse(savedUser);
    const expenseWithUser = {
      ...expenseData,
      user: user.id
    };
    
    const res= await axios.post<Expense>('http://localhost:8765/expenses/expenses',expenseWithUser);
    const savedExpense=res.data;
    
    // Security check - ensure the saved expense belongs to the current user
    if (savedExpense.user !== user.id) {
      throw new Error('Security error: Expense was created for different user');
    }
    
    setExpenses(prev => [savedExpense, ...prev]);
    await axios.post("http://localhost:5678/webhook/expense-added",{
      userId:user.id,
      category:savedExpense.category,
      amount:savedExpense.amount
    });
   }catch (error: any) { 
    console.error('Error adding expense:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('Failed to add expense. Please try again.');
    }
  }
}

  // Automatically fetch expenses when the provider mounts and when user changes
  useEffect(() => {
    const savedUser = localStorage.getItem('expenseGuardUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        fetchExpenses();
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearExpenses();
      }
    } else {
      clearExpenses();
    }
  }, []);

  // Listen for custom logout event to immediately clear expenses
  useEffect(() => {
    const handleLogout = () => {
      clearExpenses();
    };

    const handleUserChange = () => {
      clearExpenses();
      // Small delay to ensure localStorage is updated, then fetch new user's expenses
      setTimeout(() => {
        const savedUser = localStorage.getItem('expenseGuardUser');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            fetchExpenses();
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      }, 100);
    };

    window.addEventListener('userLogout', handleLogout);
    window.addEventListener('userChange', handleUserChange);

    return () => {
      window.removeEventListener('userLogout', handleLogout);
      window.removeEventListener('userChange', handleUserChange);
    };
  }, []);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const flaggedTransactions = expenses.filter(expense => expense.isFraud).length;
  const avgTransaction = expenses.length > 0 ? totalSpent / expenses.length : 0;

  return (
    <ExpensesContext.Provider value={{
      expenses: expenses,
      addExpense,
      fetchExpenses,
      refreshExpenses,
      clearExpenses,
      validateCurrentUserExpenses,
      totalSpent,
      flaggedTransactions,
      avgTransaction,
      isLoading,
      error
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