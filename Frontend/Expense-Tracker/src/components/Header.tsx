import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/authContext';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="flex items-center justify-between py-6 px-8 border-b border-slate-700/50">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <Shield className="w-6 h-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Expenzo</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        {user && (
          <div className="flex items-center space-x-3 mr-4">
            <span className="text-slate-300 text-sm">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30">
          AI-Powered
        </span>
        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
          Fraud Detection
        </span>
      </div>
    </header>
  );
}