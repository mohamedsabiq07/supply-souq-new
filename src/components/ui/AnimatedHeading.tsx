import React from 'react';
import { motion, Variants } from 'framer-motion';

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
}

export const AnimatedH3: React.FC<AnimatedH3Props> = ({
  text,
  className = '',
  staggerDelay = 0.025,
  duration = 0.5,
  delay = 0.1,
  blurAmount = 10,
  slideDistance = 20,
  once = true,
  colorVariant = 'default'
}) => {
  // Pre-configured styling presets featuring responsive sizing, tight letter tracking, and smooth color transitions
  const variantStyles = {
    default:
      'text-slate-950 hover:text-[#cf2e46] transition-colors duration-300',
    crimson:
      'text-[#cf2e46] hover:text-rose-700 transition-colors duration-300',
    gradient:
      'bg-clip-text text-transparent bg-gradient-to-r from-slate-950 via-slate-800 to-[#cf2e46] hover:from-[#cf2e46] hover:to-rose-600 transition-all duration-500',
    dark:
      'text-slate-900 dark:text-white hover:text-[#cf2e46] transition-colors duration-300',
    white:
      'text-white hover:text-rose-200 transition-colors duration-300'
  };

  // Container motion variant controlling staggered letter entrance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };

  // Letter motion variant: fades in, slides up, and reduces blur
  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: slideDistance,
      filter: `blur(${blurAmount}px)`
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for snappy, premium deceleration
      }
    }
  };

  // Split text by words first to preserve natural word boundary wrapping on mobile devices
  const words = text.split(' ');

  return (
    <motion.h3
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      variants={containerVariants}
      aria-label={text}
      className={`font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight sm:tracking-tighter leading-tight sm:leading-snug ${variantStyles[colorVariant]} ${className}`}
    >
      {words.map((word, wordIndex) => (
        <span
          key={`word-${wordIndex}-${word}`}
          className="inline-block whitespace-nowrap"
        >
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={`char-${wordIndex}-${charIndex}-${char}`}
              variants={letterVariants}
              aria-hidden="true"
              className="inline-block will-change-[transform,opacity,filter]"
            >
              {char}
            </motion.span>
          ))}
          {/* Add a space after the word unless it's the last word */}
          {wordIndex < words.length - 1 && (
            <span aria-hidden="true" className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.h3>
  );
};

export default AnimatedH3;
