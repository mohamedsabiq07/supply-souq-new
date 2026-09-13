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
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-[#cf2e46]/15 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#cf2e46]/20 to-[#2a050d] border border-[#cf2e46]/40 flex items-center justify-center text-[#cf2e46] shadow-glow-red group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-[#cf2e46]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-white tracking-tight">
                    Supply<span className="text-[#cf2e46]">Souq</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block leading-none">
                  B2B Procurement Marketplace
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-300">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'home' ? 'bg-[#2a050dcc] text-[#cf2e46] font-bold border border-[#cf2e46]/30' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setCurrentView('how-it-works')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'how-it-works' ? 'bg-[#2a050dcc] text-[#cf2e46] font-bold border border-[#cf2e46]/30' : 'hover:bg-white/5 hover:text-white'
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
                className="px-3 py-2 rounded-lg transition-colors hover:bg-white/5 hover:text-white"
              >
                Pricing
              </button>

              <button
                onClick={() => setCurrentView('onboarding-guide')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                  currentView === 'onboarding-guide' ? 'bg-[#2a050dcc] text-[#cf2e46] font-bold border border-[#cf2e46]/30' : 'hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#cf2e46]" />
                <span>Onboarding SOP</span>
              </button>

              <button
                onClick={() => setCurrentView('invoice-audit')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 font-bold ${
                  currentView === 'invoice-audit' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
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
                  className="px-3 py-2 text-xs font-bold text-slate-300 hover:text-[#cf2e46] transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => setCurrentView('login', { redirect: 'create-rfq' })}
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#cf2e46] text-white hover:bg-[#b91c33] transition-all shadow-glow-red flex items-center gap-1.5 hover:scale-105"
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
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#cf2e46] text-white hover:bg-[#b91c33] shadow-glow-red transition-all flex items-center gap-1.5 hover:scale-105"
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
                  className="p-1.5 rounded-full border border-white/10 hover:border-[#cf2e46]/40 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
                  title="View & Edit Profile"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-6 h-6 rounded-full object-cover border border-[#cf2e46]/40"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#2a050d] text-[#cf2e46] border border-[#cf2e46]/40 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {(currentUser.fullName || 'User').trim().split(/\s+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-200 hidden lg:inline max-w-[120px] truncate pr-2">{currentUser.fullName}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#cf2e46]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#cf2e46]/20 bg-[#050505]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-1 text-sm font-semibold text-slate-300">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-white/5 rounded-lg text-white font-bold"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-white/5 rounded-lg"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('pricing-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-white/5 rounded-lg"
            >
              Pricing
            </button>
            <button
              onClick={() => {
                setCurrentView('onboarding-guide');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left text-[#cf2e46] bg-[#2a050dcc] font-bold rounded-lg border border-[#cf2e46]/30"
            >
              Onboarding SOP
            </button>
            <button
              onClick={() => {
                setCurrentView('invoice-audit');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left text-rose-300 bg-rose-500/10 font-bold rounded-lg border border-rose-500/30"
            >
              Free Cost Audit (Save 15%+)
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView('login', { redirect: 'create-rfq' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl font-black bg-[#cf2e46] text-white shadow-glow-red flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Post RFQ (100% Free)</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-300 border border-white/10 hover:bg-white/5"
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
                  className="w-full py-3 rounded-xl font-black bg-[#cf2e46] text-white shadow-glow-red"
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
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-300 border border-white/10"
                >
                  Profile & Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10"
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
