import React, { useEffect, useRef, useState } from 'react';

export interface HalftoneShaderProps {
  className?: string;
  onBack?: () => void;
  embedded?: boolean;
}

export const HalftoneShader: React.FC<HalftoneShaderProps> = ({
  className = '',
  onBack,
  embedded = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Initialize WebGL context
    const gl =
      canvas.getContext('webgl', { antialias: true, alpha: false, depth: false }) ||
      (canvas.getContext('experimental-webgl', {
        antialias: true,
        alpha: false,
        depth: false
      }) as WebGLRenderingContext | null);

    if (!gl) {
      setHasWebGL(false);
      return;
    }

    // 2. Vertex Shader (Full-screen quad)
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // 3. Fragment Shader (Halftone with 34-cell lattice, FBM, domain warping, and smoothed pointer intensity)
    const fsSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_pointer;
      uniform float u_pointer_intensity;

      // --- Shared GLSL Preamble ---
      // 1. Hashed Value Noise
      float hash(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      // 2. Six-octave Fractional Brownian Motion (fbm6)
      float fbm6(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
        for (int i = 0; i < 6; i++) {
          v += a * noise(p);
          p = rot * p * 2.02 + vec2(100.0);
          a *= 0.5;
        }
        return v;
      }

      // 3. Two-level Domain-Warp Helper
      float domainWarp(vec2 p, float time, out vec2 q, out vec2 r) {
        q = vec2(
          fbm6(p + vec2(0.0, 0.0) + 0.06 * time),
          fbm6(p + vec2(5.2, 1.3) + 0.07 * time)
        );

        r = vec2(
          fbm6(p + 3.8 * q + vec2(1.7, 9.2) + 0.09 * time),
          fbm6(p + 3.8 * q + vec2(8.3, 2.8) + 0.08 * time)
        );

        return fbm6(p + 3.5 * r + 0.05 * time);
      }

      // --- Halftone Shader Body ---
      void main() {
        // Normalized aspect-corrected UV
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 st = uv;
        st.x *= aspect;

        // 34-cell lattice along the vertical axis
        const float cells = 34.0;
        vec2 gridPos = st * cells;
        vec2 cellId = floor(gridPos);
        vec2 cellCoord = fract(gridPos);
        vec2 cellCenter = (cellId + 0.5) / cells;

        // Sample field ONCE at the CELL CENTRE
        vec2 q, r;
        float fieldVal = domainWarp(cellCenter * 2.6, u_time * 0.45, q, r);

        // Pointer interaction
        vec2 pointerSt = u_pointer;
        pointerSt.x *= aspect;
        float distToPointer = length(cellCenter - pointerSt);
        float pointerEffect = exp(-distToPointer * 4.5) * u_pointer_intensity;

        fieldVal = clamp(fieldVal + pointerEffect * 0.55, 0.0, 1.0);

        // Dot radius set from the field at each cell centre
        const float maxRadius = 0.46;
        float dotRadius = fieldVal * maxRadius;

        // Smooth antialiased dot mask
        float distFromCenter = length(cellCoord - vec2(0.5));
        float edgeSmoothing = 0.035;
        float dotMask = 1.0 - smoothstep(dotRadius - edgeSmoothing, dotRadius + edgeSmoothing, distFromCenter);

        // Spec: Ground #08090D, Accents #DBE0EB, #080A0D
        vec3 groundColor = vec3(0.03137, 0.03529, 0.05098); // #08090D
        vec3 lightAccent  = vec3(0.85882, 0.87843, 0.92157); // #DBE0EB
        vec3 darkAccent   = vec3(0.03137, 0.03922, 0.05098); // #080A0D

        vec3 dotColor = mix(darkAccent, lightAccent, pow(fieldVal, 1.3));
        vec3 color = mix(groundColor, dotColor, dotMask);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) {
      setHasWebGL(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setHasWebGL(false);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(program));
      setHasWebGL(false);
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPositionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const uTimeLocation = gl.getUniformLocation(program, 'u_time');
    const uPointerLocation = gl.getUniformLocation(program, 'u_pointer');
    const uPointerIntensityLocation = gl.getUniformLocation(program, 'u_pointer_intensity');

    // 1. Pointer & Animation State
    const pointer = { x: 0.5, y: 0.5 };
    let targetIntensity = 0.0;
    let currentIntensity = 0.0;
    let pointerActive = false;
    let lastMoveTime = 0;
    let animationFrameId = 0;

    // 2. Reduced motion detection
    const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = prefersReducedMotionQuery.matches;

    // 3. Render frame function
    const renderFrame = (timeSec: number) => {
      const decaySpeed = pointerActive ? 0.08 : 0.03;
      currentIntensity += (targetIntensity - currentIntensity) * decaySpeed;

      if (pointerActive && performance.now() - lastMoveTime > 1800) {
        targetIntensity = 0.0;
        pointerActive = false;
      }

      gl.uniform1f(uTimeLocation, timeSec);
      gl.uniform2f(uPointerLocation, pointer.x, pointer.y);
      gl.uniform1f(uPointerIntensityLocation, currentIntensity);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // 4. Animation loop
    const renderLoop = (timestamp: number) => {
      renderFrame(timestamp * 0.001);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // 5. Pointer update
    const updatePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (clientX - rect.left) / rect.width;
      pointer.y = 1.0 - (clientY - rect.top) / rect.height;
      targetIntensity = 1.0;
      pointerActive = true;
      lastMoveTime = performance.now();

      if (isReducedMotion) {
        renderFrame(performance.now() * 0.001);
      }
    };

    const handleMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleMouseLeave = () => {
      targetIntensity = 0.0;
      pointerActive = false;
    };

    // 6. Resize handling
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = embedded && canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const height = embedded && canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);

      if (isReducedMotion) {
        renderFrame(0.0);
      }
    };

    // 7. Reduced motion change listener
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(renderLoop);
      } else {
        cancelAnimationFrame(animationFrameId);
        renderFrame(0.0);
      }
    };

    // 8. Register listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchend', handleMouseLeave);
    window.addEventListener('resize', resize);
    prefersReducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    // 9. Initial setup
    resize();

    if (!isReducedMotion) {
      animationFrameId = requestAnimationFrame(renderLoop);
    } else {
      renderFrame(0.0);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchend', handleMouseLeave);
      window.removeEventListener('resize', resize);
      prefersReducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [embedded]);

  // Handle Escape key to return when standalone
  useEffect(() => {
    if (embedded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onBack) {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [embedded, onBack]);

  const positionClass = embedded ? 'absolute inset-0' : 'fixed inset-0';

  return (
    <div className={`${positionClass} w-full h-full overflow-hidden bg-[#08090D] select-none ${className}`}>
      {/* Hidden Fallback Panel behind canvas (shown only when no WebGL context can be created) */}
      {!hasWebGL && (
        <div className={`${positionClass} flex items-center justify-center p-6 bg-[#08090D] text-[#DBE0EB] z-0`}>
          <div className="max-w-md p-8 rounded-2xl bg-[#080A0D] border border-[#DBE0EB]/20 shadow-2xl text-center">
            <h2 className="text-lg font-bold tracking-wide mb-2 text-[#DBE0EB]">WebGL Required</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your browser or environment does not support WebGL hardware acceleration. Please enable WebGL or use a modern browser.
            </p>
          </div>
        </div>
      )}

      {/* Full-bleed Canvas - Shader is the entire surface, no typography, no chrome */}
      <canvas
        ref={canvasRef}
        className={`${positionClass} w-full h-full block z-10 ${hasWebGL ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
    </div>
  );
};

export default HalftoneShader;
