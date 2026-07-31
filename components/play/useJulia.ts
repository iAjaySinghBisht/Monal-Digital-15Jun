"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FRAGMENT_SHADER,
  UNIFORM_NAMES,
  VERTEX_SHADER,
  defaultUniforms,
  type JuliaUniforms,
  type UniformName,
} from "@/lib/play/juliaShader";
import { LUT_SIZE, buildLutRgba, type Palette } from "@/lib/play/palettes";

type Step = (t: number, u: JuliaUniforms) => void;

type Options = {
  palette: Palette;
  /** Called once per frame to move the uniforms before they are uploaded. */
  step?: Step;
  playing?: boolean;
  /** Cap the device pixel ratio. 2 is plenty; 3 triples the fragment cost. */
  maxDpr?: number;
  /** Skip frames while the canvas is scrolled out of view. */
  pauseOffscreen?: boolean;
};

/**
 * Runs the shared Julia shader on a canvas and keeps a uniforms object in sync.
 *
 * The uniforms live in a ref, not in state: they change every frame and must
 * never trigger a React render. Controls write to `uniforms.current` directly;
 * `step` is the per-frame animation hook.
 */
export function useJulia({
  palette,
  step,
  playing = true,
  maxDpr = 2,
  pauseOffscreen = true,
}: Options) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const uniforms = useRef<JuliaUniforms>(defaultUniforms());
  const [supported, setSupported] = useState<boolean | null>(null);

  const glRef = useRef<WebGLRenderingContext | null>(null);
  const locsRef = useRef<Partial<Record<UniformName, WebGLUniformLocation | null>>>({});
  const texRef = useRef<WebGLTexture | null>(null);
  const stepRef = useRef<Step | undefined>(step);
  const playingRef = useRef(playing);
  const visibleRef = useRef(true);
  const clockRef = useRef(0);

  stepRef.current = step;
  playingRef.current = playing;

  /* --- one-time GL setup ------------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // preserveDrawingBuffer keeps the pixels readable after compositing, which
    // is what makes "Save as PNG" work without re-rendering into an FBO.
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    if (!gl) {
      setSupported(false);
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("play/useJulia shader:", gl.getShaderInfoLog(s));
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("play/useJulia link:", gl.getProgramInfoLog(program));
      setSupported(false);
      return;
    }
    gl.useProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const attr = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const locs: Partial<Record<UniformName, WebGLUniformLocation | null>> = {};
    for (const n of UNIFORM_NAMES) locs[n] = gl.getUniformLocation(program, n);
    gl.uniform1i(locs.uPal!, 0);

    glRef.current = gl;
    locsRef.current = locs;
    texRef.current = tex;
    setSupported(true);

    return () => {
      gl.deleteTexture(tex);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      glRef.current = null;
      texRef.current = null;
    };
  }, []);

  /* --- palette ---------------------------------------------------------- */
  useEffect(() => {
    const gl = glRef.current;
    const tex = texRef.current;
    if (!gl || !tex) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, LUT_SIZE, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      buildLutRgba(palette),
    );
  }, [palette, supported]);

  /* --- upload + draw ---------------------------------------------------- */
  const draw = useCallback((force?: { w: number; h: number }) => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (!gl || !canvas) return;
    const l = locsRef.current;
    const u = uniforms.current;

    // `force` lets the PNG export render one frame at an arbitrary size; the
    // next ordinary draw() restores the on-screen dimensions.
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = force ? force.w : Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = force ? force.h : Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.uniform2f(l.uRes!, canvas.width, canvas.height);
    gl.uniform2f(l.uC!, u.c[0], u.c[1]);
    gl.uniform2f(l.uCenter!, u.center[0], u.center[1]);
    gl.uniform1f(l.uSpan!, u.span);
    gl.uniform1f(l.uRot!, u.rot);
    gl.uniform1f(l.uT!, u.t);
    gl.uniform1f(l.uSpeed!, u.speed);
    gl.uniform1f(l.uSweep!, u.sweep);
    gl.uniform1f(l.uSwell!, u.swell);
    gl.uniform1f(l.uInterior!, u.interior);
    gl.uniform3f(l.uInteriorBase!, u.interiorBase[0], u.interiorBase[1], u.interiorBase[2]);
    gl.uniform1f(l.uPixel!, u.pixel);
    gl.uniform1f(l.uShadeMin!, u.shadeMin);
    gl.uniform1f(l.uShadeLo!, u.shadeLo);
    gl.uniform1f(l.uShadeHi!, u.shadeHi);
    gl.uniform1f(l.uFade!, u.fade);
    gl.uniform1f(l.uIter!, u.iterations);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [maxDpr]);

  /* --- render loop ------------------------------------------------------ */
  useEffect(() => {
    if (!supported) return;
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      // Clamp dt so a backgrounded tab does not jump the animation on return.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (playingRef.current && visibleRef.current) {
        clockRef.current += dt;
        uniforms.current.t = clockRef.current;
        stepRef.current?.(clockRef.current, uniforms.current);
        draw();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [supported, draw]);

  /* Redraw once whenever playback stops, so a paused canvas still shows the
     latest control values instead of a stale frame. */
  useEffect(() => {
    if (!supported || playing) return;
    uniforms.current.t = clockRef.current;
    stepRef.current?.(clockRef.current, uniforms.current);
    draw();
  }, [supported, playing, draw]);

  /* --- resize + visibility ---------------------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !supported) return;

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    let io: IntersectionObserver | undefined;
    if (pauseOffscreen) {
      io = new IntersectionObserver(
        ([entry]) => { visibleRef.current = entry.isIntersecting; },
        { rootMargin: "120px" },
      );
      io.observe(canvas);
    }
    return () => { ro.disconnect(); io?.disconnect(); };
  }, [supported, draw, pauseOffscreen]);

  /** Draw immediately with the current uniforms — used before a PNG export. */
  const renderNow = useCallback(() => {
    uniforms.current.t = clockRef.current;
    stepRef.current?.(clockRef.current, uniforms.current);
    draw();
  }, [draw]);

  /** Restart the animation clock (the reveal sting replays from zero). */
  const resetClock = useCallback(() => { clockRef.current = 0; }, []);

  return { canvasRef, uniforms, supported, renderNow, resetClock, draw };
}
