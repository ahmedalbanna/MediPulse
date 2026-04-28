import React, { useState, useEffect, useCallback } from 'react';
import { Shield, UserPlus, Search, MoreVertical, Edit2, Trash2, Mail, Building, ShieldCheck, ShieldAlert, BadgeCheck, Filter, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getUsers, updateUser, deleteUser, User, createUser } from '../../services/userService';

const ROLE_COLORS: Record<string, string> = {
  'Admin': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
  'Doctor': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800',
  'Nurse': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800',
  'Patient': 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

const PERMISSION_PRESETS: Record<string, string[]> = {
  'Doctor': ['عرض_المرضى', 'تعديل_السجلات', 'وصف_الأدوية', 'إدارة_المواعيد'],
  'Admin': ['الوصول_الكامل'],
  'Nurse': ['عرض_المرضى', 'تسجيل_العلامات_الحيوية', 'إدارة_المواعيد'],
  'Patient': ['عرض_السجلات_الخاصة', 'جدولة_موعد'],
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في إزالة هذا المستخدم؟ سيتم سحب صلاحيات الوصول فوراً.')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pt-24 space-y-10 text-right animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-right">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4 justify-end">
            إدارة الهوية والوصول (IAM)
            <div className="p-3 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold max-w-2xl text-right ml-auto">حوكمة صلاحيات الوصول، تحديد الأدوار، وتدقيق سياسات الأمان المتقدمة للمنظومة.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن مستخدم..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-4 py-4 text-sm w-80 font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white"
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95 shadow-xl"
          >
            <UserPlus className="w-5 h-5" /> تعيين مستخدم جديد
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-32 gap-6">
           <RotateCcw className="w-12 h-12 text-blue-500 animate-spin" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">جاري تدقيق هويات المستخدمين...</span>
        </div>
      ) : (
        <div className="glass rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/50 dark:bg-slate-950/50">
          <div className="overflow-x-auto">
            <table className="w-full text-right" dir="rtl">
              <thead className="bg-slate-50/50 dark:bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-6">ملف المستخدم</th>
                  <th className="px-10 py-6">دور الوصول</th>
                  <th className="px-10 py-6">القسم</th>
                  <th className="px-10 py-6">أذونات الوصول</th>
                  <th className="px-10 py-6">الحالة</th>
                  <th className="px-10 py-6 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {filteredUsers.map((user, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                    key={user.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-sm ring-1 ring-slate-200 dark:ring-slate-800 group-hover:scale-110 transition-transform">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-right">
                          <div className="text-md font-black text-slate-800 dark:text-white">{user.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-2 justify-end"> {user.email} <Mail className="w-3.5 h-3.5" /></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${ROLE_COLORS[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm font-black text-slate-600 dark:text-slate-400 flex items-center gap-3 justify-end">
                        {user.department}
                        <Building className="w-4 h-4 text-slate-300" />
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex gap-2 flex-wrap max-w-xs justify-end">
                        {user.permissions.map(p => (
                          <span key={p} className="text-[9px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 px-2 py-1 rounded-lg font-black uppercase tracking-tight">
                            {p.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="flex items-center gap-2.5 text-[10px] font-black text-emerald-600 justify-end">
                        {user.status === 'Active' ? 'نشط • ACTIVE' : 'غير نشط'}
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 justify-center">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 text-slate-300 hover:text-blue-600 rounded-xl transition-all border border-slate-100 dark:border-slate-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-3 hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-300 hover:text-red-600 rounded-xl transition-all border border-slate-100 dark:border-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <ShieldCheck className="w-8 h-8 text-blue-400 mb-6" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-r-4 border-blue-500 pr-3">إجمالي مسؤولي النظام</h3>
          <p className="text-4xl font-black font-mono">{users.filter(u => u.role === 'Admin').length}</p>
          <p className="text-[11px] text-slate-400 mt-6 flex items-center gap-3 justify-end font-bold">
             صلاحيات وصول كاملة ممنوحة <BadgeCheck className="w-4 h-4 text-blue-400" />
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl bg-white/50 dark:bg-slate-900/30"
        >
          <ShieldAlert className="w-8 h-8 text-amber-500 mb-6" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-r-4 border-amber-500 pr-3">دعوات معلقة</h3>
          <p className="text-4xl font-black text-slate-800 dark:text-white font-mono">0</p>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-amber-500 w-[0%]"></div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl bg-white/50 dark:bg-slate-900/30"
        >
          <Shield className="w-8 h-8 text-emerald-500 mb-6" />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-r-4 border-emerald-500 pr-3">امتثال السياسيات</h3>
          <p className="text-4xl font-black text-slate-800 dark:text-white font-mono">100%</p>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-emerald-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          </div>
        </motion.div>
      </div>

      {/* Provision User Modal */}
      <AnimatePresence>
        {(isAdding || editingUser) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsAdding(false); setEditingUser(null); }}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden p-12 text-right border border-slate-100 dark:border-slate-800"
            >
               <button onClick={() => { setIsAdding(false); setEditingUser(null); }} className="absolute top-8 left-8 p-3 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 flex items-center gap-4 justify-end">
                {editingUser ? 'تحديث هوية مستخدم' : 'تعيين هوية مستخدم جديد'}
                <BadgeCheck className="w-8 h-8 text-blue-600" />
              </h2>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  role: formData.get('role') as any,
                  department: formData.get('department') as string,
                  status: 'Active' as const,
                  permissions: PERMISSION_PRESETS[formData.get('role') as string] || [],
                };

                try {
                  if (editingUser) {
                    const updated = await updateUser(editingUser.id, data);
                    setUsers(users.map(u => u.id === editingUser.id ? updated : u));
                  } else {
                    const created = await createUser(data);
                    setUsers([...users, created]);
                  }
                  setIsAdding(false);
                  setEditingUser(null);
                } catch (err) {
                  console.error(err);
                }
              }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-3 border-r-4 border-blue-500">اسم الهوية الكامل</label>
                    <input name="name" defaultValue={editingUser?.name} required placeholder="مثال: د. هيلينا رودريغيز" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-3 border-r-4 border-blue-500">البريد الإلكتروني الرسمي</label>
                    <input name="email" type="email" defaultValue={editingUser?.email} required placeholder="h.rodriguez@hospital.com" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white font-mono text-left" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-3 border-r-4 border-blue-500">دور الأمان</label>
                    <select name="role" defaultValue={editingUser?.role || 'Doctor'} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white appearance-none">
                      <option value="Admin">مسؤول نظام (Admin)</option>
                      <option value="Doctor">طبيب ممارس (Doctor)</option>
                      <option value="Nurse">ممرض طبي (Nurse)</option>
                      <option value="Patient">مريض (Patient)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-3 border-r-4 border-blue-500">القسم المعين</label>
                    <input name="department" defaultValue={editingUser?.department} required placeholder="مثال: أمراض القلب" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all dark:text-white" />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between">
                    <span className="text-blue-600">يتم التطبيق تلقائياً</span>
                    <span>استحقاقات الوصول الأساسية</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">تُحسب الأذونات تلقائياً بناءً على دور الأمان المحدد وفقاً لمبدأ 'أقل الامتيازات' (Principle of Least Privilege) لضمان أقصى درجات حماية البيانات.</p>
                </div>

                <div className="flex gap-6 pt-6">
                  <button type="submit" className="flex-1 py-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-sm font-black hover:shadow-2xl hover:shadow-blue-500/30 transition-all active:scale-95 shadow-xl">
                    {editingUser ? 'حفظ تحديثات الهوية' : 'منح صلاحيات الوصول'}
                  </button>
                  <button type="button" onClick={() => { setIsAdding(false); setEditingUser(null); }} className="flex-1 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all">
                    إلغاء العملية
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
