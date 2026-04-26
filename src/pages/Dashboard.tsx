import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, Mic, Package, CheckCircle, 
  ListTodo, CalendarDays, History, ExternalLink, 
  User, Clock, ArrowUpRight, ChevronRight,
  Stethoscope, ClipboardList, Brain, Pill
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { getAppointments, Appointment } from '../services/appointmentService';
import { getPatients, Patient } from '../services/patientService';
import { getMedicalRecords, MedicalRecord } from '../services/recordService';

const kpis = [
  { label: 'Total Patients', value: '12,482', change: '+4.2% from last month', changeColor: 'text-green-600', icon: User },
  { label: 'Appointments Today', value: '32', change: 'Scheduled for Today', changeColor: 'text-blue-600', icon: CalendarDays },
  { label: 'ICU Capacity', value: '88%', change: '4 Beds remaining', changeColor: 'text-amber-600', icon: Stethoscope },
  { label: 'Revenue (MTD)', value: '$4.2M', change: 'On track for target', changeColor: 'text-green-600', icon: Activity },
];

const inventory = [
  { name: 'Insulin (Humulin)', status: 'LOW', color: 'bg-red-100 text-red-700' },
  { name: 'Surgical Gloves (L)', status: 'REQ', color: 'bg-amber-100 text-amber-700' },
  { name: 'Amoxicillin 500mg', status: 'OK', color: 'bg-green-100 text-green-700' },
];

const mockTasks = [
  { id: 1, title: 'Review Lab Results: J. Wilson', priority: 'High', due: '14:00', completed: false },
  { id: 2, title: 'Sign Discharge for Emily B.', priority: 'Medium', due: '15:30', completed: false },
  { id: 3, title: 'Patient Follow-up Call: Emma T.', priority: 'Low', due: '16:00', completed: true },
  { id: 4, title: 'Update Cardiology Records', priority: 'Medium', due: 'End of Day', completed: false },
];

const quickLinks = [
  { label: 'Register Patient', icon: User, path: '/patients', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { label: 'Medical Records', icon: ClipboardList, path: '/records', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { label: 'AI Diagnostic Dash', icon: Brain, path: '/ai-diagnostics', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { label: 'Pharmacy View', icon: Pill, path: '/records', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
];

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appData, patData, recData] = await Promise.all([
          getAppointments(),
          getPatients(1, 5),
          getMedicalRecords()
        ]);
        setAppointments(appData);
        setPatients(patData.data || []);
        setRecords(recData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-8 pt-24 space-y-8 max-w-[1600px] mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Clinical Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, Dr. Sarah Wilson. Here's your shift overview.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={kpi.label}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-blue-200 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</div>
              <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                <kpi.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-800">{kpi.label === 'Appointments Today' ? appointments.length : kpi.value}</div>
            <div className={`mt-2 text-[10px] font-bold flex items-center gap-1 ${kpi.changeColor}`}>
              <ArrowUpRight className="w-3 h-3" />
              {kpi.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: AI Monitoring & Appointments */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Monitoring (Expanded) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full lg:h-auto">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <div>
                <h3 className="font-extrabold text-slate-800 flex items-center gap-3">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  AI Clinical Insights
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">Real-time patient risk analysis engine active.</p>
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg uppercase border border-indigo-100 tracking-tighter shadow-sm">
                Live Engine v4.2.1
              </span>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-red-50/40 border border-red-100/50 transition-all hover:border-red-200 shadow-sm relative group">
                <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded shadow-lg animate-bounce uppercase">Priority 1</div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black text-red-600 flex items-center gap-1.5 uppercase tracking-tight">
                    <AlertTriangle className="w-4 h-4" /> Critical Vitals Alert
                  </span>
                  <span className="text-[10px] text-red-400 font-mono font-bold bg-white px-2 py-0.5 rounded border border-red-100 shadow-sm transition-all group-hover:scale-110">#ROOM-402</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 bg-white rounded-2xl border-2 border-red-500 flex items-center justify-center font-black text-red-600 text-xl shadow-md">
                      84
                    </div>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-800">Maria Thompson</div>
                    <div className="text-xs font-medium text-slate-500 leading-tight mt-1 truncate max-w-[180px]">Abnormal tachycardia detected via primary monitor</div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black py-3 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95 uppercase tracking-wider">
                    Dispatch Team
                  </button>
                  <button className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-black py-3 rounded-xl transition-all active:scale-95 uppercase tracking-wider">
                    Full Profile
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm border-dashed">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black text-indigo-600 flex items-center gap-1.5 uppercase tracking-tight">
                    <Mic className="w-4 h-4" /> Live Transcription
                  </span>
                  <div className="flex gap-1">
                    <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 h-3 bg-indigo-400" />
                    <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-0.5 h-3 bg-indigo-400" />
                    <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-0.5 h-3 bg-indigo-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '75%' }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    />
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-slate-100 shadow-inner">
                    <p className="text-[11px] text-slate-600 italic font-medium leading-relaxed">
                      "Patient shows symptoms of minor fatigue after post-op recovery... adjusting medication dosage to 5mg..."
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Syncing Clinical Notes</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-100">88% Match</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments & Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2.5">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  Upcoming Visits
                </h3>
                <Link to="/appointments" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">See Schedule</Link>
              </div>
              <div className="space-y-4">
                {appointments.slice(0, 4).map((app, appIdx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: appIdx * 0.1 }}
                    key={app.id} 
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center shrink-0 border border-slate-100 group-hover:border-blue-200 transition-colors">
                      <span className="text-xs font-black text-slate-800 leading-none">{app.time.split(':')[0]}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{app.time.split(':')[1]} {parseInt(app.time.split(':')[0]) >= 12 ? 'PM' : 'AM'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{app.patientName}</div>
                      <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                         <span className="w-1 h-1 bg-blue-400 rounded-full" />
                         {app.type}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </motion.div>
                ))}
                {appointments.length === 0 && !loading && (
                  <div className="text-center py-8 text-slate-400 text-sm font-medium">No appointments scheduled for today.</div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2.5">
                  <History className="w-5 h-5 text-emerald-500" />
                  Recent Activity
                </h3>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                {records.slice(0, 4).map((rec, recIdx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: recIdx * 0.1 }}
                    key={rec.id} 
                    className="flex gap-4 relative"
                  >
                    <div className="w-[23px] h-[23px] rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 z-10">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{rec.type} Updated</div>
                      <div className="text-[10px] font-medium text-slate-500 mt-0.5">
                        {rec.patientName} • {new Date(rec.date).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tasks & Quick Actions */}
        <div className="space-y-8">
          
          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link to={link.path} key={link.label}>
                <motion.div 
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-2xl border ${link.color} flex flex-col justify-between aspect-square group shadow-sm`}
                >
                  <link.icon className="w-7 h-7 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest leading-tight opacity-70">Navigate</div>
                    <div className="text-xs font-black mt-1">{link.label}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h3 className="font-extrabold text-slate-800 flex items-center gap-2.5 mb-6">
              <ListTodo className="w-5 h-5 text-amber-500" />
              Clinical Tasks
            </h3>
            <div className="space-y-3">
              {mockTasks.map(task => (
                <div key={task.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                    ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}
                  >
                    {task.completed && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded
                        ${task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.due}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 shadow-xl shadow-slate-100 transition-all active:scale-[0.98]">
              Manage Worklist
            </button>
          </div>

          {/* Inventory Sidebar Widget (Original Enhanced) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h4 className="text-[11px] font-black text-slate-800 uppercase mb-6 flex items-center gap-3">
              <Package className="w-4 h-4 text-amber-500" /> Inventory Alerts
            </h4>
            <div className="space-y-5">
              {inventory.map((item) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div>
                    <div className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{item.name}</div>
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-0.5">Last restock: 2d ago</div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-lg font-black tracking-tighter ${item.color} shadow-sm`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-50 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-center gap-2">
              Order Clinical Supplies <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
