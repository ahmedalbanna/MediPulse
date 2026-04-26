import { LayoutDashboard, Users, Calendar, Activity, ClipboardList, DollarSign, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', label: 'Patient Records', icon: Users },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/records', label: 'Medical Records', icon: ClipboardList },
  { path: '/ai-diagnostics', label: 'AI Diagnostics', icon: Activity },
  { path: '/billing', label: 'Finance & Billing', icon: DollarSign },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-20">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <span className="text-slate-800 font-bold text-lg tracking-tight">MediFlow Pro</span>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-6 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Modules</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-6 py-2.5 text-sm font-medium transition-all ${
                isActive 
                  ? 'sidebar-active shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <item.icon className={`w-4 h-4 ${navItems[0].path === item.path ? '' : ''}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300"></div>
          <div>
            <div className="text-sm font-bold text-slate-800">Dr. Julian Vane</div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Chief Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
