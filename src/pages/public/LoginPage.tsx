import React, { useState } from 'react';
import { LogIn, ArrowLeft, Shield, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

export const LoginPage: React.FC = () => {
  const { navigate, login, setUserRole, currentUser } = useTuneForgeStore();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    setUserRole(selectedRole);
    setTimeout(() => {
      login();
      navigate('/dashboard');
    }, 450);
  };

  return (
    <div className="py-20 bg-slate-50/50 min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 font-display font-bold text-xl flex items-center justify-center mx-auto shadow-sm">
            TF
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Masuk ke TuneForge
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Akses studio konten YouTube musik instrumental Anda dan simpan riwayat hingga 500 paket.
          </p>
        </div>

        {/* Role Preference for Demo & Verification */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <span className="text-[11px] font-semibold text-slate-700 block">
            Pilih Peran Akun (Simulasi Fase 1):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('user')}
              className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                selectedRole === 'user'
                  ? 'border-amber-500 bg-amber-50/60 text-slate-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs">Kreator YouTube</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Akses generator &amp; riwayat</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                selectedRole === 'admin'
                  ? 'border-amber-500 bg-amber-50/60 text-slate-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs">Super Admin</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Kelola knowledge base</span>
            </button>
          </div>
        </div>

        {/* Primary 1-Click Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
        >
          {/* Official Google SVG Icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{isLoggingIn ? 'Menghubungkan Akun Google...' : 'Continue with Google (1-Klik)'}</span>
        </button>

        {/* Benefits Note */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tanpa password terpisah — instan dan aman</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simpan paket konten &amp; riwayat secara permanen</span>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-400">
          Dengan melanjutkan, Anda menyetujui Ketentuan Layanan &amp; Kebijakan Privasi TuneForge.
        </p>
      </div>
    </div>
  );
};
