import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'wordmark' | 'icon' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  wordmarkClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = false,
  wordmarkClassName,
}) => {
  // Height presets for the wordmark - perfectly balanced to fit standard h-16 taskbar
  const wordmarkHeights = {
    sm: 'h-6 sm:h-6.5',
    md: 'h-8 sm:h-8.5 md:h-9',
    lg: 'h-11 sm:h-12 md:h-13',
    xl: 'h-14 sm:h-16 md:h-18',
  };

  // Dimensions for the unboxed PS monogram
  const iconDimensions = {
    sm: 'w-6 h-6 sm:w-6.5 sm:h-6.5',
    md: 'w-7.5 h-7.5 sm:w-8 sm:h-8 md:w-8.5 md:h-8.5',
    lg: 'w-10 h-10 sm:w-11 sm:h-11',
    xl: 'w-13 h-13 sm:w-15 sm:h-15',
  };

  const actualWordmarkClass = wordmarkClassName || wordmarkHeights[size];

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
          className={`w-auto object-contain ${actualWordmarkClass}`}
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
            className={`w-auto object-contain dark:hidden ${actualWordmarkClass}`}
            loading="eager"
          />
          <img
            src="/logos/logo-white-transparent.svg"
            alt="Procure Souq"
            className={`w-auto object-contain hidden dark:block ${actualWordmarkClass}`}
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

  // Default 'full' variant: Elevated unboxed PS monogram with subtle aura + architectural divider + enlarged wordmark
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
      <div className="h-6 sm:h-6.5 w-[1.5px] bg-gradient-to-b from-transparent via-slate-300 dark:via-white/20 to-transparent shrink-0 mx-0.5 hidden sm:block" />

      {/* Enlarged Prominent Wordmark */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center">
          <img
            src="/logos/logo-black-transparent.svg"
            alt="Procure Souq"
            className={`w-auto object-contain dark:hidden ${actualWordmarkClass}`}
            loading="eager"
          />
          <img
            src="/logos/logo-white-transparent.svg"
            alt="Procure Souq"
            className={`w-auto object-contain hidden dark:block ${actualWordmarkClass}`}
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
