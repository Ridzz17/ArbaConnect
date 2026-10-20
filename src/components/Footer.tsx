import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest py-3 px-gutter-desktop shadow-[0_-1px_6px_rgba(0,0,0,0.02)] border-t border-border-subtle/40">
      <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
        <span>UMS Health Innovation Hackathon 2026 • Challenge ARB-02 • CV Arba'in Target TKT 5</span>
        <span className="font-code-table text-code-table font-semibold text-primary">
          Build v2.4.0 • Enterprise Core
        </span>
      </div>
    </footer>
  );
};
