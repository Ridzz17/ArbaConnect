import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HerbalProduct, OrderItem } from '../types';

export const FieldSalesPwaView: React.FC = () => {
  const { products, outlets, isOnline, toggleOnlineStatus, submitFieldSalesOrder, selectedOutletId, offlineQueue, setPath, showToast } = useApp();

  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [selectedOutletCode, setSelectedOutletCode] = useState(() => {
    const match = outlets.find(o => o.id === selectedOutletId || o.code === selectedOutletId);
    return match ? match.code : 'AP-SLO-001';
  });
  const [cart, setCart] = useState<{ [sku: string]: number }>({
    'SKU-ARB-MDR500': 12,
    'SKU-ARB-HBT100': 6
  });
  const [selectedTerm, setSelectedTerm] = useState('Net 30 Hari');
  const [orderNotes, setOrderNotes] = useState('Pesanan rutin mingguan display etalase depan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThermalReceipt, setShowThermalReceipt] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(true);
  const [gpsDistance, setGpsDistance] = useState(14);

  const currentOutlet = outlets.find(o => o.code === selectedOutletCode) || outlets[0];

  const updateCartQty = (sku: string, delta: number) => {
    setCart(prev => {
      const current = prev[sku] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[sku];
        return copy;
      }
      return { ...prev, [sku]: next };
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [sku, qty]) => {
      const prod = products.find(p => p.sku === sku);
      return total + (prod ? prod.unitPrice * qty : 0);
    }, 0);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(cart).length === 0) {
      showToast('Pilih minimal satu produk herbal untuk dipesan', 'warning');
      return;
    }

    setIsSubmitting(true);

    const items: OrderItem[] = Object.entries(cart).map(([sku, qty]) => {
      const prod = products.find(p => p.sku === sku) as HerbalProduct;
      return {
        sku: prod.sku.replace('SKU-', ''),
        name: prod.name,
        batch: `Batch: ${prod.activeBatch}`,
        expiry: prod.fefoDate,
        fefoPriority: 'FEFO Prioritas 1',
        quantity: qty,
        unitPrice: prod.unitPrice,
        subtotal: prod.unitPrice * qty,
        allocated: true,
        remainingBatchStock: prod.stock
      };
    });

    setTimeout(() => {
      submitFieldSalesOrder({
        outletId: currentOutlet.code,
        outletName: currentOutlet.name,
        address: currentOutlet.address,
        city: currentOutlet.cityName,
        salesRep: 'Budi Santoso',
        salesRepId: 'REP-SR-04',
        terms: selectedTerm,
        totalAmount: calculateTotal(),
        items
      });
      setIsSubmitting(false);
      setCart({});
    }, 600);
  };

  const totalAmount = calculateTotal();

  return (
    <div className="flex flex-col items-center w-full gap-space-lg pb-space-xl">
      {/* Viewport Mode Switcher Banner */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-lowest p-space-md rounded-xl shadow-xs border border-border-subtle/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">smartphone</span>
          </div>
          <div>
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
              Field Sales Mobile PWA Interface Preview
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Simulasi langsung aplikasi lapangan yang digunakan oleh sales rep CV Arba'in di apotek Solo Raya.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`px-3 py-1.5 rounded-lg font-label-md text-label-md cursor-pointer transition-all ${
              isPhoneFrame
                ? 'bg-primary text-on-primary font-bold shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            type="button"
          >
            Tampilan Smartphone (375px)
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`px-3 py-1.5 rounded-lg font-label-md text-label-md cursor-pointer transition-all ${
              !isPhoneFrame
                ? 'bg-primary text-on-primary font-bold shadow-xs'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
            type="button"
          >
            Tampilan Tablet / Layar Penuh
          </button>
        </div>
      </div>

      {/* Main Container - Phone Frame or Fluid Width */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] rounded-3xl border-8 border-slate-800 bg-surface shadow-2xl overflow-hidden'
            : 'max-w-4xl bg-surface-container-lowest rounded-2xl shadow-sm border border-border-subtle/40 p-6'
        }`}
      >
        {/* Phone Notch Header (if phone mode) */}
        {isPhoneFrame && (
          <div className="w-full bg-slate-900 text-white px-5 py-2 flex items-center justify-between text-[11px] font-mono">
            <span>10:14</span>
            <div className="w-20 h-3.5 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]">wifi</span>
              <span className="material-symbols-outlined text-[13px]">battery_5_bar</span>
            </div>
          </div>
        )}

        {/* PWA App Content */}
        <div className="flex flex-col min-h-[640px] bg-slate-50 text-slate-900">
          {/* PWA App Top Bar */}
          <div className="bg-[#005c55] text-white p-4 shadow-md flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                BS
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Budi Santoso</h3>
                <p className="text-[11px] text-teal-200">Field Sales #FS-04 • Solo Tengah</p>
              </div>
            </div>

            {/* Offline Sync Toggle button */}
            <button
              onClick={toggleOnlineStatus}
              title="Klik untuk ubah status online / offline"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                isOnline ? 'bg-emerald-600/80 text-white' : 'bg-amber-500 text-slate-900'
              }`}
              type="button"
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-amber-950'}`} />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>
          </div>

          <div className="p-4 flex flex-col gap-3 flex-grow">
            {/* Geofence GPS Card */}
            <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  Target Kunjungan Hari Ini
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const dist = Math.floor(6 + Math.random() * 15);
                    setGpsDistance(dist);
                    setGpsVerified(true);
                    showToast(`Presisi GPS Geofence: ${dist}m dari ${currentOutlet.name} (Tervalidasi di Lokasi)`, 'pin_drop');
                  }}
                  className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>GPS Valid ({gpsDistance}m)</span>
                </button>
              </div>

              {/* Outlet Selector */}
              <div>
                <label className="block text-[11px] text-slate-500 font-semibold mb-1">Pilih Outlet Mitra:</label>
                <select
                  value={selectedOutletCode}
                  onChange={(e) => setSelectedOutletCode(e.target.value)}
                  className="w-full bg-slate-100 p-2 rounded-lg font-semibold text-xs border-0 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005c55] cursor-pointer"
                >
                  {outlets.map(o => (
                    <option key={o.code} value={o.code}>
                      {o.name} ({o.cityName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1 text-xs pt-1 border-t border-slate-100 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Plafon: <b>Rp {currentOutlet.creditLimit.toLocaleString('id-ID')}</b></span>
                  <span className="text-emerald-700 font-bold">
                    Sisa Limit: Rp {currentOutlet.creditRemaining.toLocaleString('id-ID')}
                  </span>
                </div>
                {totalAmount > 0 && (
                  <div className="flex items-center justify-between text-[11px] bg-slate-50 p-1.5 rounded">
                    <span className="text-slate-500">Estimasi Sisa Limit:</span>
                    <span className={`font-mono font-bold ${currentOutlet.creditRemaining - totalAmount < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      Rp {Math.max(0, currentOutlet.creditRemaining - totalAmount).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Quick-Order Catalog */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Katalog Herbal Cepat (&lt;60s Order)
                </span>
                <span className="text-[11px] text-[#005c55] font-semibold">FEFO Terverifikasi</span>
              </div>

              <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
                {products.map(prod => {
                  const qty = cart[prod.sku] || 0;
                  const isLow = prod.stock <= prod.rop;

                  return (
                    <div
                      key={prod.sku}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold flex-shrink-0">
                          <span className="material-symbols-outlined text-[18px]">{prod.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 truncate">{prod.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            Rp {prod.unitPrice.toLocaleString('id-ID')} • {prod.activeBatch}
                          </div>
                          {isLow && (
                            <span className="inline-block text-[10px] text-amber-700 font-bold">
                              Sisa Gudang: {prod.stock} unit
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stepper with touch-friendly 44x44px target buttons */}
                      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 flex-shrink-0">
                        <button
                          onClick={() => updateCartQty(prod.sku, -1)}
                          className="w-8 h-8 rounded-md bg-white text-slate-700 flex items-center justify-center font-bold text-sm shadow-2xs hover:bg-slate-200 cursor-pointer active:scale-95"
                          type="button"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold text-xs font-mono">{qty}</span>
                        <button
                          onClick={() => updateCartQty(prod.sku, 1)}
                          className="w-8 h-8 rounded-md bg-[#005c55] text-white flex items-center justify-center font-bold text-sm shadow-2xs hover:bg-teal-800 cursor-pointer active:scale-95"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart & Checkout Box */}
            <form onSubmit={handleCheckout} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-2.5 mt-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Termin Pembayaran:</span>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold cursor-pointer border-0"
                >
                  <option value="Net 30 Hari">Net 30 Hari</option>
                  <option value="Net 14 Hari">Net 14 Hari</option>
                  <option value="COD Tunai">COD Tunai</option>
                </select>
              </div>

              <input
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Catatan pesanan / instruksi khusus..."
                className="w-full bg-slate-100 p-2 rounded-lg text-xs text-slate-800 focus:outline-none"
                type="text"
              />

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-500 block">Total ({Object.values(cart).reduce((a, b) => a + b, 0)} unit):</span>
                  <span className="font-bold text-base text-[#005c55]">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  disabled={isSubmitting || totalAmount === 0}
                  className="px-4 py-2.5 rounded-lg bg-[#005c55] hover:bg-[#0f766e] text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesanan (<60s)'}</span>
                </button>
              </div>
            </form>

            {/* Action Bar for Bluetooth Printer Receipt */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowThermalReceipt(true)}
                className="w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#005c55]">receipt</span>
                <span>Cetak Struk Thermal Bluetooth (58mm)</span>
              </button>
            </div>
          </div>

          {/* Quick Nav Footer inside PWA */}
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around text-[10px] text-slate-600">
            <button className="flex flex-col items-center gap-0.5 text-[#005c55] font-bold" type="button">
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              <span>Input Order</span>
            </button>
            <button onClick={() => setPath('order-approval-queue')} className="flex flex-col items-center gap-0.5 hover:text-slate-900 cursor-pointer" type="button">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>Antrean Admin</span>
            </button>
            <button onClick={() => setPath('b2b-crm-directory')} className="flex flex-col items-center gap-0.5 hover:text-slate-900 cursor-pointer" type="button">
              <span className="material-symbols-outlined text-[18px]">store</span>
              <span>Mitra B2B</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bluetooth Thermal Receipt Modal */}
      {showThermalReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-sm w-full p-5 flex flex-col gap-3 border border-border-subtle/50">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">print</span>
                <h3 className="font-bold text-xs text-on-surface">Struk Thermal Bluetooth (58mm)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowThermalReceipt(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Monospace Thermal Receipt Paper simulation */}
            <div className="bg-[#fefefe] p-4 rounded-lg border border-dashed border-slate-300 font-mono text-[11px] text-slate-800 leading-tight space-y-2 shadow-inner">
              <div className="text-center space-y-0.5">
                <div className="font-bold text-sm tracking-wide">CV ARBA'IN SURAKARTA</div>
                <div>Distributor Herbal Solo Raya</div>
                <div className="text-[10px] text-slate-500">Telp/WA: 0812-2555-8888</div>
                <div>--------------------------------</div>
              </div>

              <div className="text-[10px] space-y-0.5">
                <div className="flex justify-between">
                  <span>Tgl: {new Date().toLocaleDateString('id-ID')}</span>
                  <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                </div>
                <div>Outlet: <b>{currentOutlet.name}</b></div>
                <div>PIC: {currentOutlet.picName}</div>
                <div>Sales: Budi Santoso (REP-04)</div>
                <div>Termin: {selectedTerm}</div>
                <div>--------------------------------</div>
              </div>

              <div className="space-y-1">
                {Object.entries(cart).map(([sku, qty]) => {
                  const prod = products.find(p => p.sku === sku);
                  if (!prod) return null;
                  return (
                    <div key={sku}>
                      <div className="font-semibold truncate">{prod.name}</div>
                      <div className="flex justify-between text-[10px] text-slate-600">
                        <span>{qty} x Rp {prod.unitPrice.toLocaleString('id-ID')}</span>
                        <span className="font-bold">Rp {(prod.unitPrice * qty).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(cart).length === 0 && (
                  <div className="text-center text-slate-400 py-2">(Keranjang Kosong)</div>
                )}
              </div>

              <div>
                <div>--------------------------------</div>
                <div className="flex justify-between font-bold text-xs pt-1">
                  <span>TOTAL TAGIHAN:</span>
                  <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Sisa Plafon Berjalan:</span>
                  <span>Rp {Math.max(0, currentOutlet.creditRemaining - totalAmount).toLocaleString('id-ID')}</span>
                </div>
                <div>================================</div>
              </div>

              <div className="text-center text-[10px] space-y-1 pt-1">
                <div className="font-bold">TERIMA KASIH ATAS KERJASAMA ANDA</div>
                <div className="text-slate-500">Barang yang dibeli bergaransi FEFO resmi CV Arba'in</div>
                <div className="font-mono text-[9px] pt-1 text-slate-400">ID: ARB-PWA-{Date.now().toString().slice(-6)}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-2">
              <button
                type="button"
                onClick={() => setShowThermalReceipt(false)}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-xs font-semibold hover:bg-surface-container-high cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Perintah cetak Bluetooth ESC/POS dikirim ke printer mobile', 'print');
                  window.print();
                  setShowThermalReceipt(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#005c55] text-white text-xs font-semibold hover:bg-[#0f766e] flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">print</span>
                <span>Cetak Struk ESC/POS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
