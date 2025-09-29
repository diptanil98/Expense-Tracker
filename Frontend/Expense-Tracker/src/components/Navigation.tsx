import { NavLink } from 'react-router-dom';

export function Navigation() {
  const tabs = [
    { path: '/', label: 'Expenses' },
    { path: '/add-expense', label: 'Add Expense' },
    {path:'/budget',label:'Budget'},
    { path: '/ai-insights', label: 'AI Insights' },
    { path: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav className="flex justify-between space-x-1 p-1 bg-slate-800/30 rounded-xl border border-slate-700/50 mb-8">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}