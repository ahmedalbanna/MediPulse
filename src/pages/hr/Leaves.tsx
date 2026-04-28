import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Plus, Calendar, Clock, CheckCircle, XCircle, User, Info, Search, Filter, RotateCcw } from 'lucide-react';
import { getLeaves, getStaff, LeaveRequest, Staff } from '../../services/hrService';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [leaveData, staffData] = await Promise.all([
        getLeaves(),
        getStaff()
      ]);
      setLeaves(leaveData);
      setStaff(staffData);
    } catch (error) {
      console.error('Failed to load leaves:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || 'غير معروف';
  };

  const statusColors: Record<string, string> = {
    'Approved': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    'Rejected': 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
    'Completed': 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  };

  return (
    <div className="p-8 pt-24 space-y-10 text-right animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/20">
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
            الإجازات والطلبات الإدارية
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">معالجة طلبات الإجازات السنوية، المرضية، والاضطرارية وتنسيق الغيابات لضمان استمرارية العمل السريري.</p>
        </div>
        <button className="flex items-center gap-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-emerald-500/30 transition-all active:scale-95 shadow-xl">
          <Plus className="w-5 h-5" />
          <span>تقديم طلب إجازة جديد</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
        {[
          { label: 'بانتظار الموافقة', val: '4', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
          { label: 'طلبات تمت الموافقة عليها', val: '12', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle },
          { label: 'طلبات مرفوضة', val: '2', color: 'text-rose-600', bg: 'bg-rose-100', icon: XCircle }
        ].map((stat, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="glass rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-row-reverse items-center gap-8 group"
          >
            <div className={`w-16 h-16 ${stat.bg} dark:bg-slate-800/10 rounded-2xl flex items-center justify-center ${stat.color} shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-1 border-r-4 border-slate-200 dark:border-slate-700 pr-3">{stat.label}</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-wider">{stat.val}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Records Table */}
      <div className="glass rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/50 dark:bg-slate-950/50">
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20 dark:bg-slate-900/30">
          <div className="flex items-center gap-4">
             <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-blue-500 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <div className="relative w-80">
              <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="ابحث باسم الموظف..." className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none" />
            </div>
          </div>
          <div className="font-black text-slate-900 dark:text-white flex items-center gap-3 border-r-8 border-emerald-500 pr-5">
            سجل طلبات الإجازة الإلكتروني
            <ClipboardList className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-6">الموظف</th>
                <th className="px-10 py-6">نوع الإجازة</th>
                <th className="px-10 py-6">الفترة الزمنية</th>
                <th className="px-10 py-6">السبب المذكور</th>
                <th className="px-10 py-6">الحالة</th>
                <th className="px-10 py-6 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <RotateCcw className="w-10 h-10 text-emerald-500 animate-spin" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">جاري تدقيق الطلبات...</span>
                    </div>
                  </td>
                </tr>
              ) : leaves.map((leave, idx) => (
                <motion.tr 
                  key={leave.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 group transition-colors"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                        {getStaffName(leave.staffId).charAt(0)}
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-800 dark:text-white block">{getStaffName(leave.staffId)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-widest">ID: {leave.staffId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {leave.type}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-sm">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold font-mono tracking-wider">
                      <span>{leave.startDate} ← {leave.endDate}</span>
                      <Calendar className="w-4 h-4 text-slate-400" />
                    </div>
                  </td>
                  <td className="px-10 py-8 text-sm max-w-xs truncate font-bold text-slate-500 dark:text-slate-400">{leave.reason}</td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${statusColors[leave.status]}`}>
                      {leave.status === 'Approved' ? 'تمت الموافقة' : 
                       leave.status === 'Pending' ? 'قيد الانتظار' : 
                       leave.status === 'Rejected' ? 'مرفوض' : 'مكتمل'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <button className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all border border-slate-100 dark:border-slate-800">
                      <Info className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
