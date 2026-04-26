import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Phone, Mail, FileText, Activity, Clock, UserPlus, Edit3, Save, RotateCcw, Pill, Trash2, Plus, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Patient, updatePatient, Medication } from '../../services/patientService';

interface PatientModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updatedPatient: Patient) => void;
}

export default function PatientModal({ patient, isOpen, onClose, onUpdate }: PatientModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Patient>>({});
  const [isSaving, setIsSaving] = useState(false);

  // New medication form state
  const [newMed, setNewMed] = useState<Partial<Medication>>({ name: '', dosage: '', frequency: '', startDate: new Date().toISOString().split('T')[0] });
  const [showAddMed, setShowAddMed] = useState(false);

  useEffect(() => {
    if (patient) {
      setEditData({
        name: patient.name,
        age: patient.age,
        email: patient.email,
        contact: patient.contact,
        address: patient.address,
        medications: patient.medications ? [...patient.medications] : [],
      });
      setIsEditing(false);
      setShowAddMed(false);
      setNewMed({ name: '', dosage: '', frequency: '', startDate: new Date().toISOString().split('T')[0] });
    }
  }, [patient]);

  if (!patient) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updatePatient(patient.id, editData);
      if (onUpdate) onUpdate(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save patient changes:", error);
      alert("Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMedication = () => {
    if (!newMed.name || !newMed.dosage || !newMed.frequency) return;
    
    const med: Medication = {
      id: `m${Date.now()}`,
      name: newMed.name as string,
      dosage: newMed.dosage as string,
      frequency: newMed.frequency as string,
      startDate: newMed.startDate as string,
    };

    setEditData(prev => ({
      ...prev,
      medications: [...(prev.medications || []), med]
    }));
    
    setNewMed({ name: '', dosage: '', frequency: '', startDate: new Date().toISOString().split('T')[0] });
    setShowAddMed(false);
  };

  const handleRemoveMedication = (id: string) => {
    setEditData(prev => ({
      ...prev,
      medications: (prev.medications || []).filter(m => m.id !== id)
    }));
  };

  const statusColors = {
    'Critical': 'bg-red-100 text-red-700 border-red-200',
    'Stable': 'bg-green-100 text-green-700 border-green-200',
    'Recovering': 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const EditableField = ({ 
    label, 
    value, 
    name, 
    icon: Icon, 
    type = "text" 
  }: { 
    label: string, 
    value: any, 
    name: keyof Patient, 
    icon: any, 
    type?: string 
  }) => (
    <div className="space-y-1 group">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <Icon className="w-3 h-3" /> {label}
      </div>
      {isEditing ? (
        <input
          type={type}
          value={editData[name] || ''}
          onChange={(e) => setEditData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(e.target.value) : e.target.value }))}
          className="w-full bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
        />
      ) : (
        <div className="text-sm text-slate-600 flex items-center gap-2 group-hover:text-slate-900 transition-colors">
          {value || <span className="text-slate-300 italic">Not provided</span>}
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden card-shadow"
          >
            {/* Header */}
            <div className={`p-6 flex items-start justify-between bg-slate-50/50 border-b border-slate-100`}>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400 shadow-sm overflow-hidden">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      value={editData.name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-2xl font-bold text-slate-800 bg-white border border-blue-200 rounded-lg px-2 outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-mono text-slate-400 font-bold uppercase tracking-wider">{patient.id}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${statusColors[patient.status]}`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-white rounded-xl border border-slate-200 text-blue-600 hover:text-blue-700 hover:bg-slate-50 transition-all flex items-center gap-2 px-4"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-sm font-bold">Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all px-4 flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="text-sm font-bold">Cancel</span>
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-all px-4 flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span className="text-sm font-bold">Save</span>
                    </button>
                  </>
                )}
                <button 
                  onClick={onClose}
                  className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <EditableField label="Age (Years)" value={patient.age} name="age" icon={Calendar} type="number" />
                  <EditableField label="Email Address" value={patient.email} name="email" icon={Mail} />
                  <EditableField label="Contact Number" value={patient.contact} name="contact" icon={Phone} />
                  <EditableField label="Residential Address" value={patient.address} name="address" icon={MapPin} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Special Notes
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-h-[120px]">
                    {patient.notes && patient.notes.length > 0 ? (
                      <ul className="space-y-3">
                        {patient.notes.map((note, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1 shrink-0"></span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No special notes for this patient.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Pill className="w-3 h-3" /> Active Medications
                </h3>
                
                <div className="space-y-3">
                  {(editData.medications || []).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(editData.medications || []).map((med) => (
                        <div key={med.id} className="p-3 bg-white border border-slate-200 rounded-xl card-shadow flex items-start justify-between group relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                          <div className="pl-2">
                            <div className="font-bold text-slate-800 text-sm">{med.name} <span className="text-blue-600 ml-1">{med.dosage}</span></div>
                            <div className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-tight">{med.frequency}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-2">Started: {new Date(med.startDate).toLocaleDateString()}</div>
                          </div>
                          {isEditing && (
                            <button 
                              onClick={() => handleRemoveMedication(med.id)}
                              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center">
                      <span className="text-xs text-slate-400 italic">No active medications registered.</span>
                    </div>
                  )}

                  {isEditing && (
                    <div className="pt-2">
                      {!showAddMed ? (
                        <button 
                          onClick={() => setShowAddMed(true)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add Medication
                        </button>
                      ) : (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">New Prescription</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <input 
                              type="text" placeholder="Medication Name" 
                              value={newMed.name} onChange={e => setNewMed(p => ({...p, name: e.target.value}))}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-blue-500 outline-none"
                            />
                            <input 
                              type="text" placeholder="Dosage (e.g. 500mg)" 
                              value={newMed.dosage} onChange={e => setNewMed(p => ({...p, dosage: e.target.value}))}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-blue-500 outline-none"
                            />
                            <input 
                              type="text" placeholder="Frequency" 
                              value={newMed.frequency} onChange={e => setNewMed(p => ({...p, frequency: e.target.value}))}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-blue-500 outline-none"
                            />
                            <input 
                              type="date" 
                              value={newMed.startDate} onChange={e => setNewMed(p => ({...p, startDate: e.target.value}))}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setShowAddMed(false)} className="text-[10px] font-bold text-slate-500 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleAddMedication} className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors">Save Prescripton</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>


              {/* Status History */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Status History & Clinical Timeline
                </h3>

                {patient.history && patient.history.length > 1 && (
                  <div className="mb-6 h-40 bg-white p-4 rounded-xl border border-slate-200 card-shadow">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[...patient.history].reverse().map(entry => ({
                        date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        statusVal: entry.status === 'Critical' ? 1 : entry.status === 'Recovering' ? 2 : 3,
                        statusLabel: entry.status
                      }))}>
                        <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} tickMargin={8} stroke="#94a3b8" />
                        <YAxis domain={[0, 4]} hide />
                        <Tooltip 
                          cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const v = payload[0].payload.statusLabel;
                              const c = v === 'Critical' ? 'text-red-600' : v === 'Recovering' ? 'text-blue-600' : 'text-green-600';
                              return (
                                <div className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-lg shadow-xl font-bold">
                                  <span className={c}>{v}</span>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line type="monotone" dataKey="statusVal" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#3b82f6' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                  {patient.history && patient.history.length > 0 ? (
                    patient.history.map((entry, idx) => (
                      <div key={idx} className="relative pl-8 group">
                        <div className="absolute left-[5px] top-[5px] w-1.5 h-1.5 rounded-full bg-slate-300 ring-4 ring-white group-first:bg-blue-500 group-first:ring-blue-100 transition-all"></div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-slate-800">{entry.status}</span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded">{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed bg-white p-2 rounded-lg border border-transparent group-hover:border-slate-100 transition-all">{entry.note}</p>
                      </div>
                    ))
                  ) : (
                    <div className="pl-8 text-xs text-slate-400 italic">No historical records found for this patient.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            {!isEditing && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  Close Profile
                </button>
                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Full Medical Report
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

