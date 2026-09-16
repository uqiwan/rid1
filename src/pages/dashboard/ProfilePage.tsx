import React from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Calendar, 
  Sparkles, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Key 
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { UserAvatar } from '../../components/ui/UserAvatar';

export const ProfilePage: React.FC = () => {
  const { currentUser, setUserRole, logout, packages } = useTuneForgeStore();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          Profil Akun Google
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Informasi autentikasi Google OAuth dan preferensi hak akses studio Anda.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
          <UserAvatar user={currentUser} size="xl" />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="font-display font-bold text-xl text-slate-900">{currentUser?.name || 'Kreator'}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser?.email || 'creator@tuneforge.ai'}</span>
            </div>
            <div className="pt-1">
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                currentUser?.role === 'admin'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}>
                <Shield className="w-3 h-3" />
                {currentUser?.role === 'admin' ? 'Peran: Super Admin' : 'Peran: Kreator YouTube'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block mb-1">Google OAuth Sub ID:</span>
            <span className="font-mono text-slate-800 font-medium truncate block">
              {currentUser?.googleSub || 'google-oauth-authenticated'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block mb-1">Bergabung Sejak:</span>
            <span className="text-slate-800 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Terautentikasi'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block mb-1">Total Paket Digenerate:</span>
            <span className="text-slate-800 font-bold font-display text-sm">
              {packages.length} Paket Konten
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block mb-1">Status Akun:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Aktif &amp; Terverifikasi
            </span>
          </div>
        </div>

        {/* Role Switching Simulator for Testing */}
        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
            <Key className="w-4 h-4 text-amber-600" />
            <span>Pengujian Hak Akses (Fase 1 Demo)</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Anda dapat beralih antara peran <strong>Kreator</strong> dan <strong>Super Admin</strong> kapan saja untuk meninjau halaman publik, dashboard pengguna, maupun menu admin (/admin/*).
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setUserRole('user')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                currentUser?.role === 'user'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Mode Kreator
            </button>
            <button
              onClick={() => setUserRole('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                currentUser?.role === 'admin'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Mode Super Admin
            </button>
          </div>
        </div>

        {/* Logout Action */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Sesi aktif tersimpan secara lokal</span>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-red-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
