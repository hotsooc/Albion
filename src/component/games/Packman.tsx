// PacmanGame.tsx
import React, { useState, useEffect, useCallback } from 'react';

interface PacmanGameProps {
  onGoBack: () => void;
}

// 0: Đường đi/Viên thức ăn, 1: Tường
const INITIAL_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const MAP_HEIGHT = INITIAL_MAP.length;
const MAP_WIDTH = INITIAL_MAP[0].length;
const INITIAL_PACMAN = { x: 1, y: 1 };
const MOVE_SPEED = 250; // Tốc độ di chuyển (ms)

type Coordinate = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Hàm Deep copy bản đồ để không thay đổi state gốc
const copyMap = (map: number[][]) => map.map(row => [...row]);

export default function PacmanGame({ onGoBack }: PacmanGameProps) {
  const [pacmanPos, setPacmanPos] = useState<Coordinate>(INITIAL_PACMAN);
  const [gameMap, setGameMap] = useState<number[][]>(copyMap(INITIAL_MAP));
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);

  // Logic di chuyển Pac-Man
  const movePacman = useCallback(() => {
    setPacmanPos(prevPos => {
      let newX = prevPos.x;
      let newY = prevPos.y;

      switch (direction) {
        case 'UP': newY -= 1; break;
        case 'DOWN': newY += 1; break;
        case 'LEFT': newX -= 1; break;
        case 'RIGHT': newX += 1; break;
      }

      // Kiểm tra va chạm với tường
      if (
        newY >= 0 && newY < MAP_HEIGHT &&
        newX >= 0 && newX < MAP_WIDTH &&
        gameMap[newY][newX] !== 1 // Không phải tường
      ) {
        // Ăn viên thức ăn
        if (gameMap[newY][newX] === 0) {
          setScore(s => s + 1);
          setGameMap(prevMap => {
            const newMap = copyMap(prevMap);
            newMap[newY][newX] = 2; // Đánh dấu đã ăn (giá trị 2)
            return newMap;
          });
        }
        return { x: newX, y: newY };
      }

      // Nếu va chạm, giữ nguyên vị trí
      return prevPos;
    });
  }, [direction, gameMap]);

  // Thiết lập vòng lặp game
  useEffect(() => {
    const gameLoop = setInterval(movePacman, MOVE_SPEED);
    return () => clearInterval(gameLoop);
  }, [movePacman]);

  // Xử lý phím bấm (W A S D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': setDirection('UP'); break;
        case 's': setDirection('DOWN'); break;
        case 'a': setDirection('LEFT'); break;
        case 'd': setDirection('RIGHT'); break;
        default: break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hàm render ô bản đồ
  const renderTile = (type: number, x: number, y: number) => {
    const isPacman = pacmanPos.x === x && pacmanPos.y === y;
    
    let backgroundColor = 'black';
    let content = '';

    if (type === 1) { // Tường
      backgroundColor = '#00008B'; 
    } else if (type === 0) { // Viên thức ăn
      content = '•';
      backgroundColor = 'black';
    } else if (type === 2) { // Đã ăn
        backgroundColor = 'black';
    }

    return (
      <div 
        key={`${x}-${y}`}
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: backgroundColor,
          color: 'white',
          fontSize: '15px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          transition: 'background-color 0.1s'
        }}
      >
        {isPacman ? '🟡' : content}
      </div>
    );
  };
  
  // Hàm reset game
  const handleRestart = () => {
    setPacmanPos(INITIAL_PACMAN);
    setGameMap(copyMap(INITIAL_MAP));
    setDirection('RIGHT');
    setScore(0);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <h1>🟡 Pac-Man - Phiên bản Tối giản 🟡</h1>
      <div style={{ marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>
        Điểm: {score}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MAP_WIDTH}, 30px)`,
          gridTemplateRows: `repeat(${MAP_HEIGHT}, 30px)`,
          border: '5px solid #00008B',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        }}
      >
        {gameMap.flatMap((row, y) => 
          row.map((type, x) => renderTile(type, x, y))
        )}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={onGoBack} style={buttonStyle}>
          &larr; Quay lại Danh sách Game
        </button>
        <button onClick={handleRestart} style={buttonStyle}>
          Chơi Lại
        </button>
      </div>
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        Sử dụng các phím **W A S D** để di chuyển.
      </p>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '5px',
  border: '1px solid #ccc',
  backgroundColor: '#fff',
  transition: 'background-color 0.3s',
};