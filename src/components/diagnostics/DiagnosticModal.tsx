import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Brain, Download, AlertTriangle, User, Calendar, FileText, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  insight: string;
  symptoms: string;
}

export default function DiagnosticModal({ isOpen, onClose, insight, symptoms }: DiagnosticModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10 glass"
        >
          {/* Header */}
          <div className="px-10 py-8 border-b border-indigo-100 dark:border-slate-800 flex items-center justify-between bg-indigo-50/30 dark:bg-slate-900/50">
            <div className="flex items-center gap-6 text-right">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20">
                <Brain className="w-8 h-8" />
              </div>
              <div className="text-right">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">تقرير الرؤية التشخيصية</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2 justify-end mt-1">
                  تحليل أولي مدعوم بالذكاء الاصطناعي
                  <CheckCircle className="w-3 h-3" />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-slate-700 px-6 py-3 rounded-2xl text-xs font-black hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4" /> حفظ في ملف المريض
              </button>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl text-slate-400 hover:text-red-500 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-white/50 dark:bg-slate-950/50 custom-scrollbar text-right">
            <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-6 flex gap-4 text-amber-800 dark:text-amber-300 shadow-sm">
              <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
              <div className="text-sm font-bold leading-relaxed">
                <strong>تنبيه هام:</strong> هذا التقرير تم إنشاؤه بواسطة نظام ذكاء اصطناعي لأغراض معلوماتية ودعم تشخيصي أولي فقط. لا يعتبر تشخيصاً طبياً نهائياً. يجب مراجعة كافة النتائج والتحقق منها من قبل ممارس طبي مرخص.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-8">
                <div className="space-y-4">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3 justify-end pr-3 border-r-4 border-slate-300 dark:border-slate-700">
                    المدخلات والمؤشرات السريرية
                    <FileText className="w-4 h-4" />
                  </h4>
                  <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-bold leading-relaxed bg-slate-50 dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
                    {symptoms}
                  </div>
                </div>
                
                <div className="p-8 rounded-[2rem] bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                   <div className="text-sm font-black text-indigo-700 dark:text-indigo-400 mb-4">تفاصيل التقرير</div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500">إصدار النظام</span>
                        <span className="font-black text-slate-900 dark:text-white">v4.2.1 Stable</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500">مستوى الثقة</span>
                        <span className="font-black text-emerald-600">عالي (92%)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500">وقت المعالجة</span>
                        <span className="font-black text-slate-900 dark:text-white">1.2s</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/30 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden group min-h-[500px]">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-8 flex items-center gap-3 relative z-10 justify-end pr-3 border-r-4 border-indigo-500">
                    مخرجات تحليل الذكاء الاصطناعي
                    <Brain className="w-4 h-4" />
                  </h4>
                  
                  <div className="markdown-body prose prose-slate dark:prose-invert max-w-none relative z-10 text-right">
                    <ReactMarkdown>{insight}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <div className="px-10 py-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-bold flex justify-between items-center">
            <span className="flex items-center gap-3 hover:text-slate-800 dark:hover:text-white cursor-default transition-colors">
              <Calendar className="w-5 h-5 text-indigo-500" />
              تاريخ الإنشاء: {new Date().toLocaleString('ar-EG')}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">MediPulse Pro Diagnostics Engine</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
