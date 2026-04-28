import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Lock, Smartphone, Globe, Mail, Shield, AlertCircle, Database, Terminal, CreditCard, MessageSquare, Zap, RefreshCw } from 'lucide-react';
import { Integration } from '../../services/integrationService';

interface ConfigureModalProps {
  integration: Integration | null;
  onClose: () => void;
  onSave: (config: any) => void;
}

export default function ConfigureModal({ integration, onClose, onSave }: ConfigureModalProps) {
  const [config, setConfig] = useState(integration?.config || {});
  const [isSaving, setIsSaving] = useState(false);

  if (!integration) return null;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(config);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'HIS': return Database;
      case 'Payment': return CreditCard;
      case 'Insurance': return Shield;
      case 'SMS': return MessageSquare;
      case 'API': return Terminal;
      default: return Zap;
    }
  };

  const Icon = getIcon(integration.type);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl glass rounded-[3rem] shadow-2xl overflow-hidden text-right"
        >
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          
          <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button 
              onClick={onClose}
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-6 h-6 text-slate-500" />
            </button>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">إعداد {integration.name}</h2>
                <p className="text-xs text-slate-500 font-bold mt-1">تكوين معايير الربط ومفاتيح الوصول الآمنة.</p>
              </div>
              <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20">
                <Icon className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Common Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-6 flex items-start gap-5">
              <div className="flex-1 text-right">
                <h4 className="text-sm font-black text-blue-800 dark:text-blue-400">تشفير الطرفين (End-to-End Encryption)</h4>
                <p className="text-xs text-blue-700 dark:text-blue-400/70 mt-1 font-bold">
                  سيتم حفظ كافة البيانات والتوكنز بشكل مشفر في قاعدة بياناتنا الآمنة المتوافقة مع معايير HIPAA و GDPR.
                </p>
              </div>
              <Shield className="w-6 h-6 text-blue-500 shrink-0" />
            </div>

            <div className="grid grid-cols-1 gap-8">
              {integration.type === 'HIS' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3">Endpoint URL</label>
                    <input 
                      type="url" 
                      defaultValue={config.endpoint}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-mono text-left"
                      placeholder="https://your-his-endpoint.com/api"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3">Auth Token / Secret</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        defaultValue="••••••••••••••••"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-mono text-left pr-14"
                      />
                      <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              )}

              {integration.type === 'Payment' && (
                <div className="space-y-6">
                   <div className="flex gap-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                     <button className="flex-1 py-3 rounded-xl text-xs font-black bg-white dark:bg-slate-950 shadow-sm">Live Mode</button>
                     <button className="flex-1 py-3 rounded-xl text-xs font-black text-slate-500">Sandbox Mode</button>
                   </div>
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3">Public Key</label>
                    <input 
                      type="text" 
                      defaultValue={config.apiId || 'pk_live_xxxxxx'}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-mono text-left"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3">Webhook URL (Ready)</label>
                    <div className="flex items-center gap-3">
                      <button className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase">Copy</button>
                      <input 
                        type="text" 
                        readOnly
                        value={config.webhook || 'https://mediflow.com/api/payment/webhook'}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-2xl px-6 py-4 text-sm font-bold dark:text-slate-400 font-mono text-left"
                      />
                    </div>
                  </div>
                </div>
              )}

              {integration.type === 'SMS' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-r-4 border-blue-500 pr-3">Sender ID (Alpha-numeric)</label>
                    <input 
                      type="text" 
                      defaultValue={config.sender || 'MediFlow'}
                      maxLength={11}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 glass rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-emerald-500 font-black font-mono">14,203</span>
                        <span className="text-[10px] font-black text-slate-400">الرصيد المتبقي</span>
                     </div>
                     <div className="p-6 glass rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-blue-500 font-black font-mono">2.4s</span>
                        <span className="text-[10px] font-black text-slate-400">متوسط سرعة الإرسال</span>
                     </div>
                  </div>
                </div>
              )}

              {integration.type === 'API' && (
                <div className="space-y-6">
                   <div className="p-8 bg-slate-900 rounded-[2rem] text-right space-y-6 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                     <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Master API Key</span>
                       <Terminal className="w-5 h-5 text-slate-500" />
                     </div>
                     <div className="bg-black/50 p-6 rounded-2xl font-mono text-sm text-blue-400 break-all border border-white/5">
                        mediflow_live_sk_7392_8821_ak_99
                     </div>
                     <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">إعادة توليد المفتاح (Regenerate)</button>
                   </div>
                </div>
              )}
            </div>
            
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                تغيير الإعدادات يتطلب إعادة مزامنة الأنظمة
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={onClose}
                  className="flex-1 md:flex-none px-10 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl text-sm font-black transition-all hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-blue-600 text-white px-12 py-4 rounded-2xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
