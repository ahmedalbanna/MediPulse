import React, { useState } from 'react';
import { Activity, ShieldAlert, Sparkles, Brain, FileText, ChevronRight, Maximize2, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import DiagnosticModal from '../components/diagnostics/DiagnosticModal';

export default function AIDiagnostics() {
  const [symptoms, setSymptoms] = useState('');
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setInsight('');
    
    try {
      const response = await fetch('/api/ai-diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setInsight(data.insight);
    } catch (error) {
      console.error(error);
      setInsight('حدث خطأ أثناء إنشاء التحليل التشخيصي. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pt-24 space-y-10 text-right animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-indigo-600 to-blue-500 rounded-2xl shadow-xl shadow-indigo-500/20">
              <Brain className="w-8 h-8 text-white" />
            </div>
            مساعد التشخيص الذكي (AI)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">استفد من تقنيات الذكاء الاصطناعي المتقدمة للحصول على رؤى تدعم قراراتك السريرية وتسرع عملية التشخيص.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-[2rem] p-6 flex gap-4 text-amber-800 dark:text-amber-300"
      >
        <ShieldAlert className="w-6 h-6 shrink-0 text-amber-600" />
        <div className="text-sm font-bold leading-relaxed">
          <strong>إشعار الخصوصية والأمان:</strong> تم تصميم أداة الذكاء الاصطناعي هذه لمساعدة المتخصصين الطبيين في تكوين رؤى أولية. هي لا توفر تشخيصات نهائية أو خطط علاج ملزمة. لا تقم بإدخال بيانات المريض التعريفية (PII) مثل الأسماء الكاملة أو الأرقام الوطنية.
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input area */}
        <div className="glass rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 flex flex-col shadow-xl">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block border-r-4 border-indigo-500 pr-3">
             النتائج السريرية والأعراض المشاهدة
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="أدخل الأعراض الملاحظة، شكاوى المريض، العلامات الحيوية، والتاريخ الطبي ذي الصلة... (مثال: رجل يبلغ من العمر 45 عاماً يعاني من ضيق مفاجئ في التنفس، مع ألم خفيف في الصدر، ومستوى تشبع الأكسجين 92%)..."
            className="w-full flex-grow min-h-[350px] p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all dark:text-white leading-relaxed placeholder:text-slate-400"
          />
          <div className="mt-8 flex justify-between items-center">
            <Link to="/records" className="text-xs font-black text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-colors">
              <FileText className="w-5 h-5" /> مرجع السجلات الطبية
            </Link>
            <button
              onClick={handleAnalyze}
              disabled={loading || !symptoms.trim()}
              className="flex items-center gap-3 bg-linear-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <RotateCcw className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              بدء التحليل الشامل
            </button>
          </div>
        </div>

        {/* Output area */}
        <div className="bg-slate-950 rounded-[2.5rem] p-10 shadow-2xl flex flex-col relative overflow-hidden group border border-slate-900">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none"></div>
          
          <div className="flex items-center justify-between relative z-10 mb-8">
            <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <Activity className="w-4 h-4" /> الرؤية التشخيصية الذكية
            </h2>
            {insight && (
              <button 
                onClick={() => setShowModal(true)}
                className="text-slate-500 hover:text-white p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                title="عرض التقرير الكامل"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="flex-grow text-slate-300 text-sm overflow-y-auto pr-2 relative z-10 custom-scrollbar min-h-[400px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full space-y-6 py-20"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-900/50 border-t-indigo-500 rounded-full animate-spin"></div>
                    <Brain className="w-8 h-8 text-indigo-500 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <p className="text-indigo-400 font-black animate-pulse uppercase tracking-[0.2em] text-[10px]">جاري معالجة البيانات السريرية...</p>
                </motion.div>
              ) : insight ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="markdown-body prose prose-invert prose-sm max-w-none text-right"
                >
                    <ReactMarkdown>{insight}</ReactMarkdown>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center px-12 py-20">
                  <div className="p-8 bg-white/5 rounded-full mb-8">
                    <Brain className="w-20 h-20 opacity-20" />
                  </div>
                  <p className="text-lg font-black text-slate-400 uppercase tracking-widest">انتظار إدخال البيانات</p>
                  <p className="text-xs mt-4 opacity-50 font-bold leading-relaxed">أدخل تفاصيل الحالة السريرية ليعطيك النظام احتمالات التشخيص والمسارات المقترحة للفحص.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {insight && !loading && (
             <div className="mt-8 pt-8 border-t border-white/5 relative z-10 flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] font-bold italic">هذا التحليل لا يغني عن استشارة طبيب مختص وهو متاح للأغراض البحثية والتعليمية فقط.</span>
             </div>
          )}
        </div>
      </div>

      <DiagnosticModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        insight={insight}
        symptoms={symptoms}
      />
    </div>
  );
}
