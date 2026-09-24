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
  // Height presets for the wordmark
  const wordmarkHeights = {
    sm: 'h-5',
    md: 'h-6 sm:h-7',
    lg: 'h-8 sm:h-9',
    xl: 'h-10 sm:h-12',
  };

  // Icon dimensions
  const iconDimensions = {
    sm: 'w-7 h-7 p-1',
    md: 'w-9 h-9 p-1.5',
    lg: 'w-11 h-11 p-2',
    xl: 'w-14 h-14 p-2.5',
  };

  if (variant === 'icon') {
    return (
      <div
        className={`rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.1] flex items-center justify-center shadow-2xs shrink-0 select-none transition-all ${iconDimensions[size]} ${className}`}
      >
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
    );
  }

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
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold tracking-tight mt-0.5">
            B2B Procurement Marketplace
          </span>
        )}
      </div>
    );
  }

  // Default 'full' variant: PS monogram badge alongside full wordmark text
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Monogram Icon Badge */}
      <div
        className={`rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.1] flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 group-hover:border-brand-500/30 transition-all ${iconDimensions[size]}`}
      >
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

      {/* Wordmark & optional subtitle */}
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
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold tracking-tight mt-0.5 leading-none">
            B2B Procurement Marketplace
          </span>
        )}
      </div>
    </div>
  );
};
