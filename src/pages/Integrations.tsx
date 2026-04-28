import React, { useState, useEffect } from 'react';
import { 
  Share2, Shield, CreditCard, MessageSquare, Database, 
  Terminal, CheckCircle2, AlertCircle, RefreshCw, 
  Settings2, ExternalLink, Zap, Lock, Globe,
  Activity, Search, Plus, Filter, ChevronRight,
  Code2, FileJson, Key, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { integrationService, Integration } from '../services/integrationService';
import ConfigureModal from '../components/integrations/ConfigureModal';

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'HIS' | 'Payment' | 'Insurance' | 'SMS' | 'API'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const data = await integrationService.getIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error("Failed to load integrations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    try {
      const result = await integrationService.testConnection(id);
      if (result.success) {
        // Success feedback
      }
    } catch (error) {
      console.error("Test failed", error);
    } finally {
      setTimeout(() => setTestingId(null), 1500);
    }
  };

  const filteredIntegrations = integrations.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'HIS': return Database;
      case 'Payment': return CreditCard;
      case 'Insurance': return Shield;
      case 'SMS': return MessageSquare;
      case 'API': return Terminal;
      default: return Share2;
    }
  };

  const menuItems = [
    { id: 'all', label: 'الكل', icon: Share2 },
    { id: 'HIS', label: 'أنظمة HIS', icon: Database },
    { id: 'Payment', label: 'بوابات الدفع', icon: CreditCard },
    { id: 'Insurance', label: 'أنظمة التأمين', icon: Shield },
    { id: 'SMS', label: 'التنبيهات و SMS', icon: MessageSquare },
    { id: 'API', label: 'API و المطورين', icon: Terminal },
  ];

  return (
    <div className="p-8 pt-24 min-h-screen text-right">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-end gap-4">
              تكامل الأنظمة الذكي
              <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold text-lg max-w-2xl">
              إدارة وربط الأنظمة الخارجية مع منصة MediFlow Pro لتعزيز الكفاءة التشغيلية وتجربة المريض.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              إضافة تكامل جديد
            </button>
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
               <Activity className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'إجمالي الربط', value: integrations.length, icon: Share2, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'أنظمة نشطة', value: integrations.filter(i => i.status === 'Active').length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'عمليات الربط (24h)', value: '12,482', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'معدل النجاح', value: '99.9%', icon: Shield, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} className="glass p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div className={`p-4 ${stat.bg} dark:bg-slate-800/10 rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black mt-1 text-slate-800 dark:text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start">
          
          {/* Integrations Grid/List */}
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row-reverse gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="ابحث عن نظام أو مزود خدمة..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl py-5 pr-14 pl-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                />
              </div>
              <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl px-8 flex items-center gap-3 text-slate-500 font-black text-sm hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" /> تصفية النتائج
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredIntegrations.map((item, idx) => {
                    const Icon = getIcon(item.type);
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.id}
                        className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform" />
                        
                        <div className="flex items-start justify-between mb-8">
                          <div className={`p-2 rounded-full ${
                            item.status === 'Active' ? 'bg-emerald-50 text-emerald-500' : 
                            item.status === 'Pending' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                          } flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest`}>
                            {item.status}
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'Active' ? 'bg-emerald-500' : 
                              item.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                            } ${item.status === 'Active' ? 'animate-pulse' : ''}`} />
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Icon className="w-8 h-8" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{item.name}</h3>
                          <p className="text-sm text-slate-500 font-bold leading-relaxed line-clamp-2">{item.description}</p>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleTestConnection(item.id)}
                              disabled={testingId === item.id}
                              className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-90 disabled:opacity-50"
                            >
                              <RefreshCw className={`w-5 h-5 text-slate-500 ${testingId === item.id ? 'animate-spin' : ''}`} />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedIntegration(item);
                                setIsModalOpen(true);
                              }}
                              className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-90"
                            >
                              <Settings2 className="w-5 h-5 text-slate-500" />
                            </button>
                          </div>
                          
                          <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                            عرض التفاصيل <ChevronRight className="w-4 h-4 rotate-180" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {/* Add Custom Integration Card */}
                <motion.div className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-10 gap-6 text-slate-400 hover:border-blue-500 hover:bg-blue-500/5 transition-all group cursor-pointer">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Plus className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-md font-black text-slate-500 group-hover:text-blue-500">ربط جديد</h4>
                    <p className="text-xs font-bold mt-2">قم بتهيئة integration جديد لبنية الأنظمة.</p>
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Navigation Sidebar */}
          <div className="space-y-8 sticky top-24">
            <div className="glass p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">التصنيف</p>
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                    activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-95' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[10px] font-mono opacity-50">{activeTab === item.id ? 'ACTIVE' : ''}</span>
                  <div className="flex items-center gap-4">
                    {item.label}
                    <item.icon className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
               <h4 className="text-lg font-black tracking-tight mb-4 flex items-center gap-4 justify-end">
                Open API
                <Terminal className="w-6 h-6 text-blue-400" />
               </h4>
               <p className="text-xs text-slate-400 font-bold leading-relaxed text-right mb-8">
                قم ببناء حلول برمجية مخصصة باستخدام واجهاتنا البرمجية الموثقة.
               </p>
               
               <div className="space-y-4">
                 {[
                   { label: 'توثيق API', icon: Code2 },
                   { label: 'نماذج طلبات JSON', icon: FileJson },
                   { label: 'مفاتيح الوصول (Keys)', icon: Key }
                 ].map((link, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-xs font-black">
                     <ChevronRight className="w-4 h-4 rotate-180 text-slate-500" />
                     <div className="flex items-center gap-3">
                       {link.label}
                       <link.icon className="w-4 h-4 text-blue-400" />
                     </div>
                   </button>
                 ))}
               </div>

               <button className="w-full mt-8 bg-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-95">
                 إدارة المطورين
               </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-[2.5rem] p-8 space-y-4">
              <div className="flex items-center gap-4 justify-end">
                <p className="text-sm font-black text-amber-800 dark:text-amber-400">تلميح أمني</p>
                <Info className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/60 font-bold leading-relaxed text-right">
                تأكد دائماً من تشفير الاتصال (HTTPS) عند إعداد بوابات الدفع أو مزامنة بيانات المرضى مع أنظمة HIS الخارجية.
              </p>
            </div>
          </div>

        </div>
      </div>

      <ConfigureModal 
        integration={selectedIntegration}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIntegration(null);
        }}
        onSave={(config) => {
          if (selectedIntegration) {
            integrationService.updateIntegration(selectedIntegration.id, config);
            loadIntegrations();
          }
        }}
      />
    </div>
  );
}
