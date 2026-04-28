import React, { useState } from 'react';
import { X, UserPlus, Mail, Phone, MapPin, Calendar, Activity, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { addPatient } from '../../services/patientService';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPatientModal({ isOpen, onClose, onSuccess }: AddPatientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'Other',
    contact: '',
    address: '',
    status: 'Stable'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addPatient({
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age),
        gender: formData.gender as 'Male' | 'Female' | 'Other',
        contact: formData.contact,
        address: formData.address,
        status: formData.status as 'Critical' | 'Stable' | 'Recovering',
        lastVisit: new Date().toISOString().split('T')[0],
        history: [],
        notes: [],
        medications: [],
        diagnoses: [],
        labResults: [],
        treatmentPlans: []
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to add patient", error);
      alert("خطأ أثناء تسجيل المريض. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden glass border border-white/10 text-right"
          >
            <div className="p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
               <button 
                onClick={onClose}
                className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">تسجيل مريض جديد</h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">إضافة سجل مريض جديد إلى النظام السحابي</p>
                </div>
                <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <UserPlus className="w-7 h-7" />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-blue-500 pr-3">الاسم الكامل *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="مثال: محمد أحمد علي"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-blue-500 pr-3">العمر *</label>
                    <div className="relative">
                      <Calendar className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                      <input 
                        required 
                        type="number" 
                        min="0"
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        placeholder="العمر"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-blue-500 pr-3">الجنس *</label>
                    <select
                      required
                      value={formData.gender}
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none dark:text-white cursor-pointer"
                    >
                      <option value="Male">ذكر</option>
                      <option value="Female">أنثى</option>
                      <option value="Other">آخر</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-blue-500 pr-3">البريد الإلكتروني *</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                      <input 
                        required 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="example@mail.com"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-blue-500 pr-3">رقم الجوال *</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                      <input 
                        required 
                        type="tel" 
                        value={formData.contact}
                        onChange={e => setFormData({...formData, contact: e.target.value})}
                        placeholder="05XXXXXXXX"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white text-left font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-blue-500 pr-3">العنوان السكني</label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      placeholder="المدينة، الحي، الشارع"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-4 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block border-r-4 border-blue-500 pr-3">الحالة الأولية</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none dark:text-white cursor-pointer"
                  >
                    <option value="Stable">مستقر</option>
                    <option value="Recovering">قيد التعافي</option>
                    <option value="Critical">حرج</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-start gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-black hover:bg-slate-200 transition-all shadow-sm active:scale-95"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/20 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  تأكيد التسجيل
                </button>
              </div>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
