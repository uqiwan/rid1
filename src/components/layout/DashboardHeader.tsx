import React, { useEffect } from 'react';
import { Menu, Wand2, Shield } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

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
        return 'Dasbor';
      case '/generate':
        return 'Forge Konten';
      case '/history':
        return 'Riwayat Paket';
      case '/profile':
        return 'Profil';
      case '/admin/dashboard':
        return 'Admin / Statistik';
      case '/admin/knowledge-base':
        return 'Admin / Knowledge Base';
      case '/admin/prompt-templates':
        return 'Admin / Prompt Library';
      case '/admin/users':
        return 'Admin / Kelola Pengguna';
      default:
        if (currentRoute.startsWith('/generate/result')) return 'Hasil Generate';
        return 'Dasbor';
    }
  };

  return (
    <header className="app-header">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded text-[var(--text-secondary)] hover:bg-[var(--bg-inset)] cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}
            className="hover:text-[var(--text-primary)] transition-colors cursor-pointer hidden sm:inline-block"
          >
            Studio
          </button>
          <span style={{ color: 'var(--border-input)' }} className="hidden sm:inline-block">/</span>
          <span
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-primary)',
            }}
          >
            {getBreadcrumbTitle()}
          </span>
          {currentUser?.role === 'admin' && currentRoute.startsWith('/admin') && (
            <span className="macos-badge macos-badge-warning ml-2">
              <Shield className="w-3 h-3" /> Admin
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] bg-[var(--bg-inset)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
          <span>{aiEngineStatus.model}</span>
        </div>

        {currentRoute !== '/generate' && (
          <button
            onClick={() => navigate('/generate')}
            className="btn-primary py-1.5 px-3 text-xs"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Forge Konten</span>
          </button>
        )}
      </div>
    </header>
  );
};


