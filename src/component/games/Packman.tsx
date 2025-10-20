import React, { useState, useEffect, useCallback } from 'react';

interface PacmanGameProps {
  onGoBack: () => void;
}

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
const INITIAL_GHOSTS = [{ x: 5, y: 3, color: 'red' }]; 

const PACMAN_SPEED = 200; 
const GHOST_SPEED = 250;

type Coordinate = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Ghost = Coordinate & { color: string };
type GameStatus = 'PLAYING' | 'WIN' | 'LOSE';

const copyMap = (map: number[][]) => map.map(row => [...row]);

const TOTAL_DOTS = INITIAL_MAP.flat().filter(cell => cell === 0).length;

const getGhostMoveDirection = (
  ghostX: number,
  ghostY: number,
  pacmanX: number,
  pacmanY: number,
  map: number[][]
): Direction => {
  const possibleMoves: { dir: Direction; dx: number; dy: number }[] = [
    { dir: 'UP', dx: 0, dy: -1 },
    { dir: 'DOWN', dx: 0, dy: 1 },
    { dir: 'LEFT', dx: -1, dy: 0 },
    { dir: 'RIGHT', dx: 1, dy: 0 },
  ];

  const validMoves: { dir: Direction; targetX: number; targetY: number; distance: number }[] = [];

  for (const move of possibleMoves) {
    const nextX = ghostX + move.dx;
    const nextY = ghostY + move.dy;

    if (
      nextY >= 0 && nextY < MAP_HEIGHT &&
      nextX >= 0 && nextX < MAP_WIDTH &&
      map[nextY][nextX] !== 1
    ) {
      const distance = Math.abs(pacmanX - nextX) + Math.abs(pacmanY - nextY);
      validMoves.push({ dir: move.dir, targetX: nextX, targetY: nextY, distance });
    }
  }

  if (validMoves.length === 0) {
    return 'UP';
  }

  validMoves.sort((a, b) => a.distance - b.distance);

  const bestMoves = validMoves.filter(
    (move) => move.distance === validMoves[0].distance
  );

  return bestMoves[Math.floor(Math.random() * bestMoves.length)].dir;
};


export default function PacmanGame({ onGoBack }: PacmanGameProps) {
  const [pacmanPos, setPacmanPos] = useState<Coordinate>(INITIAL_PACMAN);
  const [gameMap, setGameMap] = useState<number[][]>(copyMap(INITIAL_MAP));
  const [ghosts, setGhostPos] = useState<Ghost[]>(INITIAL_GHOSTS);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');

  const checkCollision = useCallback((pPos: Coordinate, gPos: Ghost[]) => {
    return gPos.some(g => g.x === pPos.x && g.y === pPos.y);
  }, []);

  const movePacman = useCallback(() => {
    if (gameStatus !== 'PLAYING') return;

    setPacmanPos(prevPos => {
      let newX = prevPos.x;
      let newY = prevPos.y;

      switch (direction) {
        case 'UP': newY -= 1; break;
        case 'DOWN': newY += 1; break;
        case 'LEFT': newX -= 1; break;
        case 'RIGHT': newX += 1; break;
      }

      if (
        newY >= 0 && newY < MAP_HEIGHT &&
        newX >= 0 && newX < MAP_WIDTH &&
        gameMap[newY][newX] !== 1
      ) {
        if (gameMap[newY][newX] === 0) {
          setScore(s => s + 0.5); 
          setGameMap(prevMap => {
            const newMap = copyMap(prevMap);
            newMap[newY][newX] = 2; 
            return newMap;
          });
        }
        
        const nextPos = { x: newX, y: newY };

        if (checkCollision(nextPos, ghosts)) {
          setGameStatus('LOSE');
        }

        return nextPos;
      }

      return prevPos;
    });
  }, [direction, gameMap, gameStatus, ghosts, checkCollision]);


  const moveGhosts = useCallback(() => {
    if (gameStatus !== 'PLAYING') return;

    setGhostPos(prevGhosts => {
      const newGhosts = prevGhosts.map(ghost => {
        const dir = getGhostMoveDirection(
          ghost.x, ghost.y, 
          pacmanPos.x, pacmanPos.y, 
          gameMap
        );

        let newX = ghost.x;
        let newY = ghost.y;

        if (dir === 'UP') newY -= 1;
        else if (dir === 'DOWN') newY += 1;
        else if (dir === 'LEFT') newX -= 1;
        else if (dir === 'RIGHT') newX += 1;
        
        return { ...ghost, x: newX, y: newY };
      });

      if (checkCollision(pacmanPos, newGhosts)) {
         setGameStatus('LOSE');
      }

      return newGhosts;
    });
  }, [gameStatus, pacmanPos, gameMap, checkCollision]);

  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;

    const pacmanLoop = setInterval(movePacman, PACMAN_SPEED);
    const ghostLoop = setInterval(moveGhosts, GHOST_SPEED);

    return () => {
      clearInterval(pacmanLoop);
      clearInterval(ghostLoop);
    };
  }, [movePacman, moveGhosts, gameStatus]);


  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      if (score === TOTAL_DOTS) { 
        setGameStatus('WIN');
        return; 
      }
      
      if (checkCollision(pacmanPos, ghosts)) {
        setGameStatus('LOSE');
      }
    }
  }, [score, gameStatus, pacmanPos, ghosts, checkCollision]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'PLAYING') return;
      
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
  }, [gameStatus]);

  const renderTile = (type: number, x: number, y: number) => {
    const isPacman = pacmanPos.x === x && pacmanPos.y === y;
    const isGhost = ghosts.find(g => g.x === x && g.y === y);
    
    let backgroundColor = 'black';
    let content = '';
    let contentStyle: React.CSSProperties = {
        fontSize: '15px',
        color: 'white'
    };


    if (type === 1) { 
      backgroundColor = '#00008B'; 
    } else if (type === 0) { 
      content = '•';
      backgroundColor = 'black';
    } else if (type === 2) { 
        backgroundColor = 'black';
    }
    
    if (isGhost) {
        content = '👻';
        contentStyle = { fontSize: '20px' };
    }
    
    if (isPacman) {
        content = '🟡';
        contentStyle = { fontSize: '25px', transform: getPacmanRotation(direction) };
    }

    return (
      <div 
        key={`${x}-${y}`}
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: backgroundColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          transition: 'background-color 0.1s'
        }}
      >
        <span style={contentStyle}>{content}</span>
      </div>
    );
  };
  
  const getPacmanRotation = (dir: Direction): string => {
    switch (dir) {
      case 'UP': return 'rotate(-90deg)';
      case 'DOWN': return 'rotate(90deg)';
      case 'LEFT': return 'scaleX(-1)';
      case 'RIGHT': return 'none';
      default: return 'none';
    }
  };

  const handleRestart = () => {
    setPacmanPos(INITIAL_PACMAN);
    setGameMap(copyMap(INITIAL_MAP));
    setGhostPos(INITIAL_GHOSTS);
    setDirection('RIGHT');
    setScore(0);
    setGameStatus('PLAYING');
  };

  const renderGameMessage = () => {
    if (gameStatus === 'LOSE') {
      return (
        <div style={messageStyle('red')}>
          GAME OVER! 💀
          <button onClick={handleRestart} style={buttonStyle}>
            Chơi Lại
          </button>
        </div>
      );
    }
    if (gameStatus === 'WIN') {
      return (
        <div style={messageStyle('green')}>
          BẠN THẮNG! 🎉
          <p>Điểm tối đa: {score}</p>
          <button onClick={handleRestart} style={buttonStyle}>
            Chơi Lại (Level 2?)
          </button>
        </div>
      );
    }
    return null;
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>🟡 Pac-Man - Có Ma! (Thông Minh Hơn) 👻</h1>
      <div style={{ marginBottom: '10px', fontSize: '22px', fontWeight: 'bold' }}>
        Điểm: <span style={{ color: '#FFC107' }}>{score}</span> / {TOTAL_DOTS}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${MAP_WIDTH}, 30px)`,
          gridTemplateRows: `repeat(${MAP_HEIGHT}, 30px)`,
          border: '5px solid #00008B',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          position: 'relative', 
        }}
      >
        {gameMap.flatMap((row, y) => 
          row.map((type, x) => renderTile(type, x, y))
        )}
        {renderGameMessage()}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={onGoBack} style={buttonStyle}>
          &larr; Quay lại Danh sách Game
        </button>
        {gameStatus === 'PLAYING' && (
            <button onClick={handleRestart} style={buttonStyle}>
              Khởi động lại
            </button>
        )}
      </div>
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        Sử dụng các phím **W A S D** để di chuyển. Tốc độ Ma là **{GHOST_SPEED}ms**.
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
  color: '#333'
};

const messageStyle = (color: string): React.CSSProperties => ({
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: `rgba(0, 0, 0, 0.9)`,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '40px',
    fontWeight: 'bold',
    borderRadius: '5px',
    border: `5px solid ${color}`,
    zIndex: 10,
});