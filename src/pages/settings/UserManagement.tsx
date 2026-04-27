import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, Search, MoreVertical, Edit2, Trash2, Mail, Building, ShieldCheck, ShieldAlert, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getUsers, updateUser, deleteUser, User, createUser } from '../../services/userService';

const ROLE_COLORS = {
  'Admin': 'bg-red-100 text-red-700 border-red-200',
  'Doctor': 'bg-blue-100 text-blue-700 border-blue-200',
  'Nurse': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Patient': 'bg-slate-100 text-slate-700 border-slate-200',
};

const PERMISSION_PRESETS: Record<string, string[]> = {
  'Doctor': ['view_patients', 'edit_records', 'prescribe_meds', 'manage_appointments'],
  'Admin': ['all'],
  'Nurse': ['view_patients', 'record_vitals', 'manage_appointments'],
  'Patient': ['view_own_records', 'schedule_appointment'],
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this user? Access will be revoked immediately.')) return;
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
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Identity & Access Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Govern system access, define roles, and audit security permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm w-72 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Provision User
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permissions</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map(user => (
                  <motion.tr 
                    layout
                    key={user.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs ring-1 ring-slate-200">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{user.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${ROLE_COLORS[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-widest">
                        <Building className="w-3.5 h-3.5 text-slate-400" /> {user.department}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-1.5 flex-wrap max-w-xs">
                        {user.permissions.map(p => (
                          <span key={p} className="text-[9px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                            {p.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <ShieldCheck className="w-6 h-6 text-blue-400 mb-4" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Administrators</h3>
          <p className="text-3xl font-black">{users.filter(u => u.role === 'Admin').length}</p>
          <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-2">
            <BadgeCheck className="w-3.5 h-3.5 text-blue-400" /> Full System Access Granted
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-amber-500 mb-4" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Invitations</h3>
          <p className="text-3xl font-black text-slate-800">0</p>
          <div className="h-2 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-amber-500 w-[0%]"></div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <Shield className="w-6 h-6 text-emerald-500 mb-4" />
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Policy Compliance</h3>
          <p className="text-3xl font-black text-slate-800">100%</p>
          <div className="h-2 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-emerald-500 w-full"></div>
          </div>
        </div>
      </div>

      {/* Provision User Modal */}
      <AnimatePresence>
        {(isAdding || editingUser) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => { setIsAdding(false); setEditingUser(null); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-blue-600" />
                {editingUser ? 'Update Identity' : 'Provision New User'}
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
              }} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Identity Name</label>
                  <input name="name" defaultValue={editingUser?.name} required placeholder="e.g. Dr. Helena Rodriguez" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Official Email Address</label>
                  <input name="email" type="email" defaultValue={editingUser?.email} required placeholder="h.rodriguez@hospital.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Security Role</label>
                    <select name="role" defaultValue={editingUser?.role || 'Doctor'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
                      <option value="Admin">Administrator</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Medical Nurse</option>
                      <option value="Patient">Patient</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Department</label>
                    <input name="department" defaultValue={editingUser?.department} required placeholder="Cardiology" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
                    <span>Baseline Entitlements</span>
                    <span className="text-blue-600">Auto-Applied</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Permissions are automatically calculated based on the selected security role following the Principle of Least Privilege.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => { setIsAdding(false); setEditingUser(null); }} className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
                    {editingUser ? 'Save Updates' : 'Grant Access'}
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
