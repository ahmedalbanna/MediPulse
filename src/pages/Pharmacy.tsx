import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Pill, Search, Filter, CheckCircle, Clock, ArrowRight, User, Stethoscope, Printer, ExternalLink, Activity, ShoppingCart } from 'lucide-react';
import { pharmacyService } from '../services/pharmacyService';
import { Prescription, Medication, inventoryService } from '../services/inventoryService';

export default function Pharmacy() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [p, m] = await Promise.all([
        pharmacyService.getPrescriptions(),
        inventoryService.getMedications()
      ]);
      setPrescriptions(p);
      setMedications(m);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getMedName = (id: string) => medications.find(m => m.id === id)?.name || 'جاري التحميل...';

  const handleDispense = async (id: string) => {
    try {
      await pharmacyService.dispensePrescription(id);
      // Refresh data
      const [p, m] = await Promise.all([
        pharmacyService.getPrescriptions(),
        inventoryService.getMedications()
      ]);
      setPrescriptions(p);
      setMedications(m);
    } catch (error) {
      console.error("Dispensing failed", error);
    }
  };

  const stats = [
    { label: 'وصفات قيد الانتظار', value: prescriptions.filter(p => p.status === 'Pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'وصفات تم صرفها اليوم', value: prescriptions.filter(p => p.status === 'Completed').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'طلبات عاجلة', value: 0, icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">نافذة الصيدلية</h1>
          <p className="text-slate-500 mt-1 dark:text-slate-400">إدارة صرف الوصفات الطبية والمراجعة الدوائية</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Printer className="w-4 h-4 text-slate-400" />
            طباعة التقارير
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg} dark:bg-slate-800`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              الوصفات الطبية الواردة
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="بحث عن مريض..." 
                  className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {prescriptions.map((p) => (
              <motion.div
                key={p.id}
                layoutId={p.id}
                className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border ${p.status === 'Pending' ? 'border-amber-100 dark:border-amber-900/30' : 'border-slate-100 dark:border-slate-800'} shadow-sm hover:shadow-md transition-all group`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                      <User className={`w-6 h-6 ${p.status === 'Pending' ? 'text-amber-600' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">أحمد المرزوقي</h3>
                        <span className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">#P-8822</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" />
                          د. سارة خالد
                        </span>
                        <span className="text-sm font-bold text-slate-400 flex items-center gap-1 italic">
                          <Clock className="w-3.5 h-3.5" />
                          منذ 15 دقيقة
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    {p.status === 'Pending' ? (
                      <button 
                        onClick={() => handleDispense(p.id)}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                      >
                        صرف الوصفة الآن
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl font-bold flex items-center gap-2 border border-emerald-100 dark:border-emerald-800">
                        <CheckCircle className="w-4 h-4" />
                        تم صرف الأدوية
                      </span>
                    )}
                    <button className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl text-slate-400 border border-transparent hover:border-slate-100">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {p.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                        <Pill className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-black text-slate-800 dark:text-slate-200">{getMedName(item.medicationId)}</div>
                        <div className="text-[10px] font-bold text-slate-500">{item.dosage}</div>
                      </div>
                      <div className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">x{item.quantity}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-linear-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">هل تحتاج للمساعدة بالوصفات؟</h3>
              <p className="text-blue-100 text-sm font-bold mb-6">استخدم المساعد الذكي للتحقق من التداخلات الدوائية أو البحث عن بدائل متوفرة في المخزون.</p>
              <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                تفعيل التحقق الذكي
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">تنبيهات الأصناف المنخفضة</h3>
            <div className="space-y-4">
              {medications.filter(m => m.quantity <= m.minQuantity).map(med => (
                <div key={med.id} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{med.name}</div>
                    <div className="text-xs font-bold text-red-500">متبقي {med.quantity} وحدة فقط</div>
                  </div>
                  <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {medications.filter(m => m.quantity <= m.minQuantity).length === 0 && (
                <div className="text-center py-4 text-slate-400 text-sm font-bold">كل الأصناف متوفرة بكثرة</div>
              )}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs font-black hover:border-blue-500 hover:text-blue-500 transition-all leading-none">
              تقديم طلب شراء مجمع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
