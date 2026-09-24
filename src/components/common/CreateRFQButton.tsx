import React from 'react';
import { PlusCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`relative group inline-flex rounded-xl select-none shrink-0 ${className}`}>
      {/* Soft ambient blue shadow underneath */}
      <div
        className="absolute -inset-0.5 rounded-xl bg-blue-600/25 dark:bg-blue-500/35 blur-xs pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Main Glossy Button Surface */}
      <button
        type="button"
        onClick={onClick}
        className={`relative z-10 w-full inline-flex items-center justify-center font-extrabold text-white rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border border-blue-400/40 hover:border-blue-300/70 hover:scale-[1.02] active:scale-[0.98] ${sizeClasses[size]}`}
        style={{
          background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 55%, #1d4ed8 100%)',
          boxShadow: isDark
            ? '0 4px 16px -1px rgba(37, 99, 235, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 0 rgba(0, 0, 0, 0.2)'
            : '0 4px 14px -1px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Glossy Top-Half Specular Glass Highlight */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/10 to-transparent pointer-events-none rounded-t-xl"
          aria-hidden="true"
        />

        {/* Moving Metallic Glint along the bottom edge */}
        <div
          className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-3/5 h-full animate-glint-sweep group-hover:[animation-duration:1.5s]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(125, 211, 252, 0.9) 25%, rgba(244, 114, 182, 0.85) 50%, rgba(251, 146, 60, 0.85) 75%, transparent 100%)',
              filter: 'blur(0.4px)',
            }}
          />
        </div>

        {/* Moving Metallic Glint along the left corner rim */}
        <div
          className="absolute inset-y-0 left-0 w-[2px] overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="h-1/2 w-full animate-glint-sweep group-hover:[animation-duration:1.5s]"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(125, 211, 252, 0.9) 50%, transparent 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center gap-2">
          <PlusCircle className={`${iconSizes[size]} shrink-0 text-white drop-shadow-xs group-hover:rotate-90 transition-transform duration-300`} />
          <span className="drop-shadow-xs whitespace-nowrap tracking-tight font-extrabold text-white">
            {children ? children : label}
          </span>
        </div>
      </button>
    </div>
  );
};
