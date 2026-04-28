
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Activity, DollarSign, Clock, Users, ArrowUpRight, 
  ArrowDownRight, Star, HeartPulse, Building2, Timer
} from 'lucide-react';
import { getAnalyticsData, AnalyticsData } from '../services/reportService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-20 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">التقارير والتحليلات الذكية</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">نظرة شاملة على الأداء الطبي، المالي والتشغيلي للمنشأة</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl text-sm font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
            تصدير ملف PDF
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            تحديث البيانات
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard 
          icon={<HeartPulse className="w-6 h-6" />}
          label="إجمالي التشخيصات"
          value={data.medical.totalDiagnoses.toLocaleString()}
          color="blue"
          trend="+8%"
        />
        <MetricCard 
          icon={<DollarSign className="w-6 h-6" />}
          label="صافي الدخل (الشهر)"
          value={`$${data.financial.netIncome.toLocaleString()}`}
          color="emerald"
          trend="+12%"
        />
        <MetricCard 
          icon={<Timer className="w-6 h-6" />}
          label="متوسط الانتظار"
          value={`${data.operational.avgWaitTime} dقة`}
          color="amber"
          trend="-2 min"
        />
        <MetricCard 
          icon={<Building2 className="w-6 h-6" />}
          label="إشغال العيادات"
          value={`${data.operational.clinicOccupancy}%`}
          color="purple"
          trend="+5%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Financial Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
          <h3 className="text-xl font-black mb-8 border-r-4 border-emerald-500 pr-4">الأداء المالي (الإيرادات vs المصروفات)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.financial.monthlyPerformance}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Medical Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
          <h3 className="text-xl font-black mb-8 border-r-4 border-blue-500 pr-4">توزيع التخصصات الطبية (Diagnoses)</h3>
          <div className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.medical.diagnosisDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.medical.diagnosisDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
        {/* Waiting Time Trend */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
          <h3 className="text-xl font-black mb-8 border-r-4 border-amber-500 pr-4">تريند وقت الانتظار الأسبوعي (بالدقائق)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.operational.waitingTimeTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="time" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Doctor Performance */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl">
          <h3 className="text-xl font-black mb-6 border-r-4 border-purple-500 pr-4">أداء الأطباء الأكثر كفاءة</h3>
          <div className="space-y-6">
            {data.doctorPerformance.map((doctor) => (
              <div key={doctor.doctorId} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                    <Users className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-black text-slate-900 dark:text-white">{doctor.name}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doctor.specialty}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 font-black">
                    <Star className="w-4 h-4 fill-current" /> {doctor.avgRating}
                  </div>
                  <div className="text-[10px] font-black text-emerald-600">{doctor.efficiency}% كفاءة</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color, trend }: { icon: React.ReactNode, label: string, value: string, color: 'blue' | 'emerald' | 'amber' | 'purple', trend: string }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-900/30',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-900/30',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-100 dark:border-purple-900/30',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-6 rounded-[2rem] border ${colors[color]} shadow-lg shadow-black/5 relative overflow-hidden group`}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1 ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
          {trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{label}</h3>
        <p className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{value}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
    </motion.div>
  );
}
