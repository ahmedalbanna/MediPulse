import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Shield, Bell, Building, 
  Globe, Database, Save, Lock, Smartphone, Mail,
  Eye, EyeOff, CheckCircle2, ChevronRight, Activity,
  Server, Palette, Languages, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const tabs = [
  { id: 'profile', label: 'My Identity', icon: User },
  { id: 'hospital', label: 'Institutional', icon: Building },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
  { id: 'notifications', label: 'Alert Config', icon: Bell },
  { id: 'system', label: 'System Health', icon: Server },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl ring-1 ring-slate-200 overflow-hidden">
                  <span className="text-4xl font-black text-slate-400 group-hover:scale-110 transition-transform">SW</span>
                </div>
                <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white hover:bg-blue-700 transition-all">
                  <Palette className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Legal Name</label>
                    <input type="text" defaultValue="Dr. Sarah Wilson" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Clinical Title</label>
                    <input type="text" defaultValue="Chief of Cardiology" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Email Address</label>
                  <input type="email" defaultValue="s.wilson@hospital.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'hospital':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Hospital Branding</h4>
                  <p className="text-xs text-slate-500 mt-1">Logo and institutional colors.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Department Structure</h4>
                  <p className="text-xs text-slate-500 mt-1">Manage clinical units & zones.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
              <Link to="/settings/users" className="md:col-span-2 bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-center justify-between group hover:bg-blue-100/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-blue-800 uppercase tracking-tight">Identity & Access Management</h4>
                    <p className="text-xs text-blue-600/70 font-medium">Provision staff accounts and configure RBAC policies.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                  Configure
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex gap-4">
                  <Lock className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Two-Factor Authentication</h4>
                    <p className="text-xs text-slate-500">Require an OTP code for every login attempt.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="p-4 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active System Sessions</h4>
                  <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded">3 Active</span>
                </div>
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-sm py-2 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="font-medium">Vite Dashboard (Chrome • London, UK)</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400">Current</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-b border-white/10 opacity-70">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">MediFlow Mobile Pro (iOS 17)</span>
                    </div>
                    <button className="text-[10px] font-bold text-red-400 hover:underline">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-8">
            <div className="grid gap-4">
              {[
                { label: 'Critical AI Alerts', desc: 'Emergency insights from the diagnostic engine.', icon: Bell, color: 'text-red-500' },
                { label: 'Appointment Confirmations', desc: 'Patient booking and cancellation updates.', icon: Globe, color: 'text-blue-500' },
                { label: 'Medical Record Sync', desc: 'Successful archive operations and lab exports.', icon: CheckCircle2, color: 'text-emerald-500' },
                { label: 'Financial Reports', desc: 'Weekly revenue and invoice status logs.', icon: Database, color: 'text-amber-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    <item.icon className={`w-5 h-5 ${item.color} mt-1`} />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{item.label}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'system':
        return (
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-lg font-bold">MediFlow Backend Health</h3>
                    <p className="text-xs text-slate-400 mt-1">Operational since April 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/30">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Operational
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'API Uptime', val: '99.98%', icon: Globe },
                  { label: 'Database Latency', val: '24ms', icon: Database },
                  { label: 'AI Engine Latency', val: '1.2s', icon: Brain },
                  { label: 'Storage Usage', val: '14.2 TB', icon: Server }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                      <stat.icon className="w-3 h-3" /> {stat.label}
                    </div>
                    <div className="text-xl font-black">{stat.val}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Diagnostic Kernel</h4>
                  <p className="text-xs font-mono text-slate-400 mt-1">Version: 4.2.1-stable-lambda</p>
                </div>
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  Run Full Audit
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <Languages className="w-5 h-5 text-slate-400" /> System Language
                </div>
                <span className="text-xs font-black text-slate-400">English (US)</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <Palette className="w-5 h-5 text-slate-400" /> Interface Zoom
                </div>
                <span className="text-xs font-black text-slate-400">100%</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 pt-24 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-slate-400" />
            System Control Panel
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Configure global clinical settings and manage your professional identity.</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saved && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Changes Persisted
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-slate-800 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-900 shadow-xl transition-all active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="setting-active" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
            </button>
          ))}
          <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 px-4 overflow-hidden">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Security Overview</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-400">Last Login:</span>
                <span className="text-slate-600">Today, 08:32</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-400">MFA Status:</span>
                <span className="text-emerald-500">Verified</span>
              </div>
            </div>
            <button className="w-full mt-4 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors">
              Sign Out System
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm min-h-[600px] flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10 group-hover:bg-blue-50/30 transition-all"></div>
          
          <div className="p-8 md:p-12">
            <div className="mb-12">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <div className="h-1 w-12 bg-blue-600 rounded-full mt-3"></div>
            </div>
            
            {renderTabContent()}
          </div>
          
          <div className="mt-auto p-8 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest">
            <span>MediFlow Central Hospital Integration</span>
            <span>Policy Tier: Administrative</span>
          </div>
        </div>
      </div>
    </div>
  );
}
