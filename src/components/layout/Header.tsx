import { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Calendar, Settings, LayoutDashboard, Users, Activity, ClipboardList, DollarSign, LogOut, Shield, Moon, Sun, MessageCircle, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllPatients, Patient } from '../../services/patientService';

const SYSTEM_MODULES = [
  { id: 'mod-dashboard', title: 'Dashboard', icon: LayoutDashboard, type: 'Module', path: '/' },
  { id: 'mod-patients', title: 'Patient Records', icon: Users, type: 'Module', path: '/patients' },
  { id: 'mod-appointments', title: 'Appointments Calendar', icon: Calendar, type: 'Module', path: '/appointments' },
  { id: 'mod-records', title: 'Medical Records', icon: ClipboardList, type: 'Module', path: '/records' },
  { id: 'mod-ai-diagnostics', title: 'AI Diagnostics', icon: Activity, type: 'Module', path: '/ai-diagnostics' },
  { id: 'mod-billing', title: 'Finance & Billing', icon: DollarSign, type: 'Module', path: '/billing' },
  { id: 'mod-settings', title: 'System Settings', icon: Settings, type: 'Module', path: '/settings' },
];

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
    // Fetch patients for global search
    getAllPatients().then(setPatients).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
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

  const handleLogout = () => {
    // Mock logout
    alert('Logging out of MediFlow Clinical System...');
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-30 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Branch: Central Hospital (Primary)</span>
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
          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            title="Submit Feedback"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-transparent hover:ring-blue-500/20 transition-all overflow-hidden"
            >
              SW
            </button>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute top-10 right-0 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800">
                    <div className="text-xs font-black text-slate-800 dark:text-slate-100">Sarah Wilson, MD</div>
                    <div className="text-[10px] font-medium text-slate-400">Chief of Cardiology</div>
                  </div>
                  <div className="py-2">
                    <Link 
                      to="/settings" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>
                    <Link 
                      to="/help" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium"
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help & Support
                    </Link>
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors font-medium"
                    >
                      <Shield className="w-4 h-4" />
                      Security Audit
                    </button>
                  </div>
                  <div className="pt-2 border-t border-slate-50 dark:border-slate-800">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout System
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden p-8 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-500" />
                  Submit Feedback
                </h2>
                <button 
                  onClick={() => setIsFeedbackOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsFeedbackOpen(false);
                alert("Thank you for your feedback! It has been submitted successfully.");
              }} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Topic</label>
                  <select required className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors">
                    <option value="">Select a topic...</option>
                    <option value="bug">Report a Bug</option>
                    <option value="feature">Feature Request</option>
                    <option value="praise">General Compliment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Details</label>
                  <textarea 
                    required 
                    rows={4} 
                    placeholder="Tell us what's on your mind..."
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors resize-none"
                  ></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md transition-all active:scale-95">
                  Send Feedback
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
