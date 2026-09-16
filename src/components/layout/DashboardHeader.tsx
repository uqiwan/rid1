import React, { useEffect } from 'react';
import { Menu, Wand2, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface DashboardHeaderProps {
  onToggleMobileMenu: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleMobileMenu }) => {
  const { currentRoute, navigate, currentUser, aiEngineStatus, checkAiHealth } = useTuneForgeStore();

  useEffect(() => {
    checkAiHealth();
  }, [checkAiHealth]);

  const getBreadcrumbTitle = () => {
    switch (currentRoute) {
      case '/dashboard':
        return 'Dasbor Kreator';
      case '/generate':
        return 'Forge Konten Baru';
      case '/history':
        return 'Riwayat Paket Konten';
      case '/profile':
        return 'Profil Saya';
      case '/admin/dashboard':
        return 'Admin / Statistik Sistem';
      case '/admin/knowledge-base':
        return 'Admin / Kelola Knowledge Base';
      case '/admin/prompt-templates':
        return 'Admin / Prompt Template Library';
      case '/admin/users':
        return 'Admin / Kelola Pengguna';
      default:
        if (currentRoute.startsWith('/generate/result')) return 'Hasil Generate Paket Konten';
        return 'Dasbor';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer hidden sm:inline-block"
          >
            Studio
          </button>
          <span className="text-slate-300 hidden sm:inline-block">/</span>
          <span className="font-semibold text-slate-800 font-display text-sm tracking-tight">
            {getBreadcrumbTitle()}
          </span>
          {currentUser.role === 'admin' && currentRoute.startsWith('/admin') && (
            <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3 text-amber-700" /> Mode Super Admin
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* PWA Install Button */}
        <PWAInstallButton />

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full text-[11px] text-slate-600 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span className="font-medium text-slate-700">{aiEngineStatus.model}</span>
        </div>

        {currentRoute !== '/generate' && (
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold cursor-pointer transition-all shadow-xs"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Forge Konten Baru</span>
            <span className="sm:hidden">Forge</span>
          </button>
        )}
      </div>
    </header>
  );
};

