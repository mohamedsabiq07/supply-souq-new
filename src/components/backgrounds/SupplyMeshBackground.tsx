import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface SupplyMeshBackgroundProps {
  className?: string;
  opacity?: number;
  interactive?: boolean;
}

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  layer: 'fore' | 'back';
  baseRadius: number;
  isHub: boolean;
  pulsePhase: number;
}

interface Packet {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export const SupplyMeshBackground: React.FC<SupplyMeshBackgroundProps> = ({
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
      radius: 220,
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

    // 1. Generate Multi-Layered Nodes
    const totalCount = Math.min(Math.floor((width * height) / 12500) || 55, 95);
    const nodes: Node[] = Array.from({ length: totalCount }, (_, i) => {
      const isForeground = i % 3 !== 0;
      const isHub = isForeground && Math.random() < 0.16;
      const rx = Math.random() * width;
      const ry = Math.random() * height;

      return {
        x: rx,
        y: ry,
        baseX: rx,
        baseY: ry,
        vx: (Math.random() - 0.5) * (isForeground ? 0.35 : 0.18),
        vy: (Math.random() - 0.5) * (isForeground ? 0.35 : 0.18),
        layer: isForeground ? 'fore' : 'back',
        baseRadius: isHub ? 3.2 : isForeground ? 1.8 : 1.1,
        isHub,
        pulsePhase: Math.random() * Math.PI * 2,
      };
    });

    // 2. Active RFQ Data Packets traveling along mesh links
    const packets: Packet[] = [];
    const maxPackets = 12;

    const spawnPacket = () => {
      if (packets.length >= maxPackets) return;
      const fgNodes = nodes.map((n, idx) => ({ n, idx })).filter((item) => item.n.layer === 'fore');
      if (fgNodes.length < 2) return;

      const randomSource = fgNodes[Math.floor(Math.random() * fgNodes.length)];
      // Find nearest neighbor in range
      let bestTarget = -1;
      let minD = Infinity;

      for (const candidate of fgNodes) {
        if (candidate.idx === randomSource.idx) continue;
        const d = Math.hypot(randomSource.n.x - candidate.n.x, randomSource.n.y - candidate.n.y);
        if (d > 40 && d < 140 && d < minD) {
          minD = d;
          bestTarget = candidate.idx;
        }
      }

      if (bestTarget !== -1) {
        packets.push({
          sourceIndex: randomSource.idx,
          targetIndex: bestTarget,
          progress: 0,
          speed: Math.random() * 0.02 + 0.012,
          color: Math.random() < 0.35 ? '#ffffff' : '#cf2e46',
        });
      }
    };

    // Pre-seed some packets
    for (let i = 0; i < 6; i++) spawnPacket();

    let frame = 0;

    const render = () => {
      frame++;
      if (frame % 28 === 0) spawnPacket();

      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Dynamic color tokens
      const linkBase = isDark ? '207, 46, 70' : '100, 116, 139';
      const maxForeDist = 135;
      const maxBackDist = 95;

      // 1. Update positions & draw background links
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.pulsePhase += 0.025;
        n.x += n.vx;
        n.y += n.vy;

        // Bounce within bounds
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Pointer magnetic repulsion (stronger for foreground)
        if (n.layer === 'fore') {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const distToMouse = Math.hypot(dx, dy);

          if (distToMouse < pointer.radius && distToMouse > 0) {
            const force = (pointer.radius - distToMouse) / pointer.radius;
            n.x -= (dx / distToMouse) * force * 1.8;
            n.y -= (dy / distToMouse) * force * 1.8;
          }
        }

        // Draw connections to other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          // Only link nodes of similar planes or from hub
          if (n.layer !== n2.layer && !n.isHub && !n2.isHub) continue;

          const d = Math.hypot(n.x - n2.x, n.y - n2.y);
          const maxDist = n.layer === 'fore' ? maxForeDist : maxBackDist;

          if (d < maxDist) {
            // Calculate proximity to cursor for spotlight enhancement
            const midX = (n.x + n2.x) * 0.5;
            const midY = (n.y + n2.y) * 0.5;
            const distToSpotlight = Math.hypot(midX - pointer.x, midY - pointer.y);
            const isNearSpotlight = distToSpotlight < pointer.radius;

            const baseAlpha = (1 - d / maxDist) * (n.layer === 'fore' ? 0.16 : 0.08) * opacity;
            const spotlightBoost = isNearSpotlight
              ? (1 - distToSpotlight / pointer.radius) * (isDark ? 0.35 : 0.25)
              : 0;

            const finalAlpha = Math.min(baseAlpha + spotlightBoost, 0.7);

            ctx.beginPath();
            if (isNearSpotlight || n.isHub || n2.isHub) {
              ctx.strokeStyle = `rgba(207, 46, 70, ${finalAlpha})`;
            } else {
              ctx.strokeStyle = isDark
                ? `rgba(255, 255, 255, ${finalAlpha * 0.9})`
                : `rgba(${linkBase}, ${finalAlpha})`;
            }
            ctx.lineWidth = isNearSpotlight ? 1.3 : n.isHub || n2.isHub ? 1.1 : 0.7;
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // 2. Render Traveling RFQ Light Packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const src = nodes[p.sourceIndex];
        const tgt = nodes[p.targetIndex];
        if (!src || !tgt) {
          packets.splice(i, 1);
          continue;
        }

        const px = src.x + (tgt.x - src.x) * p.progress;
        const py = src.y + (tgt.y - src.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, isDark ? 2.2 : 2.0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#cf2e46';
        ctx.shadowBlur = isDark ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3. Render Nodes with Hub Breathing Rings
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const distToMouse = Math.hypot(n.x - pointer.x, n.y - pointer.y);
        const nearMouse = distToMouse < pointer.radius;

        // Hub outer pulsing ring
        if (n.isHub) {
          const pulse = Math.sin(n.pulsePhase) * 2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.baseRadius + 4 + pulse, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(207, 46, 70, ${(isDark ? 0.35 : 0.25) * opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        const r = nearMouse ? n.baseRadius * 1.6 : n.baseRadius;
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);

        if (nearMouse) {
          ctx.fillStyle = '#cf2e46';
          ctx.shadowColor = '#cf2e46';
          ctx.shadowBlur = isDark ? 10 : 5;
        } else if (n.isHub) {
          ctx.fillStyle = isDark ? '#cf2e46' : '#be123c';
          ctx.shadowColor = '#cf2e46';
          ctx.shadowBlur = isDark ? 6 : 2;
        } else if (n.layer === 'fore') {
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${0.45 * opacity})`
            : `rgba(71, 85, 105, ${0.55 * opacity})`;
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${0.15 * opacity})`
            : `rgba(148, 163, 184, ${0.25 * opacity})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
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
