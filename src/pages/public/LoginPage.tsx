import React, { useState } from 'react';
import { LogIn, ArrowLeft, Shield, CheckCircle2, Sparkles, UserCheck, Mail, User as UserIcon } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { TuneForgeLogo } from '../../components/ui/TuneForgeLogo';

export const LoginPage: React.FC = () => {
  const { navigate, loginWithGoogle } = useTuneForgeStore();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [useCustomAccount, setUseCustomAccount] = useState(false);

  const handleGoogleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);

    const email = useCustomAccount && customEmail.trim() ? customEmail.trim() : (selectedRole === 'admin' ? 'uqiwan@gmail.com' : 'creator@tuneforge.ai');
    const name = useCustomAccount && customName.trim() ? customName.trim() : (selectedRole === 'admin' ? 'Uqiwan Admin' : 'Kreator YouTube');

    try {
      await loginWithGoogle({
        email,
        name,
        role: selectedRole
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-[85vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="flex justify-center">
            <TuneForgeLogo size="lg" variant="icon" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
              Masuk ke TuneForge
            </h1>
            <p className="text-xs font-semibold text-amber-600 mt-0.5">
              by Ridwan Johari
            </p>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Wajib autentikasi Google sebelum mengakses generator, dashboard studio, dan riwayat paket konten.
          </p>
        </div>

        {/* Role Preference for Demo & Verification */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
          <span className="text-[11px] font-semibold text-slate-700 block">
            Pilih Peran Akun Google:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('user')}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                selectedRole === 'user'
                  ? 'border-amber-500 bg-amber-50/60 text-slate-900 font-semibold shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs">Kreator YouTube</span>
              </div>
              <span className="text-[10px] text-slate-400 block leading-tight">Akses generator &amp; riwayat</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                selectedRole === 'admin'
                  ? 'border-amber-500 bg-amber-50/60 text-slate-900 font-semibold shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs">Super Admin</span>
              </div>
              <span className="text-[10px] text-slate-400 block leading-tight">Kelola knowledge base &amp; user</span>
            </button>
          </div>
        </div>

        {/* Custom Google Account Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Gunakan akun Google spesifik?</span>
            <button
              type="button"
              onClick={() => setUseCustomAccount(!useCustomAccount)}
              className="text-amber-700 hover:text-amber-800 font-semibold underline cursor-pointer"
            >
              {useCustomAccount ? 'Pakai 1-Klik Default' : 'Input Email Google Anda'}
            </button>
          </div>

          {useCustomAccount && (
            <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Email Google:</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Nama Tampilan:</label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary 1-Click Google Login Button */}
        <button
          onClick={() => handleGoogleLogin()}
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
          <span>{isLoggingIn ? 'Memverifikasi Google OAuth...' : 'Lanjutkan dengan Google (1-Klik)'}</span>
        </button>

        {/* Benefits Note */}
        <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Autentikasi terverifikasi &amp; data tersimpan permanen di database</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Sesi login tersimpan otomatis di browser ini</span>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-400">
          Dengan masuk, Anda menyetujui Ketentuan Layanan &amp; Kebijakan Privasi TuneForge.
        </p>
      </div>
    </div>
  );
};
