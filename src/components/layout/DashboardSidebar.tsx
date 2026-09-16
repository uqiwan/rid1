import React from 'react';
import { 
  LayoutDashboard, 
  Wand2, 
  History, 
  User as UserIcon, 
  Database, 
  FileText, 
  Users, 
  SlidersHorizontal,
  Home, 
  LogOut,
  ShieldAlert,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onCloseMobile }) => {
  const { 
    currentRoute, 
    navigate, 
    currentUser, 
    setUserRole, 
    logout 
  } = useTuneForgeStore();

  const handleNav = (route: string) => {
    navigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  const userNavItems = [
    { label: 'Dasbor Utama', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Forge Konten Baru', route: '/generate', icon: Wand2, highlight: true },
    { label: 'Riwayat Paket', route: '/history', icon: History },
    { label: 'Profil Saya', route: '/profile', icon: UserIcon },
  ];

  const adminNavItems = [
    { label: 'Statistik Admin', route: '/admin/dashboard', icon: SlidersHorizontal },
    { label: 'Knowledge Base', route: '/admin/knowledge-base', icon: Database },
    { label: 'Prompt Library', route: '/admin/prompt-templates', icon: FileText },
    { label: 'Kelola Pengguna', route: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 select-none">
      {/* Top Header & Brand */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div 
            onClick={() => handleNav('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-display font-bold text-sm flex items-center justify-center shadow-sm group-hover:bg-amber-400 transition-colors">
              TF
            </div>
            <div>
              <span className="font-display font-bold text-white text-base tracking-tight block">
                TuneForge
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Studio Workspace
              </span>
            </div>
          </div>
        </div>

        {/* User Card Widget */}
        <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Peran:</span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              currentUser.role === 'admin' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {currentUser.role === 'admin' ? 'Pemilik / Admin' : 'Kreator YouTube'}
            </span>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <div className="px-3 py-2 space-y-1">
          <div className="px-3 pb-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
            Menu Kreator
          </div>
          {userNavItems.map((item) => {
            const isActive = currentRoute === item.route;
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : item.highlight
                    ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Section (Accessible or Switchable for Testing) */}
        <div className="px-3 py-3 mt-2 border-t border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between px-3 pb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Area Sistem / Admin
            </span>
            {currentUser.role === 'admin' ? (
              <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-2.5 h-2.5" /> AKTIF
              </span>
            ) : (
              <span className="text-[9px] text-slate-500 font-mono">TERBATAS</span>
            )}
          </div>

          {adminNavItems.map((item) => {
            const isActive = currentRoute === item.route;
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => {
                  if (currentUser.role !== 'admin') {
                    setUserRole('admin');
                  }
                  handleNav(item.route);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions & Role Switcher */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {/* Toggle Role for Demo/Review */}
        <button
          onClick={() => setUserRole(currentUser.role === 'admin' ? 'user' : 'admin')}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700/80 text-[11px] text-slate-300 transition-colors cursor-pointer border border-slate-700/60"
          title="Beralih peran untuk melihat hak akses user / admin"
        >
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulasi Peran:</span>
          </span>
          <span className="font-semibold text-amber-300">
            {currentUser.role === 'admin' ? 'Mode Admin' : 'Mode User'}
          </span>
        </button>

        <button
          onClick={() => handleNav('/generate')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
        >
          <Wand2 className="w-4 h-4 text-amber-400" />
          <span>+ Forge Konten Baru</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
};
