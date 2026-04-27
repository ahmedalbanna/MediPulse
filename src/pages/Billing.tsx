import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, TrendingUp, CreditCard, Clock, CheckCircle2, AlertCircle, Plus, Search, Filter, ArrowUpRight, ArrowDownRight, MoreVertical, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getInvoices, getBillingStats, payInvoice, getTransactions, createInvoice, Invoice, BillingStats, Transaction } from '../services/billingService';
import { getPatients, Patient } from '../services/patientService';

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'invoices' | 'transactions'>('invoices');
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invData, trxData, statsData, patientsData] = await Promise.all([
        getInvoices(),
        getTransactions(),
        getBillingStats(),
        getPatients(1, 100)
      ]);
      setInvoices(invData);
      setTransactions(trxData);
      setStats(statsData);
      setPatients(patientsData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id: string) => {
    setProcessingId(id);
    try {
      await payInvoice(id, 'Credit Card');
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-600" />
            Financial Operations
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage patient billing, process payments, and monitor revenue cycle.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 shadow-sm transition-all">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button 
            onClick={() => setShowAddInvoice(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</h3>
          <p className="text-2xl font-black text-slate-800">${stats?.totalRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 mt-2">
            <ArrowUpRight className="w-3 h-3" /> +12.5% from last month
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Awaiting</h3>
          <p className="text-2xl font-black text-slate-800">${stats?.pendingAmount.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-2">
            {stats?.paidCount} of {stats?.invoiceCount} invoices paid
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overdue Amount</h3>
          <p className="text-2xl font-black text-slate-800">${stats?.overdueAmount.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 mt-2">
            Requires immediate attention
          </div>
        </div>
        <div className="md:col-span-1 bg-emerald-900 rounded-3xl p-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <h3 className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-medium text-emerald-200">Collection Rate</span>
              <span className="text-xl font-bold">84.2%</span>
            </div>
            <div className="h-1.5 w-full bg-emerald-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[84%]"></div>
            </div>
            <p className="text-[9px] text-emerald-400">Target collection: 95% (+10.8% remaining)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Monthly Revenue Growth</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div> Revenue
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions Side List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
            Recent Payments
            <button className="text-blue-600 hover:underline">View All</button>
          </h3>
          <div className="space-y-4 flex-grow">
            {transactions.slice(0, 5).map(trx => (
              <div key={trx.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${trx.type === 'Payment' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {trx.type === 'Payment' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-slate-800 truncate">{trx.invoiceId}</p>
                    <p className="text-xs font-black text-slate-900">${trx.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 font-medium">{trx.method} • {new Date(trx.date).toLocaleDateString()}</p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Completed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Active Gateway</p>
                <p className="text-xs font-bold text-emerald-600">Mock Provider Connected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Tabs */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 pt-6 border-b border-slate-100">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setActiveTab('invoices')}
              className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'invoices' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Master Invoices
              {activeTab === 'invoices' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'transactions' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Transaction Log
              {activeTab === 'transactions' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'invoices' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID & Date</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Patient</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Date</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-800">{invoice.id}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{new Date(invoice.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-800">{invoice.patientName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">UID: {invoice.patientId}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-black text-slate-900">${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-600">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase border
                        ${invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          invoice.status === 'Pending' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          invoice.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' : 
                          'bg-slate-50 text-slate-600 border-slate-100'}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        {invoice.status !== 'Paid' && (
                          <button 
                            onClick={() => handlePay(invoice.id)}
                            disabled={processingId === invoice.id}
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50"
                          >
                            {processingId === invoice.id ? 'Processing...' : 'Collect Payment'}
                          </button>
                        )}
                        <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID & Date</th>
                  <th className="px-8 py-4 text-[10px) font-bold text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invoice Ref</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-800">{trx.id}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{new Date(trx.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight ${trx.type === 'Payment' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {trx.type}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-bold text-slate-600 uppercase">{trx.invoiceId}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" /> {trx.method}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-black text-slate-900">${trx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Invoice Modal */}
      <AnimatePresence>
        {showAddInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddInvoice(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-emerald-600" />
                Generate New Invoice
              </h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const selectedPatient = patients.find(p => p.id === formData.get('patientId'));
                
                await createInvoice({
                  patientId: formData.get('patientId') as string,
                  patientName: selectedPatient?.name || 'Unknown',
                  amount: parseFloat(formData.get('amount') as string),
                  dueDate: formData.get('dueDate') as string,
                  items: [{ desc: formData.get('desc') as string, price: parseFloat(formData.get('amount') as string) }]
                });
                
                setShowAddInvoice(false);
                fetchData();
              }} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Patient Selection</label>
                  <select name="patientId" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none">
                    <option value="">Select recipient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Service Category</label>
                    <input name="desc" placeholder="e.g. Consultation" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Grand Total ($)</label>
                    <input name="amount" type="number" step="0.01" min="0" placeholder="0.00" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Fulfillment Due Date</label>
                  <input name="dueDate" type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddInvoice(false)} className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95">
                    Generate Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
