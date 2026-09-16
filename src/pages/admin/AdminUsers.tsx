import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, ArrowLeft, CheckCircle2, UserCheck, ShieldAlert, RefreshCw } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { User } from '../../types';

export const AdminUsers: React.FC = () => {
  const { navigate, currentUser, setUserRole, usersList, fetchUsers, updateUserRoleInBackend, showToast } = useTuneForgeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchUsers().finally(() => setIsLoading(false));
  }, [fetchUsers]);

  const toggleUserRole = async (u: User) => {
    const newRole: 'user' | 'admin' = u.role === 'admin' ? 'user' : 'admin';
    const success = await updateUserRoleInBackend(u.id, newRole);
    if (success) {
      if (u.id === currentUser.id) {
        setUserRole(newRole);
      }
      showToast(`Peran ${u.name} berhasil diubah menjadi ${newRole.toUpperCase()}`);
    } else {
      showToast(`Gagal mengubah peran pengguna.`);
    }
  };

  const displayUsers = usersList.length > 0 ? usersList : [currentUser];

  const filteredUsers = displayUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Admin Dashboard</span>
          </button>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Daftar Pengguna Terdaftar (Google OAuth)
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Pengguna yang melakukan otorisasi 1-klik via Google Cloud Console OAuth 2.0 dan tersimpan di database.
          </p>
        </div>

        <button
          onClick={() => {
            setIsLoading(true);
            fetchUsers().finally(() => {
              setIsLoading(false);
              showToast('Data pengguna diperbarui dari database');
            });
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Muat Ulang Database</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari user berdasarkan nama atau email Google..."
          className="w-full text-xs text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Pengguna Google</th>
                <th className="px-5 py-3.5">Google Sub ID</th>
                <th className="px-5 py-3.5">Peran (Role)</th>
                <th className="px-5 py-3.5">Terdaftar</th>
                <th className="px-5 py-3.5">Login Terakhir</th>
                <th className="px-5 py-3.5 text-right">Aksi Hak Akses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-500">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                    {u.googleSub}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3 text-amber-700" /> : <UserCheck className="w-3 h-3" />}
                      {u.role === 'admin' ? 'Super Admin' : 'Kreator'}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {new Date(u.lastLoginAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => toggleUserRole(u)}
                      className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                        u.role === 'admin'
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold'
                      }`}
                    >
                      {u.role === 'admin' ? 'Ubah ke Kreator' : 'Jadikan Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
