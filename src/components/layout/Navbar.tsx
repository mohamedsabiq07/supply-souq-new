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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-navy-900 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                    Supply<span className="text-brand-600">Souq</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block leading-none">
                  B2B Procurement Marketplace
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'home' ? 'bg-slate-100 text-brand-600 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setCurrentView('how-it-works')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'how-it-works' ? 'bg-slate-100 text-brand-600 font-bold' : 'hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                How It Works
              </button>

              <button
                onClick={() => setCurrentView('onboarding-guide')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                  currentView === 'onboarding-guide' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Onboarding SOP</span>
              </button>

              <button
                onClick={() => setCurrentView('invoice-audit')}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 font-bold ${
                  currentView === 'invoice-audit' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Free Cost Audit</span>
              </button>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isAuthenticated && role === 'buyer' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentView('create-rfq')}
                leftIcon={<PlusCircle className="w-4 h-4 text-amber-300" />}
                className="bg-brand-600 hover:bg-brand-700 shadow-sm font-bold"
              >
                Post an RFQ
              </Button>
            )}

            {isAuthenticated && role === 'supplier' && (
              <Button
                variant="amber"
                size="sm"
                onClick={() => setCurrentView('supplier-inbox')}
                leftIcon={<Zap className="w-4 h-4" />}
                className="font-bold"
              >
                RFQ Inbox (Live)
              </Button>
            )}

            {isAuthenticated && role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('admin-dashboard')}
                leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
                className="font-bold border-emerald-300 bg-emerald-50/50 text-emerald-800"
              >
                Admin Operations
              </Button>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => {
                    if (role === 'buyer') setCurrentView('buyer-dashboard');
                    else if (role === 'supplier') setCurrentView('supplier-dashboard');
                    else setCurrentView('admin-dashboard');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  My Workspace
                </button>
                <button
                  onClick={() => {
                    logout();
                    setCurrentView('home');
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left hover:bg-slate-50 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left hover:bg-slate-50 rounded-lg"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                setCurrentView('onboarding-guide');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left text-emerald-800 bg-emerald-50 font-bold rounded-lg"
            >
              Onboarding SOP
            </button>
            <button
              onClick={() => {
                setCurrentView('invoice-audit');
                setMobileMenuOpen(false);
              }}
              className="p-2 text-left text-amber-900 bg-amber-50 font-bold rounded-lg border border-amber-200"
            >
              Free Cost Audit (Save 15%+)
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => {
                    setCurrentView('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                >
                  Sign In to Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentView('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                >
                  Register New Account
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (role === 'buyer') setCurrentView('buyer-dashboard');
                    else if (role === 'supplier') setCurrentView('supplier-dashboard');
                    else setCurrentView('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                >
                  Go to Workspace
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    logout();
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};