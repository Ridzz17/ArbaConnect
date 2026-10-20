export type UserRole = 
  | 'executive' 
  | 'field-sales' 
  | 'inventory' 
  | 'sales-ops';

export type NavigationPath = 
  | 'executive-dashboard' 
  | 'inventory-stock-ledger' 
  | 'b2b-crm-directory' 
  | 'order-approval-queue' 
  | 'field-sales-pwa-preview';

export interface HerbalProduct {
  sku: string;
  name: string;
  category: 'Madu Herbal' | 'Kapsul Herbal' | 'Minyak & Cairan' | 'Serbuk';
  stock: number;
  safetyStock: number;
  rop: number;
  ropFormula: string;
  activeBatch: string;
  fefoDate: string;
  fefoStatus: 'Aman (>6 Bulan)' | 'Mendekati ED (<3 Bulan)' | 'Kritis (<30 Hari)';
  status: 'optimal' | 'below-rop' | 'critical-expiry' | 'out-of-stock';
  unitPrice: number;
  icon: string;
}

export type MutationType = 'MASUK' | 'KELUAR' | 'PENYESUAIAN' | 'RETUR';

export interface StockLedgerEntry {
  id: string;
  timestamp: string;
  docRef: string;
  skuName: string;
  skuCode: string;
  batch: string;
  type: MutationType;
  quantity: number;
  finalStock: number;
  operator: string;
  operatorRole: string;
  hash: string;
}

export interface Outlet {
  id: string;
  code: string;
  name: string;
  address: string;
  city: 'Solo' | 'Sukoharjo' | 'Karanganyar' | 'Klaten' | 'Boyolali' | 'Sragen';
  cityName: string;
  type: 'Apotek Mandiri' | 'Jaringan Farmasi' | 'Minimarket';
  picName: string;
  picRole: string;
  picPhone: string;
  salesRep: string;
  salesArea: string;
  terms: 'Net 30 Hari' | 'Net 14 Hari' | 'COD Cash';
  creditLimit: number;
  creditUsed: number;
  creditRemaining: number;
  creditStatus: 'Lancar' | 'Perhatian' | 'Overdue';
  lastOrderDate: string;
  orderFrequency: string;
  ytdTotal: number;
  lastVisitDate: string;
  visitNotes: string;
}

export interface OrderItem {
  sku: string;
  name: string;
  batch: string;
  expiry: string;
  fefoPriority: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  allocated: boolean;
  remainingBatchStock: number;
}

export interface B2BOrder {
  id: string;
  clientUuid: string;
  outletId: string;
  outletName: string;
  address: string;
  city: string;
  salesRep: string;
  salesRepId: string;
  orderTime: string;
  orderTimestamp: number;
  totalAmount: number;
  terms: string;
  limitMax: number;
  limitRemaining: number;
  geofenceValid: boolean;
  geofenceCoords: string;
  npwp: string;
  status: 'PENDING' | 'APPROVED' | 'DISPATCHED' | 'REJECTED';
  syncStatus: 'SYNCED_DEDUCTED' | 'PENDING_WAREHOUSE' | 'OFFLINE_QUEUED';
  priority: 'High' | 'Normal';
  items: OrderItem[];
  stockWarning?: string;
}

export interface SupplierPO {
  id: string;
  sku: string;
  productName: string;
  vendorName: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  leadTimeDays: number;
  expectedDate: string;
  status: 'TERKIRIM' | 'DALAM_PRODUKSI' | 'DITERIMA';
  createdAt: string;
}

export interface SalesVisit {
  id: string;
  outletId: string;
  outletName: string;
  salesRep: string;
  scheduledDate: string;
  purpose: 'Kunjungan Rutin' | 'Penagihan Tempo' | 'Promosi Bundling' | 'Follow Up At-Risk';
  notes: string;
  status: 'TERJADWAL' | 'SELESAI';
}

export interface DriverManifest {
  driverName: string;
  vehiclePlate: string;
  routeArea: string;
  wave: string;
  totalOutlets: number;
  orders: {
    orderId: string;
    outletName: string;
    address: string;
    amount: number;
    delivered: boolean;
    deliveredTime?: string;
  }[];
}
