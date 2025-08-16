import React from 'react';
import { Analytics } from '../components/Analytics';
import { useExpenses } from '../hooks/useExpenses';

export function AnalyticsPage() {
  const { expenses, isLoading } = useExpenses();

  return <Analytics expenses={expenses} isLoading={isLoading} />;
}