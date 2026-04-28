import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertTriangle, Mic, Package, CheckCircle, 
  ListTodo, CalendarDays, History, ExternalLink, 
  User, Clock, ArrowUpRight, ChevronRight,
  Stethoscope, ClipboardList, Brain, Pill, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { getAppointments, Appointment } from '../services/appointmentService';
import { getPatients, Patient } from '../services/patientService';
import { getMedicalRecords, MedicalRecord } from '../services/recordService';

const kpis = [
  { label: 'إجمالي المرضى', value: '12,482', change: '+4.2% من الشهر الماضي', changeColor: 'text-emerald-500', icon: User },
  { label: 'مواعيد اليوم', value: '32', change: 'تمت الجدولة بنجاح', changeColor: 'text-blue-500', icon: CalendarDays },
  { label: 'إشغال العناية', value: '88%', change: '4 أسرة متبقية', changeColor: 'text-amber-500', icon: Stethoscope },
  { label: 'الإيرادات (الشهر)', value: '4.2M$', change: 'متوافق مع المستهدف', changeColor: 'text-emerald-500', icon: Activity },
];

const inventory = [
  { name: 'إنسولين (هومولين)', status: 'منخفض', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { name: 'قفازات جراحية (L)', status: 'مطلوب', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { name: 'أموكسيسيلين 500 ملغ', status: 'جيد', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
];

const mockTasks = [
  { id: 1, title: 'مراجعة تحاليل: ج. ويلسون', priority: 'عالية', due: '14:00', completed: false },
  { id: 2, title: 'توقيع خروج: إيميلي ب.', priority: 'متوسطة', due: '15:30', completed: false },
  { id: 3, title: 'متابعة هاتفية: إيما ت.', priority: 'منخفضة', due: '16:00', completed: true },
  { id: 4, title: 'تحديث سجلات القلب', priority: 'متوسطة', due: 'نهاية اليوم', completed: false },
];

const quickLinks = [
  { label: 'تسجيل مريض', icon: User, path: '/patients', color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800' },
  { label: 'السجلات الطبية', icon: ClipboardList, path: '/records', color: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800' },
  { label: 'ذكاء التشخيص', icon: Brain, path: '/ai-diagnostics', color: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800' },
  { label: 'الصيدلية', icon: Pill, path: '/records', color: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' },
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
    <div className="p-8 pt-24 space-y-10 animate-in fade-in duration-1000 text-right">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2 underline decoration-blue-500/30 decoration-8 underline-offset-8">لوحة التحكم السريرية</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-4">مرحباً د. سارة، إليكِ ملخص الحالة الصحية للمستشفى اليوم.</p>
        </div>
        <div className="glass px-6 py-3 flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <CalendarDays className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-black text-slate-700 dark:text-slate-200">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
            className="glass p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/5 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
            <div className="flex items-center justify-between mb-6">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
                <kpi.icon className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 dark:text-white">{kpi.label === 'مواعيد اليوم' ? appointments.length : kpi.value}</div>
            <div className={`mt-4 text-[10px] font-black flex items-center gap-1.5 ${kpi.changeColor}`}>
              <TrendingUp className="w-3 h-3" />
              {kpi.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: AI Monitoring & Appointments */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* AI Monitoring (Expanded) */}
          <div className="glass rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/10 dark:bg-slate-800/10">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-4">
                  <Brain className="w-6 h-6 text-indigo-500" />
                  رؤى التحليل الذكي (AI)
                </h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">محرك تحليل مخاطر المرضى يعمل في الوقت الفعلي.</p>
              </div>
              <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl uppercase border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                Live Engine v4.2.1
              </span>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-8 rounded-[2rem] bg-red-50/30 dark:bg-red-900/10 border border-red-100/50 dark:border-red-900/20 transition-all hover:border-red-500/40 relative group">
                <div className="absolute -top-3 left-6 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse uppercase">أولوية قصوى</div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-black text-red-600 flex items-center gap-2 uppercase">
                    <AlertTriangle className="w-5 h-5" /> تنبيه مؤشرات حيوية
                  </span>
                  <span className="text-[10px] text-red-400 font-mono font-black bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-red-100">#G-402</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl border-2 border-red-500 flex items-center justify-center font-black text-red-600 text-2xl shadow-xl shadow-red-500/10">
                      84
                    </div>
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white dark:border-slate-900" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">أحمد محمود</div>
                    <div className="text-xs font-bold text-slate-500 leading-relaxed mt-1">اكتشاف تسارع في نبضات القلب عبر جهاز المراقبة</div>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-black py-4 rounded-2xl shadow-xl shadow-red-500/20 transition-all active:scale-95">
                    إرسال فريق الطوارئ
                  </button>
                  <button className="flex-1 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 text-xs font-black py-4 rounded-2xl transition-all">
                    عرض السجل
                  </button>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-indigo-50/10 dark:bg-indigo-900/5 border border-dashed border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-black text-indigo-500 flex items-center gap-2 uppercase">
                    <Mic className="w-5 h-5" /> تدوين صوتي حي
                  </span>
                  <div className="flex gap-1.5 items-end h-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: [4, 16, 4] }} 
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} 
                        className="w-1 bg-indigo-400 rounded-full" 
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="h-full bg-linear-to-r from-indigo-600 to-blue-400"
                    />
                  </div>
                  <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20 shadow-inner">
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic font-bold leading-relaxed">
                      "المريض يعاني من إجهاد طفيف بعد الجراحة... تم تعديل الجعة إلى 5 ملغ..."
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">تزامن ملاحظات الطبيب</span>
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">88% دقة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments & Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Upcoming Appointments */}
            <div className="glass rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-4">
                  <CalendarDays className="w-6 h-6 text-blue-500" />
                  المواعيد القادمة
                </h3>
                <Link to="/appointments" className="text-xs font-black text-blue-500 hover:underline">السجل الكامل</Link>
              </div>
              <div className="space-y-5">
                {appointments.slice(0, 4).map((app, appIdx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: appIdx * 0.1 }}
                    key={app.id} 
                    className="flex items-center gap-6 p-5 bg-slate-50 dark:bg-slate-800/20 rounded-[1.5rem] border border-transparent hover:border-blue-500/20 hover:bg-blue-50/10 transition-all group"
                  >
                    <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex flex-col items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform">
                      <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{app.time.split(':')[0]}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase leading-none">{parseInt(app.time.split(':')[0]) >= 12 ? 'مساءً' : 'صباحاً'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-md font-black text-slate-800 dark:text-slate-100 truncate">{app.patientName}</div>
                      <div className="text-xs font-bold text-slate-500 flex items-center gap-2 mt-1">
                         <div className="w-2 h-2 bg-blue-500 rounded-full" />
                         {app.type === 'Consultation' ? 'استشارة' : app.type}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:-translate-x-1 transition-all" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-4">
                  <History className="w-6 h-6 text-emerald-500" />
                  النشاط الأخير
                </h3>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
              </div>
              <div className="space-y-8 relative before:absolute before:right-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                {records.slice(0, 4).map((rec, recIdx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: recIdx * 0.1 }}
                    key={rec.id} 
                    className="flex gap-6 relative"
                  >
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div>
                      <div className="text-md font-black text-slate-800 dark:text-slate-100">تم تحديث {rec.type === 'Laboratory' ? 'تقرير المختبر' : rec.type}</div>
                      <div className="text-xs font-bold text-slate-500 mt-1">
                        {rec.patientName} • {new Date(rec.date).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tasks & Quick Actions */}
        <div className="space-y-10">
          
          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link to={link.path} key={link.label}>
                <motion.div 
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 rounded-[2rem] border ${link.color} flex flex-col justify-between aspect-square group shadow-lg shadow-black/5 relative overflow-hidden`}
                >
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                  <link.icon className="w-8 h-8 mb-4 group-hover:rotate-12 transition-transform" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">التوجه إلى</div>
                    <div className="text-sm font-black mt-1 leading-tight">{link.label}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Pending Tasks */}
          <div className="glass rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-4 mb-8">
              <ListTodo className="w-6 h-6 text-amber-500" />
              المهام السريرية
            </h3>
            <div className="space-y-4">
              {mockTasks.map(task => (
                <div key={task.id} className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all
                    ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-blue-500'}`}
                  >
                    {task.completed && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full
                        ${task.priority === 'عالية' ? 'bg-red-100 text-red-600' : task.priority === 'متوسطة' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}
                      >
                        أولوية {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> {task.due}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl text-xs font-black tracking-widest hover:bg-black dark:hover:bg-blue-700 shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98]">
              إدارة قائمة العمل
            </button>
          </div>

          {/* Inventory Sidebar Widget */}
          <div className="glass p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-4">
              <Package className="w-6 h-6 text-amber-500" /> تنبيهات المخزون
            </h4>
            <div className="space-y-6">
              {inventory.map((item) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-black mt-1">آخر توريد: قبل يومين</div>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-500 transition-all flex items-center justify-center gap-3">
              طلب مستلزمات طبية <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
