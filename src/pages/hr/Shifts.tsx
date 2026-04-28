import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, Plus, Clock, MapPin, User, ChevronLeft, ChevronRight, Filter, Search, RotateCcw } from 'lucide-react';
import { getShifts, getStaff, Shift, Staff } from '../../services/hrService';

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [shiftData, staffData] = await Promise.all([
        getShifts(),
        getStaff()
      ]);
      setShifts(shiftData);
      setStaff(staffData);
    } catch (error) {
      console.error('Failed to load shifts:', error);
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

  const days = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
  const dayMapping: Record<number, string> = {
    0: 'Monday',
    1: 'Tuesday',
    2: 'Wednesday',
    3: 'Thursday',
    4: 'Friday',
    5: 'Saturday',
    6: 'Sunday'
  };

  return (
    <div className="p-8 pt-24 space-y-10 text-right animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
              <CalendarDays className="w-8 h-8 text-white" />
            </div>
            الجداول والمناوبات الطبية
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">تخطيط وتنسيق نوبات العمل للأطباء والكوادر المساندة لضمان التغطية السريرية المثلى على مدار الساعة.</p>
        </div>
        <button className="flex items-center gap-3 bg-linear-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95 shadow-xl">
          <Plus className="w-5 h-5" />
          <span>إضافة مناوبة جديدة</span>
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between glass p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl bg-white/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20">أسبوعي</button>
          <button className="px-6 py-2.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-black transition-all">شهري</button>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 border border-slate-100 dark:border-slate-800 transition-all"><ChevronRight className="w-6 h-6" /></button>
          <div className="font-black text-slate-900 dark:text-white text-lg font-mono tracking-wider">28 أبريل - 04 مايو 2024</div>
          <button className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 border border-slate-100 dark:border-slate-800 transition-all"><ChevronLeft className="w-6 h-6" /></button>
        </div>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        {days.map((day, idx) => (
          <div key={day} className="flex flex-col gap-6">
             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className={`p-5 text-center rounded-2xl font-black text-sm border shadow-sm ${idx === 0 ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20' : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800'}`}
            >
              {day}
            </motion.div>
            
            <div className="flex flex-col gap-4 min-h-[500px]">
              {loading ? (
                <div className="h-full flex items-center justify-center opacity-10">
                   <RotateCcw className="w-10 h-10 animate-spin" />
                </div>
              ) : (
                <>
                  {shifts.filter(s => s.day === dayMapping[idx]).map((shift, sIdx) => {
                    const isNight = parseInt(shift.startTime.split(':')[0]) >= 18 || parseInt(shift.startTime.split(':')[0]) < 6;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: sIdx * 0.1 }}
                        key={shift.id}
                        className={`glass p-5 rounded-[2rem] border-r-8 shadow-md hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden
                          ${isNight ? 'border-r-indigo-500 bg-slate-900/5 dark:bg-indigo-900/10' : 'border-r-blue-500 bg-white/50 dark:bg-slate-900/50'}
                        `}
                      >
                         <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform"></div>
                        <div className={`text-[10px] font-black mb-3 flex items-center gap-2 font-mono tracking-widest ${isNight ? 'text-indigo-600 dark:text-indigo-400' : 'text-blue-600 dark:text-blue-400'}`}>
                          <Clock className="w-4 h-4" />
                          {shift.startTime} - {shift.endTime}
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-right flex-1">
                            <div className="text-sm font-black text-slate-800 dark:text-slate-100 line-clamp-1">{getStaffName(shift.staffId)}</div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">المناوب المناوب</div>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-[12px] flex items-center justify-center font-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                            {getStaffName(shift.staffId).charAt(0)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold justify-end bg-slate-100/50 dark:bg-slate-800/30 p-2 rounded-xl border border-slate-100/50 dark:border-slate-800">
                          غرفة {shift.room}
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                      </motion.div>
                    );
                  })}
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-6 border-4 border-dashed border-slate-100 dark:border-slate-900 rounded-[2rem] text-slate-300 dark:text-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 hover:text-indigo-400 transition-all text-xs font-black uppercase tracking-[0.2em] flex flex-col items-center gap-2"
                  >
                    <Plus className="w-6 h-6" />
                    إضافة مناوبة
                  </motion.button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
