import React, { useState } from 'react';
import { HelpCircle, LifeBuoy, PhoneCall, Mail, MessageSquare, ChevronDown, ChevronUp, FileText, ExternalLink, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    question: "كيف يمكنني إضافة مريض جديد إلى النظام؟",
    answer: "لإضافة مريض جديد، انتقل إلى وحدة 'سجلات المرضى' من خلال الشريط الجانبي. انقر على زر 'مريض جديد' في الزاوية العلوية. املأ البيانات الديموغرافية والتاريخ الطبي المطلوبة في النافذة المنبثقة، ثم انقر على 'تأكيد التسجيل'."
  },
  {
    question: "كيف يعمل محرك التشخيص الذكي (AI)؟",
    answer: "يقوم محرك الذكاء الاصطناعي بتحليل الأعراض، العلامات الحيوية، والسجلات الطبية التاريخية لاقتراح تشخيصات محتملة وخطط علاجية. تم تصميم هذا النظام لدعم سير العمل السريري، ولكن لا ينبغي أن يحل محل الحكم الطبي المهني. يمكنك الوصول إليه عبر قسم 'التشخيص الذكي'."
  },
  {
    question: "هل يمكنني تصدير السجلات الطبية أو فواتير المحاسبة؟",
    answer: "نعم، يمكنك تصدير البيانات من وحدتي السجلات الطبية والمالية. ابحث عن زر 'تصدير' أو 'تحميل' في أقسام الترويسة المعنية. نحن ندعم حالياً تنسيقات PDF و CSV."
  },
  {
    question: "كيف يمكنني إعادة تعيين كلمة المرور الخاصة بي؟",
    answer: "إذا كنت مسجلاً للدخول، انتقل إلى قائمة الملف الشخصي (الزاوية العلوية) -> إعدادات الحساب -> الأمان، واتبع التعليمات. في حال فقدان الوصول، يرجى التواصل مع مسؤول النظام."
  },
  {
    question: "كيف يتم تأمين بيانات المرضى؟",
    answer: "نعتمد تشفيراً تاماً (End-to-End) لجميع سجلات المرضى. نحن ممتثلون تماماً للوائح HIPAA و GDPR. الوصول إلى البيانات الحساسة مقيد بنظام التحكم في الوصول القائم على الأدوار (RBAC)."
  }
];

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="p-8 pt-24 space-y-10 min-h-screen text-right animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="text-right">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4 justify-end">
            المساعدة والدعم الفني
            <div className="p-3 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20">
              <LifeBuoy className="w-8 h-8 text-white" />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">ابحث عن الإجابات، احصل على الإرشادات، أو تواصل مع فريق الدعم المتخصص لدينا.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-10">
        
        {/* Main Content - FAQs */}
        <div className="space-y-10">
          <div className="glass rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl p-12 bg-white/50 dark:bg-slate-900/30">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 justify-end border-r-8 border-blue-600 pr-5">
              الأسئلة الشائعة
              <HelpCircle className="w-8 h-8 text-blue-500" />
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className={`w-full flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-right`}
                  >
                    {openFaq === idx ? (
                      <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="font-black text-md text-slate-800 dark:text-slate-200">{faq.question}</span>
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-8 bg-white dark:bg-slate-900/50 text-md text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 font-bold">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          
          {/* Documentation Links */}
          <div className="glass rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl p-12 bg-white/50 dark:bg-slate-900/30">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 justify-end border-r-8 border-emerald-500 pr-5">
              وثائق النظام والموارد
              <FileText className="w-8 h-8 text-emerald-500" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'دليل البدء السريع', icon: ExternalLink },
                { title: 'مرجع واجهة البرمجة (API)', icon: ExternalLink },
                { title: 'الأمان والامتثال', icon: ExternalLink },
                { title: 'سجل التحديثات', icon: ExternalLink }
              ].map((item, i) => (
                <a key={i} href="#" className="flex items-center justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-slate-700 dark:text-slate-300 transition-all group">
                  <item.icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-black">{item.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Contact */}
        <div className="space-y-10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-xl font-black mb-4 relative z-10">هل تحتاج مساعدة فورية؟</h3>
            <p className="text-blue-100 text-sm font-bold mb-10 relative z-10 leading-relaxed">فريق الدعم السريري متاح على مدار الساعة طوال أيام الأسبوع للمشكلات التقنية العاجلة.</p>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-5 bg-black/20 p-6 rounded-[1.5rem] hover:bg-black/30 transition-colors">
                <div className="text-right flex-1">
                  <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">الخط الساخن للطوارئ</div>
                  <div className="text-md font-black text-white font-mono tracking-wider">+966 (800) MEDI-911</div>
                </div>
                <PhoneCall className="w-7 h-7 text-blue-200" />
              </div>
              <div className="flex items-center gap-5 bg-black/20 p-6 rounded-[1.5rem] hover:bg-black/30 transition-colors">
                <div className="text-right flex-1">
                  <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">الدعم التقني العام</div>
                  <div className="text-md font-black text-white font-mono">support@medipulse.pro</div>
                </div>
                <Mail className="w-7 h-7 text-blue-200" />
              </div>
            </div>
          </motion.div>
          
          <div className="glass rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl p-8 text-center bg-white/50 dark:bg-slate-900/30">
            <div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <MessageSquare className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="text-md font-black text-slate-800 dark:text-white mb-3">هل لديك اقتراح لميزة جديدة؟</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 font-bold leading-relaxed">نحن نعمل باستمرار على تحسين MediPulse بناءً على ملاحظات الأطباء والممارسين.</p>
            <button className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3">
              <RotateCcw className="w-4 h-4" /> إرسال ملاحظاتك الآن
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
