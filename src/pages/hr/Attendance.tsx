import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Clock, LogIn, LogOut, CheckCircle2, AlertCircle, Calendar as CalendarIcon, User, Search, Filter, MoreVertical, RotateCcw } from 'lucide-react';
import { hrService, Attendance, Staff } from '../../services/hrService';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [attData, staffData] = await Promise.all([
        hrService.getAttendance(),
        hrService.getStaff()
      ]);
      setAttendance(attData);
      setStaff(staffData);
    } catch (error) {
      console.error('Failed to load attendance data:', error);
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

  return (
    <div className="p-8 pt-24 space-y-10 text-right animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20">
              <Clock className="w-8 h-8 text-white" />
            </div>
            إدارة الحضور والانصراف
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">متابعة دقيقة ومعالجة لحظية لسجلات حضور وانصراف الكوادر الطبية والإدارية عبر المنشأة.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-8 py-4 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-5 h-5" /> تصفية السجلات
          </button>
          <button className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95 shadow-xl">
            <LogIn className="w-5 h-5" />
            <span>تسجيل حضور يدوي</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'حاضرون الآن', val: '12', color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle2 },
          { label: 'تأخيرات مرصودة', val: '2', color: 'text-amber-500', bg: 'bg-amber-100', icon: Clock },
          { label: 'حالات غياب', val: '1', color: 'text-rose-500', bg: 'bg-rose-100', icon: AlertCircle },
          { label: 'في إجازة رسمية', val: '3', color: 'text-emerald-500', bg: 'bg-emerald-100', icon: CalendarIcon }
        ].map((stat, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            key={i} className="glass rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden group"
          >
            <div className={`p-4 ${stat.bg} dark:bg-slate-800/10 ${stat.color} rounded-2xl inline-flex mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pr-3 border-r-4 border-slate-200 dark:border-slate-700">{stat.label}</h3>
            <div className={`text-4xl font-black ${stat.color} font-mono tracking-wider`}>{stat.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Records Table */}
      <div className="glass rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/50 dark:bg-slate-950/50">
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20 dark:bg-slate-900/30">
          <div className="relative w-80">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="ابحث باسم الموظف..." className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none" />
          </div>
          <div className="flex items-center gap-4 text-md font-black text-slate-800 dark:text-white">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">سجل العمل اليومي</span>
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-6">الموظف</th>
                <th className="px-10 py-6">التاريخ</th>
                <th className="px-10 py-6">وقت الدخول</th>
                <th className="px-10 py-6">وقت الخروج</th>
                <th className="px-10 py-6">الحالة</th>
                <th className="px-10 py-6">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <RotateCcw className="w-10 h-10 text-blue-500 animate-spin" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">جاري مراجعة السجلات...</span>
                    </div>
                  </td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-24 text-center opacity-30">
                     <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                     <p className="text-lg font-black font-mono">سجل فارغ</p>
                  </td>
                </tr>
              ) : (
                attendance.map((entry, idx) => (
                  <motion.tr 
                    key={entry.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 group transition-colors"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:scale-110 transition-transform">
                          {getStaffName(entry.staffId).substring(0, 1)}
                        </div>
                        <div className="text-right">
                          <span className="font-black text-slate-800 dark:text-white block text-md">{getStaffName(entry.staffId)}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-widest">ID: {entry.staffId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 font-black text-slate-500 dark:text-slate-400 text-sm font-mono tracking-wider">
                      {entry.date}
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-emerald-600 font-black bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl text-sm tracking-widest font-mono border border-emerald-100 dark:border-emerald-800 shadow-sm">{entry.checkIn}</span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`font-black px-4 py-2 rounded-xl text-sm tracking-widest font-mono border shadow-sm ${entry.checkOut ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800' : 'text-slate-300 dark:text-slate-700 bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-white/5'}`}>
                        {entry.checkOut || '--:--'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-sm font-black text-emerald-600">
                        {entry.status}
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">عرض السجل الكامل</button>
                        <button className="p-2.5 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
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
