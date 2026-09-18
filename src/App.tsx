import React, { useState } from 'react';
import { useTuneForgeStore } from './store/useTuneForgeStore';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DashboardSidebar } from './components/layout/DashboardSidebar';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { GlobalToast } from './components/ui/CopyButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { CategoriesPage } from './pages/public/CategoriesPage';
import { CategoryDetailPage } from './pages/public/CategoryDetailPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { FAQPage } from './pages/public/FAQPage';
import { LoginPage } from './pages/public/LoginPage';

// Dashboard & Member Pages
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { GeneratePage } from './pages/dashboard/GeneratePage';
import { ResultPage } from './pages/dashboard/ResultPage';
import { HistoryPage } from './pages/dashboard/HistoryPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminKnowledgeBase } from './pages/admin/AdminKnowledgeBase';
import { AdminPromptTemplates } from './pages/admin/AdminPromptTemplates';
import { AdminUsers } from './pages/admin/AdminUsers';

export default function App() {
  const { currentRoute, routeParam, isLoggedIn, currentUser, navigate } = useTuneForgeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If non-admin user attempts to access /admin routes, redirect immediately to /dashboard
  React.useEffect(() => {
    if (isLoggedIn && currentUser?.role !== 'admin' && currentRoute.startsWith('/admin')) {
      navigate('/dashboard');
    }
  }, [currentRoute, currentUser?.role, isLoggedIn, navigate]);

  // Check if current route is part of Dashboard / Admin
  const isDashboardRoute = 
    currentRoute === '/' ||
    currentRoute === '/dashboard' ||
    currentRoute === '/generate' ||
    currentRoute.startsWith('/generate/result') ||
    currentRoute === '/history' ||
    currentRoute === '/profile' ||
    currentRoute.startsWith('/admin');

  // Mandatory Authentication: If user is not logged in, enforce login for main features or on initial load
  if (!isLoggedIn && (isDashboardRoute || currentRoute === '/login')) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col antialiased selection:bg-amber-100 selection:text-amber-900">
        <GlobalToast />
        <OfflineIndicator />
        <Header />
        <main className="flex-1 flex items-center justify-center bg-slate-50/50">
          <LoginPage />
        </main>
        <Footer />
      </div>
    );
  }

  // Render Public Page view (fallback if accessed)
  const renderPublicContent = () => {
    switch (currentRoute) {
      case '/fitur':
        return <FeaturesPage />;
      case '/kategori':
        if (routeParam) {
          return <CategoryDetailPage slug={routeParam} />;
        }
        return <CategoriesPage />;
      case '/cara-kerja':
        return <HowItWorksPage />;
      case '/faq':
        return <FAQPage />;
      case '/login':
        return <LoginPage />;
      default:
        return <DashboardOverview />;
    }
  };

  // Render Dashboard / Admin Page view
  const renderDashboardContent = () => {
    // If not super admin, block access to any admin pages
    if (currentRoute.startsWith('/admin') && currentUser?.role !== 'admin') {
      return <DashboardOverview />;
    }

    switch (currentRoute) {
      case '/':
      case '/dashboard':
        return <DashboardOverview />;
      case '/generate':
        return <GeneratePage />;
      case '/history':
        return <HistoryPage />;
      case '/profile':
        return <ProfilePage />;
      case '/admin/dashboard':
        return <AdminDashboard />;
      case '/admin/knowledge-base':
        return <AdminKnowledgeBase />;
      case '/admin/prompt-templates':
        return <AdminPromptTemplates />;
      case '/admin/users':
        return <AdminUsers />;
      default:
        if (currentRoute.startsWith('/generate/result')) {
          const parts = currentRoute.split('/');
          const pkgId = parts[3] || undefined;
          return <ResultPage packageId={pkgId} />;
        }
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col antialiased selection:bg-amber-100 selection:text-amber-900">
      <GlobalToast />
      <OfflineIndicator />

      {isDashboardRoute ? (
        // DASHBOARD & ADMIN LAYOUT (Persistent 240px Sidebar + Mobile Drawer)
        <div className="flex h-screen overflow-hidden bg-slate-50/50">
          {/* Desktop Fixed Sidebar */}
          <div className="hidden md:block shrink-0">
            <DashboardSidebar />
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              <div 
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
                onClick={() => setMobileMenuOpen(false)} 
              />
              <div className="relative z-10 w-72 max-w-xs h-full bg-slate-900">
                <DashboardSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          )}

          {/* Main Content Area with Header */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <DashboardHeader onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
            <main className="flex-1">
              {renderDashboardContent()}
            </main>
          </div>
        </div>
      ) : (
        // PUBLIC LAYOUT (Sticky Header + Content + Footer)
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {renderPublicContent()}
          </main>
          <Footer />
        </div>
      )}
    </div>
  );
}
