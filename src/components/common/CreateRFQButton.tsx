import React from 'react';
import { MetalFx } from 'metal-fx';
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
      preset="chromatic"
      strength={0.85}
      theme={isDark ? 'dark' : 'light'}
      borderRadius={8}
      style={{ background: '#0284c7' }}
      className={`rounded-lg shadow-sm shrink-0 inline-flex ${className}`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center font-bold text-white transition-all focus:outline-none select-none active:scale-[0.99] cursor-pointer bg-transparent border-none ${sizeClasses[size]}`}
      >
        <PlusCircle className={`${iconSizes[size]} shrink-0`} />
        {children ? children : <span>{label}</span>}
      </button>
    </MetalFx>
  );
};
