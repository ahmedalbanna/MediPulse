import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, ChevronLeft, ChevronRight, MapPin, MoreVertical, CheckCircle2, Clock3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAppointments, addAppointment, Appointment } from '../services/appointmentService';
import { getPatients, Patient } from '../services/patientService';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptsData, patientsData] = await Promise.all([
        getAppointments(),
        getPatients(1, 100) // Get many patients for the dropdown
      ]);
      setAppointments(apptsData);
      setPatients(patientsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDayAppointments = (day: number) => {
    const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.date === dayStr);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-600" />
            Scheduling & Calendar
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage patient visits, professional consultations, and staff shifts.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" /> Schedule Visit
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Calendar Main View */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden card-shadow">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h2 className="text-xl font-bold text-slate-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                  <ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>
                <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                  Today
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-slate-50 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                      className={`min-h-[120px] bg-white p-2 border-t border-slate-50 relative group transition-colors hover:bg-slate-50/50 ${!isCurrentMonth ? 'bg-slate-50/30' : ''}`}
                    >
                      <span className={`text-xs font-bold ${isCurrentMonth ? (isToday ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-sm' : 'text-slate-700') : 'text-slate-300'}`}>
                        {isCurrentMonth ? dayNum : ''}
                      </span>
                      
                      <div className="mt-2 space-y-1">
                        {dayApps.map(app => (
                          <div 
                            key={app.id} 
                            className={`text-[9px] font-bold p-1 rounded border shadow-sm truncate flex flex-col gap-0.5
                              ${app.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'}
                            `}
                          >
                            <span className="opacity-70 text-[8px] uppercase tracking-tighter">{app.time}</span>
                            {app.patientName}
                          </div>
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
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 card-shadow">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock3 className="w-3 h-3" /> Upcoming Today
            </h3>
            
            <div className="space-y-4">
              {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length > 0 ? (
                appointments
                  .filter(a => a.date === new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(app => (
                    <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4 group hover:bg-white hover:shadow-lg transition-all">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center text-blue-600">
                        <span className="text-xs font-bold">{app.time}</span>
                        <span className="text-[8px] font-bold uppercase">AM</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-800">{app.patientName}</h4>
                          <button className="text-slate-300 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" /> {app.doctor}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[9px] font-bold">{app.type}</span>
                          <span className="flex items-center gap-1 text-[9px] font-bold text-green-500"><CheckCircle2 className="w-3 h-3" /> {app.status}</span>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No appointments for today</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            <h3 className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-4">Weekly Summary</h3>
            <div className="space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Visits</span>
                <span className="text-2xl font-bold">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Revenue Est.</span>
                <span className="text-2xl font-bold">$12.4k</span>
              </div>
              <div className="pt-4 border-t border-blue-500/30 flex items-center justify-between text-[11px] font-bold">
                <span>NEW PATIENTS</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full">+12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Schedule New Appointment</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                // Basic mock submission for now
                setShowAddModal(false);
                fetchData();
              }} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Patient Selection</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
                    <option value="">Select a patient...</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Date</label>
                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Time</label>
                    <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Visit Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Consultation', 'Follow-up', 'Examination'].map(type => (
                      <button key={type} type="button" className="py-2.5 px-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all">
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                    Confirm Visit
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
