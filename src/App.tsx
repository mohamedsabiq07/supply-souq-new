import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { MarketTicker } from './components/ui/MarketTicker';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { CategoriesPage } from './pages/public/CategoriesPage';
import { SuppliersPage } from './pages/public/SuppliersPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { OnboardingGuidePage } from './pages/public/OnboardingGuidePage';
import { InvoiceAuditPage } from './pages/public/InvoiceAuditPage';

// Buyer Pages
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { BuyerRFQsPage } from './pages/buyer/BuyerRFQsPage';
import { CreateRFQPage } from './pages/buyer/CreateRFQPage';
import { RFQDetailPage } from './pages/buyer/RFQDetailPage';
import { CompareQuotesPage } from './pages/buyer/CompareQuotesPage';
import { BuyerOrdersPage } from './pages/buyer/BuyerOrdersPage';
import { BuyerMessagesPage } from './pages/buyer/BuyerMessagesPage';

// Supplier Pages
import { SupplierDashboard } from './pages/supplier/SupplierDashboard';
import { SupplierInboxPage } from './pages/supplier/SupplierInboxPage';
import { SubmitQuotePage } from './pages/supplier/SubmitQuotePage';
import { SupplierQuotationsPage } from './pages/supplier/SupplierQuotationsPage';
import { SupplierOrdersPage } from './pages/supplier/SupplierOrdersPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';

// Profile Page
import { ProfilePage } from './pages/profile/ProfilePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

const AppContent: React.FC = () => {
  const { role, setRole, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<string>(() => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const viewParam = search.get('view')?.toLowerCase() || search.get('page')?.toLowerCase();
      if (hash === 'admin' || hash === 'admin-dashboard' || hash === 'admin-login' || viewParam === 'admin' || viewParam === 'admin-dashboard' || viewParam === 'admin-login') {
        return 'admin-login';
      }
    } catch (e) {}
    return 'home';
  });
  const [viewParams, setViewParams] = useState<any>({});

  // Listen to hash / URL change for direct #admin access
  React.useEffect(() => {
    const handleHashOrSearch = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const search = new URLSearchParams(window.location.search);
      const viewParam = search.get('view')?.toLowerCase() || search.get('page')?.toLowerCase();
      if (hash === 'admin' || hash === 'admin-dashboard' || hash === 'admin-login' || viewParam === 'admin' || viewParam === 'admin-dashboard' || viewParam === 'admin-login') {
        if (isAuthenticated && role === 'admin') {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
        }
      }
    };
    window.addEventListener('hashchange', handleHashOrSearch);
    return () => window.removeEventListener('hashchange', handleHashOrSearch);
  }, [isAuthenticated, role]);

  // Auto-redirect to dashboard when authenticated on login/register pages
  React.useEffect(() => {
    if (isAuthenticated && (currentView === 'login' || currentView === 'admin-login' || currentView === 'register')) {
      const destination = role === 'supplier' ? 'supplier-dashboard' : role === 'admin' ? 'admin-dashboard' : 'buyer-dashboard';
      setCurrentView(destination);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAuthenticated, role, currentView]);

  const handleNavigate = (view: string, params: any = {}, allowBypass: boolean = false) => {
    setViewParams(params);

    const publicViews = [
      'home', 
      'categories', 
      'suppliers', 
      'how-it-works', 
      'onboarding-guide', 
      'invoice-audit', 
      'login', 
      'admin-login',
      'register'
    ];

    if (!isAuthenticated && !allowBypass && !publicViews.includes(view)) {
      if (view.startsWith('admin')) {
        setCurrentView('admin-login');
      } else {
        setCurrentView('login');
      }
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if this is a full-width public page or a dashboard view with sidebar
  const isPublicPage = [
    'home', 
    'categories', 
    'suppliers', 
    'how-it-works', 
    'onboarding-guide', 
    'invoice-audit', 
    'login', 
    'admin-login',
    'register'
  ].includes(currentView);

  // If user is logged out and tries to access private workspace, redirect to public login
  if (!isAuthenticated && !isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <Navbar currentView={currentView} setCurrentView={handleNavigate} />
        <MarketTicker />
        <main className="flex-1">
          <LoginPage 
            isAdminMode={currentView.startsWith('admin')}
            onSuccess={(target) => {
              const dest = target || (role === 'supplier' ? 'supplier-dashboard' : role === 'admin' ? 'admin-dashboard' : 'buyer-dashboard');
              handleNavigate(dest, {}, true);
            }} 
            onNavigateToRegister={() => handleNavigate('register')}
          />
        </main>
        <Footer setCurrentView={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Main Brand Navbar at the Top */}
      <Navbar currentView={currentView} setCurrentView={handleNavigate} />

      {/* Live Market Telemetry Ticker - Sleek Sub-Navbar Ribbon */}
      <MarketTicker />

      {/* Main Content Body */}
      {isPublicPage ? (
        <main className="flex-1">
          {currentView === 'home' && (
            <HomePage setCurrentView={handleNavigate} />
          )}
          {currentView === 'categories' && (
            <SuppliersPage onRequestQuote={(targetSupplier, category) => {
              if (!isAuthenticated) {
                handleNavigate('login', { targetSupplier, category });
              } else {
                handleNavigate('create-rfq', { targetSupplier, category });
              }
            }} />
          )}
          {currentView === 'suppliers' && (
            <SuppliersPage onRequestQuote={(targetSupplier, category) => {
              if (!isAuthenticated) {
                handleNavigate('login', { targetSupplier, category });
              } else {
                handleNavigate('create-rfq', { targetSupplier, category });
              }
            }} />
          )}
          {currentView === 'how-it-works' && (
            <HowItWorksPage onStartRFQ={() => handleNavigate(isAuthenticated ? 'create-rfq' : 'login')} />
          )}
          {currentView === 'onboarding-guide' && (
            <OnboardingGuidePage
              onStartBuyer={() => {
                if (!isAuthenticated) handleNavigate('register');
                else handleNavigate('create-rfq');
              }}
              onStartSupplier={() => {
                if (!isAuthenticated) handleNavigate('register');
                else handleNavigate('supplier-inbox');
              }}
            />
          )}
          {currentView === 'invoice-audit' && (
            <InvoiceAuditPage
              onStartRFQWithAudit={(bundle) => {
                if (!isAuthenticated) handleNavigate('login', { bundle });
                else handleNavigate('create-rfq', { bundle });
              }}
            />
          )}
          {(currentView === 'login' || currentView === 'admin-login') && (
            <LoginPage 
              isAdminMode={currentView === 'admin-login'}
              onSuccess={(target) => {
                const dest = target || (role === 'supplier' ? 'supplier-dashboard' : role === 'admin' ? 'admin-dashboard' : 'buyer-dashboard');
                handleNavigate(dest, {}, true);
              }} 
              onNavigateToRegister={() => handleNavigate('register')}
            />
          )}
          {currentView === 'register' && (
            <RegisterPage 
              onSuccess={(target) => {
                const dest = target || (role === 'supplier' ? 'supplier-dashboard' : 'buyer-dashboard');
                handleNavigate(dest, {}, true);
              }} 
              onNavigateToLogin={() => handleNavigate('login')}
            />
          )}
          <Footer setCurrentView={handleNavigate} />
        </main>
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
          {/* Sidebar */}
          <Sidebar currentView={currentView} setCurrentView={handleNavigate} />

          {/* Active Workspace View */}
          <main className="flex-1 min-w-0">
            {/* Buyer Views */}
            {(currentView === 'buyer' || currentView === 'buyer-dashboard') && (
              <BuyerDashboard onNavigate={handleNavigate} />
            )}
            {currentView === 'buyer-rfqs' && (
              <BuyerRFQsPage onNavigate={handleNavigate} />
            )}
            {currentView === 'create-rfq' && (
              <CreateRFQPage 
                initialBundle={viewParams.bundle} 
                targetSupplier={viewParams.targetSupplier}
                initialCategory={viewParams.category}
                onNavigate={handleNavigate} 
              />
            )}
            {currentView === 'rfq-detail' && (
              <RFQDetailPage rfqId={viewParams.rfqId} onNavigate={handleNavigate} />
            )}
            {(currentView === 'buyer-compare' || currentView === 'buyer-compare-quick') && (
              <CompareQuotesPage rfqId={viewParams.rfqId} onNavigate={handleNavigate} />
            )}
            {currentView === 'buyer-orders' && (
              <BuyerOrdersPage />
            )}
            {currentView === 'buyer-messages' && (
              <BuyerMessagesPage />
            )}

            {/* Supplier Views */}
            {(currentView === 'supplier' || currentView === 'supplier-dashboard') && (
              <SupplierDashboard onNavigate={handleNavigate} />
            )}
            {currentView === 'supplier-inbox' && (
              <SupplierInboxPage onNavigate={handleNavigate} />
            )}
            {currentView === 'submit-quote' && (
              <SubmitQuotePage rfqId={viewParams.rfqId} onNavigate={handleNavigate} />
            )}
            {currentView === 'supplier-quotes' && (
              <SupplierQuotationsPage />
            )}
            {currentView === 'supplier-orders' && (
              <SupplierOrdersPage />
            )}
            {currentView === 'supplier-messages' && (
              <BuyerMessagesPage />
            )}

            {/* Universal Profile & Settings View */}
            {(currentView === 'profile' || currentView === 'buyer-profile' || currentView === 'supplier-profile' || currentView === 'admin-profile') && (
              <ProfilePage />
            )}

            {/* Admin Views */}
            {(currentView === 'admin' || currentView === 'admin-dashboard') && (
              <AdminDashboard onNavigate={handleNavigate} />
            )}
            {currentView === 'admin-verifications' && (
              <AdminVerificationPage />
            )}
            {currentView === 'admin-rfqs' && (
              <BuyerRFQsPage onNavigate={handleNavigate} />
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AppContent />
      </AppDataProvider>
    </AuthProvider>
  );
}