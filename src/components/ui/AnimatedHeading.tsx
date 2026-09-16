import React from 'react';
import VariableFontCursorProximity from '@/components/fancy/text/variable-font-cursor-proximity';

export interface AnimatedH3Props {
  /** Text content to be animated letter by letter */
  text: string;
  /** Optional additional CSS classes for styling & responsiveness */
  className?: string;
  /** Delay between each letter animation in seconds (default: 0.025s) */
  staggerDelay?: number;
  /** Duration of each individual letter transition (default: 0.5s) */
  duration?: number;
  /** Initial delay before starting the animation sequence (default: 0.1s) */
  delay?: number;
  /** Initial blur radius in pixels (default: 10px) */
  blurAmount?: number;
  /** Distance in pixels each letter slides up from (default: 20px) */
  slideDistance?: number;
  /** Whether the animation should trigger only once when entering viewport (default: true) */
  once?: boolean;
  /** Visual style preset for color transitions */
  colorVariant?: 'default' | 'crimson' | 'gradient' | 'dark' | 'white';
  /** Reference to optional container for mouse tracking */
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const AnimatedH3: React.FC<AnimatedH3Props> = ({
  text,
  className = '',
  colorVariant = 'default',
  containerRef,
}) => {
  // Pre-configured styling presets featuring responsive sizing, tight letter tracking, and smooth color transitions
  const variantStyles = {
    default:
      'text-slate-950 dark:text-white hover:text-[#cf2e46] transition-colors duration-300',
    crimson:
      'text-[#cf2e46] hover:text-rose-700 transition-colors duration-300',
    gradient:
      'bg-clip-text text-transparent bg-gradient-to-r from-slate-950 via-slate-800 to-[#cf2e46] dark:from-white dark:via-slate-200 dark:to-[#cf2e46] hover:from-[#cf2e46] hover:to-rose-600 transition-all duration-500',
    dark:
      'text-slate-900 dark:text-white hover:text-[#cf2e46] transition-colors duration-300',
    white:
      'text-white hover:text-rose-200 transition-colors duration-300'
  };

  // Check if custom text sizing is provided via className
  const hasCustomSize = /\btext-(xs|sm|base|lg|[0-9]?xl)\b/.test(className);
  const baseSize = hasCustomSize ? '' : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold';

  return (
    <VariableFontCursorProximity
      as="h3"
      fromFontVariationSettings="'wght' 600, 'slnt' 0"
      toFontVariationSettings="'wght' 950, 'slnt' -8"
      radius={130}
      falloff="gaussian"
      containerRef={containerRef}
      className={`font-sans tracking-tight leading-tight cursor-default ${baseSize} ${variantStyles[colorVariant]} ${className}`}
    >
      {text}
    </VariableFontCursorProximity>
  );
};

export interface ProximityTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  radius?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const ProximityText: React.FC<ProximityTextProps> = ({
  text,
  className = '',
  as = 'p',
  fromFontVariationSettings = "'wght' 400, 'slnt' 0",
  toFontVariationSettings = "'wght' 800, 'slnt' -6",
  radius = 120,
  containerRef,
}) => {
  return (
    <VariableFontCursorProximity
      as={as}
      fromFontVariationSettings={fromFontVariationSettings}
      toFontVariationSettings={toFontVariationSettings}
      radius={radius}
      falloff="gaussian"
      containerRef={containerRef}
      className={className}
    >
      {text}
    </VariableFontCursorProximity>
  );
};

export default AnimatedH3;
