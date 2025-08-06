import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: typeof LucideIcon;
  iconColor: string;
}

export function StatCard({ title, value, icon: Icon, iconColor }: StatCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}