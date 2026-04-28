import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RefreshCcw, Sparkles, AlertTriangle, ListChecks, FileText, Brain, ArrowLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getVisitAnalysis } from '../services/aiService';

interface AnalysisResult {
  summary: string;
  suggestions: string[];
  risks: string[];
  nextSteps: string;
}

export default function AIVisitAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onend = () => {
        if (isRecording) recognition.start();
      };

      recognitionRef.current = recognition;
    }
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const result = await getVisitAnalysis(transcript);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetAssistant = () => {
    setTranscript('');
    setAnalysis(null);
  };

  return (
    <div className="p-8 pt-24 max-w-7xl mx-auto space-y-10 text-right animate-in fade-in duration-700 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl shadow-purple-500/20">
              <Mic className="w-8 h-8 text-white" />
            </div>
            مساعد الزيارة الذكي (Voice-to-JSON)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">حول محادثتك مع المريض إلى سجل طبي منظم وتوصيات ذكية بلمحة بصر.</p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={resetAssistant}
                className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 transition-all active:scale-95"
                title="إعادة تعيين"
            >
                <RefreshCcw className="w-6 h-6" />
            </button>
            <button className="flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl transition-all active:scale-95">
                <Save className="w-5 h-5" /> حفظ في السجل
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recording Section */}
        <div className="glass rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 flex flex-col shadow-xl bg-white/50 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block border-r-4 border-purple-500 pr-3">
             النسخ المباشر للمحادثة
          </label>

          <div className="relative flex-grow flex flex-col">
            <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="ابدأ التسجيل أو اكتب ملاحظات الزيارة هنا..."
                className="w-full h-[300px] p-8 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none resize-none transition-all dark:text-white leading-relaxed placeholder:text-slate-400 mb-8"
            />
            
            {isRecording && (
                <div className="absolute top-4 left-4 flex gap-1 items-end h-6">
                    <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-purple-500 rounded-full" />
                    <motion.div animate={{ height: [12, 24, 12] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-purple-400 rounded-full" />
                    <motion.div animate={{ height: [16, 8, 16] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-purple-600 rounded-full" />
                </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={toggleRecording}
              className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[1.5rem] text-sm font-black transition-all active:scale-95 shadow-lg ${
                isRecording 
                ? 'bg-red-500 text-white shadow-red-500/30' 
                : 'bg-indigo-600 text-white shadow-indigo-500/30'
              }`}
            >
              {isRecording ? <MicOff className="w-6 h-6 animate-pulse" /> : <Mic className="w-6 h-6" />}
              {isRecording ? 'إيقاف التسجيل' : 'بدء تسجيل الزيارة'}
            </button>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !transcript.trim()}
              className="flex-1 flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-[1.5rem] text-sm font-black transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 text-purple-400" />}
              تحليل البيانات ذكياً
            </button>
          </div>
        </div>

        {/* Intelligence Section */}
        <div className="bg-slate-950 rounded-[2.5rem] p-10 shadow-2xl flex flex-col relative overflow-hidden group border border-slate-900">
           <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
           
           <div className="flex items-center justify-between relative z-10 mb-10">
             <h2 className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-3">
               <Brain className="w-4 h-4" /> مخرجات المساعد الطبي الذكي
             </h2>
           </div>

           <div className="flex-grow flex flex-col space-y-8 overflow-y-auto custom-scrollbar pr-2 relative z-10">
             <AnimatePresence mode="wait">
               {loading ? (
                 <motion.div 
                   key="loading"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="flex flex-col items-center justify-center h-full space-y-8 py-20"
                 >
                    <div className="relative">
                        <div className="w-24 h-24 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                        <Sparkles className="w-10 h-10 text-purple-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-black text-xl mb-2">جاري استخلاص المعلومات...</p>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed uppercase tracking-widest">تحويل الحديث العشوائي إلى بيانات منظمة</p>
                    </div>
                 </motion.div>
               ) : analysis ? (
                 <motion.div 
                   key="results"
                   initial={{ opacity: 0, y: 20 }} 
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-10"
                 >
                   {/* Summary Card */}
                   <section className="space-y-4">
                     <h3 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                       <FileText className="w-4 h-4 text-blue-400" /> ملخص الزيارة الطبية
                     </h3>
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-slate-300 font-bold leading-relaxed">
                        {analysis.summary}
                     </div>
                   </section>

                   {/* Risks Card */}
                   {analysis.risks.length > 0 && (
                     <section className="space-y-4">
                       <h3 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                         <AlertTriangle className="w-4 h-4 text-red-400" /> تنبيهات المخاطر
                       </h3>
                       <div className="grid grid-cols-1 gap-3">
                         {analysis.risks.map((risk, i) => (
                           <div key={i} className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center gap-3 text-red-300 text-xs font-bold">
                             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                             {risk}
                           </div>
                         ))}
                       </div>
                     </section>
                   )}

                   {/* Suggestions Card */}
                   <section className="space-y-4">
                     <h3 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                       <ListChecks className="w-4 h-4 text-emerald-400" /> دعم القرار والاقتراحات
                     </h3>
                     <div className="grid grid-cols-1 gap-4">
                       {analysis.suggestions.map((sug, i) => (
                         <div key={i} className="p-5 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 flex items-start gap-4">
                           <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                             <Sparkles className="w-4 h-4" />
                           </div>
                           <p className="text-slate-300 text-xs font-bold leading-relaxed">{sug}</p>
                         </div>
                       ))}
                     </div>
                   </section>

                   <section className="pt-6 border-t border-white/5">
                     <p className="text-[10px] text-slate-600 italic text-center">بناءً على تحليل ذكي لنص المحادثة المنسوخ. يرجى المراجعة والاعتماد.</p>
                   </section>
                 </motion.div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center py-20">
                   <div className="p-12 bg-white/5 rounded-full mb-10 border border-white/5 animate-pulse">
                     <Mic className="w-20 h-20 opacity-10" />
                   </div>
                   <p className="text-xl font-black text-slate-400 uppercase tracking-widest mb-4">في انتظار تسجيل الصوت</p>
                   <p className="text-xs opacity-50 font-bold max-w-xs leading-relaxed">اضغط على زر التسجيل لبدء معالجة محادثة الطبيب مع المريض وتحويلها إلى بيانات قيمة.</p>
                 </div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
