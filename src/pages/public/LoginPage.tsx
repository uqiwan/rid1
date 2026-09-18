import React, { useState } from 'react';
import { 
  LogIn, 
  Mail, 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { TuneForgeLogo } from '../../components/ui/TuneForgeLogo';

export const LoginPage: React.FC = () => {
  const { navigate, loginWithGoogle } = useTuneForgeStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cleanEmail = email.trim().toLowerCase();
  const isOwnerAdmin = cleanEmail === 'uqiwan@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Email validation
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Silakan masukkan alamat email Google yang valid (contoh: nama@gmail.com).');
      return;
    }

    // 2. Name validation
    if (!name.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap atau nama channel YouTube Anda.');
      return;
    }

    // 3. Password validation for creator
    if (!isOwnerAdmin) {
      if (!password.trim()) {
        setErrorMessage('Kata sandi akses kreator wajib diisi.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await loginWithGoogle({
        email: cleanEmail,
        name: name.trim(),
        creatorPassword: password.trim()
      });
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal masuk akun. Silakan periksa koneksi dan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 w-full flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <TuneForgeLogo size="lg" variant="icon" />
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Pendaftaran &amp; Masuk Akun Google
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>TuneForge Studio by Ridwan Johari</span>
          </div>
          <p className="text-xs text-slate-500 pt-1 max-w-sm mx-auto leading-relaxed">
            Daftar / Masuk dengan akun Google Anda untuk mengakses generator konten musik AI dan menyimpan riwayat produksi Anda secara pribadi.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Role Detection Badge */}
        {cleanEmail && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
            isOwnerAdmin 
              ? 'bg-amber-50/80 border-amber-300 text-amber-900' 
              : 'bg-blue-50/70 border-blue-200 text-blue-900'
          }`}>
            {isOwnerAdmin ? (
              <>
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">👑 Akun Pemilik Terdeteksi:</span>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Email <strong>uqiwan@gmail.com</strong> terdaftar sebagai <strong>Super Admin</strong>.
                  </p>
                </div>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold">🎨 Akun Kreator YouTube:</span>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Akses kreator mandiri dengan riwayat terisolasi untuk akun ini.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Email Google: <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="namaanda@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {isOwnerAdmin 
                ? 'Super Admin terdaftar: uqiwan@gmail.com' 
                : 'Akun Anda akan memiliki riwayat tersendiri.'}
            </p>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap / Nama Channel: <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso / Zen Sound Studio"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Password Input for Creator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Kata Sandi Akses Kreator: {!isOwnerAdmin && <span className="text-rose-500">*</span>}
              </label>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Akses Resmi
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required={!isOwnerAdmin}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isOwnerAdmin ? 'Khusus Admin (Opsional)' : 'Masukkan kata sandi akses'}
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Masukkan kata sandi akses resmi yang diberikan oleh administrator untuk mendaftar sebagai kreator.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {/* Official Google 4-color SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>
              {isSubmitting 
                ? 'Memverifikasi Akun Google...' 
                : isOwnerAdmin 
                ? 'Masuk sebagai Super Admin (uqiwan@gmail.com)' 
                : 'Daftar & Masuk dengan Akun Google'}
            </span>
          </button>
        </form>

        {/* Isolation & Security Information */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Riwayat Terisolasi:</strong> Paket konten yang Anda generate tersimpan rapi untuk akun Anda sendiri.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Hak Akses Admin:</strong> Hanya <em>uqiwan@gmail.com</em> yang berhak mengakses pengaturan sistem.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Kata Sandi Rahasia:</strong> Pendaftaran akun kreator memerlukan kata sandi akses resmi yang valid.</span>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-400">
          TuneForge Studio — Platform Pembuatan Konten Musik Instrumental YouTube Tier-1.
        </p>
      </div>
    </div>
  );
};
