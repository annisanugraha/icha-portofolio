'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { Profile } from '@/types';

const SplineScene = dynamic(() => import('./SplineScene').then((mod) => mod.SplineScene), {
    ssr: false,
    loading: () => null,
});

interface HeroSectionProps {
    profile: Profile | null;
}

function buildStats(profile: Profile | null): string[] {
    return [profile?.statsItem1, profile?.statsItem2, profile?.statsItem3, profile?.statsItem4].filter(
        (s): s is string => Boolean(s)
    );
}

/** Splits a string into magnetic letter spans used by the mouse-follow effect. */
function splitToSpans(text: string) {
    return [...text].map((ch, i) => (
        <span key={i} className="hero-lt">
            {ch === ' ' ? '\u00A0' : ch}
        </span>
    ));
}

export function HeroSection({ profile }: HeroSectionProps) {
    const heroRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ghostOutlineRef = useRef<HTMLDivElement>(null);
    const ghostSolidRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const splineWrapRef = useRef<HTMLDivElement>(null);
    const thinRef = useRef<HTMLSpanElement>(null);
    const boldRef = useRef<HTMLSpanElement>(null);

    const stats = buildStats(profile);
    const ghostWord = (profile?.logoText || 'ICHA').split(' ')[0].toUpperCase();

    // Background grid, redrawn on resize.
    useEffect(() => {
        const hero = heroRef.current;
        const canvas = canvasRef.current;
        if (!hero || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cell = 46;
        const ink = '18,18,16';
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        function draw() {
            const rect = hero!.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            canvas!.width = Math.round(w * dpr);
            canvas!.height = Math.round(h * dpr);
            canvas!.style.width = `${w}px`;
            canvas!.style.height = `${h}px`;
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx!.clearRect(0, 0, w, h);
            ctx!.strokeStyle = `rgba(${ink},0.08)`;
            ctx!.lineWidth = 1;

            for (let x = 0; x <= w + cell; x += cell) {
                ctx!.beginPath();
                ctx!.moveTo(x + 0.5, 0);
                ctx!.lineTo(x + 0.5, h);
                ctx!.stroke();
            }
            for (let y = 0; y <= h + cell; y += cell) {
                ctx!.beginPath();
                ctx!.moveTo(0, y + 0.5);
                ctx!.lineTo(w, y + 0.5);
                ctx!.stroke();
            }
        }

        draw();
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, []);

    // Magnetic letter attraction, ghost-word drift, and 3D tilt on the robot stage.
    useEffect(() => {
        const hero = heroRef.current;
        const ghostOutline = ghostOutlineRef.current;
        const ghostSolid = ghostSolidRef.current;
        const stage = stageRef.current;
        const splineWrap = splineWrapRef.current;
        if (!hero) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return;

        let letterRects: Array<{ el: HTMLElement; cx: number; cy: number }> = [];

        function cacheLetters() {
            letterRects = [];
            [thinRef.current, boldRef.current].forEach((container) => {
                if (!container) return;
                container.querySelectorAll<HTMLElement>('.hero-lt').forEach((span) => {
                    const r = span.getBoundingClientRect();
                    letterRects.push({ el: span, cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
                });
            });
        }

        window.addEventListener('load', cacheLetters);
        window.addEventListener('resize', cacheLetters);
        const cacheTimeout = setTimeout(cacheLetters, 500);

        function onMouseMove(e: MouseEvent) {
            const mx = e.clientX;
            const my = e.clientY;
            const radius = 130;

            letterRects.forEach(({ el, cx, cy }) => {
                const dx = mx - cx;
                const dy = my - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < radius) {
                    const strength = 1 - dist / radius;
                    el.style.transform = `translate(${(-dx / dist) * strength * 6}px, ${(-dy / dist) * strength * 10}px)`;
                } else {
                    el.style.transform = '';
                }
            });

            const hr = hero!.getBoundingClientRect();
            const nx = (mx - hr.left) / hr.width - 0.5;
            const ny = (my - hr.top) / hr.height - 0.5;
            if (ghostOutline) ghostOutline.style.transform = `translate(${nx * 14}px, ${ny * 10}px)`;
            if (ghostSolid) ghostSolid.style.transform = `translate(${-nx * 10}px, ${-ny * 7}px)`;
        }

        function onMouseLeave() {
            letterRects.forEach(({ el }) => (el.style.transform = ''));
            if (ghostOutline) ghostOutline.style.transform = '';
            if (ghostSolid) ghostSolid.style.transform = '';
            if (splineWrap) splineWrap.style.transform = '';
        }

        function onStageMouseMove(e: MouseEvent) {
            if (!stage || !splineWrap) return;
            const r = stage.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            splineWrap.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
        }

        function onStageMouseLeave() {
            if (splineWrap) splineWrap.style.transform = '';
        }

        hero.addEventListener('mousemove', onMouseMove);
        hero.addEventListener('mouseleave', onMouseLeave);
        stage?.addEventListener('mousemove', onStageMouseMove);
        stage?.addEventListener('mouseleave', onStageMouseLeave);

        return () => {
            clearTimeout(cacheTimeout);
            hero.removeEventListener('mousemove', onMouseMove);
            hero.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('load', cacheLetters);
            window.removeEventListener('resize', cacheLetters);
            stage?.removeEventListener('mousemove', onStageMouseMove);
            stage?.removeEventListener('mouseleave', onStageMouseLeave);
        };
    }, []);

    function scrollToNext() {
        const hero = heroRef.current;
        if (!hero) return;
        const next = hero.nextElementSibling as HTMLElement | null;
        (next || document.body).scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <section ref={heroRef} id="hero">
            <canvas ref={canvasRef} className="hero-grid-canvas" aria-hidden="true" />

            {/* Out-of-register ghost typography */}
            <div ref={ghostOutlineRef} className="ghost-outline" aria-hidden="true">
                {ghostWord}
            </div>
            <div ref={ghostSolidRef} className="ghost-solid" aria-hidden="true">
                {ghostWord}
            </div>

            <div className="hero-content">
                <div className="hero-mid">
                    {/* Typography */}
                    <div className="hero-mid-left">
                        <motion.div
                            className="hero-role"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="mark">✦</span>
                            {profile?.heroRole ?? 'UI/UX Designer & Frontend Developer'}
                        </motion.div>

                        <motion.h1
                            className="hero-headline"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span ref={thinRef} className="hero-h-thin">
                                {splitToSpans(profile?.heroTitle ?? 'Explorative design.')}
                            </span>
                            <span ref={boldRef} className="hero-h-bold">
                                {splitToSpans(profile?.heroTitleBold ?? 'Dynamic code.')}
                            </span>
                        </motion.h1>

                        <motion.div
                            className="hero-sub"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="bar" />
                            <p>
                                {profile?.heroSubtitle ??
                                    'Bridging visual aesthetics and frontend logic to build impactful digital products.'}
                            </p>
                        </motion.div>

                        {stats.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="flex w-full flex-wrap justify-start gap-2.5"
                            >
                                {stats.map((s, i) => (
                                    <div
                                        key={i}
                                        className="inline-flex shrink-0 items-center rounded-full border border-black/[0.18] bg-white/90 px-[18px] py-2"
                                    >
                                        <b className="whitespace-nowrap font-serif text-xs font-bold text-[#111]">{s}</b>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Spline robot stage */}
                    <motion.div
                        ref={stageRef}
                        className="hero-stage"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="hero-annot a1" aria-hidden="true">
                            <span className="chip">Neat Design</span>
                        </div>
                        <div className="hero-annot a2" aria-hidden="true">
                            <span className="chip">Code Craft</span>
                        </div>
                        <div className="hero-annot a3" aria-hidden="true">
                            <span className="chip">Always Learning</span>
                        </div>

                        <div
                            ref={splineWrapRef}
                            className="relative h-full w-full transition-transform duration-[250ms] ease-out"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <div className="hero-orbit-ring" aria-hidden="true" />
                            <SplineScene
                                scene="https://prod.spline.design/bTBmc2h7TBzR3GJr/scene.splinecode"
                                className="h-full w-full"
                            />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="hero-bottom"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="hero-bottomrow">
                        <span className="hero-avail">
                            <i className="hero-avail-dot" />
                            Available for projects
                        </span>
                        <button className="hero-scroll-btn" onClick={scrollToNext} aria-label="Scroll to explore">
                            <span>Scroll to explore</span>
                            <svg className="hero-scroll-chevron" width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
                                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}