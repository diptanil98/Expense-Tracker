import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ExpensesPage } from './pages/ExpensePage';
import { AddExpensePage } from './pages/AddExpensePage';
import { AIInsightsPage } from './pages/AIInsightPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ExpensesProvider } from './hooks/useExpenses';

function App() {
  return (
    <AuthProvider>
      <ExpensesProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<ExpensesPage />} />
              <Route path="add-expense" element={<AddExpensePage />} />
              <Route path="ai-insights" element={<AIInsightsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Routes>
        </Router>
      </ExpensesProvider>
    </AuthProvider>
  );
}

export default App;