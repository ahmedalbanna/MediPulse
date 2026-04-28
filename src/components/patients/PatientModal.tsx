import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, X, Calendar, MapPin, Phone, Mail, FileText, Activity, Clock, UserPlus, Edit3, Save, RotateCcw, Pill, Trash2, Plus, TrendingUp, CalendarCheck, Shield, Microscope, ClipboardList, Thermometer, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Patient, updatePatient, Medication, Diagnosis, LabResult, TreatmentPlan } from '../../services/patientService';
import { addAppointment } from '../../services/appointmentService';

interface PatientModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

type TabType = 'info' | 'visits' | 'clinical' | 'meds' | 'labs';

export default function PatientModal({ patient, isOpen, onClose, onUpdate }: PatientModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Patient>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setEditData({ ...patient });
      setIsEditing(false);
      setActiveTab('info');
    }
  }, [patient]);

  if (!patient) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePatient(patient.id, editData);
      if (onUpdate) onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save patient changes:", error);
      alert("خطأ في حفظ البيانات. حاول مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  const statusMap: Record<string, { label: string, color: string }> = {
    'Critical': { label: 'حرج', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30' },
    'Stable': { label: 'مستقر', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30' },
    'Recovering': { label: 'قيد التعافي', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30' },
  };

  const tabs: { id: TabType, label: string, icon: any }[] = [
    { id: 'info', label: 'معلومات الحساب', icon: User },
    { id: 'visits', label: 'السجلات والزيارات', icon: Clock },
    { id: 'clinical', label: 'التشخيص والخطة', icon: ClipboardList },
    { id: 'meds', label: 'الوصفات الطبية', icon: Pill },
    { id: 'labs', label: 'المختبر والأشعة', icon: Microscope },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-5xl bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden glass border border-white/20"
          >
            {/* Header Area */}
            <div className="p-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 text-right">
                <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl shadow-blue-500/20">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[1.4rem] flex items-center justify-center text-3xl font-black text-blue-600">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{patient.name}</h2>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black border ${statusMap[patient.status]?.color}`}>
                      {statusMap[patient.status]?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                    <span className="font-mono text-blue-500 tracking-widest">ID: {patient.id}</span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                    <span>{patient.age} سنة</span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                    <span>{patient.gender === 'Male' ? 'ذكر' : 'أنثى'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                    <Edit3 className="w-4 h-4" /> تعديل البيانات
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all">إلغاء</button>
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 px-6 py-3 rounded-2xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                      {isSaving ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} حفظ التغييرات
                    </button>
                  </div>
                )}
                <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-transparent hover:border-red-100/20">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <div className="flex gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-black transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-lg shadow-blue-500/40" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {activeTab === 'info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-right">
                      <div className="space-y-6">
                        <SectionTitle icon={User} title="المعلومات الديموغرافية" />
                        <div className="grid grid-cols-2 gap-6">
                          <DataField label="الاسم الكامل" value={patient.name} />
                          <DataField label="العمر" value={`${patient.age} سنة`} />
                          <DataField label="رقم الجوال" value={patient.contact} icon={Phone} />
                          <DataField label="البريد الإلكتروني" value={patient.email} icon={Mail} />
                          <div className="col-span-2">
                            <DataField label="العنوان السكني" value={patient.address || 'غير متوفر'} icon={MapPin} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <SectionTitle icon={Activity} title="ملاحظات وحساسية" />
                        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-[2rem] min-h-[150px]">
                          {patient.notes && patient.notes.length > 0 ? (
                            <ul className="space-y-3">
                              {patient.notes.map((note, i) => (
                                <li key={i} className="text-sm font-bold text-red-700 dark:text-red-400 flex items-start gap-2">
                                  <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                  {note}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-slate-400 font-bold italic text-center mt-10">لا توجد ملاحظات أو حساسيات مسجلة.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'visits' && (
                    <div className="space-y-8 text-right">
                      <SectionTitle icon={Clock} title="سجل الزيارات والنشاط السريري" />
                      <div className="space-y-4 relative before:absolute before:right-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                        {patient.history && patient.history.length > 0 ? (
                          patient.history.map((visit, i) => (
                            <div key={i} className="relative pr-12 group">
                              <div className="absolute right-[11px] top-1.5 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 group-first:bg-blue-500 group-first:ring-4 group-first:ring-blue-100 dark:group-first:ring-blue-900/30 transition-all shadow-sm" />
                              <div className="glass p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-black text-slate-400 font-mono">{new Date(visit.date).toLocaleDateString('ar-EG')}</span>
                                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${statusMap[visit.status]?.color || 'bg-slate-100'}`}>
                                    {statusMap[visit.status]?.label || visit.status}
                                  </span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{visit.note}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 text-slate-400 font-bold italic">لا يوجد سجل زيارات متوفر.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'clinical' && (
                    <div className="space-y-8 text-right">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <SectionTitle icon={ClipboardList} title="التشخيصات الحالية" />
                          <div className="space-y-4">
                            {patient.diagnoses && patient.diagnoses.length > 0 ? (
                              patient.diagnoses.map(d => (
                                <div key={d.id} className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none">{d.condition}</h4>
                                    <span className="text-[10px] font-mono text-slate-400">{d.date}</span>
                                  </div>
                                  <div className="text-xs font-bold text-blue-600 mb-2">بواسطة: {d.doctor}</div>
                                  <p className="text-xs text-slate-500 font-medium">{d.notes}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-slate-400 italic py-10 font-bold">لا توجد تشخيصات مسجلة.</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-6">
                          <SectionTitle icon={TrendingUp} title="الخطة العلاجية" />
                          <div className="space-y-4">
                            {patient.treatmentPlans && patient.treatmentPlans.length > 0 ? (
                              patient.treatmentPlans.map(tp => (
                                <div key={tp.id} className="p-6 gradient-text border border-blue-100 dark:border-blue-900/20 rounded-3xl bg-blue-50/30 dark:bg-blue-900/5">
                                  <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-black text-blue-700 dark:text-blue-400">{tp.goal}</h4>
                                    <span className="px-3 py-1 bg-blue-200 dark:bg-blue-800 rounded-full text-[10px] font-black">{tp.status === 'Active' ? 'نشطة' : 'منتهية'}</span>
                                  </div>
                                  <ul className="space-y-3">
                                    {tp.steps.map((step, idx) => (
                                      <li key={idx} className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        {step}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-slate-400 italic py-10 font-bold">لا توجد خطة علاجية حالية.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'meds' && (
                    <div className="space-y-8 text-right">
                      <div className="flex justify-between items-center">
                        <SectionTitle icon={Pill} title="الأدوية الموصوفة" />
                        <button className="flex items-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-100 transition-all">
                          <Plus className="w-4 h-4" /> إضافة دواء
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {patient.medications && patient.medications.length > 0 ? (
                          patient.medications.map(med => (
                            <div key={med.id} className="glass p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-500" />
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none">{med.name}</h4>
                                  <span className="text-xs font-bold text-blue-600 mt-1 block">{med.dosage}</span>
                                </div>
                                <div className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg">بدأت: {med.startDate}</div>
                              </div>
                              <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 mb-4">
                                <RotateCcw className="w-4 h-4 text-blue-400" />
                                التكرار: {med.frequency}
                              </div>
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-20 text-slate-400 italic font-bold">لا توجد أدوية حالية.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'labs' && (
                    <div className="space-y-8 text-right">
                      <SectionTitle icon={Microscope} title="الفحوصات والأشعة" />
                      <div className="space-y-4">
                        {patient.labResults && patient.labResults.length > 0 ? (
                          patient.labResults.map(lab => (
                            <div key={lab.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl gap-4">
                              <div className="flex items-center gap-6 flex-1">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-[10px] ${lab.status === 'Normal' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                  {lab.status === 'Normal' ? 'سليم' : 'غير سليم'}
                                </div>
                                <div className="text-right">
                                  <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">{lab.testName}</h4>
                                  <div className="text-sm font-bold text-slate-500">{lab.result}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <div className="text-xs font-bold text-slate-400">تاريخ الفحص</div>
                                  <div className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono">{lab.date}</div>
                                </div>
                                <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-xl text-xs font-black text-blue-600 hover:bg-blue-50 transition-all">
                                  <Download className="w-4 h-4" /> تحميل النتيجة
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-20 text-slate-400 italic font-bold">لا توجد نتائج فحوصات مسجلة.</div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="p-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4">
              <div className="flex gap-3">
                 <button className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-2xl text-sm font-black text-white hover:shadow-xl hover:shadow-blue-500/25 transition-all active:scale-95">
                    <FileText className="w-5 h-5" /> إنشاء تقرير طبي كامل
                 </button>
                 <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 px-8 py-4 rounded-2xl text-sm font-black text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                    <CalendarCheck className="w-5 h-5" /> حجز موعد جديد
                 </button>
              </div>
              <button onClick={onClose} className="px-8 py-4 text-slate-500 font-black text-sm hover:text-slate-800 dark:hover:text-white transition-colors">إغلاق النافذة</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3 border-r-4 border-blue-500 pr-3">
      <Icon className="w-4 h-4 text-blue-500" />
      {title}
    </h3>
  );
}

function DataField({ label, value, icon: Icon }: { label: string, value: any, icon?: any }) {
  return (
    <div className="space-y-1.5 group">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</div>
      <div className="glass p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 group-hover:border-blue-200 transition-all">
        {Icon && <Icon className="w-4 h-4 text-blue-400" />}
        {value}
      </div>
    </div>
  );
}
