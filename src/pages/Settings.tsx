import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Shield, Bell, Building, 
  Globe, Database, Save, Lock, Smartphone, Mail,
  CheckCircle2, ChevronLeft, Activity,
  Server, Palette, Languages, Brain, LogOut, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'profile', label: 'هويتي المهنية', icon: User },
  { id: 'hospital', label: 'إعدادات المنشأة', icon: Building },
  { id: 'security', label: 'الأمان والخصوصية', icon: Shield },
  { id: 'notifications', label: 'تكوين التنبيهات', icon: Bell },
  { id: 'system', label: 'حالة النظام', icon: Server },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 text-right">
            <div className="flex flex-col md:flex-row-reverse gap-10 items-start">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 overflow-hidden group-hover:scale-105 transition-transform">
                   <div className="text-5xl font-black text-slate-300 dark:text-slate-600">د.س</div>
                </div>
                <button className="absolute -bottom-3 -left-3 bg-blue-600 text-white p-3.5 rounded-2xl shadow-xl border-4 border-white dark:border-slate-900 hover:bg-blue-700 transition-all active:scale-90">
                  <Palette className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 space-y-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3">الاسم القانوني الكامل</label>
                    <input type="text" defaultValue="د. سارة ويلسون" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3">المسمى الوظيفي</label>
                    <input type="text" defaultValue="رئيس قسم القلب" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3">البريد الإلكتروني المعتمد</label>
                  <input type="email" defaultValue="s.wilson@hospital.com" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white text-left font-mono" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3">المستندات المهنية</label>
                  <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer">
                     <Languages className="w-10 h-10" />
                     <span className="text-xs font-black">اسحب السيرة الذاتية أو شهادات الخبرة هنا</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'hospital':
        return (
          <div className="space-y-8 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass rounded-3xl p-8 border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer group">
                <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:-translate-x-2 transition-transform" />
                <div className="text-right">
                  <h4 className="text-md font-black text-slate-800 dark:text-white">هوية المنشأة التعليمية</h4>
                  <p className="text-xs text-slate-500 font-bold mt-2">تخصيص الشعار والألوان المؤسسية.</p>
                </div>
              </div>
              <div className="glass rounded-3xl p-8 border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer group">
                <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:-translate-x-2 transition-transform" />
                <div className="text-right">
                  <h4 className="text-md font-black text-slate-800 dark:text-white">هيكلية الأقسام</h4>
                  <p className="text-xs text-slate-500 font-bold mt-2">إدارة الوحدات السريرية والنطاقات.</p>
                </div>
              </div>
              <Link to="/settings/users" className="md:col-span-2 bg-blue-600 rounded-[2.5rem] p-10 text-white flex items-center justify-between group hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-[0.98]">
                 <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft className="w-5 h-5" />
                  تخصيص الصلاحيات
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <h4 className="text-xl font-black uppercase tracking-tight">إدارة الهوية والوصول (IAM)</h4>
                    <p className="text-sm text-blue-100 font-bold mt-2 opacity-80">تعيين حسابات الموظفين وتكوين سياسات التحكم في الوصول (RBAC).</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8 text-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-8 glass rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <div className="flex gap-6">
                  <div className="text-right">
                    <h4 className="text-md font-black text-slate-800 dark:text-white">المصادقة الثنائية (2FA)</h4>
                    <p className="text-xs text-slate-500 font-bold mt-2">تطلب كود (OTP) عند كل محاولة تسجيل دخول جديدة لزيادة الأمان.</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                </div>
              </div>
              <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">3 جلسات نشطة</span>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">جلسات النظام النشطة حالياً</h4>
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between text-sm py-4 border-b border-white/5">
                     <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">الجلسة الحالية</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-black">Vite Dashboard (Chrome • London, UK)</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">IP: 192.168.1.45</p>
                      </div>
                      <Globe className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm py-4 border-b border-white/5 opacity-50">
                    <button className="text-[10px] font-black text-red-400 hover:underline tracking-widest">إبطال الجلسة</button>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-black">MediPulse Mobile Pro (iOS 17.4)</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">IP: 10.0.0.12</p>
                      </div>
                      <Smartphone className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-10 text-right">
            <div className="grid gap-6">
              {[
                { label: 'تنبيهات حالة الطوارئ (AI)', desc: 'رؤى عاجلة من محرك التشخيص والتحليل الذكي.', icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
                { label: 'تأكيدات المواعيد المجدولة', desc: 'تحديثات حجز وإلغاء المواعيد من قبل المرضى.', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'مزامنة السجلات الطبية', desc: 'عمليات الأرشفة وتصدير النتائج المخبرية بنجاح.', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'التقارير المالية والدورية', desc: 'ملخصات الإيرادات الأسبوعية وسجلات حالة الفواتير.', icon: Database, color: 'text-amber-500', bg: 'bg-amber-50' }
              ].map((item, idx) => (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                  key={idx} className="flex items-center justify-between p-8 glass rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all"
                >
                  <div className="flex gap-4">
                    <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                      <Smartphone className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex gap-6 items-start">
                    <div className="text-right">
                      <h4 className="text-md font-black text-slate-800 dark:text-white">{item.label}</h4>
                      <p className="text-xs text-slate-500 font-bold mt-2">{item.desc}</p>
                    </div>
                    <div className={`p-4 ${item.bg} dark:bg-slate-800/10 rounded-2xl`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="space-y-10 text-right">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform"></div>
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30">
                  Operational • فعال
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                    <h3 className="text-xl font-black">جاهزية خوادم MediPulse</h3>
                    <p className="text-xs text-slate-400 mt-1 font-bold">تعمل بكفاءة منذ أبريل 2024</p>
                  </div>
                  <div className="p-4 bg-emerald-400/10 rounded-2xl">
                    <Activity className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'جاهزية الـ API', val: '99.98%', icon: Globe },
                  { label: 'زمن استجابة DB', val: '24ms', icon: Database },
                  { label: 'معالجة الـ AI', val: '1.2s', icon: Brain },
                  { label: 'سعة التخزين', val: '14.2 TB', icon: Server }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-3 justify-end">
                      {stat.label}
                      <stat.icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-center">{stat.val}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-10 border-t border-white/10 flex items-center justify-between">
                <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 border border-white/5">
                  إجراء فحص شامل للنظام
                </button>
                <div className="text-right">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">محرك التشخيص الأمني</h4>
                  <p className="text-xs font-mono text-slate-400 mt-2">V4.2.1-STABLE-LAMBDA</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 glass border border-slate-100 dark:border-slate-800 rounded-[1.5rem] flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase font-mono tracking-widest">Arabic (Saudi Arabia)</span>
                <div className="flex items-center gap-4 text-sm font-black text-slate-700 dark:text-slate-200">
                  لغة النظام الأساسية <Languages className="w-5 h-5 text-slate-400" />
                </div>
              </div>
              <div className="p-6 glass border border-slate-100 dark:border-slate-800 rounded-[1.5rem] flex items-center justify-between">
                 <span className="text-xs font-black text-slate-400 uppercase font-mono tracking-widest">100% Native</span>
                <div className="flex items-center gap-4 text-sm font-black text-slate-700 dark:text-slate-200">
                  حجم واجهة المستخدم <Palette className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 pt-24 space-y-10 min-h-screen animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-6">
        <div className="text-right">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4 justify-end">
            لوحة التحكم والإعدادات
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <SettingsIcon className="w-8 h-8 text-slate-500" />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl">تخصيص الخيارات العالمية للمنشأة وإدارة هويتك المهنية داخل المنظومة.</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {saved && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-6 py-3 rounded-2xl text-sm font-black shadow-sm"
              >
                تم حفظ التغييرات بنجاح <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={handleSave}
            className="flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-10 py-4 rounded-2xl text-sm font-black hover:bg-black shadow-2xl transition-all active:scale-95"
          >
            <Save className="w-5 h-5" /> حفظ كافة الإعدادات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-3 glass p-6 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl sticky top-24">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-between px-6 py-4.5 rounded-[1.5rem] text-sm font-black transition-all
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/30 -translate-x-2' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-800 dark:hover:text-white'}`}
            >
              {activeTab === tab.id && <motion.div layoutId="setting-active-dot" className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />}
              <div className="flex items-center gap-4 flex-1 justify-end">
                {tab.label}
                <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
              </div>
            </button>
          ))}
          <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 space-y-6 px-6 overflow-hidden">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-right">نظرة عامة على الأمان</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-800 dark:text-slate-200 font-mono">اليوم، 08:32 ص</span>
                <span className="text-slate-400">آخر دخول:</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold">
                 <span className="text-emerald-500 font-black">فعال (تحقق تام)</span>
                <span className="text-slate-400">حالة MFA:</span>
              </div>
            </div>
            <button className="w-full mt-6 py-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center justify-center gap-3">
               إيقاف الجلسة والخروج <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="glass rounded-[4rem] border border-slate-100 dark:border-slate-800 shadow-2xl min-h-[700px] flex flex-col relative overflow-hidden group bg-white/50 dark:bg-slate-950/30">
          <div className="absolute top-0 left-0 w-80 h-80 bg-slate-50 dark:bg-slate-900/20 rounded-full blur-3xl -z-10 group-hover:bg-blue-50/20 transition-all pointer-events-none"></div>
          
          <div className="p-12 md:p-16">
            <div className="mb-16 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-10">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full">SECTION_ID: {activeTab.toUpperCase()}</div>
                <div className="text-right">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <div className="h-1.5 w-16 bg-blue-600 rounded-full mt-4 mr-auto"></div>
                </div>
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
              {renderTabContent()}
            </div>
          </div>
          
          <div className="mt-auto p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-900/10 flex flex-col md:flex-row items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest gap-6">
            <p className="font-bold underline cursor-pointer hover:text-blue-500">سياسة خصوصية البيانات الطبية (GDPR)</p>
            <div className="flex items-center gap-6">
               <span className="flex items-center gap-2">مستوى الوصول: إداري (ADMIN) <Shield className="w-4 h-4" /></span>
               <span className="w-1 h-1 bg-slate-300 rounded-full" />
               <span>تكامل مستشفى MediPulse المركزي</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
