import { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Layout, Calendar, Pill, MessageSquare, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { getAllPatients, Patient } from '../../services/patientService';

const SYSTEM_MODULES = [
  { id: 'mod-dashboard', title: 'Dashboard', icon: Layout, type: 'Module', path: '/' },
  { id: 'mod-patients', title: 'Patients Directory', icon: User, type: 'Module', path: '/patients' },
  { id: 'mod-appointments', title: 'Appointments Calendar', icon: Calendar, type: 'Module', path: '/appointments' },
  { id: 'mod-prescriptions', title: 'Prescriptions & Meds', icon: Pill, type: 'Module', path: '/prescriptions' },
  { id: 'mod-messages', title: 'Messages', icon: MessageSquare, type: 'Module', path: '/messages' },
  { id: 'mod-settings', title: 'System Settings', icon: Settings, type: 'Module', path: '/settings' },
];

export default function Header() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patients for global search
    getAllPatients().then(setPatients).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = () => {
    if (!query.trim()) {
      return { modules: SYSTEM_MODULES.slice(0, 3), patients: [] };
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
    ).slice(0, 5); // Limit patient results

    return { modules: matchedModules, patients: matchedPatients };
  };

  const results = searchResults();
  const showDropdown = isFocused && (query.trim() || results.modules.length > 0 || results.patients.length > 0);

  const handleModuleClick = (path: string) => {
    navigate(path);
    setIsFocused(false);
    setQuery('');
  };

  const handlePatientClick = (id: string) => {
    navigate(`/patients?search=${id}`);
    setIsFocused(false);
    setQuery('');
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-30">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500">Branch: Central Hospital (Primary)</span>
        <div className="h-4 w-[1px] bg-slate-200"></div>
        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Monitoring Active
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={containerRef}>
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search records, patients, modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-xs w-72 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all shadow-sm"
          />
          
          {/* Search Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
              >
                <div className="max-h-96 overflow-y-auto p-2">
                  {query.trim() === '' && (
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Quick Links
                    </div>
                  )}

                  {results.modules.length > 0 && (
                    <div className="mb-2">
                      {query.trim() !== '' && (
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          System Modules
                        </div>
                      )}
                      {results.modules.map(mod => (
                        <div 
                          key={mod.id} 
                          onClick={() => handleModuleClick(mod.path)}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                            <mod.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-700">{mod.title}</div>
                            <div className="text-[10px] text-slate-500">Go to {mod.title}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.patients.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Patients
                      </div>
                      {results.patients.map(patient => (
                        <div 
                          key={patient.id} 
                          onClick={() => handlePatientClick(patient.id)}
                          className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-700">{patient.name}</div>
                              <div className="text-[10px] font-mono text-slate-500">{patient.id}</div>
                            </div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                            ${patient.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                              patient.status === 'Recovering' ? 'bg-blue-100 text-blue-700' : 
                              'bg-green-100 text-green-700'}`}
                          >
                            {patient.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {query.trim() !== '' && results.modules.length === 0 && results.patients.length === 0 && (
                    <div className="px-4 py-8 text-center">
                      <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-slate-700">No results found</div>
                      <div className="text-xs text-slate-500 mt-1">Try checking for typos or searching by ID</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
