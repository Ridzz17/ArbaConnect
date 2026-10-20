import React from 'react';
import { useApp } from '../context/AppContext';
import { NavigationPath } from '../types';

interface NavItem {
  id: NavigationPath;
  label: string;
  icon: string;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { currentPath, setPath, orders, products } = useApp();

  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;
  const criticalStockCount = products.filter(p => p.status === 'below-rop' || p.status === 'critical-expiry').length;

  const navItems: NavItem[] = [
    {
      id: 'executive-dashboard',
      label: 'Executive Dashboard',
      icon: 'dashboard'
    },
    {
      id: 'inventory-stock-ledger',
      label: 'Inventory & Stock Ledger',
      icon: 'inventory_2',
      badge: criticalStockCount > 0 ? criticalStockCount : undefined
    },
    {
      id: 'b2b-crm-directory',
      label: 'B2B CRM & Directory',
      icon: 'store'
    },
    {
      id: 'order-approval-queue',
      label: 'Order Approval Queue',
      icon: 'fact_check',
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined
    },
    {
      id: 'field-sales-pwa-preview',
      label: 'Field Sales PWA Preview',
      icon: 'smartphone'
    }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex flex-col justify-between py-space-md border-r border-border-subtle/50">
      <div className="flex flex-col gap-space-xs px-space-sm">
        <div className="px-space-md py-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
          Navigasi Sistem
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPath(item.id)}
                type="button"
                className={`flex items-center justify-between px-space-md py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-on-primary-container' : 'text-primary'}`}>
                    {item.icon}
                  </span>
                  <span className="font-label-lg text-label-lg">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-badge-amber/20 text-badge-amber'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Audit Readiness bottom status widget */}
      <div className="px-space-md py-3 bg-surface-container-low/70 rounded-xl mx-space-sm border border-border-subtle/30 shadow-xs">
        <div className="flex items-center gap-2 text-primary font-label-md text-label-md mb-1">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span className="font-bold">Audit Readiness</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          FEFO Strict Enforcement &amp; Stock Ledger Integrity Active
        </p>
      </div>
    </aside>
  );
};
