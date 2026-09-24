import React from 'react';
import { PlusCircle } from 'lucide-react';

interface CreateRFQButtonProps {
  onClick: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const CreateRFQButton: React.FC<CreateRFQButtonProps> = ({
  onClick,
  label = 'Create New RFQ',
  size = 'md',
  className = '',
  children,
}) => {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 font-bold',
    md: 'px-4.5 py-2 text-sm gap-2 font-extrabold',
    lg: 'px-6 py-2.5 text-base gap-2.5 font-extrabold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`relative group inline-flex rounded-xl p-[2px] overflow-visible select-none shrink-0 ${className}`}>
      {/* 1. Ambient Dynamic Chromatic Glow (radiates soft colored light around the button) */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-60 dark:opacity-80 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -inset-[200%] animate-spin-chromatic group-hover:animate-[spin-chromatic_2s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, #ff007a, #7928ca, #0284c7, #00dfd8, #eab308, #ff007a)',
          }}
        />
      </div>

      {/* 2. Moving Chromatic Border Ring (continuous 360-degree rotation around the perimeter) */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute -inset-[200%] animate-spin-chromatic group-hover:animate-[spin-chromatic_2s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, #ff007a, #7928ca, #0284c7, #00dfd8, #eab308, #ff007a)',
          }}
        />
      </div>

      {/* 3. Core Button with Cerulean Gradient & Periodic Light Sweep */}
      <button
        type="button"
        onClick={onClick}
        className={`relative z-10 w-full inline-flex items-center justify-center text-white bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#0284c7] hover:from-[#0369a1] hover:to-[#075985] rounded-[10px] shadow-sm border border-white/20 active:scale-[0.98] transition-all cursor-pointer overflow-hidden ${sizeClasses[size]}`}
      >
        {/* Subtle Specular Light Sweep */}
        <div
          className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-sweep-shimmer"
          aria-hidden="true"
        />

        <PlusCircle className={`${iconSizes[size]} shrink-0 text-white drop-shadow-sm group-hover:rotate-90 transition-transform duration-300`} />
        <span className="relative z-10 drop-shadow-xs tracking-tight whitespace-nowrap">
          {children ? children : label}
        </span>
      </button>
    </div>
  );
};
