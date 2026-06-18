'use client';

import PacmanGame from '@/component/games/Packman';
import SnakeGame from '@/component/games/Snake';
import { useState } from 'react';
import useTrans from '@/hooks/useTrans';

type GameType = 'list' | 'snake' | 'pacman';

export default function GamePage() {
  const [currentGame, setCurrentGame] = useState<GameType>('list');
  const { trans } = useTrans();

  const renderGame = () => {
    switch (currentGame) {
      case 'snake': return <SnakeGame onGoBack={() => setCurrentGame('list')} />;
      case 'pacman': return <PacmanGame onGoBack={() => setCurrentGame('list')} />;
      case 'list':
      default:
        return (
          <div className="p-8 min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--text-primary)] theme-transition">
            <h1 className="text-3xl font-extrabold sora-font mb-4">{trans.game.gameList}</h1>
            <p className="text-[var(--text-secondary)] mb-8">{trans.game.selectGame}</p>
            <div className="flex gap-6">
              <button
                onClick={() => setCurrentGame('snake')}
                className="px-8 py-4 text-lg font-bold rounded-2xl border-2 border-[var(--border-color)] bg-[var(--color-accent)] text-[var(--text-btn-upload)] cursor-pointer transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.25)] will-change-transform backface-visibility-hidden"
              >
                {trans.game.snakeName}
              </button>
              <button
                onClick={() => setCurrentGame('pacman')}
                className="px-8 py-4 text-lg font-bold rounded-2xl border-2 border-[var(--border-color)] bg-[var(--color-accent)] text-[var(--text-btn-upload)] cursor-pointer transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.25)] will-change-transform backface-visibility-hidden"
              >
                {trans.game.pacmanName}
              </button>
            </div>
            <p className="mt-10 text-[var(--text-secondary)] text-sm">{trans.game.demoNote}</p>
          </div>
        );
    }
  };

  return renderGame();
}
