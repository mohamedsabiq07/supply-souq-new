import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isTouch, setIsTouch] = useState(true);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device has fine pointer (mouse) vs touch
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsTouch(false);
    } else {
      setIsTouch(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor-label]') as HTMLElement | null;
      if (cursorTarget) {
        setCursorLabel(cursorTarget.getAttribute('data-cursor-label'));
        setIsHovered(true);
        return;
      }

      const interactive = target.closest('button, a, input, select, textarea, [role="button"]');
      if (interactive) {
        setIsHovered(true);
        setCursorLabel(null);
      } else {
        setIsHovered(false);
        setCursorLabel(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouch) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Outer Ring / Capsule */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovered ? (cursorLabel ? 1.6 : 1.4) : 1,
          borderColor: isHovered ? '#e61937' : '#a1a1aa',
          backgroundColor: cursorLabel ? '#0a0a0a' : isHovered ? 'rgba(230, 25, 55, 0.08)' : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`fixed flex items-center justify-center rounded-full border border-zinc-400 transition-colors ${
          cursorLabel ? 'h-14 w-14 border-[#e61937] text-white shadow-lg' : 'h-8 w-8'
        }`}
      >
        {cursorLabel && (
          <span className="font-mono text-[9px] font-black uppercase tracking-wider text-[#e61937]">
            {cursorLabel}
          </span>
        )}
      </motion.div>

      {/* Inner Dot */}
      {!cursorLabel && (
        <motion.div
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
            opacity: isVisible ? 1 : 0,
          }}
          animate={{
            scale: isHovered ? 0.4 : 1,
            backgroundColor: isHovered ? '#e61937' : '#18181b',
          }}
          transition={{ duration: 0.1 }}
          className="fixed h-1.5 w-1.5 rounded-full bg-zinc-900"
        />
      )}
    </div>
  );
};
