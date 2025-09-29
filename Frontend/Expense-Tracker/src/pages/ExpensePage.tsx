import { ExpensesList } from '../components/ExpenseList';
import { useExpenses } from '../hooks/useExpenses';

export function ExpensesPage() {
  const { expenses, isLoading } = useExpenses();

  return <ExpensesList expenses={expenses} isLoading={isLoading} />;
}