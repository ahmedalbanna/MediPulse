import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500">Branch: Central Hospital (Primary)</span>
        <div className="h-4 w-[1px] bg-slate-200"></div>
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Monitoring Active
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-1.5 text-xs w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors">
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
