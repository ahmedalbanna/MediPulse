import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  CheckCircle2, 
  Clock3, 
  Search,
  Users,
  LayoutGrid,
  Filter,
  UserCheck,
  Stethoscope,
  AlertCircle,
  MoreVertical,
  Activity,
  ArrowRightLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAppointments, Appointment } from '../services/appointmentService';
import { getPatients, Patient } from '../services/patientService';
import { getStaff, Staff } from '../services/hrService';
import AppointmentModal from '../components/appointments/AppointmentModal';
import AddAppointmentModal from '../components/appointments/AddAppointmentModal';

type ViewMode = 'calendar' | 'queue' | 'schedule';

export default function Appointments() {
  const [viewMode, setViewMode] = useState<ViewMode>('queue');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptsData, patientsData, staffData] = await Promise.all([
        getAppointments(),
        getPatients(1, 100),
        getStaff()
      ]);
      setAppointments(apptsData);
      setPatients(patientsData.data);
      setStaff(staffData.filter(s => s.role === 'Doctor'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => 
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [appointments, searchQuery]);

  // Calendar Helpers
  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  return (
    <div className="p-8 pt-24 space-y-8 text-right animate-in fade-in duration-700 min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      {/* Header & Stats Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3.5 bg-linear-to-br from-blue-600 to-indigo-600 rounded-[1.25rem] shadow-xl shadow-blue-500/20">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">المواعيد والاستقبال</h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">نظام إدارة التدفق الطبي الذكي</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="البحث عن اسم المريض أو الطبيب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full xl:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pr-14 pl-6 text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95 shadow-lg"
          >
            <Plus className="w-5 h-5" /> حجز موعد جديد
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 w-fit shadow-sm">
        <button 
          onClick={() => setViewMode('calendar')}
          className={`px-8 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-3 ${viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <CalendarIcon className="w-4 h-4" /> التقويم الشهري
        </button>
        <button 
          onClick={() => setViewMode('queue')}
          className={`px-8 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-3 ${viewMode === 'queue' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <Activity className="w-4 h-4" /> قائمة الانتظار
        </button>
        <button 
          onClick={() => setViewMode('schedule')}
          className={`px-8 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-3 ${viewMode === 'schedule' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <Stethoscope className="w-4 h-4" /> جدول الأطباء
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: QUEUE MANAGEMENT */}
        {viewMode === 'queue' && (
          <motion.div 
            key="queue"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[
                { label: 'في الانتظار', count: filteredAppointments.filter(a => a.date === todayStr && a.status === 'Waiting').length, color: 'purple', icon: Clock3 },
                { label: 'قيد الاستشارة', count: filteredAppointments.filter(a => a.date === todayStr && a.status === 'In-Progress').length, color: 'cyan', icon: Activity },
                { label: 'بانتظار الحضور', count: filteredAppointments.filter(a => a.date === todayStr && (a.status === 'Confirmed' || a.status === 'Pending')).length, color: 'blue', icon: UserCheck },
                { label: 'مكتمل اليوم', count: filteredAppointments.filter(a => a.date === todayStr && a.status === 'Completed').length, color: 'emerald', icon: CheckCircle2 },
              ].map((stat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  key={stat.label}
                  className="glass border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex items-center gap-6 shadow-sm"
                >
                  <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl">
              <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <ArrowRightLeft className="w-6 h-6 text-blue-600" /> قائمة الانتظار الحالية لليوم
                </h3>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2 text-xs font-black px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                     المجموع: {filteredAppointments.filter(a => a.date === todayStr).length}
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">المريض</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">الطبيب / العيادة</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">التوقيت</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">الحالة</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-slate-800">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredAppointments.filter(a => a.date === todayStr).length > 0 ? (
                      filteredAppointments
                        .filter(a => a.date === todayStr)
                        .sort((a,b) => a.time.localeCompare(b.time))
                        .map((app, idx) => (
                          <motion.tr 
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                            key={app.id} 
                            className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-all cursor-pointer"
                            onClick={() => setSelectedAppointment(app)}
                          >
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-black border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                  {app.patientName[0]}
                                </div>
                                <div>
                                  <div className="text-md font-black text-slate-900 dark:text-white">{app.patientName}</div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase">ID: {app.patientId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <div className="text-sm font-black text-slate-700 dark:text-slate-300">{app.doctor}</div>
                              <div className="text-[10px] font-bold text-blue-500 flex items-center gap-1.5 mt-1">
                                <MapPin className="w-3.5 h-3.5" /> {app.room || 'Clinic A'}
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-200">
                                <Clock className="w-4 h-4 text-slate-400" /> {app.time}
                                <span className="text-[10px] text-slate-400 opacity-60">({app.duration} د)</span>
                              </div>
                            </td>
                            <td className="px-10 py-6">
                              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-2 border shadow-xs
                                ${app.status === 'Waiting' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                                  app.status === 'In-Progress' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                                  app.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  app.status === 'Checked-in' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                  'bg-slate-50 text-slate-500 border-slate-200'}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-10 py-6 text-left">
                              <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-lg transition-all active:scale-90">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-24 text-center">
                          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                             <Clock3 className="w-10 h-10 text-slate-400" />
                          </div>
                          <p className="text-xl font-black text-slate-400 tracking-widest">لا توجد مواعيد مجدولة اليوم</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: DOCTOR SCHEDULE */}
        {viewMode === 'schedule' && (
          <motion.div 
            key="schedule"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {staff.map((doctor, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                key={doctor.id}
                className="glass border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-lg group hover:shadow-2xl hover:shadow-blue-500/5 transition-all"
              >
                <div className="p-8 bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-blue-600 font-black text-2xl group-hover:scale-110 transition-transform">
                        {doctor.name[0]}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white">{doctor.name}</h4>
                        <p className="text-sm font-bold text-blue-500 mt-1">{doctor.specialization}</p>
                        <div className="flex items-center gap-2 mt-3 p-1.5 px-3 bg-blue-50 dark:bg-blue-900/30 rounded-full w-fit">
                           <MapPin className="w-3.5 h-3.5 text-blue-600" />
                           <span className="text-[10px] font-black text-blue-600 uppercase">العيادة رقم 4</span>
                        </div>
                      </div>
                   </div>
                </div>
                
                <div className="p-8 space-y-4">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3 mb-6">مواعيد اليوم</h5>
                  <div className="space-y-3">
                    {appointments.filter(a => a.doctor === doctor.name && a.date === todayStr).length > 0 ? (
                      appointments
                        .filter(a => a.doctor === doctor.name && a.date === todayStr)
                        .sort((a,b) => a.time.localeCompare(b.time))
                        .map(app => (
                          <div key={app.id} className="flex item-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                             <div className="flex items-center gap-4">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-black text-slate-800 dark:text-slate-200">{app.time}</span>
                             </div>
                             <span className="text-xs font-bold text-slate-500">{app.patientName}</span>
                          </div>
                        ))
                    ) : (
                      <div className="py-10 text-center opacity-30">
                        <AlertCircle className="w-8 h-8 mx-auto mb-3" />
                        <p className="text-xs font-black">لا توجد مواعيد مسجلة</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* VIEW 3: CLASSIC CALENDAR */}
        {viewMode === 'calendar' && (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            className="glass rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <button onClick={nextMonth} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500 hover:shadow-lg transition-all active:scale-90">
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="text-2xl font-black text-slate-900 dark:text-white min-w-[220px] text-center tracking-tight">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                <button onClick={prevMonth} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500 hover:shadow-lg transition-all active:scale-90">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
              <button 
                onClick={() => setCurrentDate(new Date())} 
                className="px-8 py-3.5 text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-100 transition-all active:scale-95 border border-blue-100 dark:border-blue-900/50"
              >
                العودة لليوم الحالي
              </button>
            </div>

            <div className="p-10">
              <div className="grid grid-cols-7 gap-3 mb-8">
                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
                  <div key={day} className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: 42 }).map((_, i) => {
                  const dayNum = i - startOfMonth(currentDate) + 1;
                  const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth(currentDate);
                  const isToday = isCurrentMonth && 
                    dayNum === new Date().getDate() && 
                    currentDate.getMonth() === new Date().getMonth() && 
                    currentDate.getFullYear() === new Date().getFullYear();
                  
                  const dayApps = isCurrentMonth ? appointments.filter(a => {
                    const d = new Date(a.date);
                    return d.getDate() === dayNum && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
                  }) : [];

                  return (
                    <div 
                      key={i} 
                      className={`min-h-[160px] rounded-3xl border transition-all p-4 group
                        ${isCurrentMonth ? 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-black/5 hover:scale-[1.02] cursor-pointer' : 'bg-transparent border-transparent opacity-20 cursor-default'}
                        ${isToday ? 'border-blue-500 ring-4 ring-blue-500/10' : ''}
                      `}
                    >
                      {isCurrentMonth && (
                        <div className="flex flex-col h-full">
                          <div className={`text-sm font-black mb-4 inline-flex items-center justify-center w-8 h-8 rounded-xl ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 dark:text-slate-600'}`}>
                            {dayNum}
                          </div>
                          
                          <div className="space-y-2 overflow-y-auto max-h-[100px] custom-scrollbar">
                            {dayApps.map((app, idx) => (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                                key={app.id} 
                                onClick={(e) => { e.stopPropagation(); setSelectedAppointment(app); }}
                                className="text-[9px] font-black p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 truncate hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                  <span className="text-slate-400 font-mono tracking-tighter uppercase">{app.time}</span>
                                </div>
                                <div className="text-slate-700 dark:text-slate-300 truncate">{app.patientName}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Details Modal */}
      <AppointmentModal 
        appointment={selectedAppointment} 
        onClose={() => setSelectedAppointment(null)} 
        onUpdate={fetchData}
      />

      <AddAppointmentModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchData}
        patients={patients}
        doctors={staff}
      />
    </div>
  );
}
