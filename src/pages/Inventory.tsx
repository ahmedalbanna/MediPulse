import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, AlertTriangle, Truck, ShoppingCart, Plus, Search, Filter, MoreVertical, Edit2, Trash2, ArrowUpRight, Pill } from 'lucide-react';
import { inventoryService, Medication, Supplier } from '../services/inventoryService';

export default function Inventory() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [lowStock, setLowStock] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [meds, sups, low] = await Promise.all([
        inventoryService.getMedications(),
        inventoryService.getSuppliers(),
        inventoryService.getLowStock()
      ]);
      setMedications(meds);
      setSuppliers(sups);
      setLowStock(low);
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'إجمالي الأصناف', value: medications.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'أصناف منخفضة', value: lowStock.length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'الموردين النشطين', value: suppliers.length, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'طلبات الشراء', value: 12, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const filteredMeds = medications.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">إدارة المخزون والمستلزمات</h1>
          <p className="text-slate-500 mt-1 dark:text-slate-400">تتبع الأدوية، المستلزمات الطبية وأوامر الشراء</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Truck className="w-4 h-4 text-emerald-500" />
            إدارة الموردين
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25">
            <Plus className="w-4 h-4" />
            إضافة صنف جديد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} dark:bg-slate-800 transition-colors`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-[10px] bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full font-bold text-slate-400">هذا الشهر</div>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="البحث بالاسم أو كود الصنف..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-500">
              <Filter className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-400 px-2">ترتيب حسب:</span>
            <select className="text-xs font-bold text-slate-600 bg-transparent border-none focus:ring-0 cursor-pointer">
              <option>الاسم (أ-ي)</option>
              <option>الكمية الأقل</option>
              <option>تاريخ الصلاحية</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">الصنف</th>
                <th className="px-6 py-4">الكود</th>
                <th className="px-6 py-4">التصنيف</th>
                <th className="px-6 py-4">الكمية الحالية</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">الصلاحية</th>
                <th className="px-6 py-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredMeds.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Pill className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{med.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono font-medium text-slate-500">{med.code}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {med.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-black ${med.quantity <= med.minQuantity ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                      {med.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {med.quantity <= med.minQuantity ? (
                      <span className="flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        مخزون منخفض
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full w-fit">
                        متوفر
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{med.price} ريال</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{med.expiryDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-500 transition-colors shadow-sm border border-transparent hover:border-blue-100">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-500 transition-colors shadow-sm border border-transparent hover:border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
