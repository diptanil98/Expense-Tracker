import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('expenseGuardUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8765/User/login', {
        email,
        password
      });
      
      // Extract user data from response
      const userData = response.data.data.user;
      const user = { 
        id: userData._id, // Use the _id from backend response
        username: userData.username, 
        email: userData.email 
      };
      
      setUser(user);
      localStorage.setItem('expenseGuardUser', JSON.stringify(user));
      localStorage.setItem('expenseGuardToken', response.data.token);
      
      // Dispatch user change event to clear previous user's expenses
      window.dispatchEvent(new CustomEvent('userChange'));
      
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      setIsLoading(false);
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
      
      let errorMessage = 'Login failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      console.log({  username, email, password });
      const response = await axios.post('http://localhost:8765/User/register', {
        username, // changed from name to username
        email,
        password
      });
      
      // Extract user data from response
      const userData = response.data.data.user;
      const user = { 
        id: userData._id, // Use the _id from backend response
        username: userData.username, 
        email: userData.email 
      };
      
      setUser(user);
      localStorage.setItem('expenseGuardUser', JSON.stringify(user));
      localStorage.setItem('expenseGuardToken', response.data.token);
      
      // Dispatch user change event to clear previous user's expenses
      window.dispatchEvent(new CustomEvent('userChange'));
      
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      setIsLoading(false);
      console.error('Signup error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
      
      let errorMessage = 'Registration failed';
      if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('expenseGuardUser');
    localStorage.removeItem('expenseGuardToken');
    
    // Dispatch logout event to immediately clear expenses
    window.dispatchEvent(new CustomEvent('userLogout'));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}