import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, LayoutDashboard, Users, Activity, ClipboardList, DollarSign, LogOut, Shield, Moon, Sun, MessageCircle, X, HelpCircle, MapPin, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllPatients, Patient } from '../../services/patientService';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { UserRole } from '../../services/userService';

const ROLE_LABELS: Record<string, string> = {
  'Admin': 'Admin',
  'Doctor': 'Doctor',
  'Receptionist': 'Receptionist',
  'Pharmacist': 'Pharmacist',
  'Accountant': 'Accountant',
  'HR': 'HR Manager',
  'Nurse': 'Nurse',
  'Patient': 'Patient'
};

const AR_ROLE_LABELS: Record<string, string> = {
  'Admin': 'مدير النظام',
  'Doctor': 'طبيب استشاري',
  'Receptionist': 'موظف استقبال',
  'Pharmacist': 'صيدلي مسؤول',
  'Accountant': 'محاسب مالي',
  'HR': 'مدير موارد بشرية',
  'Nurse': 'ممرض ممارس',
  'Patient': 'مريض مسجل'
};

import { Calendar } from 'lucide-react';

export default function Header() {
  const { currentUser, switchRole } = useAuth();
  const { language, setLanguage, currentBranch, setBranch, branches, t } = useSettings();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const branchRef = useRef<HTMLDivElement>(null);
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
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) setIsBranchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    window.location.reload();
  };

  const currentRoleLabel = language === 'ar' ? AR_ROLE_LABELS[currentUser?.role || ''] : ROLE_LABELS[currentUser?.role || ''];

  return (
    <header className="fixed top-0 rtl:right-64 rtl:left-0 ltr:left-64 ltr:right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-30 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="relative" ref={branchRef}>
          <button 
            onClick={() => setIsBranchOpen(!isBranchOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <MapPin className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{currentBranch.name}</span>
          </button>
          
          <AnimatePresence>
            {isBranchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-10 rtl:right-0 ltr:left-0 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-50"
              >
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('branch_selector')}</div>
                {branches.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => { setBranch(branch.id); setIsBranchOpen(false); }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold transition-all ${currentBranch.id === branch.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {branch.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
        
        <button 
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all group"
        >
          <Globe className="w-3 h-3 text-emerald-500 group-hover:rotate-180 transition-transform duration-500" />
          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{t('lang_selector')}</span>
        </button>
      </div>

      <div className="flex items-center gap-6">
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
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shadow-lg shadow-blue-500/20">
                {currentUser?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{currentUser?.name}</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase">{currentRoleLabel}</div>
              </div>
            </button>
            
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-12 rtl:right-auto ltr:right-0 rtl:left-0 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 overflow-hidden z-50"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{currentUser?.name}</div>
                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{currentUser?.department}</div>
                  </div>
                  
                  <div className="p-2 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                    <div className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{language === 'ar' ? 'تبديل الدور' : 'Switch Role'}</div>
                    <div className="grid grid-cols-2 gap-1">
                      {(Object.keys(language === 'ar' ? AR_ROLE_LABELS : ROLE_LABELS) as UserRole[]).map(role => (
                        <button 
                          key={role}
                          onClick={() => { switchRole(role); setIsProfileOpen(false); }}
                          className={`text-[10px] px-2 py-1.5 rounded-lg font-bold text-right transition-all ${currentUser?.role === role ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          {language === 'ar' ? AR_ROLE_LABELS[role] : ROLE_LABELS[role]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="py-2">
                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-bold">
                      <Settings className="w-4 h-4" />
                      <span>{t('settings')}</span>
                    </Link>
                  </div>
                  <div className="pt-2 border-t border-slate-50 dark:border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-bold">
                      <LogOut className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
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
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md glass rounded-3xl overflow-hidden p-8">
              <h2 className="text-2xl font-bold mb-6 gradient-text">{language === 'ar' ? 'أرسل ملاحظاتك' : 'Feedback'}</h2>
              <form onSubmit={(e) => { e.preventDefault(); setIsFeedbackOpen(false); }} className="space-y-4">
                <textarea required className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-32 font-medium" placeholder={language === 'ar' ? 'كيف يمكننا تحسين تجربتك؟' : 'How can we improve?'} />
                <button type="submit" className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all">{language === 'ar' ? 'إرسال' : 'Send'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
