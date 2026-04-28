import React from 'react';
import { Construction, Sparkles, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="p-8 pt-24 min-h-[calc(100vh-4rem)] flex items-center justify-center text-right overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="text-center space-y-8 relative z-10">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-500/30"
        >
          <Construction className="w-10 h-10" />
        </motion.div>
        
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">وحدة {title}</h2>
        
        <div className="max-w-xl mx-auto space-y-6">
          <p className="text-lg text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
            يتم حالياً تحسين وتطوير وحدة <span className="text-blue-600 dark:text-blue-400 font-black">{title}</span> لضمان أعلى معايير استمرارية العمل الطبي والتشفير المتقدم.
          </p>
          <p className="text-sm text-slate-400 font-medium">سيكون هذا القسم متاحاً بكامل وظائفه قريباً ضمن سياق نظام MediPulse المتكامل.</p>
        </div>

        <div className="flex justify-center gap-8 pt-10">
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white dark:bg-slate-900 px-6 py-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
             المزامنة حية <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          </div>
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white dark:bg-slate-900 px-6 py-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
             تشفير تام <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white dark:bg-slate-900 px-6 py-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
             قاعدة البيانات v4.2 <Activity className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
