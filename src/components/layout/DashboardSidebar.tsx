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
  LogOut,
  Shield
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { UserAvatar } from '../ui/UserAvatar';
import { TuneForgeLogo } from '../ui/TuneForgeLogo';

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onCloseMobile }) => {
  const { 
    currentRoute, 
    navigate, 
    currentUser, 
    logout 
  } = useTuneForgeStore();

  const handleNav = (route: string) => {
    navigate(route);
    if (onCloseMobile) onCloseMobile();
  };

  const userNavItems = [
    { label: 'Dasbor Utama', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Forge Konten', route: '/generate', icon: Wand2 },
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
    <aside
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        width: '240px',
      }}
      className="h-full flex flex-col justify-between select-none text-[var(--text-primary)] shrink-0"
    >
      {/* Top Header & Brand */}
      <div>
        <div
          style={{
            height: '52px',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 var(--space-4)',
          }}
          className="flex items-center justify-between"
        >
          <div 
            onClick={() => handleNav('/dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <TuneForgeLogo size="sm" variant="icon" />
            <div className="flex items-center gap-1.5">
              <span
                style={{
                  fontSize: 'var(--text-md)',
                  fontWeight: 'var(--weight-semibold)',
                  color: 'var(--text-primary)',
                }}
              >
                TuneForge
              </span>
              <span className="macos-badge text-[10px] py-0 px-1.5 font-mono">
                AI
              </span>
            </div>
          </div>
        </div>

        {/* User Card Widget */}
        <div
          style={{
            backgroundColor: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            margin: 'var(--space-3)',
            padding: 'var(--space-3)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <UserAvatar user={currentUser} size="sm" />
            <div className="flex-1 min-w-0">
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-semibold)',
                  color: 'var(--text-primary)',
                }}
                className="truncate m-0"
              >
                {currentUser?.name || 'Kreator'}
              </p>
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                }}
                className="truncate m-0"
              >
                {currentUser?.email || 'creator@tuneforge.ai'}
              </p>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              marginTop: 'var(--space-2)',
              paddingTop: 'var(--space-2)',
            }}
            className="flex items-center justify-between text-[11px]"
          >
            <span style={{ color: 'var(--text-secondary)' }}>Peran</span>
            <span className={currentUser?.role === 'admin' ? 'macos-badge macos-badge-warning' : 'macos-badge'}>
              {currentUser?.role === 'admin' ? 'Super Admin' : 'Kreator'}
            </span>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <div className="px-2 space-y-0.5">
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-tertiary)',
              padding: '4px 10px',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Menu Utama
          </div>
          {userNavItems.map((item) => {
            const isActive = currentRoute === item.route;
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'rgba(0, 122, 255, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-primary)',
                  fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                  fontSize: 'var(--text-sm)',
                  padding: '6px 10px',
                }}
                className="w-full flex items-center gap-2.5 cursor-pointer transition-colors hover:bg-[var(--bg-inset)] text-left"
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' }}
                />
                <span className="flex-1 truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Admin Section (Strictly hidden for non-admin) */}
        {currentUser?.role === 'admin' && (
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              marginTop: 'var(--space-3)',
              paddingTop: 'var(--space-2)',
            }}
            className="px-2 space-y-0.5"
          >
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                padding: '4px 10px',
                fontWeight: 'var(--weight-medium)',
              }}
              className="flex items-center justify-between"
            >
              <span>Admin</span>
              <Shield className="w-3 h-3 text-[var(--accent-orange)]" />
            </div>

            {adminNavItems.map((item) => {
              const isActive = currentRoute === item.route;
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isActive ? 'rgba(0, 122, 255, 0.12)' : 'transparent',
                    color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                    fontSize: 'var(--text-sm)',
                    padding: '6px 10px',
                  }}
                  className="w-full flex items-center gap-2.5 cursor-pointer transition-colors hover:bg-[var(--bg-inset)] text-left"
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-tertiary)' }}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: 'var(--space-3)',
        }}
        className="space-y-1"
      >
        <button
          onClick={logout}
          style={{
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            padding: '6px 10px',
          }}
          className="w-full flex items-center gap-2 cursor-pointer transition-colors hover:bg-[var(--bg-inset)] hover:text-[var(--accent-red)] text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
};

