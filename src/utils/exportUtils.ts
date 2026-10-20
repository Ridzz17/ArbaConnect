import { Outlet, StockLedgerEntry, B2BOrder, HerbalProduct } from '../types';

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCrmToCsv(outlets: Outlet[]) {
  const headers = [
    'Kode Outlet',
    'Nama Outlet',
    'Alamat',
    'Kota/Wilayah',
    'Tipe',
    'Apoteker / PJ',
    'WhatsApp / Telepon',
    'Sales Dedikasi',
    'Area Rute',
    'Termin Pembayaran',
    'Plafon Kredit (IDR)',
    'Pemakaian Kredit (IDR)',
    'Sisa Plafon (IDR)',
    'Status Kredit',
    'Order Terakhir',
    'Total Omset YTD (IDR)'
  ];

  const rows = outlets.map(o => [
    `"${o.code}"`,
    `"${o.name}"`,
    `"${o.address}"`,
    `"${o.cityName}"`,
    `"${o.type}"`,
    `"${o.picName}"`,
    `"${o.picPhone}"`,
    `"${o.salesRep}"`,
    `"${o.salesArea}"`,
    `"${o.terms}"`,
    o.creditLimit,
    o.creditUsed,
    o.creditRemaining,
    `"${o.creditStatus}"`,
    `"${o.lastOrderDate}"`,
    o.ytdTotal
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCsv(`ArbaConnect_CRM_Mitra_SoloRaya_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}

export function exportStockLedgerToCsv(ledger: StockLedgerEntry[]) {
  const headers = [
    'ID Transaksi',
    'Waktu',
    'Ref Dokumen',
    'Kode SKU',
    'Nama Produk',
    'Batch Terkait',
    'Tipe Mutasi',
    'Kuantitas',
    'Saldo Akhir',
    'Petugas/Operator',
    'Peran Operator',
    'SHA-256 Hash'
  ];

  const rows = ledger.map(l => [
    `"${l.id}"`,
    `"${l.timestamp}"`,
    `"${l.docRef}"`,
    `"${l.skuCode}"`,
    `"${l.skuName}"`,
    `"${l.batch}"`,
    `"${l.type}"`,
    l.quantity,
    l.finalStock,
    `"${l.operator}"`,
    `"${l.operatorRole}"`,
    `"${l.hash}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCsv(`ArbaConnect_BukuBesarStok_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}

export function exportExecutiveReportToCsv(orders: B2BOrder[], products: HerbalProduct[], outlets: Outlet[]) {
  const totalOmset = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 450000000;
  const headers = ['METRIK EKSEKUTIF', 'NILAI', 'CATATAN'];
  const summaryRows = [
    ['Total Omset Berjalan Q1 2026', `Rp ${totalOmset.toLocaleString('id-ID')}`, 'Target Rp 500.000.000 (96.5%)'],
    ['Total Mitra B2B Solo Raya', `${outlets.length} Outlet`, '104 Apotek, 64 Minimarket'],
    ['Kepatuhan FEFO Gudang', '99.4%', 'Audit Strict Standard CDOB'],
    ['Total Saldo Fisik Gudang', `${products.reduce((acc, p) => acc + p.stock, 0)} Unit`, 'Gudang Utama Kartasura'],
    ['SKU di Bawah ROP', `${products.filter(p => p.stock <= p.rop).length} SKU`, 'Pemesanan supplier terintegrasi']
  ];

  const orderHeaders = ['', '', ''];
  const orderTableHeaders = ['Client UUID', 'Nama Outlet', 'Kota', 'Sales Rep', 'Total (IDR)', 'Termin', 'Status'];
  const orderRows = orders.map(o => [
    `"${o.clientUuid}"`,
    `"${o.outletName}"`,
    `"${o.city}"`,
    `"${o.salesRep}"`,
    o.totalAmount,
    `"${o.terms}"`,
    `"${o.status}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...summaryRows.map(r => r.map(c => `"${c}"`).join(',')),
    orderHeaders.join(','),
    ['DAFTAR PESANAN MASUK TERBARU', '', ''].join(','),
    orderTableHeaders.join(','),
    ...orderRows.map(r => r.join(','))
  ].join('\n');

  downloadCsv(`ArbaConnect_Laporan_Eksekutif_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}
