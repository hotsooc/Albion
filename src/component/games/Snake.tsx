'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import useTrans from '@/hooks/useTrans';
import { Play, RotateCcw, ArrowLeft } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }];
const INITIAL_FOOD = { x: 5, y: 5 };

type Coordinate = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SnakeGameProps {
  onGoBack: () => void;
}

const SPEED_MAP: Record<number, number> = {
  1: 200,
  2: 175,
  3: 150,
  4: 125,
  5: 100,
  6: 85,
  7: 70,
  8: 55,
  9: 40, // Cực kỳ nhanh!
};

export default function SnakeGame({ onGoBack }: SnakeGameProps) {
  const { trans } = useTrans();
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('UP');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speedLevel, setSpeedLevel] = useState(5);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const lastDirectionRef = useRef<Direction>('UP');
  const nextDirectionRef = useRef<Direction>('UP');

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nokia_snake_highscore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Update high score
  const checkAndSaveHighScore = useCallback((finalScore: number) => {
    const saved = localStorage.getItem('nokia_snake_highscore');
    const currentHigh = saved ? parseInt(saved, 10) : 0;
    if (finalScore > currentHigh) {
      localStorage.setItem('nokia_snake_highscore', finalScore.toString());
      setHighScore(finalScore);
      setIsNewRecord(true);
    }
  }, []);

  const createFood = useCallback((currentSnake: Coordinate[]): Coordinate => {
    let newFood: Coordinate;
    let attempts = 0;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      attempts++;
    } while (
      attempts < 400 && 
      currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    // Apply the buffered direction from input
    const currentDir = nextDirectionRef.current;
    lastDirectionRef.current = currentDir;

    setSnake(prevSnake => {
      const newHead = { ...prevSnake[0] };

      switch (currentDir) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // Check border collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        setIsPaused(true);
        checkAndSaveHighScore(score);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        checkAndSaveHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food eating
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(createFood(newSnake));
        setScore(s => s + (speedLevel * 10)); // Cấp càng cao, điểm ăn mồi càng nhiều
        return newSnake;
      } else {
        newSnake.pop();
        return newSnake;
      }
    });
  }, [isGameOver, isPaused, food, createFood, score, speedLevel, checkAndSaveHighScore]);

  // Game loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const intervalTime = SPEED_MAP[speedLevel] || 100;
    const gameLoop = setInterval(moveSnake, intervalTime);
    return () => clearInterval(gameLoop);
  }, [moveSnake, isGameOver, isPaused, speedLevel]);

  // Handle controls input
  const triggerDirection = useCallback((newDir: Direction) => {
    let isValid = false;
    switch (newDir) {
      case 'UP':
        isValid = lastDirectionRef.current !== 'DOWN';
        break;
      case 'DOWN':
        isValid = lastDirectionRef.current !== 'UP';
        break;
      case 'LEFT':
        isValid = lastDirectionRef.current !== 'RIGHT';
        break;
      case 'RIGHT':
        isValid = lastDirectionRef.current !== 'LEFT';
        break;
    }

    if (isValid) {
      nextDirectionRef.current = newDir;
      setDirection(newDir);
    }
  }, []);

  const handleStartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('UP');
    lastDirectionRef.current = 'UP';
    nextDirectionRef.current = 'UP';
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setIsNewRecord(false);
  };

  const handleRestart = () => {
    setHasStarted(false);
    setIsPaused(true);
    setIsGameOver(false);
    setScore(0);
    setIsNewRecord(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Start game on keypress in menu
      if (!hasStarted) {
        if (key === ' ' || key === 'enter') {
          e.preventDefault();
          handleStartGame();
          return;
        }
        if (key === 'a' || key === 'arrowleft') {
          e.preventDefault();
          setSpeedLevel(l => Math.max(1, l - 1));
          return;
        }
        if (key === 'd' || key === 'arrowright') {
          e.preventDefault();
          setSpeedLevel(l => Math.min(9, l + 1));
          return;
        }
        return;
      }

      if (isGameOver) {
        if (key === ' ' || key === 'enter') {
          e.preventDefault();
          handleRestart();
        }
        return;
      }

      // Handle direct turns
      let newDir: Direction | null = null;
      switch (key) {
        case 'w':
        case 'arrowup':
          newDir = 'UP';
          break;
        case 's':
        case 'arrowdown':
          newDir = 'DOWN';
          break;
        case 'a':
        case 'arrowleft':
          newDir = 'LEFT';
          break;
        case 'd':
        case 'arrowright':
          newDir = 'RIGHT';
          break;
        case 'p':
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
      }

      if (newDir) {
        e.preventDefault(); // Stop browser scrolling
        triggerDirection(newDir);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver, isPaused, hasStarted, triggerDirection]);

  // Render pixels for monochrome LCD screen
  const renderCell = (x: number, y: number) => {
    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    // Nokia pixel style: active is dark, inactive is greenish LCD background
    return (
      <div
        key={`${x}-${y}`}
        className={`w-full aspect-square transition-all duration-75 flex items-center justify-center ${
          isSnake || isFood
            ? 'bg-[#1c2111] shadow-[inset_0_0_1px_rgba(255,255,255,0.1)]'
            : 'bg-[#a3b081]'
        }`}
      >
        {isFood && (
          <div className="w-[60%] h-[60%] bg-[#a3b081] animate-pulse" />
        )}
      </div>
    );
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        grid.push(renderCell(x, y));
      }
    }
    return grid;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[85vh] bg-[var(--background)] text-[var(--text-primary)] theme-transition select-none font-mono">
      
      {/* Standalone Retro LCD Game Cabinet Card */}
      <div className="w-full max-w-[420px] bg-[var(--bg-panel-solid)] border-4 border-[var(--border-color)] p-5 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(120,100,240,0.25)] flex flex-col gap-4">
        
        {/* LCD Screen Frame */}
        <div className="w-full bg-[#8c9676] border-4 border-[var(--border-color)] p-2.5 rounded-xl flex flex-col items-center relative overflow-hidden shadow-inner">
          
          {/* Subtle Scanlines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

          {/* LCD Screen Panel */}
          <div className="w-full aspect-square bg-[#a3b081] border border-[#96a277] p-2 flex flex-col relative overflow-hidden text-[#1c2111] leading-none">
            
            {/* Header info bar */}
            {hasStarted && !isGameOver && (
              <div className="flex justify-between items-center text-[10px] font-bold border-b border-[#1c2111]/20 pb-1 mb-1 tracking-tight select-none">
                <span>LEVEL: {speedLevel}</span>
                <span>SCORE: {String(score).padStart(4, '0')}</span>
              </div>
            )}

            {/* View 1: Main Start Menu */}
            {!hasStarted && (
              <div className="absolute inset-0 flex flex-col items-center justify-between py-6 px-3 bg-[#a3b081] text-center">
                <div className="w-full flex flex-col items-center mt-2">
                  <div className="text-[20px] font-black tracking-widest uppercase border-b-2 border-[#1c2111] pb-1 font-mono">
                    SNAKE II
                  </div>
                  <div className="text-[8px] tracking-widest mt-1 opacity-75">NOKIA CLASSIC</div>
                </div>

                <div className="flex flex-col items-center gap-1.5 my-2">
                  <div className="text-[9px] font-bold tracking-wider">SELECT LEVEL (1-9):</div>
                  <div className="flex items-center gap-4 bg-[#1c2111]/10 px-3 py-1 rounded-md border border-[#1c2111]/20">
                    <button 
                      onClick={() => setSpeedLevel(l => Math.max(1, l - 1))}
                      className="cursor-pointer font-bold hover:scale-125 transition-transform"
                    >
                      ◀
                    </button>
                    <span className="text-sm font-black">{speedLevel}</span>
                    <button 
                      onClick={() => setSpeedLevel(l => Math.min(9, l + 1))}
                      className="cursor-pointer font-bold hover:scale-125 transition-transform"
                    >
                      ▶
                    </button>
                  </div>
                  <div className="text-[9px] opacity-75">SPEED: {SPEED_MAP[speedLevel]}ms</div>
                </div>

                <div className="w-full flex flex-col items-center">
                  <div className="text-[8px] font-bold animate-pulse tracking-wide">PRESS [START] OR [SPACE] TO PLAY</div>
                  {highScore > 0 && (
                    <div className="text-[9px] mt-1 font-bold">HI-SCORE: {String(highScore).padStart(4, '0')}</div>
                  )}
                </div>
              </div>
            )}

            {/* View 2: Board Grid */}
            {hasStarted && (
              <div className="w-full flex-grow grid grid-cols-20 gap-[0.5px] bg-[#97a375]">
                {renderGrid()}
              </div>
            )}

            {/* View 3: Game Over overlay */}
            {isGameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#a3b081]/95 text-center p-3 animate-fade-in">
                <div className="border-2 border-[#1c2111] px-4 py-2 bg-[#a3b081] font-bold text-sm tracking-widest">
                  GAME OVER
                </div>
                <div className="text-xs font-bold mt-3">
                  SCORE: <span className="underline">{score}</span>
                </div>
                {isNewRecord ? (
                  <div className="text-[10px] font-black tracking-widest mt-2 animate-bounce bg-[#1c2111] text-[#a3b081] px-2 py-0.5">
                    * NEW RECORD *
                  </div>
                ) : (
                  <div className="text-[9px] mt-1 opacity-75">
                    HI-SCORE: {String(highScore).padStart(4, '0')}
                  </div>
                )}
                <div className="text-[8px] font-bold mt-4 animate-pulse">
                  PRESS [START] BUTTON TO RESET
                </div>
              </div>
            )}

            {/* Pause Overlay */}
            {hasStarted && isPaused && !isGameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#a3b081]/80 text-center">
                <div className="text-xs font-black tracking-widest border border-[#1c2111] px-3 py-1 bg-[#a3b081]">
                  PAUSED
                </div>
                <span className="text-[8px] mt-2 opacity-80">PRESS START TO RESUME</span>
              </div>
            )}
          </div>
        </div>

        {/* Clean Neobrutalist buttons under screen */}
        <div className="grid grid-cols-2 gap-3.5">
          <button
            onClick={onGoBack}
            className="py-3 px-4 text-xs font-extrabold rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] text-[var(--text-primary)] cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.25)] transition-all flex items-center justify-center gap-1.5 active:scale-98 will-change-transform backface-visibility-hidden"
          >
            <ArrowLeft size={14} /> {trans.game.backToGames.split(' ')[0]}
          </button>
          
          <button
            onClick={() => {
              if (!hasStarted || isGameOver) {
                handleStartGame();
              } else {
                setIsPaused(p => !p);
              }
            }}
            className="py-3 px-4 text-xs font-extrabold rounded-2xl border-2 border-[var(--border-color)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--text-primary)] cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.25)] transition-all flex items-center justify-center gap-1.5 active:scale-98 will-change-transform backface-visibility-hidden"
          >
            <Play size={14} /> {(!hasStarted || isGameOver) ? 'START' : isPaused ? 'RESUME' : 'PAUSE'}
          </button>
        </div>

        {/* Small reset button */}
        {hasStarted && !isGameOver && (
          <button
            onClick={handleRestart}
            className="w-full py-2 px-4 text-[10px] font-extrabold rounded-xl border border-[var(--border-color)] bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] cursor-pointer hover:opacity-90 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <RotateCcw size={12} /> RESET GAME
          </button>
        )}
      </div>

      {/* Guide text */}
      <div className="max-w-[420px] mt-6 text-center text-xs text-[var(--text-secondary)] leading-relaxed">
        <p className="font-bold">{trans.game.snakeInstructions}</p>
        <p className="mt-2 text-[10px] opacity-75">
          * Phím di chuyển: <b>W A S D</b> hoặc <b>Phím Mũi Tên</b> trên bàn phím.
        </p>
        <p className="mt-1 text-[10px] opacity-75">
          * Tạm dừng/Bắt đầu: phím <b>Space</b> hoặc phím <b>P</b>.
        </p>
      </div>
    </div>
  );
}
