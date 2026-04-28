import { Package, Truck, ShoppingCart, Pill } from 'lucide-react';

export interface Medication {
  id: string;
  name: string;
  code: string;
  category: string;
  type: 'Pill' | 'Syrup' | 'Injection' | 'Other';
  quantity: number;
  minQuantity: number;
  price: number;
  expiryDate: string;
  supplierId: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  items: { medicationId: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'Pending' | 'Ordered' | 'Received' | 'Cancelled';
  orderDate: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  items: { medicationId: string; dosage: string; quantity: number; status: 'Pending' | 'Dispensed' }[];
  status: 'Pending' | 'Partial' | 'Completed';
}

const medications: Medication[] = [
  { id: '1', name: 'أوميبرازول 20 ملغ', code: 'OMP-020', category: 'معدي ومعوي', type: 'Pill', quantity: 15, minQuantity: 20, price: 45, expiryDate: '2026-12-01', supplierId: 's1' },
  { id: '2', name: 'باراسيتامول 500 ملغ', code: 'PCM-500', category: 'مسكنات', type: 'Pill', quantity: 500, minQuantity: 100, price: 12, expiryDate: '2027-05-15', supplierId: 's2' },
  { id: '3', name: 'أموكسيسيلين 500 ملغ', code: 'AMX-500', category: 'مضاد حيوي', type: 'Pill', quantity: 24, minQuantity: 50, price: 85, expiryDate: '2026-08-20', supplierId: 's1' },
];

const suppliers: Supplier[] = [
  { id: 's1', name: 'شركة الحياة للأدوية', contactName: 'أحمد علي', phone: '+966 50 123 4567', email: 'ahmad@alhayat.com', address: 'الرياض، السعودية', category: 'أدوية' },
  { id: 's2', name: 'مؤسسة رعاية المستلزمات', contactName: 'سارة محمد', phone: '+966 50 987 6543', email: 'sara@care.com', address: 'جدة، السعودية', category: 'مستلزمات' },
];

export const inventoryService = {
  getMedications: async (): Promise<Medication[]> => {
    const res = await fetch('/api/inventory/medications');
    return res.json();
  },
  getSuppliers: async (): Promise<Supplier[]> => {
    const res = await fetch('/api/inventory/suppliers');
    return res.json();
  },
  getLowStock: async (): Promise<Medication[]> => {
    const meds = await inventoryService.getMedications();
    return meds.filter(m => m.quantity <= m.minQuantity);
  },
  getMedicationById: async (id: string): Promise<Medication | undefined> => {
    const meds = await inventoryService.getMedications();
    return meds.find(m => m.id === id);
  },
};
