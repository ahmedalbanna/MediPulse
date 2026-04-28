import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Stethoscope, AlertCircle, CheckCircle2, ChevronRight, UserPlus, MapPin, Hash } from 'lucide-react';
import { Appointment, addAppointment } from '../../services/appointmentService';
import { Patient } from '../../services/patientService';
import { Staff } from '../../services/hrService';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patients: Patient[];
  doctors: Staff[];
}

export default function AddAppointmentModal({ isOpen, onClose, onSuccess, patients, doctors }: AddAppointmentModalProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorId: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    type: 'Consultation',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Emergency',
    room: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  // Auto-fill patient name when ID changes
  useEffect(() => {
    const patient = patients.find(p => p.id === formData.patientId);
    if (patient) {
      setFormData(prev => ({ ...prev, patientName: patient.name }));
    }
  }, [formData.patientId, patients]);

  // Auto-fill doctor name when ID changes
  useEffect(() => {
    const dr = doctors.find(d => d.id === formData.doctorId);
    if (dr) {
      setFormData(prev => ({ ...prev, doctor: dr.name }));
    }
  }, [formData.doctorId, doctors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      setError('يرجى إكمال جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addAppointment({
        ...formData,
        status: 'Confirmed'
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        patientId: '',
        patientName: '',
        doctorId: '',
        doctor: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 30,
        type: 'Consultation',
        priority: 'Medium',
        room: '',
        notes: ''
      });
      setStep(1);
    } catch (err) {
      setError('فشل في حجز الموعد. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} 
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 overflow-hidden text-right"
          dir="rtl"
        >
          {/* Header */}
          <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">حجز موعد جديد</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">إضافة مريض لجدول الزيارات</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl text-sm font-bold border border-rose-100 dark:border-rose-800">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Stepper */}
            <div className="flex items-center justify-center gap-4 mb-8">
               {[1, 2].map((s) => (
                 <React.Fragment key={s}>
                   <div className={`flex items-center gap-2 ${step >= s ? 'text-blue-600' : 'text-slate-300'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step === s ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20' : step > s ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white'}`}>
                        {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                      </div>
                      <span className="text-xs font-black">{s === 1 ? 'بيانات المريض والطبيب' : 'التوقيت والتفاصيل'}</span>
                   </div>
                   {s === 1 && <div className={`w-12 h-0.5 rounded-full ${step > 1 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>}
                 </React.Fragment>
               ))}
            </div>

            <div className="space-y-6">
              {step === 1 ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <User className="w-4 h-4 text-blue-500" /> المريض
                    </label>
                    <select 
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                      required
                    >
                      <option value="">اختر مريضاً...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Stethoscope className="w-4 h-4 text-blue-500" /> الطبيب المعالج
                    </label>
                    <select 
                      value={formData.doctorId}
                      onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                      required
                    >
                      <option value="">اختر طبيباً...</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
                     <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                        <UserPlus className="w-6 h-6 text-blue-500" />
                     </div>
                     <p className="text-xs font-bold text-blue-700 dark:text-blue-400">إذا لم يكن المريض مسجلاً مسبقاً، يرجى إضافته أولاً من صفحة المرضى.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-blue-500" /> التاريخ
                    </label>
                    <input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-mono"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Clock className="w-4 h-4 text-blue-500" /> التوقيت
                    </label>
                    <input 
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-black focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-mono"
                      required
                    />
                  </div>

                  {/* Room & Priority */}
                  <div className="space-y-3 text-right">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" /> الغرفة / العيادة
                    </label>
                    <input 
                      type="text"
                      placeholder="رقم الغرفة"
                      value={formData.room}
                      onChange={(e) => setFormData({...formData, room: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                    />
                  </div>

                  <div className="space-y-3 text-right">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 font-mono">
                      <AlertCircle className="w-4 h-4 text-blue-500" /> الأولوية
                    </label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
                    >
                      <option value="Low">منخفضة</option>
                      <option value="Medium">متوسطة</option>
                      <option value="High">عالية</option>
                      <option value="Emergency">طوارئ</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ملاحظات إضافية</label>
                    <textarea 
                      placeholder="ملاحظات حول الحالة أو سبب الزيارة..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white min-h-[100px] resize-none"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                type="button"
                onClick={onClose}
                className="text-sm font-black text-slate-400 hover:text-slate-600 transition-colors"
                disabled={loading}
              >
                إلغاء
              </button>
              
              <div className="flex items-center gap-4">
                {step === 2 && (
                   <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-black transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
                    disabled={loading}
                  >
                    السابق
                  </button>
                )}
                
                {step === 1 ? (
                  <button 
                    type="button"
                    onClick={() => {
                       if (formData.patientId && formData.doctorId) setStep(2);
                       else setError('يرجى اختيار المريض والطبيب أولاً');
                    }}
                    className="flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95 shadow-lg group"
                  >
                    <span>المتابعة</span>
                    <ChevronRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95 shadow-lg disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <Clock className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    <span>تأكيد حجز الموعد</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
