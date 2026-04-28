import React, { useState } from 'react';
import { Activity, ShieldAlert, Sparkles, Brain, FileText, ChevronRight, Maximize2, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import DiagnosticModal from '../components/diagnostics/DiagnosticModal';
import { useSettings } from '../contexts/SettingsContext';

export default function AIDiagnostics() {
  const { language, t } = useSettings();
  const [symptoms, setSymptoms] = useState('');
  const [insight, setInsight] = useState('');
  const [engine, setEngine] = useState('');
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
        body: JSON.stringify({ symptoms, language })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setInsight(data.insight);
      setEngine(data.engine);
    } catch (error) {
      console.error(error);
      setInsight(language === 'ar' ? 'فشل الاتصال بمحرك التشخيص الذكي.' : 'Failed to connect to the diagnostic engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="rtl:text-right ltr:text-left">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-indigo-600 to-blue-500 rounded-2xl shadow-xl shadow-indigo-500/20">
              <Brain className="w-8 h-8 text-white" />
            </div>
            {t('ai_diagnostics')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">
            {language === 'ar' 
              ? 'تحليل سريري متقدم مدعوم بذكاء اصطناعي محلي وسحابي لدعم القرار الطبي.' 
              : 'Advanced clinical analysis powered by local and cloud AI for medical decision support.'}
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-[2rem] p-6 flex items-center gap-4 text-blue-800 dark:text-blue-300"
      >
        <ShieldCheck className="w-6 h-6 shrink-0 text-blue-600" />
        <div className="text-xs font-bold leading-relaxed">
          {language === 'ar'
            ? 'نظام MediFlow Pro مشفر بالكامل. جميع البيانات تمر عبر قنوات آمنة مع حماية خصوصية المريض.'
            : 'MediFlow Pro is fully encrypted. All data transfer is secured to ensure patient privacy.'}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input area */}
        <div className="glass rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 flex flex-col shadow-xl">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block border-emerald-500 rtl:border-r-4 ltr:border-l-4 rtl:pr-3 ltr:pl-3">
             {language === 'ar' ? 'البيانات السريرية' : 'Clinical Inputs'}
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={language === 'ar' ? 'أدخل الأعراض، العلامات الحيوية، والشكوى السريرية...' : 'Enter symptoms, vitals, and clinical complaints...'}
            className="w-full flex-grow min-h-[350px] p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none transition-all dark:text-white leading-relaxed placeholder:text-slate-400"
          />
          <div className="mt-8 flex justify-between items-center">
            <Link to="/records" className="text-xs font-black text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-colors">
              <FileText className="w-5 h-5" /> {t('records')}
            </Link>
            <button
              onClick={handleAnalyze}
              disabled={loading || !symptoms.trim()}
              className="flex items-center gap-3 bg-linear-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {language === 'ar' ? 'بدء التحليل الآمن' : 'Start Secure Analysis'}
            </button>
          </div>
        </div>

        {/* Output area */}
        <div className="bg-slate-950 rounded-[2.5rem] p-8 shadow-2xl flex flex-col relative overflow-hidden group border border-slate-900">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between relative z-10 mb-8">
            <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <Activity className="w-4 h-4" /> {language === 'ar' ? 'الرؤية الاستقصائية' : 'Investigative Insight'}
              {engine && <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[8px]">{engine}</span>}
            </h2>
            {insight && (
              <button onClick={() => setShowModal(true)} className="text-slate-500 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex-grow text-slate-300 text-sm overflow-y-auto relative z-10 custom-scrollbar min-h-[400px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full space-y-6 pt-20"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-900/50 border-t-indigo-500 rounded-full animate-spin"></div>
                    <Brain className="w-6 h-6 text-indigo-500 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <p className="text-indigo-400 font-bold animate-pulse text-[10px] uppercase tracking-widest">{language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}</p>
                </motion.div>
              ) : insight ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="markdown-body prose prose-invert prose-sm max-w-none rtl:text-right ltr:text-left">
                  <ReactMarkdown>{insight}</ReactMarkdown>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center py-20 opacity-40">
                  <Brain className="w-16 h-16 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'انتظار البيانات' : 'Awaiting Data'}</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {insight && (
             <div className="mt-8 pt-6 border-t border-white/5 relative z-10 flex items-center gap-3 text-amber-500/60">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-[9px] font-bold italic">{language === 'ar' ? 'هذا التحليل للأغراض التعليمية ودعم القرار فقط.' : 'This analysis is for educational and support purposes only.'}</span>
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
