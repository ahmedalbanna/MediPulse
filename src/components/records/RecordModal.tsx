import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Download, Calendar, User, Activity, Clock, Server } from 'lucide-react';
import { MedicalRecord } from '../../services/recordService';

interface RecordModalProps {
  record: MedicalRecord | null;
  onClose: () => void;
}

export default function RecordModal({ record, onClose }: RecordModalProps) {
  if (!record) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Document Viewer</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  ID: {record.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors"
                title="Download PDF"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Meta */}
            <div className="w-64 bg-slate-50 border-r border-slate-100 p-6 overflow-y-auto hidden md:block">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Metadata</h4>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Patient</p>
                  <p className="text-sm font-bold text-slate-800">{record.patientName}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</p>
                  <p className="text-sm font-bold text-slate-800">{new Date(record.date).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Type</p>
                  <span className="inline-block px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-bold shadow-sm">{record.type}</span>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Ordered By</p>
                  <p className="text-sm font-bold text-slate-800">{record.doctor}</p>
                  <p className="text-[10px] text-slate-500">{record.department}</p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5"><Server className="w-3.5 h-3.5" /> System Status</p>
                  <p className="text-sm font-bold text-slate-800">{record.status}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> Size: {record.fileSize}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Mock Document View */}
            <div className="flex-1 bg-slate-200 p-8 overflow-y-auto flex justify-center">
              <div className="bg-white w-full max-w-2xl min-h-[800px] shadow-sm rounded border border-slate-300 p-12">
                {/* Document Header */}
                <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">CENTRAL HOSPITAL</h1>
                    <p className="text-xs font-bold text-slate-500 tracking-widest uppercase mt-1">Medical Records Department</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{record.type} Report</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">Ref: {record.id}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{record.title}</h2>
                    <p className="text-sm text-slate-600 mt-2">Prepared for: <span className="font-bold text-slate-800">{record.patientName}</span></p>
                  </div>

                  <div className="h-px bg-slate-100 w-full" />

                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500 line-clamp-3">
                        [This is a secure document preview wrapper.] Please click the download button to retrieve the encrypted PDF version containing high-resolution scans and complete analytical data points. All generated previews use low-fidelity rendering.
                      </p>
                    </div>

                    {/* Mock chart/data area */}
                    {record.type === 'Laboratory' && (
                      <div className="space-y-2 mt-8">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
                          <span>Test</span>
                          <span>Result</span>
                          <span>Range</span>
                        </div>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex justify-between text-sm py-2 border-b border-slate-100">
                            <span className="text-slate-700 font-medium">Marker {i} (Alpha)</span>
                            <span className="font-bold text-slate-900">12.{i}</span>
                            <span className="text-slate-400">10.0 - 15.0</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer sig */}
                <div className="mt-32 pt-8 border-t border-slate-200 flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-8">Electronically Signed By</p>
                    <p className="text-sm font-bold text-slate-800">{record.doctor}</p>
                    <p className="text-xs text-slate-500">{record.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-400">TIMESTAMP: {new Date().toISOString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
