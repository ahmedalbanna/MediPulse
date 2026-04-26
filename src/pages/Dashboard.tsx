import { Activity, AlertTriangle, Mic, Package, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

const kpis = [
  { label: 'Total Patients', value: '12,482', change: '+4.2% from last month', changeColor: 'text-green-600' },
  { label: 'Appointments Today', value: '842', change: 'Scheduled for Today', changeColor: 'text-blue-600' },
  { label: 'ICU Capacity', value: '88%', change: '4 Beds remaining', changeColor: 'text-amber-600' },
  { label: 'Revenue (MTD)', value: '$4.2M', change: 'On track for target', changeColor: 'text-green-600' },
];

const inventory = [
  { name: 'Insulin (Humulin)', status: 'LOW', color: 'bg-red-100 text-red-700' },
  { name: 'Surgical Gloves (L)', status: 'REQ', color: 'bg-amber-100 text-amber-700' },
  { name: 'Amoxicillin 500mg', status: 'OK', color: 'bg-green-100 text-green-700' },
];

export default function Dashboard() {
  return (
    <div className="p-8 pt-24 space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={kpi.label}
            className="bg-white p-5 rounded-xl card-shadow border border-slate-100"
          >
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
            <div className={`mt-2 text-[10px] font-bold ${kpi.changeColor}`}>{kpi.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AI & Patient Monitoring */}
        <div className="lg:col-span-3 bg-white rounded-xl card-shadow border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              AI Patient Risk Monitoring
            </h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase border border-blue-100">
              Live Engine v4.2
            </span>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="ai-glow p-5 rounded-xl bg-red-50/30 transition-all hover:bg-red-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> CRITICAL ALERT
                </span>
                <span className="text-[10px] text-red-400 font-mono font-bold">#ROOM-402</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-red-500 flex items-center justify-center font-bold text-red-600 text-lg shadow-sm">
                  84
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Maria Thompson</div>
                  <div className="text-xs text-slate-500">Abnormal tachycardia detected via vitals monitor</div>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-2.5 rounded shadow-sm transition-colors uppercase">
                  Dispatch Team
                </button>
                <button className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold py-2.5 rounded transition-colors uppercase">
                  View Records
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Mic className="w-3 h-3" /> VOICE TRANSCRIPTION
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">#DR-VANE</span>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: '75%' }}
                    className="h-full bg-blue-400"
                  />
                </div>
                <p className="text-[11px] text-slate-600 italic leading-relaxed bg-white/50 p-2 rounded border border-slate-100">
                  "Patient shows symptoms of minor fatigue after post-op recovery... adjusting medication dosage to 5mg..."
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Processing Sync...</span>
                <div className="flex gap-1.5">
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 bg-blue-600 rounded-full" />
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 bg-blue-600 rounded-full" />
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 bg-blue-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl card-shadow border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase mb-4 border-b border-slate-50 pb-2 flex items-center gap-2">
              <Package className="w-3 h-3 text-slate-400" /> Inventory Alerts
            </h4>
            <div className="space-y-4">
              {inventory.map((item) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">{item.name}</div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.color}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all">
              Order Supplies
            </button>
          </div>

          <div className="bg-blue-600 p-5 rounded-xl card-shadow text-white relative overflow-hidden group">
            <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
            <h4 className="text-[10px] font-bold uppercase opacity-80 mb-2">Pharmacy Link</h4>
            <div className="text-lg font-bold leading-tight relative z-10">
              14 Prescriptions Pending Approval
            </div>
            <div className="mt-4 text-[10px] bg-white/20 p-2 rounded flex items-center gap-2 border border-white/10 relative z-10">
              <CheckCircle className="w-3 h-3" />
              System synced 2 mins ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
