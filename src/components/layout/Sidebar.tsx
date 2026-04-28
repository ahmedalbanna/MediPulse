import { LayoutDashboard, Users, Calendar, Activity, ClipboardList, DollarSign, Briefcase, Clock, CalendarDays, ShieldCheck, Package, Pill, Mic, TrendingUp, Share2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';

const mainNavItems = [
  { path: '/', labelKey: 'dashboard', icon: LayoutDashboard, roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist', 'Accountant', 'HR'] },
  { path: '/patients', labelKey: 'patients', icon: Users, roles: ['Admin', 'Doctor', 'Receptionist'] },
  { path: '/appointments', labelKey: 'appointments', icon: Calendar, roles: ['Admin', 'Doctor', 'Receptionist'] },
  { path: '/records', labelKey: 'records', icon: ClipboardList, roles: ['Admin', 'Doctor'] },
  { path: '/inventory', labelKey: 'inventory', icon: Package, roles: ['Admin', 'Pharmacist'] },
  { path: '/pharmacy', labelKey: 'pharmacy', icon: Pill, roles: ['Admin', 'Pharmacist'] },
  { path: '/ai-diagnostics', labelKey: 'ai_diagnostics', icon: Activity, roles: ['Admin', 'Doctor'] },
  { path: '/billing', labelKey: 'billing', icon: DollarSign, roles: ['Admin', 'Receptionist', 'Accountant'] },
  { path: '/analytics', labelKey: 'analytics', icon: TrendingUp, roles: ['Admin', 'Accountant'] },
];

const hrNavItems = [
  { path: '/hr/staff', labelKey: 'hr', icon: Users, roles: ['Admin', 'HR'] },
  { path: '/settings/users', labelKey: 'settings', icon: ShieldCheck, roles: ['Admin', 'HR'] },
];

export default function Sidebar() {
  const { currentUser: user } = useAuth();
  const { t, currentBranch, language } = useSettings();
  const userRole = user?.role || 'Guest';

  const filteredMainNav = mainNavItems.filter(item => item.roles.includes(userRole));
  const filteredHRNav = hrNavItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="fixed top-0 h-screen w-64 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col z-20 transition-all duration-300 shadow-xl rtl:right-0 rtl:border-l ltr:left-0 ltr:border-r">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-800 dark:text-slate-100 font-extrabold text-lg tracking-tight leading-none">MediFlow Pro</span>
          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1 truncate max-w-[120px]">{currentBranch.name}</span>
        </div>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        {filteredMainNav.length > 0 && (
          <>
            <div className="px-6 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}</div>
            {filteredMainNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-50/50 text-blue-600 rtl:border-r-4 ltr:border-l-4 border-blue-600 dark:bg-blue-900/20' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </>
        )}

        {filteredHRNav.length > 0 && (
          <>
            <div className="px-6 mt-8 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'ar' ? 'الإدارة' : 'Administration'}</div>
            {filteredHRNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-emerald-50/50 text-emerald-600 rtl:border-r-4 ltr:border-l-4 border-emerald-600 dark:bg-emerald-900/20' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
