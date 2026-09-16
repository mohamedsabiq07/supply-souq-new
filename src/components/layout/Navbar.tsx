import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
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
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import VariableFontCursorProximity from '../fancy/text/variable-font-cursor-proximity';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { role, currentCompany, currentUser, isAuthenticated, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublic = ['home', 'categories', 'suppliers', 'how-it-works', 'onboarding-guide', 'login', 'register'].includes(currentView);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-[#cf2e46] shadow-xs group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-[#cf2e46]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                    <VariableFontCursorProximity
                      fromFontVariationSettings="'wght' 800, 'slnt' 0"
                      toFontVariationSettings="'wght' 950, 'slnt' -8"
                      radius={70}
                      falloff="gaussian"
                    >
                      Supply
                    </VariableFontCursorProximity>
                    <span className="text-[#cf2e46]">
                      <VariableFontCursorProximity
                        fromFontVariationSettings="'wght' 800, 'slnt' 0"
                        toFontVariationSettings="'wght' 950, 'slnt' -8"
                        radius={70}
                        falloff="gaussian"
                      >
                        Souq
                      </VariableFontCursorProximity>
                    </span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block leading-none">
                  <VariableFontCursorProximity
                    fromFontVariationSettings="'wght' 500, 'slnt' 0"
                    toFontVariationSettings="'wght' 800, 'slnt' -5"
                    radius={60}
                    falloff="gaussian"
                  >
                    B2B Procurement Marketplace
                  </VariableFontCursorProximity>
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-bold border border-slate-200 dark:border-slate-700'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <VariableFontCursorProximity
                  fromFontVariationSettings="'wght' 500, 'slnt' 0"
                  toFontVariationSettings="'wght' 800, 'slnt' -5"
                  radius={50}
                  falloff="gaussian"
                >
                  Home
                </VariableFontCursorProximity>
              </button>

              <button
                onClick={() => setCurrentView('how-it-works')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === 'how-it-works'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-bold border border-slate-200 dark:border-slate-700'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <VariableFontCursorProximity
                  fromFontVariationSettings="'wght' 500, 'slnt' 0"
                  toFontVariationSettings="'wght' 800, 'slnt' -5"
                  radius={50}
                  falloff="gaussian"
                >
                  How It Works
                </VariableFontCursorProximity>
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
                className="px-3 py-2 rounded-lg transition-colors hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-950 dark:hover:text-white cursor-pointer"
              >
                <VariableFontCursorProximity
                  fromFontVariationSettings="'wght' 500, 'slnt' 0"
                  toFontVariationSettings="'wght' 800, 'slnt' -5"
                  radius={50}
                  falloff="gaussian"
                >
                  Pricing
                </VariableFontCursorProximity>
              </button>

              <button
                onClick={() => setCurrentView('onboarding-guide')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                  currentView === 'onboarding-guide'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-bold border border-slate-200 dark:border-slate-700'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#cf2e46]" />
                <VariableFontCursorProximity
                  fromFontVariationSettings="'wght' 500, 'slnt' 0"
                  toFontVariationSettings="'wght' 800, 'slnt' -5"
                  radius={50}
                  falloff="gaussian"
                >
                  Onboarding SOP
                </VariableFontCursorProximity>
              </button>

              <button
                onClick={() => setCurrentView('invoice-audit')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 font-bold cursor-pointer ${
                  currentView === 'invoice-audit'
                    ? 'bg-rose-50 dark:bg-rose-950/50 text-[#cf2e46] dark:text-rose-400 border border-rose-200 dark:border-rose-900 shadow-2xs'
                    : 'bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-[#cf2e46] dark:text-rose-400 border border-rose-200 dark:border-rose-900/80'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#cf2e46]" />
                <VariableFontCursorProximity
                  fromFontVariationSettings="'wght' 600, 'slnt' 0"
                  toFontVariationSettings="'wght' 900, 'slnt' -6"
                  radius={50}
                  falloff="gaussian"
                >
                  Free Cost Audit
                </VariableFontCursorProximity>
              </button>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-950 dark:hover:text-amber-300 transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200" />
              )}
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <VariableFontCursorProximity
                    fromFontVariationSettings="'wght' 600, 'slnt' 0"
                    toFontVariationSettings="'wght' 850, 'slnt' -5"
                    radius={50}
                    falloff="gaussian"
                  >
                    Log in
                  </VariableFontCursorProximity>
                </button>
                <button
                  onClick={() => setCurrentView('login', { redirect: 'create-rfq' })}
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#cf2e46] text-white hover:bg-[#b91c33] transition-all shadow-sm flex items-center gap-1.5 hover:scale-105 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <VariableFontCursorProximity
                    fromFontVariationSettings="'wght' 700, 'slnt' 0"
                    toFontVariationSettings="'wght' 950, 'slnt' -8"
                    radius={60}
                    falloff="gaussian"
                  >
                    Post RFQ (Free)
                  </VariableFontCursorProximity>
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
                  className="px-4 py-2 rounded-full text-xs font-black bg-[#cf2e46] text-white hover:bg-[#b91c33] shadow-sm transition-all flex items-center gap-1.5 hover:scale-105 cursor-pointer"
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
                  className="p-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
                  title="View & Edit Profile"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-6 h-6 rounded-full object-cover border border-[#cf2e46]/40"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950/60 text-[#cf2e46] border border-rose-200 dark:border-rose-900 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {(currentUser.fullName || 'User').trim().split(/\s+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden lg:inline max-w-[120px] truncate pr-2">{currentUser.fullName}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions: Theme Toggle & Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#cf2e46]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-3 shadow-lg transition-colors duration-200">
          {/* Mobile Theme Switcher Bar */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-[#cf2e46]" />}
              Theme: <span className="capitalize text-[#cf2e46]">{theme} Mode</span>
            </span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
            >
              Switch to {isDark ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="flex flex-col gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-950 dark:text-white font-bold cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('pricing-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => {
                setCurrentView('onboarding-guide');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left text-[#cf2e46] bg-rose-50 dark:bg-rose-950/40 font-bold rounded-lg border border-rose-200 dark:border-rose-900/80 cursor-pointer"
            >
              Onboarding SOP
            </button>
            <button
              onClick={() => {
                setCurrentView('invoice-audit');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left text-[#cf2e46] bg-rose-50 dark:bg-rose-950/40 font-bold rounded-lg border border-rose-200 dark:border-rose-900/80 flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#cf2e46]" />
                Free Cost Audit
              </span>
              <span className="text-[10px] bg-[#cf2e46] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Save 15%+</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView('login', { redirect: 'create-rfq' });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl font-black bg-[#cf2e46] text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Post RFQ (100% Free)</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
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
                  className="w-full py-3 rounded-xl font-black bg-[#cf2e46] text-white shadow-sm cursor-pointer"
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
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  Profile & Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/30 cursor-pointer"
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
