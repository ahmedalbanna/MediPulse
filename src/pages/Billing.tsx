import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, FileText, TrendingUp, CreditCard, Clock, CheckCircle2, AlertCircle, Plus, Search, Filter, ArrowUpRight, ArrowDownRight, MoreVertical, Download, RotateCcw, ShieldCheck, Receipt, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getInvoices, getBillingStats, payInvoice, getTransactions, createInvoice, getClaims, getExpenses, createExpense, Invoice, BillingStats, Transaction, Claim, Expense } from '../services/billingService';
import { getPatients, Patient } from '../services/patientService';

export default function Billing() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'invoices' | 'transactions' | 'claims' | 'expenses'>('invoices');
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [invData, trxData, claimsData, expData, statsData, patientsData] = await Promise.all([
        getInvoices(),
        getTransactions(),
        getClaims(),
        getExpenses(),
        getBillingStats(),
        getPatients(1, 100)
      ]);
      setInvoices(invData);
      setTransactions(trxData);
      setClaims(claimsData);
      setExpenses(expData);
      setStats(statsData);
      setPatients(patientsData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-6">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black tracking-widest text-[10px] uppercase">جاري تحميل البيانات المالية...</p>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 space-y-10 text-right animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/20">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            العمليات المالية والفواتير
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">إدارة فواتير المرضى، معالجة الدفعات، ومراقبة دورة الإيرادات والأداء المالي للمنشأة.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-8 py-4 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-5 h-5" /> تصدير التقرير
          </button>
          <button 
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-8 py-4 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowDownRight className="w-5 h-5 text-red-500" /> إضافة مصروفات
          </button>
          <button 
            onClick={() => setShowAddInvoice(true)}
            className="flex items-center gap-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-emerald-500/30 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> فاتورة جديدة
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform"></div>
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <TrendingUp className="w-7 h-7" />
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-r-4 border-emerald-500 pr-3">صافي الربح</h3>
          <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">${stats?.netIncome.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 mt-4">
            <ArrowUpRight className="w-4 h-4" /> العائد المالي الفعلي
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-r-4 border-blue-500 pr-3">مبالغ قيد الانتظار</h3>
          <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">${stats?.pendingAmount.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 mt-4">
            تم دفع {stats?.paidCount} من أصل {stats?.invoiceCount} فاتورة
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <ArrowDownRight className="w-7 h-7" />
          </div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-r-4 border-red-500 pr-3">إجمالي المصروفات</h3>
          <p className="text-3xl font-black text-red-600 dark:text-red-400 font-mono">${stats?.totalExpenses.toLocaleString()}</p>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 mt-4">
            تكاليف التشغيل والمشتريات
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-linear-to-br from-emerald-900 to-teal-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform pointer-events-none"></div>
          <h3 className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-6 border-r-4 border-emerald-400 pr-3">كفاءة التحصيل</h3>
          <div className="space-y-6 relative">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-emerald-200">معدل التحصيل الكلي</span>
              <span className="text-4xl font-black">84.2%</span>
            </div>
            <div className="h-3 w-full bg-emerald-950/50 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-linear-to-r from-emerald-500 to-teal-400 w-[84%] shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold tracking-widest">المستهدف: 95% (تبقي +10.8%)</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white border-r-8 border-emerald-500 pr-5">نمو الإيرادات الشهرية</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20"></div> الإيرادات المحققة
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} tickFormatter={(value) => `$${value}`} dx={-15} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ fontWeight: '900', color: '#10b981' }}
                  labelStyle={{ fontWeight: '900', color: '#64748b', marginBottom: '8px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="glass rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center justify-between border-r-4 border-blue-500 pr-3">
            آخر الدفعات المستلمة
            <button className="text-blue-500 hover:underline">عرض الكل</button>
          </h3>
          <div className="space-y-6 flex-grow">
            {transactions.slice(0, 6).map((trx, idx) => (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                key={trx.id} className="flex items-center gap-6 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-[2rem] transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${trx.type === 'Payment' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                  {trx.type === 'Payment' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{trx.invoiceId}</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white font-mono">${trx.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 font-bold">{trx.method} • {new Date(trx.date).toLocaleDateString('ar-EG')}</p>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">مكتمل</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-[1.5rem] p-6 flex items-center gap-4 border border-emerald-100 dark:border-emerald-900/30">
              <CreditCard className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest mb-1">بوابة الدفع النشطة</p>
                <p className="text-xs font-black text-emerald-600">MediPay Secure Gateway v1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Tabs */}
      <div className="glass rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl bg-white/50 dark:bg-slate-950/50">
        <div className="px-10 pt-10 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-12">
            <button 
              onClick={() => setActiveTab('invoices')}
              className={`pb-6 text-md font-black transition-all relative ${activeTab === 'invoices' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              سجل الفواتير الرئيسية
              {activeTab === 'invoices' && <motion.div layoutId="tab-underline-billing" className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-600 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`pb-6 text-md font-black transition-all relative ${activeTab === 'transactions' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              سجل الحركات المالية (Log)
              {activeTab === 'transactions' && <motion.div layoutId="tab-underline-billing" className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-600 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('claims')}
              className={`pb-6 text-md font-black transition-all relative ${activeTab === 'claims' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              مطالبات التأمين
              {activeTab === 'claims' && <motion.div layoutId="tab-underline-billing" className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-600 rounded-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('expenses')}
              className={`pb-6 text-md font-black transition-all relative ${activeTab === 'expenses' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              المصروفات التشغيلية
              {activeTab === 'expenses' && <motion.div layoutId="tab-underline-billing" className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-600 rounded-full" />}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {activeTab === 'invoices' && (
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المعرف والتاريخ</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المريض / العميل</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ الصافي</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الخصم</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الاستحقاق</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono tracking-wider">{invoice.id}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase mt-1">{new Date(invoice.date).toLocaleDateString('ar-EG')}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-slate-800 dark:text-slate-100">{invoice.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-bold mt-1">UID: {invoice.patientId}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-lg font-black text-slate-900 dark:text-white font-mono">${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-xs font-black text-red-500 font-mono">-${invoice.discount.toLocaleString()}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-xs font-black text-slate-600 dark:text-slate-400">{new Date(invoice.dueDate).toLocaleDateString('ar-EG')}</div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border
                        ${invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50' : 
                          invoice.status === 'Pending' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50' : 
                          invoice.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50' : 
                          'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}
                      >
                        {invoice.status === 'Paid' ? 'مدفوعة' : invoice.status === 'Pending' ? 'معلقة' : invoice.status === 'Overdue' ? 'متأخرة' : invoice.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        {invoice.status !== 'Paid' && (
                          <button 
                            onClick={() => handlePay(invoice.id)}
                            disabled={processingId === invoice.id}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 active:scale-95"
                          >
                            {processingId === invoice.id ? <RotateCcw className="w-4 h-4 animate-spin" /> : 'تحصيل المبلع'}
                          </button>
                        )}
                        <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-xl transition-all border border-slate-100 dark:border-slate-800">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'transactions' && (
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المعرف والتاريخ</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع العملية</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">مرجع الفاتورة</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">طريقة الدفع</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {transactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono tracking-wider">{trx.id}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase mt-1">{new Date(trx.date).toLocaleDateString('ar-EG')}</div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1 rounded text-[10px] font-black uppercase tracking-widest ${trx.type === 'Payment' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {trx.type === 'Payment' ? 'دفعة مستلمة' : 'مسترد'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-slate-600 dark:text-slate-400 uppercase font-mono">{trx.invoiceId}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                        <CreditCard className="w-5 h-5 text-slate-400" /> {trx.method}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-lg font-black text-slate-900 dark:text-white font-mono">${trx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                        <CheckCircle2 className="w-5 h-5" /> تمت التسوية
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'claims' && (
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المعرف والتاريخ</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المريض</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">شركة التأمين</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {claims.map(claim => (
                  <tr key={claim.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono tracking-wider">{claim.id}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase mt-1">{new Date(claim.date).toLocaleDateString('ar-EG')}</div>
                    </td>
                    <td className="px-10 py-8 text-sm font-black text-slate-800 dark:text-slate-100">{claim.patientName}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" /> {claim.insuranceProvider}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-lg font-black font-mono text-slate-900 dark:text-white">${claim.amount.toLocaleString()}</td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border
                        ${claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          claim.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          claim.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                          'bg-slate-50 text-slate-600 border-slate-100'}`}
                      >
                        {claim.status === 'Approved' ? 'مقبولة' : claim.status === 'Processing' ? 'قيد المعالجة' : claim.status === 'Rejected' ? 'مرفوضة' : 'محفوظة'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'expenses' && (
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المعرف والتاريخ</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الفئة</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الوصف</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">المبلغ</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                {expenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono tracking-wider">{expense.id}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase mt-1">{new Date(expense.date).toLocaleDateString('ar-EG')}</div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">{expense.category}</span>
                    </td>
                    <td className="px-10 py-8 text-sm font-bold text-slate-700 dark:text-slate-300">{expense.description}</td>
                    <td className="px-10 py-8 text-lg font-black font-mono text-red-500">-${expense.amount.toLocaleString()}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                        {expense.status === 'Paid' ? (
                          <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> مدفوع</span>
                        ) : (
                          <span className="text-amber-500 flex items-center gap-1"><Clock className="w-4 h-4" /> معلق</span>
                        )}
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddInvoice(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden p-10 glass border border-white/10"
            >
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4 border-r-8 border-emerald-600 pr-5">
                <FileText className="w-8 h-8 text-emerald-600" />
                إنشاء فاتورة جديدة
              </h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const selectedPatient = patients.find(p => p.id === formData.get('patientId'));
                
                await createInvoice({
                  patientId: formData.get('patientId') as string,
                  patientName: selectedPatient?.name || 'Unknown',
                  amount: parseFloat(formData.get('amount') as string),
                  discount: parseFloat(formData.get('discount') as string) || 0,
                  dueDate: formData.get('dueDate') as string,
                  items: [{ desc: formData.get('desc') as string, price: parseFloat(formData.get('amount') as string) }]
                });
                
                setShowAddInvoice(false);
                fetchData();
              }} className="space-y-8 text-right">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-200 pr-3">اختيار المستلم (المريض)</label>
                  <select name="patientId" required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none dark:text-white">
                    <option value="">اختر المريض...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-200 pr-3">فئة الخدمة</label>
                    <input name="desc" placeholder="مثال: استشارة طبية" required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-200 pr-3">المبلغ الإجمالي ($)</label>
                    <input name="amount" type="number" step="0.01" min="0" placeholder="0.00" required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-200 pr-3">مبلغ الخصم ($)</label>
                    <input name="discount" type="number" step="0.01" min="0" placeholder="0.00" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-200 pr-3">تاريخ استحقاق السداد</label>
                    <input name="dueDate" type="date" required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none dark:text-white" />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowAddInvoice(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-[1.5rem] text-sm font-black hover:bg-slate-200 transition-all">
                    إلغاء
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-[1.5rem] text-sm font-black hover:shadow-2xl hover:shadow-emerald-500/30 transition-all shadow-xl active:scale-95">
                    إصدار الفاتورة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddExpense(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden p-10 glass border border-white/10"
            >
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4 border-r-8 border-red-600 pr-5">
                <Receipt className="w-8 h-8 text-red-600" />
                تسجيل مصروفات جديدة
              </h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                await createExpense({
                  category: formData.get('category') as string,
                  description: formData.get('description') as string,
                  amount: parseFloat(formData.get('amount') as string),
                  status: formData.get('status') as 'Paid' | 'Pending'
                });
                
                setShowAddExpense(false);
                fetchData();
              }} className="space-y-8 text-right">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-200 pr-3">الفئة التصنيفية</label>
                  <select name="category" required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none dark:text-white">
                    <option value="Supplies">مستلزمات طبية</option>
                    <option value="Utility">فواتير (كهرباء/ماء)</option>
                    <option value="Maintenance">صيانة دورية</option>
                    <option value="Salaries">رواتب وأجور</option>
                    <option value="Other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-200 pr-3">وصف المصروفات</label>
                  <input name="description" placeholder="مثال: شراء شاش ومعقمات" required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none dark:text-white" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-200 pr-3">المبلغ ($)</label>
                    <input name="amount" type="number" step="0.01" min="0" placeholder="0.00" required className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-200 pr-3">حالة السداد</label>
                    <select name="status" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none dark:text-white">
                      <option value="Paid">تم الدفع</option>
                      <option value="Pending">قيد الانتظار</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowAddExpense(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-[1.5rem] text-sm font-black hover:bg-slate-200 transition-all">
                    إلغاء
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-linear-to-r from-red-600 to-rose-600 text-white rounded-[1.5rem] text-sm font-black hover:shadow-2xl hover:shadow-red-500/30 transition-all shadow-xl active:scale-95">
                    حفظ المصروفات
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
