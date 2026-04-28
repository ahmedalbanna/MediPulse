import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, ChevronLeft, ChevronRight, MapPin, MoreVertical, CheckCircle2, Clock3, RotateCcw, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAppointments, addAppointment, Appointment } from '../services/appointmentService';
import { getPatients, Patient } from '../services/patientService';
import AppointmentModal from '../components/appointments/AppointmentModal';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptsData, patientsData] = await Promise.all([
        getAppointments(),
        getPatients(1, 100)
      ]);
      setAppointments(apptsData);
      setPatients(patientsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  const getDayAppointments = (day: number) => {
    const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.date === dayStr);
  };

  return (
    <div className="p-8 pt-24 space-y-10 text-right animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            جدولة المواعيد والتقويم
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">إدارة زيارات المرضى، الاستشارات الطبية الاحترافية، وتوزيع نوبات العمل بكفاءة عالية.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-5 h-5" /> جدولة زيارة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Calendar Main View */}
        <div className="xl:col-span-2 space-y-8">
          <div className="glass rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/20 dark:bg-slate-800/10">
              <div className="flex items-center gap-4">
                <button onClick={nextMonth} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="text-2xl font-black text-slate-900 dark:text-white min-w-[180px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                <button onClick={prevMonth} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <button onClick={() => setCurrentDate(new Date())} className="px-6 py-2.5 text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 transition-all">
                اليوم
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-7 gap-1 bg-slate-100 dark:bg-slate-800 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 text-center">
                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
                  <div key={day} className="bg-slate-50/50 dark:bg-slate-900/50 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: 42 }).map((_, i) => {
                  const dayNum = i - startOfMonth(currentDate) + 1;
                  const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth(currentDate);
                  const isToday = isCurrentMonth && 
                    dayNum === new Date().getDate() && 
                    currentDate.getMonth() === new Date().getMonth() && 
                    currentDate.getFullYear() === new Date().getFullYear();
                  
                  const dayApps = isCurrentMonth ? getDayAppointments(dayNum) : [];

                  return (
                    <div 
                      key={i} 
                      className={`min-h-[140px] bg-white dark:bg-slate-950 p-4 border-t border-slate-50 dark:border-slate-900 relative group transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/10 ${!isCurrentMonth ? 'bg-slate-50/10 dark:bg-slate-900/5 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`text-sm font-black mb-3 inline-flex items-center justify-center ${isToday ? 'bg-blue-600 text-white w-8 h-8 rounded-xl shadow-lg shadow-blue-500/20 scale-110' : (isCurrentMonth ? 'text-slate-800 dark:text-slate-200' : 'text-slate-200 dark:text-slate-800')}`}>
                        {isCurrentMonth ? dayNum : ''}
                      </div>
                      
                      <div className="space-y-1.5">
                        {dayApps.map((app, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            key={app.id} 
                            onClick={(e) => { e.stopPropagation(); setSelectedAppointment(app); }}
                            className={`text-[9px] font-black p-2 rounded-xl border shadow-sm truncate flex flex-col gap-1 hover:scale-[1.03] transition-all hover:shadow-md
                              ${app.status === 'Confirmed' ? 'bg-blue-50/50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50' : 'bg-amber-50/50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50'}
                            `}
                          >
                            <span className="opacity-70 font-mono tracking-widest">{app.time}</span>
                            <div className="truncate">{app.patientName}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Upcoming & Stats */}
        <div className="space-y-8">
          <div className="glass border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-xl">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3 border-r-4 border-amber-500 pr-3">
              <Clock3 className="w-5 h-5 text-amber-500" /> مواعيد اليوم
            </h3>
            
            <div className="space-y-6">
              {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length > 0 ? (
                appointments
                  .filter(a => a.date === new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((app, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                      key={app.id} 
                      onClick={() => setSelectedAppointment(app)}
                      className="cursor-pointer p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex items-start gap-6 group hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl hover:shadow-black/5 transition-all"
                    >
                      <div className="w-16 h-16 bg-white dark:bg-slate-950 rounded-2xl shadow-sm flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform">
                        <span className="text-md font-black">{app.time}</span>
                        <span className="text-[9px] font-black uppercase">{parseInt(app.time.split(':')[0]) >= 12 ? 'مساءً' : 'صباحاً'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-md font-black text-slate-800 dark:text-slate-100 truncate">{app.patientName}</h4>
                          <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                        </div>
                        <p className="text-xs text-slate-500 font-bold flex items-center gap-2 mt-1">
                          <User className="w-4 h-4" /> {app.doctor}
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black">{app.type === 'Consultation' ? 'استشارة' : app.type}</span>
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500"><CheckCircle2 className="w-4 h-4" /> {app.status === 'Confirmed' ? 'مؤكد' : app.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="py-20 text-center opacity-40">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-md font-black text-slate-500 uppercase tracking-widest">لا توجد مواعيد اليوم</p>
                </div>
              )}
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group"
          >
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            <h3 className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-6 border-r-4 border-white/30 pr-3">ملخص الأسبوع</h3>
            <div className="space-y-6 relative">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold opacity-80">إجمالي الزيارات</span>
                <span className="text-4xl font-black">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold opacity-80">تقدير الإيرادات</span>
                <span className="text-4xl font-black">12.4k$</span>
              </div>
              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-black">
                <span className="flex items-center gap-2 uppercase tracking-widest">نمو المرضى الجدد</span>
                <span className="bg-emerald-500 px-3 py-1 rounded-full flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden p-10 glass border border-white/10"
            >
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 border-r-8 border-blue-600 pr-5">جدولة موعد جديد</h2>
              <form onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); fetchData(); }} className="space-y-8 text-right">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-300 pr-3">اختيار المريض</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white">
                    <option value="">اختر مريضاً من القائمة...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-300 pr-3">التاريخ</label>
                    <input type="date" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-300 pr-3">الوقت</label>
                    <input type="time" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-slate-300 pr-3">نوع الزيارة</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['استشارة', 'متابعة', 'فحص دوري'].map(type => (
                      <button key={type} type="button" className="py-4 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-black text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all shadow-sm">
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl text-sm font-black hover:bg-slate-200 transition-all">
                    إلغاء
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all shadow-lg active:scale-95">
                    تأكيد الموعد
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AppointmentModal 
        appointment={selectedAppointment} 
        onClose={() => setSelectedAppointment(null)} 
      />
    </div>
  );
}
