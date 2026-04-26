import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, CheckCircle2, AlertTriangle, FileText, Phone } from 'lucide-react';
import { Appointment } from '../../services/appointmentService';

interface AppointmentModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export default function AppointmentModal({ appointment, onClose }: AppointmentModalProps) {
  if (!appointment) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Appointment Details</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  ID: {appointment.id}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{appointment.patientName}</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Patient</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm border
                ${appointment.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 
                  appointment.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  appointment.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'}`}
              >
                {appointment.status === 'Confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {appointment.status === 'Pending' && <AlertTriangle className="w-3.5 h-3.5" />}
                {appointment.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> Date
                </p>
                <p className="text-sm font-bold text-slate-700">{new Date(appointment.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Time / Duration
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-bold text-slate-700">{appointment.time}</p>
                  <span className="text-xs text-slate-400 font-medium">({appointment.duration} min)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl hover:shadow-md transition-shadow cursor-default">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Professional</p>
                  <p className="text-sm font-bold text-slate-700">{appointment.doctor}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl hover:shadow-md transition-shadow cursor-default">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appointment Type</p>
                  <p className="text-sm font-bold text-slate-700">{appointment.type}</p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              Close
            </button>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Check-In Patient
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
