import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Filter, MoreVertical, UserPlus, FileText, CheckCircle, AlertTriangle, Download, X } from 'lucide-react';
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

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterMinAge, setFilterMinAge] = useState<string>('');
  const [filterMaxAge, setFilterMaxAge] = useState<string>('');

  const location = useLocation();
  const navigate = useNavigate();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        status: filterStatus || undefined,
        minAge: filterMinAge || undefined,
        maxAge: filterMaxAge || undefined
      };
      
      const result = await getPatients(page, 8, sortBy, sortOrder, filters);
      setPatients(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      
      // Auto-open modal if there's a search param representing an ID
      const queryParams = new URLSearchParams(location.search);
      const searchId = queryParams.get('search');
      if (searchId) {
        // try to find the patient locally first
        let p = result.data.find((pat: Patient) => pat.id === searchId);
        if (!p) {
            // maybe it's not on this page, let's fetch all quickly just to get the record
            const all = await getAllPatients();
            p = all.find((pat: Patient) => pat.id === searchId);
        }
        if (p) {
          setSelectedPatient(p);
          setIsModalOpen(true);
        }
        // clear the URL param so it doesn't reopen indefinitely on other state changes
        navigate('/patients', { replace: true });
      }

    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, filterStatus, filterMinAge, filterMaxAge, location.search, navigate]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleExportCSV = async () => {
    try {
      const allData = await getAllPatients();
      const headers = ["ID", "Name", "Age", "Gender", "Email", "Contact", "Status", "Last Visit"];
      const rows = allData.map((p: Patient) => [
        p.id, `"${p.name}"`, p.age, p.gender, p.email, p.contact, p.status, p.lastVisit
      ]);
      const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `patients_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const handleSort = (key: keyof Patient) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setPage(1); // Reset to first page on sort
  };

  const statusColors = {
    'Critical': 'bg-red-100 text-red-700 border-red-200',
    'Stable': 'bg-green-100 text-green-700 border-green-200',
    'Recovering': 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 pt-24 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Patient Directory</h2>
          <p className="text-sm text-slate-500">Manage and monitor all registered patients across all branches.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-semibold transition-all card-shadow ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all card-shadow"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Add Patient
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end overflow-hidden"
          >
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Stable">Stable</option>
                <option value="Recovering">Recovering</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Min Age</label>
              <input 
                type="number" 
                value={filterMinAge} 
                onChange={(e) => { setFilterMinAge(e.target.value); setPage(1); }}
                className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Max Age</label>
              <input 
                type="number" 
                value={filterMaxAge} 
                onChange={(e) => { setFilterMaxAge(e.target.value); setPage(1); }}
                className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                placeholder="100"
              />
            </div>
            {(filterStatus || filterMinAge || filterMaxAge) && (
              <button 
                onClick={() => { setFilterStatus(''); setFilterMinAge(''); setFilterMaxAge(''); setPage(1); }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all"
              >
                <X className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden card-shadow">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
            Total: {total} Patients
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                    Patient <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                   Age/Gender
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                    Status <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <button onClick={() => handleSort('lastVisit')} className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                    Last Visit <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode='wait'>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredPatients.map((patient, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={patient.id} 
                      onClick={() => handleRowClick(patient)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{patient.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono italic">{patient.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{patient.age}Y • {patient.gender}</div>
                        <div className="text-[11px] text-slate-400">{patient.contact}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[patient.status]}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{new Date(patient.lastVisit).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Records">
                            <FileText className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
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
        <div className="p-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-700">{(page - 1) * 8 + 1}</span> to <span className="font-bold text-slate-700">{Math.min(page * 8, total)}</span> of <span className="font-bold text-slate-700">{total}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1 || loading}
              onClick={() => setPage(p => p - 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === i + 1 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'hover:bg-white text-slate-500 border border-transparent hover:border-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={page === totalPages || loading}
              onClick={() => setPage(p => p + 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 card-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">82%</div>
            <div className="text-xs text-slate-400 font-bold uppercase">Stability Rate</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 card-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">4</div>
            <div className="text-xs text-slate-400 font-bold uppercase">Active Emergencies</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 card-shadow flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">12</div>
            <div className="text-xs text-slate-400 font-bold uppercase">New Registrations Today</div>
          </div>
        </div>
      </div>
      
      <PatientModal 
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={() => {
          fetchPatients();
          setIsModalOpen(false);
        }}
      />
      
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          setPage(1); // Reset to first page
          fetchPatients();
        }}
      />
    </div>
  );
}
