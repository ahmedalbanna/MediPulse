import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, LayoutDashboard, Users, Activity, ClipboardList, DollarSign, LogOut, Shield, Moon, Sun, MessageCircle, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllPatients, Patient } from '../../services/patientService';

const SYSTEM_MODULES = [
  { id: 'mod-dashboard', title: 'لوحة التحكم', icon: LayoutDashboard, type: 'Module', path: '/' },
  { id: 'mod-patients', title: 'ملفات المرضى', icon: Users, type: 'Module', path: '/patients' },
  { id: 'mod-appointments', title: 'المواعيد والزيارات', icon: Calendar, type: 'Module', path: '/appointments' },
  { id: 'mod-records', title: 'السجلات الطبية', icon: ClipboardList, type: 'Module', path: '/records' },
  { id: 'mod-ai-diagnostics', title: 'التشخيص الذكي (AI)', icon: Activity, type: 'Module', path: '/ai-diagnostics' },
  { id: 'mod-billing', title: 'الفواتير والمالية', icon: DollarSign, type: 'Module', path: '/billing' },
  { id: 'mod-settings', title: 'إعدادات النظام', icon: Settings, type: 'Module', path: '/settings' },
];

import { Calendar } from 'lucide-react';

export default function Header() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    getAllPatients().then(setPatients).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsFocused(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = () => {
    if (!query.trim()) {
      return { 
        modules: SYSTEM_MODULES.filter(m => 
          ['mod-appointments', 'mod-records', 'mod-ai-diagnostics', 'mod-billing'].includes(m.id)
        ), 
        patients: [] 
      };
    }

    const q = query.toLowerCase();
    
    const matchedModules = SYSTEM_MODULES.filter(m => 
      m.title.toLowerCase().includes(q)
    );

    const matchedPatients = patients.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q) || 
      p.email.toLowerCase().includes(q) ||
      p.contact.includes(q)
    ).slice(0, 5);

    return { modules: matchedModules, patients: matchedPatients };
  };

  const results = searchResults();
  const showDropdown = isFocused && (query.trim() || results.modules.length > 0 || results.patients.length > 0);

  const handleLogout = () => {
    alert('جاري تسجيل الخروج من نظام MediFlow الطبي...');
    window.location.reload();
  };

  return (
    <header className="fixed top-0 right-64 left-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-30 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الفرع الحالي: المستشفى التخصصي (الرئيسي)</span>
        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          مراقبة النظام حية
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={containerRef}>
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن سجل، مريض، أو قسم..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl pr-10 pl-4 py-2 text-xs w-80 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all shadow-sm font-bold"
          />
          
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-12 right-0 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 text-right"
              >
                <div className="max-h-[500px] overflow-y-auto p-3">
                  {results.modules.length > 0 && (
                    <div className="mb-4">
                      <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">أقسام النظام</div>
                      {results.modules.map(mod => (
                        <div 
                          key={mod.id} 
                          onClick={() => { navigate(mod.path); setIsFocused(false); setQuery(''); }}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <mod.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{mod.title}</div>
                            <div className="text-[10px] text-slate-500">انتقل إلى {mod.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.patients.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">المرضى</div>
                      {results.patients.map(patient => (
                        <div 
                          key={patient.id} 
                          onClick={() => { navigate(`/patients?search=${patient.id}`); setIsFocused(false); setQuery(''); }}
                          className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors text-right"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{patient.name}</div>
                              <div className="text-[10px] font-mono text-slate-500">{patient.id}</div>
                            </div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                            ${patient.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                              patient.status === 'Recovering' ? 'bg-blue-100 text-blue-700' : 
                              'bg-green-100 text-green-700'}`}
                          >
                            {patient.status === 'Critical' ? 'حرج' : patient.status === 'Recovering' ? 'قيد التعافي' : 'مستقر'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setIsFeedbackOpen(true)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </button>
          
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shadow-lg shadow-blue-500/20">AB</div>
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">د. أحمد البنا</div>
                <div className="text-[9px] text-slate-500 font-bold">طبيب استشاري</div>
              </div>
            </button>
            
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 left-0 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 overflow-hidden z-50 text-right"
                >
                  <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">د. أحمد البنا</div>
                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">استشاري جراحة القلب</div>
                  </div>
                  <div className="py-2">
                    <Link to="/settings" className="flex items-center justify-end gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-bold">
                      <span>إعدادات الحساب</span>
                      <Settings className="w-4 h-4" />
                    </Link>
                    <Link to="/help" className="flex items-center justify-end gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-bold">
                      <span>المساعدة والدعم</span>
                      <HelpCircle className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="pt-2 border-t border-slate-50 dark:border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-end gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-bold">
                      <span>تسجيل الخروج</span>
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFeedbackOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md glass rounded-3xl overflow-hidden p-8 text-right">
              <h2 className="text-2xl font-bold mb-6 gradient-text">أرسل ملاحظاتك</h2>
              <form onSubmit={(e) => { e.preventDefault(); setIsFeedbackOpen(false); alert("شكراً لملاحظاتك!"); }} className="space-y-4">
                <textarea required className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-32 font-medium" placeholder="كيف يمكننا تحسين تجربتك؟" />
                <button type="submit" className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all">إرسال</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
