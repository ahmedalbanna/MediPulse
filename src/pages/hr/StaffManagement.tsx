import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, Search, MoreVertical, Shield, Briefcase, Calendar, Filter, DollarSign, RotateCcw } from 'lucide-react';
import { getStaff, Staff } from '../../services/hrService';

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadStaff = useCallback(async () => {
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pt-24 space-y-10 text-right animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4 justify-end">
             إدارة الكادر والنبلاء
            <div className="p-3 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl shadow-purple-500/20">
              <Users className="w-8 h-8 text-white" />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl text-right ml-auto">إدارة شاملة لملفات الأطباء، طاقم التمريض، والموظفين الإداريين لضمان التميز المؤسسي.</p>
        </div>
        <button className="flex items-center gap-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95 shadow-xl">
          <UserPlus className="w-5 h-5" />
          <span>إضافة كادر جديد</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'إجمالي الموظفين', val: staff.length, color: 'text-blue-600', icon: Users, bg: 'bg-blue-50' },
          { label: 'الأطباء الاستشاريين', val: staff.filter(s => s.role === 'Doctor').length, color: 'text-emerald-600', icon: Shield, bg: 'bg-emerald-50' },
          { label: 'الكوادر الإدارية', val: staff.filter(s => s.role !== 'Doctor' && s.role !== 'Nurse').length, color: 'text-amber-600', icon: Briefcase, bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="glass rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-between group"
          >
             <div className="text-right">
              <div className="text-4xl font-black text-slate-900 dark:text-white font-mono mb-2">{stat.val}</div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest border-r-4 border-slate-200 dark:border-slate-700 pr-3">{stat.label}</div>
            </div>
            <div className={`w-16 h-16 ${stat.bg} dark:bg-slate-800/10 ${stat.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm`}>
              <stat.icon className="w-8 h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Staff Table */}
      <div className="glass rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/50 dark:bg-slate-950/50">
        <div className="px-10 py-10 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-6 items-center bg-slate-50/20 dark:bg-slate-900/30">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <button className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
              <Filter className="w-6 h-6" />
            </button>
            <div className="relative flex-1 md:w-96">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input 
                type="text"
                placeholder="ابحث عن موظف بالاسم أو الدور..."
                className="w-full pr-14 pl-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="font-black text-slate-900 dark:text-white text-xl border-r-8 border-indigo-600 pr-6">قاعدة بيانات الكوادر المركزية</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-6">البيانات الأساسية</th>
                <th className="px-10 py-6">المسمى الوظيفي</th>
                <th className="px-10 py-6">التخصص</th>
                <th className="px-10 py-6">تاريخ الانضمام</th>
                <th className="px-10 py-6">راتب الأساس</th>
                <th className="px-10 py-6">الوضعية الحالية</th>
                <th className="px-10 py-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-6">
                       <RotateCcw className="w-12 h-12 text-indigo-500 animate-spin" />
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">جاري استرجاع منظومة الكادر...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-10 py-24 text-center">
                     <Users className="w-16 h-16 mx-auto mb-6 text-slate-200 dark:text-slate-800" />
                     <p className="text-xl font-black text-slate-400">لم يتم العثور على سجلات مطابقة</p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((person, idx) => (
                  <motion.tr 
                    key={person.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg border border-indigo-100 dark:border-indigo-800 shadow-sm group-hover:scale-110 transition-transform">
                          {person.name.charAt(0)}
                        </div>
                        <div className="text-right">
                          <div className="font-black text-slate-900 dark:text-white text-md">{person.name}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">UID: {person.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-sm font-black text-slate-700 dark:text-slate-300">
                       <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">{person.role}</span>
                    </td>
                    <td className="px-10 py-8 text-sm font-bold text-slate-500 dark:text-slate-400">{person.specialization}</td>
                    <td className="px-10 py-8 text-sm text-slate-500 dark:text-slate-400 font-mono">
                      <div className="flex items-center gap-3 justify-end">
                        {person.joinDate}
                        <Calendar className="w-4 h-4 text-slate-300" />
                      </div>
                    </td>
                    <td className="px-10 py-8 text-md font-black text-slate-900 dark:text-white font-mono tracking-tighter">
                      <div className="flex items-center gap-1 justify-end">
                        ${person.salary.toLocaleString()}
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                        person.status === 'Active' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' 
                        : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 border-slate-100 dark:border-slate-800'
                      }`}>
                        {person.status === 'Active' ? 'نشط • ACTIVE' : 'غير نشط • INACTIVE'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <div className="flex items-center justify-center gap-2">
                        <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">الملف الكامل</button>
                        <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-300"><MoreVertical className="w-6 h-6" /></button>
                       </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
