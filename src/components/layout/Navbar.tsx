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
import { BrandLogo } from '../common/BrandLogo';
import { CreateRFQButton } from '../common/CreateRFQButton';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string, params?: any) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  mobileMenuOpen: externalMobileMenuOpen,
  setMobileMenuOpen: externalSetMobileMenuOpen,
}) => {
  const { role, currentCompany, currentUser, isAuthenticated, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const mobileMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;
  const setMobileMenuOpen = externalSetMobileMenuOpen || setInternalMobileMenuOpen;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isPublic = ['home', 'categories', 'suppliers', 'how-it-works', 'onboarding-guide', 'login', 'register'].includes(currentView);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  };

  return (
    <header
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full bg-white/90 dark:bg-[#070709]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08] text-slate-900 dark:text-zinc-100 shadow-xs transition-all duration-300 relative group"
    >
      {/* Dynamic Cursor Spotlight Beam on Hover */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 overflow-hidden"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(207, 46, 70, 0.14), transparent 70%)`
        }}
      />

      {/* Interactive Bottom Border Cursor Glow Beam */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] transition-opacity duration-300 overflow-hidden"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <div
          className="absolute h-full w-56 bg-gradient-to-r from-transparent via-[#cf2e46] to-transparent blur-[1px] transition-transform duration-75 ease-out"
          style={{ transform: `translateX(${mousePos.x - 112}px)` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center text-left focus:outline-none group/logo cursor-pointer py-1"
              title="Procure Souq Home"
            >
              <BrandLogo variant="full" size="md" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-zinc-300">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                  currentView === 'home'
                    ? 'bg-slate-100 dark:bg-white/[0.1] text-slate-950 dark:text-white font-bold border border-slate-200/80 dark:border-white/[0.12] shadow-2xs'
                    : 'hover:bg-slate-100/80 dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white'
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
                className={`px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                  currentView === 'how-it-works'
                    ? 'bg-slate-100 dark:bg-white/[0.1] text-slate-950 dark:text-white font-bold border border-slate-200/80 dark:border-white/[0.12] shadow-2xs'
                    : 'hover:bg-slate-100/80 dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white'
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
                onClick={() => setCurrentView('onboarding-guide')}
                className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  currentView === 'onboarding-guide'
                    ? 'bg-slate-100 dark:bg-white/[0.1] text-slate-950 dark:text-white font-bold border border-slate-200/80 dark:border-white/[0.12] shadow-2xs'
                    : 'hover:bg-slate-100/80 dark:hover:bg-white/[0.06] hover:text-slate-950 dark:hover:text-white'
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
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Subtle Minimalist Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              data-testid="theme-toggle"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.06] transition-colors cursor-pointer mr-1"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform duration-200" />
              )}
            </button>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:text-[#cf2e46] dark:hover:text-rose-400 transition-colors cursor-pointer"
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
                <CreateRFQButton
                  size="sm"
                  onClick={() => setCurrentView('create-rfq')}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    if (role === 'buyer') setCurrentView('buyer-dashboard');
                    else if (role === 'supplier') setCurrentView('supplier-dashboard');
                    else setCurrentView('admin-dashboard');
                  }}
                  className="px-4 py-2 rounded-full text-xs font-black bg-gradient-to-r from-[#cf2e46] to-[#b91c33] text-white hover:from-[#b91c33] hover:to-[#9f1230] shadow-md shadow-[#cf2e46]/20 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
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
                  className="p-1.5 rounded-full border border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 bg-slate-50 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:scale-105"
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
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 hidden lg:inline max-w-[120px] truncate pr-2">{currentUser.fullName}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions: Subtle Theme Toggle + Menu Toggle */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#cf2e46]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0c0c0e] px-4 pt-3 pb-6 space-y-3 shadow-lg transition-colors duration-200">
          <div className="flex flex-col gap-1 text-sm font-semibold text-slate-700 dark:text-zinc-300">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-slate-50 dark:hover:bg-white/[0.04] rounded-lg text-slate-950 dark:text-white font-bold cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setCurrentView('onboarding-guide');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 text-left text-[#cf2e46] bg-rose-50 dark:bg-rose-950/40 font-bold rounded-lg border border-rose-200 dark:border-rose-900/80 cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#cf2e46]" />
              <span>Onboarding SOP</span>
            </button>
          </div>

          {/* Theme Quick Switcher in Mobile Drawer */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06] text-xs font-semibold text-slate-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="text-[11px] font-bold text-[#cf2e46] hover:underline"
            >
              Switch to {isDark ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-white/[0.06] space-y-2">
            {!isAuthenticated ? (
              <>
                <CreateRFQButton
                  size="md"
                  className="w-full justify-center py-2.5"
                  onClick={() => {
                    setCurrentView('create-rfq');
                    setMobileMenuOpen(false);
                  }}
                >
                  Create New RFQ
                </CreateRFQButton>
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer"
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
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer"
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
