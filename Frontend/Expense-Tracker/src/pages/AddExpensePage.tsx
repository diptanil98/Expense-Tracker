
import { useNavigate } from 'react-router-dom';
import { AddExpenseForm } from '../components/AddExpenseForm';
import { useExpenses } from '../hooks/useExpenses';

export function AddExpensePage() {
  const navigate = useNavigate();
  const { addExpense } = useExpenses();

  const handleAddExpense = (expense: any) => {
    addExpense(expense);
    navigate('/'); // Navigate back to expenses page after adding
  };

  return <AddExpenseForm onAddExpense={handleAddExpense} />;
}