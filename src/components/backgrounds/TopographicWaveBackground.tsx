import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface TopographicWaveBackgroundProps {
  className?: string;
  opacity?: number;
  interactive?: boolean;
}

export const TopographicWaveBackground: React.FC<TopographicWaveBackgroundProps> = ({
  className = '',
  opacity = 0.9,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      radius: 260,
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      pointer.targetX = -9999;
      pointer.targetY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;
    const lineCount = 13;
    const stepX = 22; // Sampling interval for smooth bezier points

    // Architectural elevation contour labels
    const elevationLabels = [
      '+08.0m',
      '+14.5m',
      '+22.0m',
      '+30.5m',
      'EL 42.0m',
      '+55.0m',
      '+68.5m',
      '+82.0m',
    ];

    const render = () => {
      time += 0.007;
      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const spacing = height / (lineCount + 1);

      ctx.font = '9px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < lineCount; i++) {
        const baseY = spacing * (i + 1);
        const isAccent = i === 3 || i === 8;
        const depthFactor = (i + 1) / lineCount;

        // Collect point sequence for smooth bezier curve interpolation
        const points: { x: number; y: number }[] = [];

        for (let x = -stepX; x <= width + stepX * 2; x += stepX) {
          // Multi-harmonic natural sand dune / CAD topographic waves
          const wave1 = Math.sin(x * 0.0028 + time + i * 0.45) * (18 + depthFactor * 8);
          const wave2 = Math.cos(x * 0.0065 - time * 0.75 + i * 0.3) * 12;
          const wave3 = Math.sin(x * 0.0012 + time * 0.4 + i * 0.8) * 26;

          let y = baseY + wave1 + wave2 + wave3;

          // Interactive elastic membrane depression
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (dist < pointer.radius && dist > 0) {
            const influence = 1 - dist / pointer.radius;
            const deflection = Math.cos((dist / pointer.radius) * Math.PI * 0.5) * influence * 52;
            y += dy > 0 ? deflection : -deflection;
          }

          points.push({ x, y });
        }

        // Draw curved isoline with quadratic midpoints
        if (points.length > 2) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);

          for (let p = 1; p < points.length - 1; p++) {
            const xc = (points[p].x + points[p + 1].x) * 0.5;
            const yc = (points[p].y + points[p + 1].y) * 0.5;
            ctx.quadraticCurveTo(points[p].x, points[p].y, xc, yc);
          }

          if (isAccent) {
            ctx.strokeStyle = isDark
              ? `rgba(207, 46, 70, ${0.42 * opacity})`
              : `rgba(207, 46, 70, ${0.32 * opacity})`;
            ctx.lineWidth = 1.4;
          } else {
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${(0.07 + (i % 3) * 0.035) * opacity})`
              : `rgba(71, 85, 105, ${(0.09 + (i % 3) * 0.035) * opacity})`;
            ctx.lineWidth = 0.85;
          }

          ctx.stroke();

          // Render Architectural Elevation Contour Label
          if (i % 2 === 1 && i < elevationLabels.length * 2) {
            const labelIdx = Math.floor(i / 2);
            const labelText = elevationLabels[labelIdx];
            // Position label at 25% or 75% of screen width
            const targetSample = Math.floor(points.length * (i % 4 === 1 ? 0.22 : 0.78));
            const labelPoint = points[targetSample];

            if (labelPoint && labelPoint.x > 50 && labelPoint.x < width - 100) {
              const labelColor = isAccent
                ? `rgba(207, 46, 70, ${0.7 * opacity})`
                : isDark
                  ? `rgba(255, 255, 255, ${0.28 * opacity})`
                  : `rgba(100, 116, 139, ${0.4 * opacity})`;

              // Pill background cutout behind label for legibility
              const textWidth = ctx.measureText(labelText).width;
              ctx.fillStyle = isDark ? '#000000' : '#f4f4f6';
              ctx.fillRect(labelPoint.x - 3, labelPoint.y - 7, textWidth + 6, 14);

              ctx.fillStyle = labelColor;
              ctx.fillText(labelText, labelPoint.x, labelPoint.y);
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark, interactive, opacity]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden transition-opacity duration-500 [mask-image:radial-gradient(ellipse_85%_75%_at_50%_35%,black_40%,transparent_90%)] ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
