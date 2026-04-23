import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20; // Tăng kích thước lưới
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const SPEED = 150; // Tốc độ (miligiây) - có thể điều chỉnh

type Coordinate = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SnakeGameProps {
  onGoBack: () => void;
}

import useTrans from '@/hooks/useTrans';

export default function SnakeGame({ onGoBack }: SnakeGameProps) {
  const { trans } = useTrans();
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('UP');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const createFood = (currentSnake: Coordinate[]): Coordinate => {
    let newFood: Coordinate;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    setSnake(prevSnake => {
      const newHead = { ...prevSnake[0] };

      switch (direction) {
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

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      if (prevSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(createFood(newSnake)); 
        setScore(s => s + 10);
        return newSnake; // Giữ nguyên đuôi (rắn dài ra)
      } else {
        newSnake.pop(); // Bỏ đuôi cũ (rắn di chuyển)
        return newSnake;
      }
    });
  }, [direction, isGameOver, food]);

  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(moveSnake, SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      const key = e.key.toLowerCase();
      let newDirection: Direction | null = null;

      switch (key) {
        case 'w': // LÊN
          if (direction !== 'DOWN') newDirection = 'UP';
          break;
        case 's': // XUỐNG
          if (direction !== 'UP') newDirection = 'DOWN';
          break;
        case 'a': // TRÁI
          if (direction !== 'RIGHT') newDirection = 'LEFT';
          break;
        case 'd': // PHẢI
          if (direction !== 'LEFT') newDirection = 'RIGHT';
          break;
        default:
          break;
      }
      
      if (newDirection) {
          setDirection(newDirection);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]); 
  
  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('UP'); // Khởi động lại với hướng mặc định
    setIsGameOver(false);
    setScore(0);
  };

  const renderCell = (x: number, y: number) => {
    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;
    const isHead = snake[0].x === x && snake[0].y === y;

    const cellStyle: React.CSSProperties = {
        width: '20px',
        height: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        backgroundColor: '#1a1a1a', // Nền tối
        border: '1px solid #0a0a0a',
    };

    let contentStyle: React.CSSProperties = {
        width: '18px',
        height: '18px',
        borderRadius: '2px', // Hình vuông có bo góc nhẹ
        transition: 'all 0.1s', // Thêm hiệu ứng chuyển động
    };

    if (isSnake) {
        contentStyle = {
            ...contentStyle,
            backgroundColor: isHead ? '#4CAF50' : '#8BC34A', // Màu đầu và thân
            borderRadius: isHead ? '50%' : '5px', // Đầu tròn, thân bo góc
            boxShadow: isHead ? '0 0 5px #4CAF50' : 'none',
        };
    } else if (isFood) {
        contentStyle = {
            ...contentStyle,
            backgroundColor: '#FFEB3B', // Màu thức ăn vàng
            borderRadius: '50%', // Thức ăn tròn
            transform: 'scale(0.7)',
            boxShadow: '0 0 5px #FFEB3B',
            border: '2px solid #FFC107'
        };
    }

    return (
        <div 
            key={`${x}-${y}`}
            style={cellStyle}
        >
            {isSnake || isFood ? <div style={contentStyle} /> : null}
        </div>
    );
  };

  const renderGrid = () => {
    const grid: React.ReactElement[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        grid.push(renderCell(x, y));
      }
    }
    return grid;
  };

  return (
    <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        minHeight: '100vh' 
    }}>
      <h1>{trans.game.snakeTitle}</h1>
      <div style={{ marginBottom: '15px', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
        {trans.game.score}: <span style={{ color: '#4CAF50' }}>{score}</span>
      </div>
      
      <div
        tabIndex={0} 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
          border: '8px solid #333',
          borderRadius: '5px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
          position: 'relative',
        }}
      >
        {renderGrid()}
        
        {isGameOver && (
          <div 
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(255, 0, 0, 0.8)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '40px',
              fontWeight: 'bold',
              borderRadius: '5px',
              textAlign: 'center'
            }}
          >
            GAME OVER!
            <div style={{ fontSize: '20px', marginTop: '10px' }}>
                {trans.game.finalScore}: {score}
            </div>
            <button 
              onClick={handleRestart} 
              style={{ ...buttonStyle, marginTop: '20px', backgroundColor: '#FFC107', color: '#333' }}
            >
              {trans.game.playAgain}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
        <button onClick={onGoBack} style={buttonStyle}>
          {trans.game.backToGames}
        </button>
        {!isGameOver && (
            <button onClick={handleRestart} style={buttonStyle}>
                {trans.game.restart}
            </button>
        )}
      </div>
      <p style={{ marginTop: '15px', fontSize: '16px', color: '#666' }}>
        {trans.game.snakeInstructions}
      </p>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '12px 20px',
  fontSize: '18px',
  cursor: 'pointer',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#333',
  color: 'white',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  transition: 'background-color 0.3s, transform 0.1s',
};
