'use client';

import { useEffect, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

/**
 * "Signal field": a dot-matrix surface that breathes like a waveform and
 * sends a ripple out from wherever the cursor touches it. Colours follow
 * the theme. Pauses when the tab is hidden; a single still frame when the
 * visitor prefers reduced motion.
 */

const COLS = 168;
const ROWS = 84;
const WIDTH = 34;
const DEPTH = 17;

const PALETTE = {
  light: { base: '#1a1a1a', glow: '#1800ff', opacity: 0.32 },
  dark: { base: '#f2f2f2', glow: '#32a5ff', opacity: 0.42 },
} as const;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uPixelRatio;
  uniform float uSize;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    vec3 p = position;
    float t = uTime;

    float h = sin(p.x * 0.42 + t * 0.55) * 0.24
            + sin(p.z * 0.68 - t * 0.75) * 0.16
            + sin((p.x + p.z) * 0.28 + t * 0.35) * 0.22;

    float d = distance(p.xz, uPointer);
    float ripple = sin(d * 2.6 - t * 4.2) * exp(-d * 0.42) * 0.42 * uPointerStrength;
    p.y += h + ripple;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (8.0 / -mv.z);

    float edgeX = 1.0 - smoothstep(${(WIDTH / 2 - 7).toFixed(1)}, ${(WIDTH / 2).toFixed(1)}, abs(p.x));
    float edgeZ = 1.0 - smoothstep(${(DEPTH / 2 - 5).toFixed(1)}, ${(DEPTH / 2).toFixed(1)}, abs(position.z));
    float crest = smoothstep(-0.4, 0.55, h);
    vAlpha = edgeX * edgeZ * (0.35 + 0.65 * crest);
    vGlow = clamp(exp(-d * 0.55) * uPointerStrength * 1.4 + abs(ripple) * 1.6, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uGlow;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vGlow;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.18, r);
    vec3 color = mix(uBase, uGlow, vGlow);
    gl_FragColor = vec4(color, soft * vAlpha * uOpacity * (1.0 + vGlow * 0.9));
  }
`;

export function SignalField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      return; // no WebGL: the site works fine without the field
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 2.9, 9.4);
    camera.lookAt(0, -0.4, 0);

    // grid of points on the XZ plane
    const positions = new Float32Array(COLS * ROWS * 3);
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        positions[i++] = (c / (COLS - 1) - 0.5) * WIDTH;
        positions[i++] = 0;
        positions[i++] = (r / (ROWS - 1) - 0.5) * DEPTH;
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));

    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new Vector2(0, 2) },
      uPointerStrength: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 2.1 },
      uBase: { value: new Color() },
      uGlow: { value: new Color() },
      uOpacity: { value: 0.3 },
    };
    const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false });
    const points = new Points(geometry, material);
    scene.add(points);

    const applyTheme = () => {
      const p = document.documentElement.dataset.theme === 'dark' ? PALETTE.dark : PALETTE.light;
      uniforms.uBase.value.set(p.base);
      uniforms.uGlow.value.set(p.glow);
      uniforms.uOpacity.value = p.opacity;
    };
    applyTheme();

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h, false);
      uniforms.uPixelRatio.value = ratio;
      camera.aspect = w / h;
      // keep the field wide enough on portrait screens
      camera.fov = w / h < 0.8 ? 58 : 38;
      camera.updateProjectionMatrix();
    };
    resize();

    // pointer → point on the y=0 plane
    const ray = new Raycaster();
    const ndc = new Vector2();
    const ground = new Plane(new Vector3(0, 1, 0), 0);
    const hit = new Vector3();
    const target = new Vector2(0, 2);
    let lastMove = -Infinity;
    const onPointer = (e: PointerEvent) => {
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(ground, hit)) {
        target.set(hit.x, hit.z);
        lastMove = performance.now();
      }
      if (reduce.matches) render(performance.now());
    };

    let frame = 0;
    let start = performance.now();
    const render = (now: number) => {
      const t = (now - start) / 1000;
      uniforms.uTime.value = reduce.matches ? 2.4 : t;
      uniforms.uPointer.value.lerp(target, 0.08);
      const active = now - lastMove < 1400 ? 1 : 0;
      uniforms.uPointerStrength.value += (active - uniforms.uPointerStrength.value) * 0.04;
      renderer.render(scene, camera);
    };
    const loop = (now: number) => {
      render(now);
      frame = requestAnimationFrame(loop);
    };
    const play = () => {
      cancelAnimationFrame(frame);
      if (reduce.matches || document.hidden) {
        render(performance.now());
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    play();

    const themeObserver = new MutationObserver(() => {
      applyTheme();
      if (reduce.matches) render(performance.now());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const onResize = () => {
      resize();
      if (reduce.matches) render(performance.now());
    };
    const onVisibility = () => {
      if (!document.hidden) start = performance.now() - uniforms.uTime.value * 1000;
      play();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    reduce.addEventListener('change', play);
    requestAnimationFrame(() => el.setAttribute('data-ready', ''));

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      reduce.removeEventListener('change', play);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className="signal-field" aria-hidden="true" />;
}
