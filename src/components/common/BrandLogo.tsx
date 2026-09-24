import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'wordmark' | 'icon' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = false,
}) => {
  // Height presets for the wordmark - scaled up for high-impact clarity & legibility
  const wordmarkHeights = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9 md:h-10',
    lg: 'h-11 sm:h-13 md:h-14',
    xl: 'h-14 sm:h-18 md:h-20',
  };

  // Dimensions for the unboxed PS monogram
  const iconDimensions = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
  };

  // Standalone Icon Variant (unboxed with luminous ambient aura)
  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center shrink-0 group/icon select-none ${className}`}>
        {/* Ambient subtle backglow */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-brand-600/20 via-[#cf2e46]/20 to-amber-500/20 blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/icon:scale-105 ${iconDimensions[size]}`}>
          <img
            src="/logos/icon-black-transparent.svg"
            alt="Procure Souq PS Icon"
            className="w-full h-full object-contain dark:hidden"
            loading="eager"
          />
          <img
            src="/logos/icon-white-transparent.svg"
            alt="Procure Souq PS Icon"
            className="w-full h-full object-contain hidden dark:block"
            loading="eager"
          />
        </div>
      </div>
    );
  }

  // Glow Wordmark Variant
  if (variant === 'glow') {
    return (
      <div className={`relative flex items-center select-none ${className}`}>
        <img
          src="/logos/logo-glow-transparent.svg"
          alt="Procure Souq"
          className={`w-auto object-contain ${wordmarkHeights[size]}`}
          loading="eager"
        />
      </div>
    );
  }

  // Pure Wordmark Variant
  if (variant === 'wordmark') {
    return (
      <div className={`flex flex-col select-none ${className}`}>
        <div className="flex items-center">
          <img
            src="/logos/logo-black-transparent.svg"
            alt="Procure Souq"
            className={`w-auto object-contain dark:hidden ${wordmarkHeights[size]}`}
            loading="eager"
          />
          <img
            src="/logos/logo-white-transparent.svg"
            alt="Procure Souq"
            className={`w-auto object-contain hidden dark:block ${wordmarkHeights[size]}`}
            loading="eager"
          />
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-semibold tracking-tight mt-0.5">
            B2B Procurement Marketplace
          </span>
        )}
      </div>
    );
  }

  // Default 'full' variant: Elevated unboxed PS monogram with subtle aura + architectural divider + bold wordmark
  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* Unboxed Monogram with Subtle Interactive Ambient Aura */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-brand-600/15 via-[#cf2e46]/20 to-amber-500/15 blur-md opacity-0 group-hover/logo:opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/logo:scale-105 group-hover:scale-105 ${iconDimensions[size]}`}>
          <img
            src="/logos/icon-black-transparent.svg"
            alt="PS Monogram"
            className="w-full h-full object-contain dark:hidden"
            loading="eager"
          />
          <img
            src="/logos/icon-white-transparent.svg"
            alt="PS Monogram"
            className="w-full h-full object-contain hidden dark:block"
            loading="eager"
          />
        </div>
      </div>

      {/* Elegant Hairline Divider */}
      <div className="h-6 sm:h-7 w-[1.5px] bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent shrink-0 mx-0.5 hidden sm:block" />

      {/* Scaled Wordmark */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <img
            src="/logos/logo-black-transparent.svg"
            alt="Procure Souq"
            className={`w-auto object-contain dark:hidden ${wordmarkHeights[size]}`}
            loading="eager"
          />
          <img
            src="/logos/logo-white-transparent.svg"
            alt="Procure Souq"
            className={`w-auto object-contain hidden dark:block ${wordmarkHeights[size]}`}
            loading="eager"
          />
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-semibold tracking-tight mt-0.5 leading-none">
            B2B Procurement Marketplace
          </span>
        )}
      </div>
    </div>
  );
};
