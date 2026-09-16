import React from 'react';
import { Sparkles, Compass, HelpCircle, Layers, LogIn, LayoutDashboard, Wand2 } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { TuneForgeLogo } from '../ui/TuneForgeLogo';

export const Header: React.FC = () => {
  const { currentRoute, navigate, isLoggedIn } = useTuneForgeStore();

  const navItems = [
    { label: 'Beranda', route: '/' },
    { label: 'Fitur 7-Blok', route: '/fitur', icon: Sparkles },
    { label: '18 Kategori', route: '/kategori', icon: Compass },
    { label: 'Cara Kerja', route: '/cara-kerja', icon: Layers },
    { label: 'FAQ', route: '/faq', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <TuneForgeLogo size="sm" showSubtext subtext="by Ridwan Johari" />
        </div>

        {/* Public Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate('/generate')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium cursor-pointer transition-all shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Forge Konten</span>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition-all shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Buka Dasbor</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Login dengan Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
