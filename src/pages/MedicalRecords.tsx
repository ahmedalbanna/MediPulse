import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Download, Eye, Calendar, User, Activity, Clock, ShieldCheck, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getMedicalRecords, MedicalRecord } from '../services/recordService';

const recordTypes = ['All', 'Laboratory', 'Radiology', 'Prescription', 'Note'];

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [selectedType]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await getMedicalRecords({ type: selectedType === 'All' ? undefined : selectedType });
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeIcons = {
    'Laboratory': 'bg-blue-100 text-blue-600',
    'Radiology': 'bg-purple-100 text-purple-600',
    'Prescription': 'bg-green-100 text-green-600',
    'Note': 'bg-slate-100 text-slate-600'
  };

  const statusColors = {
    'Final': 'bg-green-100 text-green-700 border-green-200',
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'Draft': 'bg-slate-100 text-slate-700 border-slate-200',
    'Active': 'bg-blue-100 text-blue-700 border-blue-200'
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            Medical Records Archive
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Secure repository for diagnostic reports, lab results, and imaging scans.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient, report, or doctor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm w-72 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Category:</span>
              <div className="flex gap-2">
                {recordTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      selectedType === type 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Loading Records...</p>
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecords.map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeIcons[record.type as keyof typeof typeIcons] || 'bg-slate-100 text-slate-600'} shadow-sm`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{record.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-bold text-blue-600 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {record.patientName}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {record.type}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColors[record.status as keyof typeof statusColors]}`}>
                    {record.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Officer</p>
                    <p className="text-xs font-semibold text-slate-700">{record.doctor}</p>
                    <p className="text-[10px] text-slate-500">{record.department}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Archive Details</p>
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(record.date).toLocaleDateString()}</p>
                      <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-slate-400" /> {record.fileSize}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 font-mono">
                    <Clock className="w-3 h-3" /> UID: {record.id}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all">
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-md transition-all">
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No medical records found</h3>
          <p className="text-slate-500 max-w-sm">No records match your current search criteria. Try adjusting your filters or refining your search term.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedType('All'); }}
            className="text-blue-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-t border-slate-100">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Encryption Active (AES-256)</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> HIPAA Compliant</span>
        </div>
        <p>MediFlow Archive System v2.4.0</p>
      </div>
    </div>
  );
}
