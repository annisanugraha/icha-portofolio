'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';

// ── Module-level mutable: avoids state re-renders on every mouse move ──
const _mouse = { x: 0, y: 0 };
const _scroll = { y: 0 };

// ── WebGL Support Check ────────────────────────────────────────────────
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// ── 3D Loading Indicator (3d-web-experience: HIGH Severity Fix) ────────
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-3.5 select-none pointer-events-none p-6 rounded-2xl bg-[#0a0a0a]/80 border border-white/10 backdrop-blur-md shadow-2xl transition-all">
        <div className="relative w-14 h-14 flex items-center justify-center">
          {/* Subtle outer ping animation */}
          <div className="absolute inset-0 border border-white/15 rounded-full animate-ping opacity-30" />
          {/* Rotating gradient loader ring */}
          <div className="absolute inset-0 border-2 border-t-white border-r-white/30 border-b-white/10 border-l-transparent rounded-full animate-spin" />
          {/* Percentage */}
          <span className="text-[11px] font-mono text-white/90 font-bold tracking-tighter">
            {progress.toFixed(0)}%
          </span>
        </div>
        <div className="text-center">
          <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-neutral-400">
            Loading 3D Experience
          </p>
          <div className="w-24 h-[2px] bg-white/10 rounded-full mt-2 overflow-hidden mx-auto">
            <div
              className="h-full bg-white transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Html>
  );
}

// ── 3D Character mesh + multi-phase animation & scroll orchestration ───
function Character({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/3d/anime-girl.glb');
  const { actions, mixer } = useAnimations(animations, groupRef);

  // Track current phase: 'walking' | 'waving' | 'idle'
  const phaseRef = useRef<'walking' | 'waving' | 'idle'>('walking');

  useEffect(() => {
    if (!mixer || !actions) return;

    // Helper to find action regardless of exact casing or NLA strip prefix
    const getAction = (name: string) => {
      const key = Object.keys(actions).find((k) =>
        k.toLowerCase().includes(name.toLowerCase())
      );
      return key ? actions[key] : null;
    };

    const walkAction = getAction('walk');
    const waveAction = getAction('wave');
    const idleAction = getAction('idle');

    // Start with walking animation
    if (walkAction) {
      phaseRef.current = 'walking';
      walkAction.reset().fadeIn(0.2).setLoop(THREE.LoopRepeat, Infinity);
      walkAction.play();
    } else if (waveAction) {
      // Fallback if walk action isn't found
      phaseRef.current = 'waving';
      waveAction.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 1);
      waveAction.clampWhenFinished = true;
      waveAction.play();
    }

    // Listener when a one-shot action (like wave) finishes
    const onFinished = (e: any) => {
      if (waveAction && e.action === waveAction && phaseRef.current === 'waving') {
        phaseRef.current = 'idle';
        waveAction.fadeOut(0.4);
        if (idleAction) {
          idleAction.reset().fadeIn(0.4).setLoop(THREE.LoopRepeat, Infinity);
          idleAction.play();
        }
      }
    };

    mixer.addEventListener('finished', onFinished);
    return () => {
      mixer.removeEventListener('finished', onFinished);
    };
  }, [actions, mixer]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Scroll factor normalized (0 at top, 1 when scrolled down ~600px)
    const scrollFactor = THREE.MathUtils.clamp(_scroll.y / 600, 0, 1);

    if (phaseRef.current === 'walking') {
      // Move from RIGHT (1.4) towards center-left target (0.15)
      const nextX = groupRef.current.position.x - delta * 0.85;
      groupRef.current.position.x = nextX > 0.15 ? nextX : 0.15;

      // Face the direction of travel (~-1.1 radians / ~63 degrees to the LEFT) while walking
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -1.1, 0.12);

      // Check if arrived at target destination
      if (groupRef.current.position.x <= 0.15) {
        groupRef.current.position.x = 0.15;
        phaseRef.current = 'waving';

        // Transition from walk to wave
        const getAction = (name: string) => {
          const key = Object.keys(actions).find((k) =>
            k.toLowerCase().includes(name.toLowerCase())
          );
          return key ? actions[key] : null;
        };
        const walkAction = getAction('walk');
        const waveAction = getAction('wave');

        walkAction?.fadeOut(0.35);
        if (waveAction) {
          waveAction.reset().fadeIn(0.35).setLoop(THREE.LoopOnce, 1);
          waveAction.clampWhenFinished = true;
          waveAction.play();
        }
      }
    } else if (phaseRef.current === 'waving') {
      // Smoothly turn to face forward towards the user while greeting
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.08, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.06);
    } else if (phaseRef.current === 'idle') {
      // Idle floating bob combined with scroll parallax shift
      // Base Y = -0.42: feet aligned with subtitle text (measured at ~67% from canvas top)
      const bobY = Math.sin(t * 1.4) * 0.025 + Math.cos(t * 0.7) * 0.01;
      const scrollShiftY = scrollFactor * 0.35;
      groupRef.current.position.y = -0.42 + bobY + scrollShiftY;

      // Smooth cursor-tracked rotation combined with scroll tilt
      const targetRotY = _mouse.x * (isMobile ? 0.15 : 0.35) + scrollFactor * 0.25;
      const targetRotX = -_mouse.y * (isMobile ? 0.06 : 0.12) + scrollFactor * 0.15;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.05
      );
    }
  });

  // Start character on the RIGHT side (1.4) angled LEFT (~-1.1 rad) so she walks into position
  // Y = -0.42 aligns character feet with the subtitle text at ~67% from canvas top
  return (
    <group ref={groupRef} scale={isMobile ? 1.3 : 1.65} position={[1.4, -0.42, 0]} rotation={[0, -1.1, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// ── Preload as soon as module is imported ─────────────────────────────
useGLTF.preload('/3d/anime-girl.glb');

// ── Canvas wrapper with WebGL Fallback & Performance Optimization ─────
export default function CharacterCanvas() {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport());

    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();

    const onMouseMove = (e: MouseEvent) => {
      _mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      _mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onScroll = () => {
      _scroll.y = window.scrollY || document.documentElement.scrollTop || 0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', checkMobile, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // ── WebGL Fallback UI (3d-web-experience: MEDIUM Severity Fix) ──
  if (!webGLSupported) {
    return (
      <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center border border-white/10 rounded-3xl bg-gradient-to-b from-neutral-900/40 to-[#0a0a0a]/60 backdrop-blur-md p-8 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/15 shadow-inner">
          <span className="text-2xl animate-pulse">✨</span>
        </div>
        <h3 className="text-xs font-mono text-white tracking-[0.25em] uppercase mb-1.5">
          Interactive 3D Avatar
        </h3>
        <p className="text-[11px] text-neutral-400 max-w-xs font-mono leading-relaxed">
          Your device or browser currently does not support WebGL hardware acceleration.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0.3, 4.5], fov: 50 }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: 'low-power' }}
        dpr={isMobile ? 1 : [1, 1.5]}
        performance={{ min: 0.5 }}
        style={{ background: 'transparent' }}
      >
        {/* Soft warm studio lighting matching the portfolio palette */}
        <ambientLight intensity={isMobile ? 1.5 : 1.8} />
        <directionalLight position={[3, 6, 4]} intensity={1.6} />
        <directionalLight position={[-4, 1, -3]} intensity={0.6} color="#ffe8cc" />

        {/* Suspense with elegant Loader (useProgress) */}
        <Suspense fallback={<Loader />}>
          <Character isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}

