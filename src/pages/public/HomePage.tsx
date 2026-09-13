import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { QuickBundle } from '../../types';

// UI Enhancements
import { CustomCursor } from '../../components/ui/CustomCursor';
import { FloatingCTA } from '../../components/ui/FloatingCTA';

// 14 Master Editorial Sections
import { EditorialHero } from '../../components/editorial/EditorialHero';
import { EditorialIntro } from '../../components/editorial/EditorialIntro';
import { EditorialCategories } from '../../components/editorial/EditorialCategories';
import { EditorialWins } from '../../components/editorial/EditorialWins';
import { EditorialReviews } from '../../components/editorial/EditorialReviews';
import { EditorialHowItWorks } from '../../components/editorial/EditorialHowItWorks';
import { EditorialMosaic } from '../../components/editorial/EditorialMosaic';
import { EditorialPricing } from '../../components/editorial/EditorialPricing';
import { EditorialJourney } from '../../components/editorial/EditorialJourney';
import { EditorialNetwork } from '../../components/editorial/EditorialNetwork';
import { EditorialManifesto } from '../../components/editorial/EditorialManifesto';
import { EditorialFAQ } from '../../components/editorial/EditorialFAQ';
import { EditorialArticles } from '../../components/editorial/EditorialArticles';
import { EditorialContact } from '../../components/editorial/EditorialContact';

interface HomePageProps {
  setCurrentView: (view: string, params?: any) => void;
  onOpenCompareDemo?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentView }) => {
  const { isAuthenticated } = useAuth();
  const { categories } = useAppData();

  const handleStartBuyer = (bundle?: QuickBundle, categoryId?: string) => {
    if (!isAuthenticated) {
      setCurrentView('login', { redirect: 'create-rfq', bundle, category: categoryId });
      return;
    }
    setCurrentView('create-rfq', { bundle, category: categoryId });
  };

  const handleStartSupplier = () => {
    if (!isAuthenticated) {
      setCurrentView('login', { redirect: 'supplier-inbox' });
      return;
    }
    setCurrentView('supplier-inbox');
  };

  const handleExploreStockists = () => {
    setCurrentView('suppliers');
  };

  const handleCategorySelect = (catId: string) => {
    setCurrentView('suppliers', { category: catId });
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#e61937] selection:text-white overflow-x-hidden">
      {/* Custom Precision Trailing Cursor (Desktop only, automatically hidden on touch) */}
      <CustomCursor />

      {/* Floating Bottom-Right Quick Procurement CTA */}
      <FloatingCTA onStartRFQ={() => handleStartBuyer()} />

      {/* Section 1: Editorial Hero with Hot Red Accent & Oversized Wordmark */}
      <EditorialHero
        onStartRFQ={() => handleStartBuyer()}
        onExploreCategories={handleExploreStockists}
      />

      {/* Section 2: Intro / Who We Are (Ghost text, floating media, core metrics) */}
      <EditorialIntro />

      {/* Section 3: What We Supply (Sticky categories rail + detailed row panels) */}
      <EditorialCategories
        onStartRFQ={(catName) => handleStartBuyer(undefined, catName)}
      />

      {/* Section 4: Featured Procurement Wins (Marquee + Stacked Full-Width Case Studies) */}
      <EditorialWins
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* Section 5: Proof / Client Reviews (Split testimonial + dark metric card + brand marquee) */}
      <EditorialReviews />

      {/* Section 6: How Supply Souq Works (Mockup + curved path + 2x2 interactive process grid) */}
      <EditorialHowItWorks
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* Section 7: Feature Mosaic (3-column capability grid with clipped corners & live metrics) */}
      <EditorialMosaic
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* Section 8: Plans / Pricing (Sliding toggle + 3-column bento, Growth in Hot Red) */}
      <EditorialPricing
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* Section 9: The Journey (Dark section + vertical red timeline) */}
      <EditorialJourney
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* Section 10: Supplier Network & Regional Specialists */}
      <EditorialNetwork
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* Section 11: Belief / Procurement Manifesto */}
      <EditorialManifesto
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* Section 12: Fluid FAQ (Sticky rail + 6 fluid accordions with rotating red plus) */}
      <EditorialFAQ
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* Section 13: Articles & Supply Chain Intelligence (3 editorial cards) */}
      <EditorialArticles
        onStartRFQ={() => handleStartBuyer()}
      />

      {/* Section 14: Contact / Requisition Terminal & Grand Typographic Footer */}
      <EditorialContact
        onStartRFQ={() => handleStartBuyer()}
        onNavigate={setCurrentView}
      />
    </div>
  );
};
