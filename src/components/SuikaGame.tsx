'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Matter from 'matter-js'

const TIERS = [
  { symbol: '◦', size: 12, color: '#fafafa', stroke: '#e5e5e5' },
  { symbol: '⋆', size: 18, color: '#f5f5f5', stroke: '#d5d5d5' },
  { symbol: '✧', size: 26, color: '#f0f0f0', stroke: '#c5c5c5' },
  { symbol: '✦', size: 36, color: '#ebebeb', stroke: '#b5b5b5' },
  { symbol: '☼', size: 48, color: '#e0e0e0', stroke: '#959595' },
  { symbol: '❂', size: 62, color: '#d5d5d5', stroke: '#858585' },
  { symbol: '❉', size: 80, color: '#cccccc', stroke: '#757575' },
  { symbol: '✿', size: 100, color: '#bbbbbb', stroke: '#666666' },
  { symbol: '✺', size: 124, color: '#999999', stroke: '#444444' },
  { symbol: '❋', size: 152, color: '#111111', stroke: '#111111', textCol: '#ffffff' },
]

export const SuikaGame = () => {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  const scoreRef = useRef(0)

  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Game mechanics state
  const [currentTier, setCurrentTier] = useState(0)
  const [nextTier, setNextTier] = useState(1)

  // Refs for inside Matter.js events
  const currentTierRef = useRef(0)
  const nextTierRef = useRef(1)
  const cooldownRef = useRef(false)
  const previewXRef = useRef(200)
  const gameWidthRef = useRef(400)
  const gameHeightRef = useRef(440)

  // Initialize random starting tiers
  useEffect(() => {
    const initC = Math.floor(Math.random() * 3);
    const initN = Math.floor(Math.random() * 3);
    setCurrentTier(initC);
    setNextTier(initN);
    currentTierRef.current = initC;
    nextTierRef.current = initN;
  }, [])

  useEffect(() => {
    const savedBest = localStorage.getItem('icha-suika-best')
    if (savedBest) setBestScore(parseInt(savedBest, 10))

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Events = Matter.Events

    const engine = Engine.create()
    engineRef.current = engine
    engine.gravity.y = 1.2;

    const initialWidth = sceneRef.current?.clientWidth || 400;
    const initialHeight = sceneRef.current?.clientHeight || 440;
    gameWidthRef.current = initialWidth;
    gameHeightRef.current = initialHeight;

    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: initialWidth,
        height: initialHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
      }
    })
    renderRef.current = render

    const wallOptions = {
      isStatic: true,
      render: { visible: false, opacity: 0, fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 }
    }

    const ground = Bodies.rectangle(initialWidth / 2, initialHeight + 28, 3000, 60, wallOptions)
    const leftWall = Bodies.rectangle(-30, initialHeight / 2, 60, 3000, wallOptions)
    const rightWall = Bodies.rectangle(initialWidth + 30, initialHeight / 2, 60, 3000, wallOptions)

    Composite.add(engine.world, [ground, leftWall, rightWall])
    Render.run(render)

    // Handle Resize
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries.length) return;
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;

      gameWidthRef.current = width;
      gameHeightRef.current = height;

      render.options.width = width;
      render.options.height = height;
      const pixelRatio = render.options.pixelRatio || (typeof window !== 'undefined' ? window.devicePixelRatio : 1);
      render.canvas.width = width * pixelRatio;
      render.canvas.height = height * pixelRatio;

      Matter.Body.setPosition(ground, { x: width / 2, y: height + 28 });
      Matter.Body.setPosition(leftWall, { x: -30, y: height / 2 });
      Matter.Body.setPosition(rightWall, { x: width + 30, y: height / 2 });
    });
    if (sceneRef.current) {
      resizeObserver.observe(sceneRef.current);
    }

    const runner = Runner.create()
    runnerRef.current = runner
    Runner.run(runner, engine)

    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      const bodiesToRemove = new Set<Matter.Body>();
      const pairsToAdd: { x: number, y: number, tier: number }[] = [];

      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;

        if (bodyA.plugin.tier !== undefined && bodyB.plugin.tier !== undefined) {
          if (bodyA.plugin.tier === bodyB.plugin.tier) {
            // Prevent multiple merges involving the same body
            if (!bodiesToRemove.has(bodyA) && !bodiesToRemove.has(bodyB)) {
              const currentTier = bodyA.plugin.tier;
              if (currentTier < TIERS.length - 1) {
                bodiesToRemove.add(bodyA);
                bodiesToRemove.add(bodyB);

                const midX = (bodyA.position.x + bodyB.position.x) / 2;
                const midY = (bodyA.position.y + bodyB.position.y) / 2;
                pairsToAdd.push({ x: midX, y: midY, tier: currentTier + 1 });

                // Suika-like scoring formula: Triangular numbers
                const points = ((currentTier + 1) * (currentTier + 2)) / 2;
                scoreRef.current += points;
                setScore(scoreRef.current);
              }
            }
          }
        }
      }

      if (bodiesToRemove.size > 0) {
        Composite.remove(engine.world, Array.from(bodiesToRemove));

        pairsToAdd.forEach(p => {
          const newTier = TIERS[p.tier];
          const newBody = Bodies.circle(p.x, p.y, newTier.size, {
            restitution: 0.2, // slightly bouncy
            friction: 0.1,
            density: 0.002 * (p.tier + 1),
            render: {
              fillStyle: newTier.color,
              strokeStyle: newTier.stroke,
              lineWidth: 1
            },
            plugin: { tier: p.tier }
          });
          Composite.add(engine.world, newBody);
        });
      }
    });

    Events.on(render, 'afterRender', () => {
      const context = render.context;
      context.textAlign = "center";
      context.textBaseline = "middle";

      // Draw active bodies
      for (let body of Composite.allBodies(engine.world)) {
        if (body.plugin.tier !== undefined) {
          const tier = TIERS[body.plugin.tier];
          context.fillStyle = tier.textCol || '#111';
          const fontSize = tier.size * 1.2;
          context.font = `${fontSize}px Arial`;
          context.fillText(tier.symbol, body.position.x, body.position.y);
        }
      }

      // Draw Preview Drop if not game over and not in cooldown
      if (!gameOver && !cooldownRef.current) {
        const pTier = TIERS[currentTierRef.current];
        if (pTier) {
          context.globalAlpha = 0.5;
          context.fillStyle = pTier.color;
          context.strokeStyle = pTier.stroke;
          context.lineWidth = 1;
          context.beginPath();
          context.arc(previewXRef.current, pTier.size + 10, pTier.size, 0, 2 * Math.PI);
          context.fill();
          context.stroke();

          context.globalAlpha = 1.0;
          context.fillStyle = pTier.textCol || '#111';
          context.font = `${pTier.size * 1.2}px Arial`;
          context.fillText(pTier.symbol, previewXRef.current, pTier.size + 10);
        }
      }

      // Warning line
      context.beginPath();
      context.moveTo(0, 80);
      context.lineTo(gameWidthRef.current, 80);
      context.setLineDash([5, 5]);
      context.strokeStyle = 'rgba(200, 0, 0, 0.15)';
      context.stroke();
      context.setLineDash([]);
    });

    let dangerTicks = 0;
    const checkInterval = setInterval(() => {
      if (gameOver) return;
      let inDanger = false;
      for (let body of Composite.allBodies(engine.world)) {
        if (body.plugin.tier !== undefined) {
          // If the top edge of a body is above y=80 and has virtually stopped moving
          const topEdge = body.position.y - (body.circleRadius ?? 0);
          if (topEdge < 80 && Math.abs(body.velocity.y) < 0.5 && Math.abs(body.velocity.x) < 0.5) {
            inDanger = true;
            break;
          }
        }
      }
      if (inDanger) {
        dangerTicks++;
        if (dangerTicks >= 3) { // Must be settled in danger zone for 3 seconds
          setGameOver(true);
        }
      } else {
        dangerTicks = 0;
      }
    }, 1000);

    // Pause/resume engine when not visible in viewport
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!runnerRef.current || !renderRef.current) return;
        if (entry.isIntersecting) {
          Runner.run(runnerRef.current, engine);
          Render.run(renderRef.current);
        } else {
          Runner.stop(runnerRef.current);
          Render.stop(renderRef.current);
        }
      },
      { threshold: 0.1 }
    );
    if (sceneRef.current) {
      visibilityObserver.observe(sceneRef.current);
    }

    return () => {
      clearInterval(checkInterval);
      visibilityObserver.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      if (engineRef.current) {
        Engine.clear(engineRef.current);
      }
      if (render.canvas) {
        render.canvas.remove();
      }
      render.canvas = null as any;
      render.context = null as any;
      render.textures = {};
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('icha-suika-best', score.toString());
    }
  }, [score, bestScore]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameOver || cooldownRef.current) return;
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Logical size exactly matches physical size now
    const rawX = e.clientX - rect.left;

    const tier = TIERS[currentTier];
    if (tier) {
      const minX = tier.size + 2;
      const maxX = gameWidthRef.current - tier.size - 2;
      previewXRef.current = Math.max(minX, Math.min(rawX, maxX));
    }
  };

  const handleDrop = () => {
    if (gameOver || cooldownRef.current || !engineRef.current) return;

    const tierIdx = currentTierRef.current;
    const tier = TIERS[tierIdx];

    const body = Matter.Bodies.circle(previewXRef.current, tier.size + 10, tier.size, {
      restitution: 0.1,
      friction: 0.1,
      density: 0.002 * (tierIdx + 1),
      render: {
        fillStyle: tier.color,
        strokeStyle: tier.stroke,
        lineWidth: 1
      },
      plugin: { tier: tierIdx }
    });

    Matter.Composite.add(engineRef.current.world, body);

    cooldownRef.current = true;

    // Queue next drop
    setTimeout(() => {
      // Sync state and refs instantly
      currentTierRef.current = nextTierRef.current;
      const newNext = Math.floor(Math.random() * 3);
      nextTierRef.current = newNext;

      setCurrentTier(currentTierRef.current);
      setNextTier(newNext);

      cooldownRef.current = false;
    }, 800); // 800ms wait between drops
  };

  const restartGame = () => {
    if (engineRef.current) {
      Matter.Composite.clear(engineRef.current.world, false);
      const wallOptions = { isStatic: true, render: { visible: false, opacity: 0, fillStyle: 'transparent', strokeStyle: 'transparent', lineWidth: 0 } }
      const width = gameWidthRef.current;
      const height = gameHeightRef.current;
      const ground = Matter.Bodies.rectangle(width / 2, height + 28, 3000, 60, wallOptions)
      const leftWall = Matter.Bodies.rectangle(-30, height / 2, 60, 3000, wallOptions)
      const rightWall = Matter.Bodies.rectangle(width + 30, height / 2, 60, 3000, wallOptions)
      Matter.Composite.add(engineRef.current.world, [ground, leftWall, rightWall]);

      scoreRef.current = 0;
      setScore(0);
      setGameOver(false);
      const initC = Math.floor(Math.random() * 3);
      const initN = Math.floor(Math.random() * 3);
      currentTierRef.current = initC;
      nextTierRef.current = initN;
      setCurrentTier(initC);
      setNextTier(initN);
      cooldownRef.current = false;
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full max-w-[600px] mx-auto py-4 relative z-10 min-h-0">
      {/* Header Info */}
      <div className="w-full flex justify-between items-end mb-4 px-2 shrink-0">
        <div>
          <div className="flex items-center gap-3 mt-2.5">
            <button
              onClick={() => setShowHelp(true)}
              className="group px-3.5 py-1.5 rounded-full border border-white/30 bg-[#1a1a1a] hover:bg-white hover:text-black text-gray-200 hover:scale-105 active:scale-95 text-[10px] font-mono font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2 shadow-md cursor-pointer"
              aria-label="How to Play"
            >
              <span className="w-4 h-4 rounded-full bg-white/15 group-hover:bg-black group-hover:text-white flex items-center justify-center text-[10px] transition-colors font-mono font-black">?</span>
              <span>HOW TO PLAY</span>
            </button>
            <div className="h-4 w-[1px] bg-white/15" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 tracking-[0.15em] uppercase font-mono font-medium">
                Next
              </span>
              <div
                className="w-7 h-7 rounded-full border border-white/20 bg-[#222] shadow-sm flex items-center justify-center text-[11px] text-white font-bold"
              >
                {TIERS[nextTier]?.symbol}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right font-mono flex flex-col justify-end gap-1">
          <p className="text-[11px] text-gray-400 tracking-widest uppercase m-0 leading-tight">Score <span className="text-white font-semibold text-xs">{score}</span></p>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase m-0 leading-tight">Best <span className="text-gray-300">{bestScore}</span></p>
        </div>
      </div>

      {/* Game Container Wrapper - completely fluid */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center relative overflow-hidden">
        <div
          className="relative bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-full h-full"
        >
          <div
            ref={sceneRef}
            onMouseMove={handleMouseMove}
            onClick={handleDrop}
            className={`absolute inset-0 [&>canvas]:!w-full [&>canvas]:!h-full cursor-crosshair transition-opacity duration-300 ${gameOver ? 'opacity-30' : 'opacity-100'}`}
          />

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Game Over</h3>
              <p className="text-xs font-mono text-gray-600 uppercase tracking-[0.2em] mb-8 font-semibold">
                Final Score: {score}
              </p>
              <button
                onClick={restartGame}
                className="px-8 py-3 bg-black text-white font-bold text-[11px] tracking-[0.2em] uppercase font-mono hover:scale-105 active:scale-95 transition-all rounded-full shadow-lg"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Help / How to Play Fullscreen Popup Modal */}
      {showHelp && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[50000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="max-w-sm w-full bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-xl relative space-y-4">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center transition-all text-xs font-mono cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-black text-white font-serif text-base shadow-sm">
                ?
              </div>
              <h3 className="text-xl font-serif text-[#111] tracking-tight font-bold">How to Play</h3>
            </div>
            <div className="text-left text-xs text-[#444] font-light space-y-3 leading-relaxed bg-white border border-gray-200 p-4 rounded-2xl">
              <p className="flex gap-2.5 items-start">
                <span className="font-mono text-white font-bold bg-black px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">1</span>
                <span><strong className="text-[#111] font-semibold">Aim & Drop:</strong> Move your cursor inside the white container and click to drop shapes.</span>
              </p>
              <p className="flex gap-2.5 items-start">
                <span className="font-mono text-white font-bold bg-black px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">2</span>
                <span><strong className="text-[#111] font-semibold">Merge & Grow:</strong> When two identical symbols collide, they combine into the next bigger tier (<span className="font-mono text-[#111] font-medium">◦ → ⋆ → ✧ → ✦</span>).</span>
              </p>
              <p className="flex gap-2.5 items-start">
                <span className="font-mono text-white font-bold bg-black px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">3</span>
                <span><strong className="text-[#111] font-semibold">High Score:</strong> Keep merging for points without overflowing the top limit!</span>
              </p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 bg-black text-white font-bold text-[11px] tracking-[0.2em] uppercase font-mono hover:bg-[#222] active:scale-98 transition-all rounded-full shadow-md !mt-5 cursor-pointer"
            >
              Got it, Let&apos;s Play!
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
