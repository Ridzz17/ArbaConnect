import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentRole,
    setRole,
    isOnline,
    toggleOnlineStatus,
    isDarkMode,
    toggleDarkMode,
    orders,
    products,
    outlets,
    setPath,
    setSelectedOutletId,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingCount = orders.filter(o => o.status === 'PENDING').length;

  // Search matches
  const matchedOutlets = searchQuery.trim()
    ? outlets.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.code.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];
  const matchedProducts = searchQuery.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];
  const matchedOrders = searchQuery.trim()
    ? orders.filter(o => o.clientUuid.toLowerCase().includes(searchQuery.toLowerCase()) || o.outletName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const hasSearchResults = matchedOutlets.length > 0 || matchedProducts.length > 0 || matchedOrders.length > 0;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 border-b border-border-subtle/40">
      <div className="h-16 w-full px-gutter-desktop flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-space-md">
          <img
            alt="ArbaConnect Brand Logo"
            className="h-8 w-auto object-contain cursor-pointer"
            onClick={() => setPath('executive-dashboard')}
            src="https://lh3.googleusercontent.com/aida/AEtjO1Uwe38vmG086Hh9taUzSVornhjOXOmqxRUjZh59glp8JC99KGV7BK4vzhY9IsW-fL7Zmvch7D9ibcBb7l2s2dSfeeERfruYrT3eCVKwuErwjk7ossKo-iLKZMLopcGTg2wiJTLaEjikW2CIrewYxmhL1_pIlODNnJmwNOWVkAnJQjF8q7ywGr91mXsRChhktrECPsyhySUVBYH84FPbS-LDMt_MooUBj64FbdKmPJJ5_2l9aTKuHj3zznY"
          />
          <div className="flex flex-col cursor-pointer" onClick={() => setPath('executive-dashboard')}>
            <span className="font-title-sm text-title-sm text-primary leading-tight tracking-tight font-bold">
              ArbaConnect
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
              CV Arba'in Logistics ERP
            </span>
          </div>
        </div>

        {/* Global Quick Search Bar */}
        <div className="hidden md:flex relative max-w-sm w-full mx-4">
          <span className="material-symbols-outlined text-on-surface-variant absolute left-3 top-2 text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Cari SKU Herbal, Apotek Mitra, atau Faktur..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full pl-9 pr-4 py-1.5 bg-surface-container-low text-xs rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-border-subtle/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSearchDropdown(false);
              }}
              className="absolute right-2 top-2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}

          {/* Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-surface-container-lowest rounded-xl shadow-xl border border-border-subtle/50 p-2 z-50 max-h-80 overflow-y-auto">
              {hasSearchResults ? (
                <div className="flex flex-col gap-2 text-xs">
                  {matchedOutlets.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 py-1">
                        Mitra B2B Outlet
                      </div>
                      {matchedOutlets.map(o => (
                        <div
                          key={o.id}
                          onClick={() => {
                            setSelectedOutletId(o.id);
                            setPath('b2b-crm-directory');
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="p-2 hover:bg-surface-container-low rounded-lg cursor-pointer flex items-center justify-between"
                        >
                          <div className="font-semibold text-on-surface">{o.name}</div>
                          <span className="text-[10px] text-slate-500">{o.cityName}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedProducts.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 py-1">
                        Produk &amp; SKU Herbal
                      </div>
                      {matchedProducts.map(p => (
                        <div
                          key={p.sku}
                          onClick={() => {
                            setPath('inventory-stock-ledger');
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="p-2 hover:bg-surface-container-low rounded-lg cursor-pointer flex items-center justify-between"
                        >
                          <div className="font-semibold text-on-surface">{p.name}</div>
                          <span className="text-[10px] font-mono text-primary font-bold">Stok: {p.stock}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {matchedOrders.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider px-2 py-1">
                        Faktur Pesanan B2B
                      </div>
                      {matchedOrders.map(ord => (
                        <div
                          key={ord.id}
                          onClick={() => {
                            setPath('order-approval-queue');
                            setShowSearchDropdown(false);
                            setSearchQuery('');
                          }}
                          className="p-2 hover:bg-surface-container-low rounded-lg cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono font-bold text-primary">{ord.clientUuid}</span>
                            <span className="ml-2 text-slate-600">{ord.outletName}</span>
                          </div>
                          <span className="font-bold text-[10px] text-emerald-700">Rp {ord.totalAmount.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-on-surface-variant">
                  Tidak ditemukan hasil untuk "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global Controls & User Info */}
        <div className="flex items-center gap-space-md">
          {/* Role Perspective Switcher */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined text-on-surface-variant absolute left-2 text-[18px] pointer-events-none">
              swap_horiz
            </span>
            <select
              aria-label="Ganti Role Perspektif"
              value={currentRole}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-surface-container-low font-label-md text-label-md text-on-surface pl-8 pr-8 py-1.5 rounded-lg border-0 appearance-none cursor-pointer focus:outline-none focus:bg-surface-container shadow-xs hover:bg-surface-container transition-colors"
            >
              <option value="executive">Executive Director / Management</option>
              <option value="field-sales">Field Sales Rep (Mobile PWA)</option>
              <option value="inventory">Inventory &amp; Warehouse Admin</option>
              <option value="sales-ops">Sales &amp; Order Admin</option>
            </select>
            <span className="material-symbols-outlined text-on-surface-variant absolute right-2 text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Online / Network Sync Status Chip */}
          <button
            onClick={toggleOnlineStatus}
            type="button"
            title="Klik untuk simulasi mode Online / Offline"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              isOnline
                ? 'bg-status-success-bg text-status-success-text hover:opacity-90'
                : 'bg-status-warning-bg text-status-warning-text hover:opacity-90'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-badge-green animate-pulse' : 'bg-badge-amber'
              }`}
            />
            <span className="font-label-sm text-label-sm font-semibold">
              {isOnline ? 'Online - All Synced' : 'Offline - Local Mode'}
            </span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle color mode"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-badge-red ring-2 ring-surface" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-border-subtle/50 p-3 z-50 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-on-surface">Notifikasi Sistem</span>
                  <span className="text-[10px] text-primary font-semibold">{pendingCount} Pesanan Baru</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div
                    onClick={() => {
                      setPath('order-approval-queue');
                      setShowNotifications(false);
                    }}
                    className="p-2 bg-surface-container-low hover:bg-surface-container rounded-lg cursor-pointer flex gap-2"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">shopping_bag</span>
                    <div>
                      <div className="font-semibold text-on-surface">Pesanan Baru Siap Validasi</div>
                      <div className="text-[11px] text-on-surface-variant">Apotek Kimia Farma Slamet Riyadi (Rp 8.450.000)</div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setPath('inventory-stock-ledger');
                      setShowNotifications(false);
                    }}
                    className="p-2 bg-surface-container-low hover:bg-surface-container rounded-lg cursor-pointer flex gap-2"
                  >
                    <span className="material-symbols-outlined text-badge-amber text-[18px]">warning</span>
                    <div>
                      <div className="font-semibold text-on-surface">Peringatan Reorder Point (ROP)</div>
                      <div className="text-[11px] text-on-surface-variant">Madu Randu Murni 500g mendekati safety stock</div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      showToast('Audit Kepatuhan CDOB: 99.4% Kepatuhan FEFO tervalidasi!', 'verified');
                      setShowNotifications(false);
                    }}
                    className="p-2 bg-surface-container-low hover:bg-surface-container rounded-lg cursor-pointer flex gap-2"
                  >
                    <span className="material-symbols-outlined text-badge-green text-[18px]">verified</span>
                    <div>
                      <div className="font-semibold text-on-surface">Validasi Integritas CDOB</div>
                      <div className="text-[11px] text-on-surface-variant">Buku besar stok diverifikasi SHA-256</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info */}
          <div
            onClick={() => showToast(`Login sebagai: ${currentRole.toUpperCase()} (CV Arba'in Logistik)`, 'account_circle')}
            className="flex items-center gap-space-sm pl-space-xs cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold">
                Admin Operasional
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
                CV Arba'in Logistik
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
