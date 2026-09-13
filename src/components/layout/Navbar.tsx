import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import {
  Layers,
  Search,
  PlusCircle,
  Bell,
  Menu,
  X,
  Store,
  Building2,
  ShieldCheck,
  Zap,
  HelpCircle,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { role, currentCompany, currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublic = ['home', 'categories', 'suppliers', 'how-it-works', 'onboarding-guide', 'login', 'register'].includes(currentView);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#cf2e46] shadow-xs group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-[#cf2e46]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                    Supply<span className="text-[#cf2e46]">Souq</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold block leading-none">
                  B2B Procurement Marketplace
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'home' ? 'bg-slate-100 text-slate-950 font-bold border border-slate-200' : 'hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setCurrentView('how-it-works')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'how-it-works' ? 'bg-slate-100 text-slate-950 font-bold border border-slate-200' : 'hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                How It Works
              </button>

              <button
                onClick={() => {
                  if (currentView === 'home') {
                    const el = document.getElementById('pricing-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setCurrentView('home');
                    setTimeout(() => {
                      const el = document.getElementById('pricing-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="px-3 py-2 rounded-lg transition-colors hover:bg-slate-50 hover:text-slate-950"
              >
                Pricing
              </button>

              <button
                onClick={() => setCurrentView('onboarding-guide')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                  currentView === 'onboarding-guide' ? 'bg-slate-100 text-slate-950 font-bold border border-slate-200' : 'hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#cf2e46]" />
                <span>Onboarding SOP</span>
              </button>

              <button
                onClick={() => setCurrentView('invoice-audit')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 font-bold ${
                  currentView === 'invoice-audit' ? 'bg-rose-50 text-[#cf2e46] border border-rose-200 shadow-2xs' : 'bg-rose-50/70 hover:bg-rose-100 text-[#cf2e46] border border-rose-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#cf2e46]" />
                <span>Free Cost Audit</span>
              </button>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#cf2e46] transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => setCurrentView('login', { redirect: 'create-rfq' })}
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#cf2e46] text-white hover:bg-[#b91c33] transition-all shadow-sm flex items-center gap-1.5 hover:scale-105"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Post RFQ (Free)</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    if (role === 'buyer') setCurrentView('buyer-dashboard');
                    else if (role === 'supplier') setCurrentView('supplier-dashboard');
                    else setCurrentView('admin-dashboard');
                  }}
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#cf2e46] text-white hover:bg-[#b91c33] shadow-sm transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>My Workspace</span>
                </button>
                <button
                  onClick={() => {
                    if (role === 'buyer') setCurrentView('buyer-profile');
                    else if (role === 'supplier') setCurrentView('supplier-profile');
                    else setCurrentView('admin-profile');
                  }}
                  className="p-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-2"
                  title="View & Edit Profile"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-6 h-6 rounded-full object-cover border border-[#cf2e46]/40"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-rose-50 text-[#cf2e46] border border-rose-200 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {(currentUser.fullName || 'User').trim().split(/\s+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 hidden lg:inline max-w-[120px] truncate pr-2">{currentUser.fullName}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#cf2e46]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-slate-50 rounded-lg text-slate-950 font-bold"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-slate-50 rounded-lg"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('pricing-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-slate-50 rounded-lg"
            >
              Pricing
            </button>
            <button
              onClick={() => {
                setCurrentView('onboarding-guide');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left text-[#cf2e46] bg-rose-50 font-bold rounded-lg border border-rose-200"
            >
              Onboarding SOP
            </button>
            <button
              onClick={() => {
                setCurrentView('invoice-audit');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left text-[#cf2e46] bg-rose-50 font-bold rounded-lg border border-rose-200"
            >
              Free Cost Audit (Save 15%+)
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView('login', { redirect: 'create-rfq' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl font-black bg-[#cf2e46] text-white shadow-sm flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Post RFQ (100% Free)</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (role === 'buyer') setCurrentView('buyer-dashboard');
                    else if (role === 'supplier') setCurrentView('supplier-dashboard');
                    else setCurrentView('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl font-black bg-[#cf2e46] text-white shadow-sm"
                >
                  Go to Workspace
                </button>
                <button
                  onClick={() => {
                    if (role === 'buyer') setCurrentView('buyer-profile');
                    else if (role === 'supplier') setCurrentView('supplier-profile');
                    else setCurrentView('admin-profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-700 border border-slate-200"
                >
                  Profile & Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
