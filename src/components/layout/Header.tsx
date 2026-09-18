import React from 'react';
import { LogIn, LayoutDashboard, Wand2 } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { TuneForgeLogo } from '../ui/TuneForgeLogo';

export const Header: React.FC = () => {
  const { currentRoute, navigate, isLoggedIn } = useTuneForgeStore();

  const navItems = [
    { label: 'Beranda', route: '/' },
    { label: 'Fitur 7-Blok', route: '/fitur' },
    { label: '18 Kategori', route: '/kategori' },
    { label: 'Cara Kerja', route: '/cara-kerja' },
    { label: 'FAQ', route: '/faq' },
  ];

  return (
    <header
      style={{
        height: '52px',
        backgroundColor: 'var(--bg-overlay)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
      className="sticky top-0 z-40 w-full flex items-center justify-between px-4 sm:px-6"
    >
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <TuneForgeLogo size="sm" showSubtext={false} />
          <span
            style={{
              fontSize: 'var(--text-md)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-primary)',
            }}
          >
            TuneForge
          </span>
        </div>

        {/* Public Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--accent-blue)' : '2px solid transparent',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                }}
                className="cursor-pointer transition-colors hover:text-[var(--text-primary)]"
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate('/generate')}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Forge Konten</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-xs py-1.5 px-3"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Buka Dasbor</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
