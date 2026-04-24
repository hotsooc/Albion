'use client';

import PacmanGame from '@/component/games/Packman';
import SnakeGame from '@/component/games/Snake';
import React, { useState } from 'react';
import useTrans from '@/hooks/useTrans';

type GameType = 'list' | 'snake' | 'pacman';

export default function GamePage() {
  const [currentGame, setCurrentGame] = useState<GameType>('list');
  const { trans } = useTrans();

  const renderGame = () => {
    switch (currentGame) {
      case 'snake':
        return <SnakeGame onGoBack={() => setCurrentGame('list')} />;
      case 'pacman':
        return <PacmanGame onGoBack={() => setCurrentGame('list')} />;
      case 'list':
      default:
        return (
          <div style={{ padding: '20px', textAlign: 'center' }} className='h-screen'>
            <h1>{trans.game.gameList}</h1>
            <p>{trans.game.selectGame}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button 
                onClick={() => setCurrentGame('snake')} 
                style={buttonStyle}
              >
                {trans.game.snakeName}
              </button>
              <button 
                onClick={() => setCurrentGame('pacman')} 
                style={buttonStyle}
              >
                {trans.game.pacmanName}
              </button>
            </div>
            <p style={{ marginTop: '30px', color: '#666' }}>
              {trans.game.demoNote}
            </p>
          </div>
        );
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {renderGame()}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '18px',
  cursor: 'pointer',
  borderRadius: '5px',
  border: '1px solid #ccc',
  backgroundColor: '#f0f0f0',
  transition: 'background-color 0.3s',
};
