import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { QuickBundle } from '../../types';

import { NeidenHero } from '../../components/home/NeidenHero';
import { NeidenPhilosophy } from '../../components/home/NeidenPhilosophy';
import { NeidenStackCards } from '../../components/home/NeidenStackCards';
import { NeidenShowcase } from '../../components/home/NeidenShowcase';
import { NeidenProcess } from '../../components/home/NeidenProcess';
import { NeidenTimeline } from '../../components/home/NeidenTimeline';
import { NeidenPricing } from '../../components/home/NeidenPricing';
import { NeidenFAQ } from '../../components/home/NeidenFAQ';
import { NeidenFooter } from '../../components/home/NeidenFooter';

interface HomePageProps {
  setCurrentView: (view: string, params?: any) => void;
  onOpenCompareDemo?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentView }) => {
  const { isAuthenticated } = useAuth();
  const { categories, companies, rfqs } = useAppData();

  const handleStartBuyer = (bundle?: QuickBundle) => {
    if (!isAuthenticated) {
      setCurrentView('login', { redirect: 'create-rfq', bundle });
      return;
    }
    setCurrentView('create-rfq', { bundle });
  };

  const handleStartSupplier = () => {
    if (!isAuthenticated) {
      setCurrentView('login', { redirect: 'supplier-inbox' });
      return;
    }
    setCurrentView('supplier-inbox');
  };

  return (
    <div className="min-h-screen bg-[#020706] text-slate-100 font-sans selection:bg-emerald-400 selection:text-slate-950 overflow-x-hidden">
      {/* 1. Neiden Hero Section */}
      <NeidenHero
        onStartBuyer={handleStartBuyer}
        onExploreStockists={() => setCurrentView('suppliers')}
      />

      {/* 2. Neiden Philosophy & Who We Are */}
      <NeidenPhilosophy />

      {/* 3. Neiden Flagship Sticky Stacking Cards */}
      <NeidenStackCards
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* 4. Neiden Horizontal Project & Case Studies Showcase */}
      <NeidenShowcase
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* 5. Neiden 3-Step Process Flow */}
      <NeidenProcess
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* 6. Neiden Milestone Timeline */}
      <NeidenTimeline />

      {/* 7. Neiden Interactive Bento Pricing Grid */}
      <NeidenPricing
        onStartBuyer={() => handleStartBuyer()}
        onStartSupplier={handleStartSupplier}
      />

      {/* 8. Neiden Numbered FAQ Accordion */}
      <NeidenFAQ />

      {/* 9. Neiden Grand Typographic Footer */}
      <NeidenFooter
        onNavigate={setCurrentView}
      />
    </div>
  );
};