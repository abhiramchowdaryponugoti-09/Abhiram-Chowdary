import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const nextDirection = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Don't spawn food on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirection.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) nextDirection.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.y !== -1) nextDirection.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) nextDirection.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.x !== -1) nextDirection.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = nextDirection.current;
        setDirection(currentDir);
        
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y
        };

        // Collision check - Wall
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Collision check - Self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(70, BASE_SPEED - (score / 10) * 2);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [food, isGameOver, isPaused, score, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#050506';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff007f';
    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 15 : 10;
      ctx.shadowColor = '#39ff14';
      ctx.fillStyle = isHead ? '#fff' : '#39ff14';
      
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const margin = 2;
      
      ctx.beginPath();
      ctx.roundRect(x + margin, y + margin, cellSize - margin * 2, cellSize - margin * 2, 4);
      ctx.fill();
    });
    
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div id="snake-container" className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="absolute top-6 left-8 flex items-baseline space-x-4">
        <div className="text-sm uppercase tracking-widest opacity-40">Score</div>
        <div className="text-5xl font-black text-neon-green tabular-nums tracking-tighter">
          {score.toString().padStart(6, '0')}
        </div>
      </div>

      <div className="absolute top-6 right-8 text-right">
        <div className="text-xs uppercase tracking-widest opacity-40">Multiplier</div>
        <div className="text-2xl font-bold text-neon-pink">x{(1 + score / 100).toFixed(1)}</div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="bg-black border border-white/5 shadow-[0_0_50px_rgba(0,0,0,1)] max-w-[500px] w-full aspect-square"
          id="snake-canvas"
        />

        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            >
              <h3 className="text-4xl font-black text-white mb-2 tracking-tighter italic">SYSTEM FAILURE</h3>
              <p className="text-zinc-500 font-mono mb-6 uppercase tracking-[0.3em] text-[10px]">Data Lost: {score} Units</p>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-10 py-3 bg-white hover:bg-zinc-200 text-black font-black uppercase text-xs tracking-widest transition-all transform hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Grid
              </button>
            </motion.div>
          )}

          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10"
            >
              <div className="px-6 py-2 bg-white text-black font-bold tracking-widest animate-pulse uppercase rounded-sm text-[10px]">
                Link Suspended
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex gap-12 text-white/20 font-bold text-[9px] uppercase tracking-[0.4em] border-t border-white/5 pt-8">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 border border-white/10 rounded-sm text-white/40 font-mono">KEYS</span>
          <span>Maneuver</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 border border-white/10 rounded-sm text-white/40 font-mono">SPACE</span>
          <span>Suspend</span>
        </div>
      </div>
    </div>
  );
}
