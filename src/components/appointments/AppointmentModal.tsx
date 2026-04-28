import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, CheckCircle2, AlertTriangle, FileText, Phone, MapPin, Hash, Trash2, Edit3, UserCheck, Play, MoreHorizontal } from 'lucide-react';
import { Appointment, updateAppointment, deleteAppointment } from '../../services/appointmentService';

interface AppointmentModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function AppointmentModal({ appointment, onClose, onUpdate }: AppointmentModalProps) {
  if (!appointment) return null;

  const handleStatusChange = async (newStatus: Appointment['status']) => {
    try {
      await updateAppointment(appointment.id, { status: newStatus });
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleCancel = async () => {
    if (confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) {
      try {
        await deleteAppointment(appointment.id);
        if (onUpdate) onUpdate();
        onClose();
      } catch (err) {
        console.error('Failed to cancel appointment', err);
      }
    }
  };

  const statusColors: Record<Appointment['status'], string> = {
    'Confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'Cancelled': 'bg-red-50 text-red-700 border-red-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Checked-in': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Waiting': 'bg-purple-50 text-purple-700 border-purple-200',
    'In-Progress': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'No-show': 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const statusLabels: Record<Appointment['status'], string> = {
    'Confirmed': 'مؤكد',
    'Pending': 'قيد الانتظار',
    'Cancelled': 'ملغي',
    'Completed': 'مكتمل',
    'Checked-in': 'حضر المريض',
    'Waiting': 'في قائمة الانتظار',
    'In-Progress': 'قيد الاستشارة',
    'No-show': 'لم يحضر'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">تفاصيل الموعد</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  ID: {appointment.id}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-600 transition-all active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-10 overflow-y-auto space-y-8 text-right">
            <div className="flex items-center justify-between gap-6 border-r-8 border-blue-600 pr-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{appointment.patientName}</h2>
                <div className="flex items-center gap-2 mt-2 text-slate-500 font-bold">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm">سجل مريض رقم: {appointment.patientId}</span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-sm border uppercase tracking-wider
                ${statusColors[appointment.status]}`}
              >
                {statusLabels[appointment.status]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-end">
                  التاريخ <Calendar className="w-3.5 h-3.5" />
                </p>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                  {new Date(appointment.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-end">
                  الوقت / المدة <Clock className="w-3.5 h-3.5" />
                </p>
                <div className="flex items-baseline gap-2 justify-end">
                  <span className="text-xs text-slate-400 font-bold">({appointment.duration} دقيقة)</span>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200">{appointment.time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-100 dark:border-slate-800 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الطبيب المعالج</p>
                  <p className="text-md font-black text-slate-800 dark:text-slate-100">{appointment.doctor}</p>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الغرفة</p>
                  <span className="flex items-center gap-1.5 text-blue-600 font-black text-sm"><MapPin className="w-4 h-4" /> {appointment.room || 'غير محدد'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-100 dark:border-slate-800 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع الموعد</p>
                  <p className="text-md font-black text-slate-800 dark:text-slate-100">{appointment.type}</p>
                </div>
                {appointment.priority && (
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الأولوية</p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${appointment.priority === 'Emergency' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                      {appointment.priority}
                    </span>
                  </div>
                )}
              </div>

              {appointment.notes && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-end">
                    ملاحظات <FileText className="w-3.5 h-3.5" />
                  </p>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{appointment.notes}"
                  </p>
                </div>
              )}
            </div>
            
          </div>

          {/* Footer Actions */}
          <div className="p-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-between gap-4">
            <div className="flex gap-2">
              <button onClick={handleCancel} className="p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95">
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all shadow-sm active:scale-95">
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-3">
              {appointment.status === 'Confirmed' && (
                <button 
                  onClick={() => handleStatusChange('Checked-in')}
                  className="px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all shadow-lg active:scale-95 flex items-center gap-3"
                >
                  <UserCheck className="w-5 h-5" /> تسجيل حضور المريض
                </button>
              )}
              {appointment.status === 'Checked-in' && (
                <button 
                  onClick={() => handleStatusChange('In-Progress')}
                  className="px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-emerald-500/30 transition-all shadow-lg active:scale-95 flex items-center gap-3"
                >
                  <Play className="w-5 h-5" /> بدء الاستشارة
                </button>
              )}
              {appointment.status === 'In-Progress' && (
                <button 
                  onClick={() => handleStatusChange('Completed')}
                  className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-indigo-500/30 transition-all shadow-lg active:scale-95 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5" /> إتمام الزيارة
                </button>
              )}
              <button 
                onClick={onClose}
                className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
