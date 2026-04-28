import { LayoutDashboard, Users, Calendar, Activity, ClipboardList, DollarSign, Briefcase, Clock, CalendarDays, ShieldCheck, Package, Pill } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const mainNavItems = [
  { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/patients', label: 'ملفات المرضى', icon: Users },
  { path: '/appointments', label: 'المواعيد والزيارات', icon: Calendar },
  { path: '/records', label: 'السجلات الطبية', icon: ClipboardList },
  { path: '/inventory', label: 'المخزون والمستلزمات', icon: Package },
  { path: '/pharmacy', label: 'الصيدلية وصرف الأدوية', icon: Pill },
  { path: '/ai-diagnostics', label: 'التشخيص الذكي (AI)', icon: Activity },
  { path: '/billing', label: 'الفواتير والمالية', icon: DollarSign },
  { path: '/analytics', label: 'التقارير والتحليلات', icon: TrendingUp },
];

const hrNavItems = [
  { path: '/hr/staff', label: 'دليل الموظفين', icon: Users },
  { path: '/hr/attendance', label: 'الحضور والانصراف', icon: Clock },
  { path: '/hr/shifts', label: 'المناوبات والجدول', icon: CalendarDays },
  { path: '/hr/leaves', label: 'الإجازات والطلبات', icon: ClipboardList },
  { path: '/settings/users', label: 'الأدوار والصلاحيات', icon: ShieldCheck },
];

export default function Sidebar() {
  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-20 transition-colors duration-200 shadow-xl">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-800 dark:text-slate-100 font-extrabold text-lg tracking-tight leading-none">MediFlow Pro</span>
          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">المستشفى التخصصي</span>
        </div>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <div className="px-6 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">الموديولات الأساسية</div>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 space-x-reverse px-6 py-3 text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-blue-50/50 text-blue-600 border-l-4 border-blue-600 dark:bg-blue-900/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`
            }
          >
            <item.icon className={`w-5 h-5 transition-transform duration-200`} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="px-6 mt-8 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">الموارد البشرية والعمليات</div>
        {hrNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 space-x-reverse px-6 py-3 text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-emerald-50/50 text-emerald-600 border-l-4 border-emerald-600 dark:bg-emerald-900/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
