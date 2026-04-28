import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, FileText, Download, Eye, Calendar, User, Activity, Clock, ShieldCheck, Tag, Lock, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getMedicalRecords, MedicalRecord } from '../services/recordService';
import RecordModal from '../components/records/RecordModal';

const recordTypes = [
  { id: 'All', label: 'الكل' },
  { id: 'Laboratory', label: 'مختبر' },
  { id: 'Radiology', label: 'أشعة' },
  { id: 'Prescription', label: 'وصفة طبية' },
  { id: 'Note', label: 'ملاحظات' }
];

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMedicalRecords({ type: selectedType === 'All' ? undefined : selectedType });
      setRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typeIcons: Record<string, string> = {
    'Laboratory': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'Radiology': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    'Prescription': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Note': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
  };

  const statusColors: Record<string, string> = {
    'Final': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
    'Draft': 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
    'Active': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return (
    <div className="p-8 pt-24 space-y-10 text-right animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            أرشيف السجلات الطبية
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">مستودع آمن وشامل لتقارير التشخيص، نتائج المختبر، وصور الأشعة والمستندات الطبية.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث باسم المريض، التقرير، أو الطبيب..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-4 py-3.5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3.5 rounded-2xl border transition-all ${showFilters ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
          >
            <Filter className="w-6 h-6" />
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
            <div className="glass p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-wrap gap-6 items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">تصنيف المستندات:</span>
              <div className="flex gap-3">
                {recordTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black border transition-all ${
                      selectedType === type.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Grid */}
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <RotateCcw className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-[10px]">جاري استرجاع السجلات الطبية...</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredRecords.map((record, idx) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:border-blue-500/30 transition-all group relative bg-white/50 dark:bg-slate-900/30"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${typeIcons[record.type] || 'bg-slate-100'} shadow-sm group-hover:scale-110 transition-transform`}>
                        <FileText className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1">{record.title}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-black text-blue-600 flex items-center gap-1.5"><User className="w-4 h-4" /> {record.patientName}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Tag className="w-4 h-4" /> {record.type}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black border ${statusColors[record.status]}`}>
                      {record.status === 'Final' ? 'نهائي' : record.status === 'Pending' ? 'معلق' : record.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-50 dark:border-slate-800">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-slate-200 dark:border-slate-700 pr-3">المسؤول الطبي</p>
                      <p className="text-sm font-black text-slate-700 dark:text-slate-200">{record.doctor}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{record.department}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-slate-200 dark:border-slate-700 pr-3">بيانات الأرشفة</p>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200 flex items-center gap-2 font-mono"><Calendar className="w-4 h-4 text-slate-400" /> {new Date(record.date).toLocaleDateString('ar-EG')}</p>
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200 flex items-center gap-2"><Activity className="w-4 h-4 text-slate-400" /> {record.fileSize}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 font-mono tracking-widest">
                      <Clock className="w-4 h-4" /> UID: {record.id}
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedRecord(record)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-black hover:bg-slate-200 transition-all"
                      >
                        <Eye className="w-4 h-4" /> معاينة
                      </button>
                      <button className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-black hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95">
                        <Download className="w-4 h-4" /> تحميل PDF
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-[3rem] border border-slate-100 dark:border-slate-800 p-24 flex flex-col items-center justify-center text-center space-y-6 shadow-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 to-transparent pointer-events-none" />
             <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-800 mb-4 animate-bounce">
              <FileText className="w-12 h-12 text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">لا توجد سجلات طبية</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-bold">لم يتم العثور على سجلات تطابق معايير البحث الحالية. حاول تعديل الفلاتر أو تغيير مصطلح البحث.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedType('All'); }}
              className="text-blue-500 font-black hover:underline tracking-widest text-xs uppercase"
            >
              مسح كافة الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-10 flex flex-col md:flex-row items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-t border-slate-100 dark:border-slate-800 mt-10">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-3"><Lock className="w-4 h-4 text-emerald-500" /> نظام التشفير النشط (AES-256)</span>
          <span className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-blue-500" /> متوافق مع معايير HIPAA</span>
        </div>
        <p className="mt-4 md:mt-0 font-mono">MediPulse Pro Archive v4.2.0</p>
      </div>

      <RecordModal 
        record={selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
      />
    </div>
  );
}
