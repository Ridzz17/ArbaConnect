import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl bg-[#0b1c30] text-white border border-slate-700">
      <span className="material-symbols-outlined text-[22px] text-badge-green">
        {toast.icon || 'check_circle'}
      </span>
      <span className="font-body-sm text-body-sm font-medium">{toast.message}</span>
    </div>
  );
};
