export interface InvoiceItem {
  desc: string;
  price: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';
  items: InvoiceItem[];
}

export interface Transaction {
  id: string;
  invoiceId: string;
  type: 'Payment' | 'Refund';
  amount: number;
  method: 'Credit Card' | 'Insurance' | 'Cash';
  date: string;
}

export interface BillingStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  monthlyRevenue: { month: string; revenue: number }[];
  invoiceCount: number;
  paidCount: number;
}

export async function getInvoices() {
  const response = await fetch('/api/billing/invoices');
  if (!response.ok) throw new Error('Failed to fetch invoices');
  return response.json() as Promise<Invoice[]>;
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'date' | 'status'>) {
  const response = await fetch('/api/billing/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });
  if (!response.ok) throw new Error('Failed to create invoice');
  return response.json() as Promise<Invoice>;
}

export async function payInvoice(id: string, method: string) {
  const response = await fetch(`/api/billing/invoices/${id}/pay`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method }),
  });
  if (!response.ok) throw new Error('Failed to process payment');
  return response.json() as Promise<{ invoice: Invoice; transaction: Transaction }>;
}

export async function getTransactions() {
  const response = await fetch('/api/billing/transactions');
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json() as Promise<Transaction[]>;
}

export async function getBillingStats() {
  const response = await fetch('/api/billing/stats');
  if (!response.ok) throw new Error('Failed to fetch billing stats');
  return response.json() as Promise<BillingStats>;
}
