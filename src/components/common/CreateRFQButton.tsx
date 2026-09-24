import React, { useRef, useEffect } from 'react';
import { MetalFx, useMetalBend, PRESETS } from 'metal-fx';
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
  const buttonRef = useRef<HTMLDivElement>(null);

  // Enable dynamic cursor-driven liquid metal bend & spring animation
  useMetalBend(buttonRef);

  useEffect(() => {
    // Keep shader animation speed brisk and visibly flowing
    if (PRESETS?.chromatic?.modes) {
      if (PRESETS.chromatic.modes.dark) {
        PRESETS.chromatic.modes.dark.speed = 2.4;
      }
      if (PRESETS.chromatic.modes.light) {
        PRESETS.chromatic.modes.light.speed = 2.4;
      }
    }
  }, []);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <MetalFx
      ref={buttonRef}
      preset="chromatic"
      strength={0.85}
      glowGain={1.4}
      innerShadow={true}
      theme={isDark ? 'dark' : 'light'}
      borderRadius={8}
      style={{
        background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
      }}
      className={`rounded-lg shadow-sm shrink-0 inline-flex transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center font-bold text-white transition-all focus:outline-none select-none cursor-pointer bg-transparent border-none ${sizeClasses[size]}`}
      >
        <PlusCircle className={`${iconSizes[size]} shrink-0 drop-shadow-xs`} />
        {children ? children : <span>{label}</span>}
      </button>
    </MetalFx>
  );
};
