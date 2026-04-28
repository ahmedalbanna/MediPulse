import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Filter, MoreVertical, UserPlus, FileText, CheckCircle, AlertTriangle, Download, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPatients, getAllPatients, Patient } from '../services/patientService';
import PatientModal from '../components/patients/PatientModal';
import AddPatientModal from '../components/patients/AddPatientModal';

type SortOrder = 'asc' | 'desc';

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Patient>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  const location = useLocation();
  const navigate = useNavigate();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const filters = { status: filterStatus || undefined };
      const result = await getPatients(page, 8, sortBy, sortOrder, filters);
      setPatients(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      
      const queryParams = new URLSearchParams(location.search);
      const searchId = queryParams.get('search');
      if (searchId) {
        let p = result.data.find((pat: Patient) => pat.id === searchId);
        if (!p) {
            const all = await getAllPatients();
            p = all.find((pat: Patient) => pat.id === searchId);
        }
        if (p) {
          setSelectedPatient(p);
          setIsModalOpen(true);
        }
        navigate('/patients', { replace: true });
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, filterStatus, location.search, navigate]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSort = (key: keyof Patient) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const statusMap: Record<string, { label: string, color: string }> = {
    'Critical': { label: 'حرج', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400' },
    'Stable': { label: 'مستقر', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' },
    'Recovering': { label: 'قيد التعافي', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' },
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pt-24 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-2">دليل المرضى</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">إدارة ومتابعة كافة سجلات المرضى المسجلين في فروع المستشفى.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Filter className="w-4 h-4" /> تصفية النتائج
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-2.5 rounded-2xl text-sm font-bold text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all shadow-md active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> تسجيل مريض جديد
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-wrap gap-6 items-end"
          >
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">الحالة الطبية</label>
              <select 
                value={filterStatus} 
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none min-w-[200px]"
              >
                <option value="">جميع الحالات</option>
                <option value="Stable">مستقر</option>
                <option value="Recovering">قيد التعافي</option>
                <option value="Critical">حرج</option>
              </select>
            </div>
            {filterStatus && (
              <button 
                onClick={() => { setFilterStatus(''); setPage(1); }}
                className="flex items-center gap-2 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-4 py-2.5 rounded-xl transition-all"
              >
                <X className="w-4 h-4" /> مسح التصفية
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table Container */}
      <div className="glass rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث بالاسم، الرقم الطبي، أو السجل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pr-12 pl-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
            إجمالي المرضى: {total}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    المريض <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                   العمر / الجنس
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-2 hover:text-blue-600 transition-colors justify-center w-full">
                    الحالة <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                  <button onClick={() => handleSort('lastVisit')} className="flex items-center gap-2 hover:text-blue-600 transition-colors justify-center w-full">
                    آخر زيارة <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-left">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence mode='wait'>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-6">
                        <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredPatients.map((patient, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                      key={patient.id} 
                      onClick={() => { setSelectedPatient(patient); setIsModalOpen(true); }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all cursor-pointer group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-black border border-white dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-800 dark:text-slate-100">{patient.name}</div>
                            <div className="text-[10px] text-blue-500 font-mono italic font-bold">#{patient.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="text-sm font-bold text-slate-600 dark:text-slate-400">{patient.age} سنة • {patient.gender === 'Male' ? 'ذكر' : 'أنثى'}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-1">{patient.contact}</div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black border ${statusMap[patient.status]?.color || 'bg-slate-100'}`}>
                          {statusMap[patient.status]?.label || patient.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="text-sm font-bold text-slate-600 dark:text-slate-400">{new Date(patient.lastVisit).toLocaleDateString('ar-EG')}</div>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="flex justify-start gap-2">
                          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all" title="View Records">
                            <FileText className="w-5 h-5" />
                          </button>
                          <button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            عرض <span className="font-black text-slate-800 dark:text-white">{(page - 1) * 8 + 1}</span> إلى <span className="font-black text-slate-800 dark:text-white">{Math.min(page * 8, total)}</span> من <span className="font-black text-slate-800 dark:text-white">{total}</span> مريض
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled={page === 1 || loading}
              onClick={() => setPage(p => p - 1)}
              className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    page === i + 1 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110' 
                      : 'hover:bg-white dark:hover:bg-slate-800 text-slate-500 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={page === totalPages || loading}
              onClick={() => setPage(p => p + 1)}
              className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white dark:hover:bg-slate-800 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <PatientModal patient={selectedPatient} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpdate={fetchPatients} />
      <AddPatientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={() => { setIsAddModalOpen(false); setPage(1); fetchPatients(); }} />
    </div>
  );
}
