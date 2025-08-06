
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ExpensesPage } from './pages/ExpensePage';
import { AddExpensePage } from './pages/AddExpensePage';
import { AIInsightsPage } from './pages/AIInsightPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ExpensesProvider } from './hooks/useExpenses';

function App() {
  return (
    <ExpensesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ExpensesPage />} />
            <Route path="add-expense" element={<AddExpensePage />} />
            <Route path="ai-insights" element={<AIInsightsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </Router>
    </ExpensesProvider>
  );
}

export default App;