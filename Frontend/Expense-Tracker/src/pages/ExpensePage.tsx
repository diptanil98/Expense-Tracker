import React from 'react';
import { ExpensesList } from '../components/ExpenseList';
import { useExpenses } from '../hooks/useExpenses';

export function ExpensesPage() {
  const { expenses } = useExpenses();

  return <ExpensesList expenses={expenses} />;
}