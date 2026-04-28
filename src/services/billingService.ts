export interface InvoiceItem {
  desc: string;
  price: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  discount: number;
  total: number;
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

export interface Claim {
  id: string;
  invoiceId: string;
  patientName: string;
  insuranceProvider: string;
  amount: number;
  status: 'Submitted' | 'Processing' | 'Approved' | 'Rejected';
  date: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

export interface BillingStats {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
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

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'date' | 'status' | 'total'>) {
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

export async function getClaims() {
  const response = await fetch('/api/billing/claims');
  if (!response.ok) throw new Error('Failed to fetch claims');
  return response.json() as Promise<Claim[]>;
}

export async function getExpenses() {
  const response = await fetch('/api/billing/expenses');
  if (!response.ok) throw new Error('Failed to fetch expenses');
  return response.json() as Promise<Expense[]>;
}

export async function createExpense(expense: Omit<Expense, 'id' | 'date'>) {
  const response = await fetch('/api/billing/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!response.ok) throw new Error('Failed to create expense');
  return response.json() as Promise<Expense>;
}

export async function getBillingStats() {
  const response = await fetch('/api/billing/stats');
  if (!response.ok) throw new Error('Failed to fetch billing stats');
  return response.json() as Promise<BillingStats>;
}
