'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import useTrans from '@/hooks/useTrans';
import { ArrowLeft, RotateCcw, Cpu, Users, Eye } from 'lucide-react';
export interface Coordinate {
  x: number;
  y: number;
}

export type Player = 'red' | 'black';
export type PieceType = 'R' | 'G' | 'A' | 'E' | 'H' | 'C' | 'S';
// R: Chariot (Xe), G: General (Tướng), A: Advisor (Sĩ), E: Elephant (Tượng), H: Horse (Mã), C: Cannon (Pháo), S: Soldier (Tốt)

export interface Piece {
  type: PieceType;
  player: Player;
}

export type Board = (Piece | null)[][];

interface ChineseChessProps {
  onGoBack: () => void;
}

interface Move {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

const PIECE_LABELS: Record<Player, Record<PieceType, string>> = {
  red: {
    G: '帥',
    A: '仕',
    E: '相',
    H: '傌',
    R: '俥',
    C: '炮',
    S: '兵'
  },
  black: {
    G: '將',
    A: '士',
    E: '象',
    H: '馬',
    R: '車',
    C: '砲',
    S: '卒'
  }
};

const PIECE_NAMES_VI: Record<PieceType, string> = {
  G: 'Tướng',
  A: 'Sĩ',
  E: 'Tượng',
  H: 'Mã',
  R: 'Xe',
  C: 'Pháo',
  S: 'Tốt'
};

const PIECE_VALUES: Record<PieceType, number> = {
  G: 100000,
  R: 900,
  C: 450,
  H: 400,
  E: 200,
  A: 200,
  S: 100
};

const charToCol = (char: string): number => char.charCodeAt(0) - 97;

const iccsToMove = (iccs: string): Move => {
  return {
    fromX: charToCol(iccs[0]),
    fromY: 9 - parseInt(iccs[1], 10),
    toX: charToCol(iccs[2]),
    toY: 9 - parseInt(iccs[3], 10)
  };
};

const getBoardFen = (board: Board, activePlayer: Player): string => {
  const toUciPiece = (type: PieceType): string => {
    const map: Record<PieceType, string> = {
      G: 'K', // General -> King
      A: 'A', // Advisor
      E: 'B', // Elephant -> Bishop
      H: 'N', // Horse -> kNight
      R: 'R', // Rook
      C: 'C', // Cannon
      S: 'P'  // Soldier -> Pawn
    };
    return map[type] || type;
  };

  const rows: string[] = [];
  for (let y = 0; y < 10; y++) {
    let emptyCount = 0;
    let rowStr = '';
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece === null) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rowStr += emptyCount;
          emptyCount = 0;
        }
        const char = toUciPiece(piece.type);
        rowStr += piece.player === 'red' ? char : char.toLowerCase();
      }
    }
    if (emptyCount > 0) {
      rowStr += emptyCount;
    }
    rows.push(rowStr);
  }
  
  const fenPieces = rows.join('/');
  const activeColor = activePlayer === 'red' ? 'w' : 'b';
  
  return `${fenPieces} ${activeColor}`;
};

const fetchCloudBestMove = (fen: string): Promise<Move | null> => {
  return fetch(`/api/chessdb?board=${encodeURIComponent(fen)}`).then(res => {
    if (!res.ok) return null;
    return res.json().then(data => {
      const result: string = data.result || '';
      
      if (result.startsWith('move:')) {
        const iccsMove = result.substring(5).trim();
        if (iccsMove.length === 4) {
          return iccsToMove(iccsMove);
        }
      } else if (result.startsWith('egtb:')) {
        const iccsMove = result.substring(5).trim();
        if (iccsMove.length === 4) {
          return iccsToMove(iccsMove);
        }
      }
      return null;
    });
  });
};

// Initial board positions
const getInitialBoard = (): Board => {
  const b: Board = Array(10).fill(null).map(() => Array(9).fill(null));

  // Black pieces (top)
  b[0][0] = { type: 'R', player: 'black' };
  b[0][1] = { type: 'H', player: 'black' };
  b[0][2] = { type: 'E', player: 'black' };
  b[0][3] = { type: 'A', player: 'black' };
  b[0][4] = { type: 'G', player: 'black' };
  b[0][5] = { type: 'A', player: 'black' };
  b[0][6] = { type: 'E', player: 'black' };
  b[0][7] = { type: 'H', player: 'black' };
  b[0][8] = { type: 'R', player: 'black' };
  b[2][1] = { type: 'C', player: 'black' };
  b[2][7] = { type: 'C', player: 'black' };
  b[3][0] = { type: 'S', player: 'black' };
  b[3][2] = { type: 'S', player: 'black' };
  b[3][4] = { type: 'S', player: 'black' };
  b[3][6] = { type: 'S', player: 'black' };
  b[3][8] = { type: 'S', player: 'black' };

  // Red pieces (bottom)
  b[9][0] = { type: 'R', player: 'red' };
  b[9][1] = { type: 'H', player: 'red' };
  b[9][2] = { type: 'E', player: 'red' };
  b[9][3] = { type: 'A', player: 'red' };
  b[9][4] = { type: 'G', player: 'red' };
  b[9][5] = { type: 'A', player: 'red' };
  b[9][6] = { type: 'E', player: 'red' };
  b[9][7] = { type: 'H', player: 'red' };
  b[9][8] = { type: 'R', player: 'red' };
  b[7][1] = { type: 'C', player: 'red' };
  b[7][7] = { type: 'C', player: 'red' };
  b[6][0] = { type: 'S', player: 'red' };
  b[6][2] = { type: 'S', player: 'red' };
  b[6][4] = { type: 'S', player: 'red' };
  b[6][6] = { type: 'S', player: 'red' };
  b[6][8] = { type: 'S', player: 'red' };

  return b;
};

// Helper function to count pieces between two coordinates
const countPiecesBetween = (board: Board, fromX: number, fromY: number, toX: number, toY: number): number => {
  let count = 0;
  if (fromX === toX) {
    const startY = Math.min(fromY, toY);
    const endY = Math.max(fromY, toY);
    for (let y = startY + 1; y < endY; y++) {
      if (board[y][fromX] !== null) count++;
    }
  } else if (fromY === toY) {
    const startX = Math.min(fromX, toX);
    const endX = Math.max(fromX, toX);
    for (let x = startX + 1; x < endX; x++) {
      if (board[fromY][x] !== null) count++;
    }
  }
  return count;
};

const isPathClear = (board: Board, fromX: number, fromY: number, toX: number, toY: number): boolean => {
  return countPiecesBetween(board, fromX, fromY, toX, toY) === 0;
};

// Validate individual piece movement rules
const isValidMove = (board: Board, fromX: number, fromY: number, toX: number, toY: number): boolean => {
  if (toX < 0 || toX > 8 || toY < 0 || toY > 9) return false;
  if (fromX === toX && fromY === toY) return false;

  const piece = board[fromY][fromX];
  if (!piece) return false;

  const destPiece = board[toY][toX];
  if (destPiece && destPiece.player === piece.player) return false;

  const dx = toX - fromX;
  const dy = toY - fromY;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  switch (piece.type) {
    case 'G': // General (Tướng)
      if (absDx + absDy !== 1) return false;
      if (toX < 3 || toX > 5) return false; // Must be in Palace
      if (piece.player === 'black') {
        if (toY < 0 || toY > 2) return false;
      } else {
        if (toY < 7 || toY > 9) return false;
      }
      break;

    case 'A': // Advisor (Sĩ)
      if (absDx !== 1 || absDy !== 1) return false; // Diagonal 1 square
      if (toX < 3 || toX > 5) return false; // Must be in Palace
      if (piece.player === 'black') {
        if (toY < 0 || toY > 2) return false;
      } else {
        if (toY < 7 || toY > 9) return false;
      }
      break;

    case 'E': // Elephant (Tượng)
      if (absDx !== 2 || absDy !== 2) return false; // Diagonal 2 squares
      // Cannot cross river
      if (piece.player === 'black' && toY > 4) return false;
      if (piece.player === 'red' && toY < 5) return false;
      // Block check (cản tượng)
      if (board[fromY + dy / 2][fromX + dx / 2] !== null) return false;
      break;

    case 'H': // Horse (Mã)
      if (!((absDx === 1 && absDy === 2) || (absDx === 2 && absDy === 1))) return false;
      // Block check (cản mã)
      if (absDy === 2) {
        if (board[fromY + dy / 2][fromX] !== null) return false;
      } else {
        if (board[fromY][fromX + dx / 2] !== null) return false;
      }
      break;

    case 'R': // Chariot (Xe)
      if (dx !== 0 && dy !== 0) return false;
      if (!isPathClear(board, fromX, fromY, toX, toY)) return false;
      break;

    case 'C': // Cannon (Pháo)
      if (dx !== 0 && dy !== 0) return false;
      const obstacles = countPiecesBetween(board, fromX, fromY, toX, toY);
      if (destPiece) {
        if (obstacles !== 1) return false; // Capturing needs exactly 1 obstacle
      } else {
        if (obstacles !== 0) return false; // Empty move needs clear path
      }
      break;

    case 'S': // Soldier (Tốt)
      if (piece.player === 'black') {
        if (dy < 0) return false; // Cannot move backward
        if (fromY <= 4) {
          if (dy !== 1 || dx !== 0) return false; // Before river: only forward 1 square
        } else {
          if (!((dy === 1 && dx === 0) || (dy === 0 && absDx === 1))) return false; // After river: forward or horizontal 1
        }
      } else {
        if (dy > 0) return false; // Cannot move backward
        if (fromY >= 5) {
          if (dy !== -1 || dx !== 0) return false; // Before river: only forward 1 square
        } else {
          if (!((dy === -1 && dx === 0) || (dy === 0 && absDx === 1))) return false; // After river: forward or horizontal 1
        }
      }
      break;
  }

  return true;
};

const findGeneral = (board: Board, player: Player): Coordinate => {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.type === 'G' && piece.player === player) {
        return { x, y };
      }
    }
  }
  return { x: 4, y: player === 'black' ? 0 : 9 };
};

const isGeneralFacingEachOther = (board: Board): boolean => {
  const redG = findGeneral(board, 'red');
  const blackG = findGeneral(board, 'black');
  if (redG.x === blackG.x) {
    return isPathClear(board, redG.x, redG.y, blackG.x, blackG.y);
  }
  return false;
};

const isUnderCheck = (board: Board, player: Player): boolean => {
  const general = findGeneral(board, player);
  const opponent = player === 'red' ? 'black' : 'red';

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.player === opponent) {
        if (isValidMove(board, x, y, general.x, general.y)) {
          return true;
        }
      }
    }
  }
  return false;
};

// Check if move is fully legal (no check/self check)
const isMoveLegal = (board: Board, fromX: number, fromY: number, toX: number, toY: number): boolean => {
  if (!isValidMove(board, fromX, fromY, toX, toY)) return false;

  const piece = board[fromY][fromX];
  const destPiece = board[toY][toX];

  // Simulate
  board[toY][toX] = piece;
  board[fromY][fromX] = null;

  const opponentFacing = isGeneralFacingEachOther(board);
  const playerChecked = isUnderCheck(board, piece!.player);

  // Undo
  board[fromY][fromX] = piece;
  board[toY][toX] = destPiece;

  return !opponentFacing && !playerChecked;
};

const getLegalMoves = (board: Board, player: Player): Move[] => {
  const moves: Move[] = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece && piece.player === player) {
        for (let targetY = 0; targetY < 10; targetY++) {
          for (let targetX = 0; targetX < 9; targetX++) {
            if (isMoveLegal(board, x, y, targetX, targetY)) {
              moves.push({ fromX: x, fromY: y, toX: targetX, toY: targetY });
            }
          }
        }
      }
    }
  }
  return moves;
};

// AI valuation function
// Piece-Square Tables for RED player (y: 9 is bottom/own side, y: 0 is top/enemy side)
// For BLACK player, we will flip the y coordinate (y_black = 9 - y_red) and negate the score.

const PST_KING = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, -10, -20, -10, 0, 0, 0],
  [0, 0, 0, 0, -10, 0, 0, 0, 0],
  [0, 0, 0, 5, 10, 5, 0, 0, 0]
];

const PST_ADVISOR = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 10, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const PST_ELEPHANT = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 5, 0, 0, 0, 5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 15, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const PST_CHARIOT = [
  [10, 15, 10, 20, 10, 20, 10, 15, 10],
  [15, 20, 15, 25, 20, 25, 15, 20, 15],
  [10, 15, 10, 20, 15, 20, 10, 15, 10],
  [10, 15, 12, 20, 18, 20, 12, 15, 10],
  [8,  12,  8, 15, 12, 15,  8, 12,  8],
  [6,  10,  6, 12, 10, 12,  6, 10,  6],
  [2,   6,  2,  8,  6,  8,  2,  6,  2],
  [0,   2,  0,  5,  2,  5,  0,  2,  0],
  [2,   6,  2,  8,  6,  8,  2,  6,  2],
  [5,  10,  8, 12, 10, 12,  8, 10,  5]
];

const PST_HORSE = [
  [2,  4,  6, 10,  6, 10,  6,  4,  2],
  [4,  8, 12, 16, 12, 16, 12,  8,  4],
  [6, 12, 18, 22, 20, 22, 18, 12,  6],
  [8, 14, 20, 25, 22, 25, 20, 14,  8],
  [6, 12, 16, 20, 18, 20, 16, 12,  6],
  [4, 10, 14, 18, 16, 18, 14, 10,  4],
  [2,  6, 10, 12, 10, 12, 10,  6,  2],
  [0,  4,  6,  8,  6,  8,  6,  4,  0],
  [-2, 2,  4,  6,  4,  6,  4,  2, -2],
  [-4, 0,  2,  4,  2,  4,  2,  0, -4]
];

const PST_CANNON = [
  [4,  6,  4,  8, 10,  8,  4,  6,  4],
  [6,  8,  6, 12, 15, 12,  6,  8,  6],
  [4,  6,  4,  8, 10,  8,  4,  6,  4],
  [2,  4,  2,  6,  8,  6,  2,  4,  2],
  [0,  2,  0,  4,  6,  4,  0,  2,  0],
  [-2, 0, -2,  2,  4,  2, -2,  0, -2],
  [-2, 0, -2,  2,  4,  2, -2,  0, -2],
  [0,  4,  2,  6,  6,  6,  2,  4,  0],
  [2,  6,  4,  8,  8,  8,  4,  6,  2],
  [0,  2,  0,  4,  4,  4,  0,  2,  0]
];

const PST_SOLDIER = [
  [15, 25, 35, 40, 40, 40, 35, 25, 15],
  [20, 30, 40, 50, 50, 50, 40, 30, 20],
  [18, 28, 38, 45, 45, 45, 38, 28, 18],
  [10, 18, 22, 35, 35, 35, 22, 18, 10],
  [5,  10, 15, 25, 25, 25, 15, 10,  5],
  [0,   0,  0,  0,  0,  0,  0,   0,  0],
  [0,   0,  0,  0,  0,  0,  0,   0,  0],
  [0,   0,  0,  0,  0,  0,  0,   0,  0],
  [0,   0,  0,  0,  0,  0,  0,   0,  0],
  [0,   0,  0,  0,  0,  0,  0,   0,  0]
];

const getPstScore = (type: PieceType, player: Player, x: number, y: number): number => {
  let table: number[][] | null = null;
  switch (type) {
    case 'G': table = PST_KING; break;
    case 'A': table = PST_ADVISOR; break;
    case 'E': table = PST_ELEPHANT; break;
    case 'R': table = PST_CHARIOT; break;
    case 'H': table = PST_HORSE; break;
    case 'C': table = PST_CANNON; break;
    case 'S': table = PST_SOLDIER; break;
  }
  if (!table) return 0;
  
  const targetY = player === 'red' ? y : 9 - y;
  return table[targetY][x];
};

const evaluatePosition = (board: Board): number => {
  let score = 0;
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const piece = board[y][x];
      if (piece) {
        let value = PIECE_VALUES[piece.type];
        value += getPstScore(piece.type, piece.player, x, y);

        if (piece.player === 'red') {
          score += value;
        } else {
          score -= value;
        }
      }
    }
  }
  return score;
};

// Hàm chấm điểm nước đi phục vụ sắp xếp nước đi trước để Alpha-Beta Pruning đạt hiệu suất cắt tỉa cao nhất (MVV-LVA)
const scoreMove = (board: Board, move: Move, player: Player): number => {
  let score = 0;
  const attacker = board[move.fromY][move.fromX];
  const victim = board[move.toY][move.toX];
  
  if (!attacker) return 0;
  
  // 1. MVV-LVA (Most Valuable Victim - Least Valuable Attacker)
  if (victim) {
    score += PIECE_VALUES[victim.type] * 10 - PIECE_VALUES[attacker.type];
    score += 10000; // Cộng điểm thưởng cho nước đi ăn quân
  }
  
  // 2. Chênh lệch điểm thưởng vị trí (PST) trước và sau khi đi
  const oldPst = getPstScore(attacker.type, player, move.fromX, move.fromY);
  const newPst = getPstScore(attacker.type, player, move.toX, move.toY);
  score += (newPst - oldPst);
  
  // 3. Tấn công / Đẩy Tốt qua sông
  if (attacker.type === 'S') {
    const crossedRiver = player === 'red' ? (move.toY <= 4 && move.fromY > 4) : (move.toY >= 5 && move.fromY < 5);
    if (crossedRiver) {
      score += 500;
    }
  }
  
  return score;
};

const minimax = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number => {
  if (depth === 0) {
    return evaluatePosition(board);
  }

  const currentPlayer = isMaximizing ? 'red' : 'black';
  const moves = getLegalMoves(board, currentPlayer);

  if (moves.length === 0) {
    if (isUnderCheck(board, currentPlayer)) {
      return isMaximizing ? -200000 + (3 - depth) : 200000 - (3 - depth); // Checkmate
    }
    return 0; // Stalemate
  }

  // Sắp xếp các nước đi tối ưu trước theo điểm số để kích hoạt việc cắt tỉa nhanh nhất
  const moveScores = new Map<Move, number>();
  for (const m of moves) {
    moveScores.set(m, scoreMove(board, m, currentPlayer));
  }
  moves.sort((a, b) => (moveScores.get(b) || 0) - (moveScores.get(a) || 0));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const piece = board[move.fromY][move.fromX];
      const dest = board[move.toY][move.toX];

      board[move.toY][move.toX] = piece;
      board[move.fromY][move.fromX] = null;

      const evaluation = minimax(board, depth - 1, alpha, beta, false);

      board[move.fromY][move.fromX] = piece;
      board[move.toY][move.toX] = dest;

      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const piece = board[move.fromY][move.fromX];
      const dest = board[move.toY][move.toX];

      board[move.toY][move.toX] = piece;
      board[move.fromY][move.fromX] = null;

      const evaluation = minimax(board, depth - 1, alpha, beta, true);

      board[move.fromY][move.fromX] = piece;
      board[move.toY][move.toX] = dest;

      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

const getBestMove = (board: Board, player: Player, depth: number): Move | null => {
  const moves = getLegalMoves(board, player);
  if (moves.length === 0) return null;

  let bestMove: Move | null = null;
  const isMaximizing = player === 'red';

  // Sắp xếp nước đi theo điểm số tối ưu trước
  const moveScores = new Map<Move, number>();
  for (const m of moves) {
    moveScores.set(m, scoreMove(board, m, player));
  }
  moves.sort((a, b) => (moveScores.get(b) || 0) - (moveScores.get(a) || 0));

  if (isMaximizing) {
    let bestValue = -Infinity;
    for (const move of moves) {
      const piece = board[move.fromY][move.fromX];
      const dest = board[move.toY][move.toX];

      board[move.toY][move.toX] = piece;
      board[move.fromY][move.fromX] = null;

      const boardValue = minimax(board, depth - 1, -Infinity, Infinity, false);

      board[move.fromY][move.fromX] = piece;
      board[move.toY][move.toX] = dest;

      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }
  } else {
    let bestValue = Infinity;
    for (const move of moves) {
      const piece = board[move.fromY][move.fromX];
      const dest = board[move.toY][move.toX];

      board[move.toY][move.toX] = piece;
      board[move.fromY][move.fromX] = null;

      const boardValue = minimax(board, depth - 1, -Infinity, Infinity, true);

      board[move.fromY][move.fromX] = piece;
      board[move.toY][move.toX] = dest;

      if (boardValue < bestValue) {
        bestValue = boardValue;
        bestMove = move;
      }
    }
  }

  return bestMove;
};

export default function ChineseChess({ onGoBack }: ChineseChessProps) {
  const { trans } = useTrans();
  const [board, setBoard] = useState<Board>(getInitialBoard());
  const [selectedPiece, setSelectedPiece] = useState<Coordinate | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red'); // Red moves first
  const [gameMode, setGameMode] = useState<'ai' | 'pvp'>('pvp');
  const [playerColor, setPlayerColor] = useState<Player>('red'); // Player's side in vs AI mode
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const isAiThinkingRef = useRef(false);
  const [aiDifficulty, setAiDifficulty] = useState<number>(3); // Mặc định Cấp 3 (Trung cấp)
  const [hintMove, setHintMove] = useState<Move | null>(null);
  const [isFetchingHint, setIsFetchingHint] = useState(false);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [timeLimit, setTimeLimit] = useState<number>(0); // 0 = Không giới hạn
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const resetGame = useCallback(() => {
    setBoard(getInitialBoard());
    setSelectedPiece(null);
    setCurrentPlayer('red');
    setIsGameOver(false);
    setWinner(null);
    setMoveHistory([]);
    setIsAiThinking(false);
    isAiThinkingRef.current = false;
    setHintMove(null);
    setLastMove(null);
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  // Compute valid moves for currently selected piece
  const validMovesForSelected = useMemo(() => {
    if (!selectedPiece) return [];
    const moves: Coordinate[] = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        if (isMoveLegal(board, selectedPiece.x, selectedPiece.y, x, y)) {
          moves.push({ x, y });
        }
      }
    }
    return moves;
  }, [selectedPiece, board]);

  // Execute a piece move
  const executeMove = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    const piece = board[fromY][fromX];
    if (!piece) return;

    const destPiece = board[toY][toX];
    const logMessage = `${PIECE_NAMES_VI[piece.type]} (${piece.player === 'red' ? 'Đỏ' : 'Đen'}): (${fromX},${9 - fromY}) → (${toX},${9 - toY})${destPiece ? ` ăn ${PIECE_NAMES_VI[destPiece.type]}` : ''}`;

    const nextBoard = board.map(row => [...row]);
    nextBoard[toY][toX] = piece;
    nextBoard[fromY][fromX] = null;

    setBoard(nextBoard);
    setSelectedPiece(null);
    setHintMove(null); // Xóa gợi ý cũ khi đi quân mới
    setLastMove({ fromX, fromY, toX, toY }); // Lưu lại nước đi gần nhất để highlight
    setTimeLeft(timeLimit); // Reset lại thời gian cho lượt mới
    setMoveHistory(prev => [logMessage, ...prev].slice(0, 15));

    const nextPlayer = currentPlayer === 'red' ? 'black' : 'red';

    // Check if next player has any legal moves (Checkmate / Stalemate)
    const opponentMoves = getLegalMoves(nextBoard, nextPlayer);
    if (opponentMoves.length === 0) {
      setIsGameOver(true);
      setWinner(currentPlayer);
    } else {
      setCurrentPlayer(nextPlayer);
    }
  }, [board, currentPlayer, timeLimit]);

  // AI execution tick
  useEffect(() => {
    if (isGameOver || gameMode !== 'ai' || currentPlayer === playerColor || isAiThinkingRef.current) return;

    isAiThinkingRef.current = true;
    setIsAiThinking(true);
    
    let executeTimer: NodeJS.Timeout;
    
    const aiTimer = setTimeout(() => {
      const fen = getBoardFen(board, currentPlayer);
      // 1. Thử lấy nước đi tốt nhất từ Thư viện Đám mây (ChessDB Book) trước
      fetchCloudBestMove(fen).then(cloudMove => {
        let bestMove: Move | null = cloudMove;

        // 2. Nếu không tìm thấy trong thư viện đám mây, sử dụng Minimax nội bộ với độ sâu tương ứng
        if (!bestMove) {
          bestMove = getBestMove(board, currentPlayer, aiDifficulty);
        }

        if (bestMove) {
          // HÀNH TRÌNH CHẬM LẠI:
          // Bước 1: Chỉ chọn quân cờ đó để thắp sáng ô nước đi
          setSelectedPiece({ x: bestMove.fromX, y: bestMove.fromY });
          
          // Bước 2: Chờ 1 giây để người chơi nhìn rõ AI chọn quân nào, sau đó mới đi
          executeTimer = setTimeout(() => {
            if (bestMove) {
              executeMove(bestMove.fromX, bestMove.fromY, bestMove.toX, bestMove.toY);
            }
            isAiThinkingRef.current = false;
            setIsAiThinking(false);
          }, 1000);
        } else {
          // AI has no moves, player wins
          setIsGameOver(true);
          setWinner(playerColor);
          isAiThinkingRef.current = false;
          setIsAiThinking(false);
        }
      });
    }, 600); // Khoảng chờ ngắn ban đầu

    return () => {
      clearTimeout(aiTimer);
      if (executeTimer) clearTimeout(executeTimer);
    };
  }, [board, currentPlayer, gameMode, playerColor, isGameOver, aiDifficulty, executeMove]);

  // Bộ đếm ngược thời gian mỗi nước đi
  useEffect(() => {
    if (isGameOver || timeLimit === 0 || isAiThinking || (gameMode === 'ai' && currentPlayer !== playerColor)) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameOver(true);
          setWinner(currentPlayer === 'red' ? 'black' : 'red');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, isGameOver, timeLimit, isAiThinking, gameMode, playerColor]);

  // Hàm chuyển đổi định dạng giây thành mm:ss
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Hàm lấy nước đi gợi ý từ cơ sở dữ liệu hoặc AI
  const getHint = () => {
    if (isGameOver || isAiThinking || isFetchingHint) return;

    setIsFetchingHint(true);
    const fen = getBoardFen(board, currentPlayer);
    fetchCloudBestMove(fen).then(move => {
      if (move) {
        setHintMove(move);
        // Tự động tắt gợi ý sau 4 giây
        setTimeout(() => setHintMove(null), 4000);
      } else {
        // Fallback cợ chế gợi ý bằng Minimax
        const localMove = getBestMove(board, currentPlayer, Math.max(aiDifficulty, 3));
        if (localMove) {
          setHintMove(localMove);
          setTimeout(() => setHintMove(null), 4000);
        }
      }
      setIsFetchingHint(false);
    });
  };

  const handleCellClick = (x: number, y: number) => {
    if (isGameOver || isAiThinking) return;

    const clickedPiece = board[y][x];

    // If a valid destination cell is clicked, move the selected piece
    if (selectedPiece && validMovesForSelected.some(m => m.x === x && m.y === y)) {
      // In vs AI mode, ensure it's player's turn to move
      if (gameMode === 'ai' && currentPlayer !== playerColor) return;

      executeMove(selectedPiece.x, selectedPiece.y, x, y);
      return;
    }

    // Select friendly piece
    if (clickedPiece && clickedPiece.player === currentPlayer) {
      if (gameMode === 'ai' && currentPlayer !== playerColor) return; // Not your turn
      setSelectedPiece({ x, y });
    } else {
      setSelectedPiece(null);
    }
  };

  const isChecked = useMemo(() => {
    return isUnderCheck(board, currentPlayer);
  }, [board, currentPlayer]);

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-[var(--background)] text-[var(--text-primary)] theme-transition select-none">

      {/* Title */}
      <h1 className="text-3xl font-extrabold sora-font mb-2 text-center flex items-center gap-2.5">
        ⚔️ {trans.game.chineseChessName || 'Cờ Tướng'} ⚔️
      </h1>
      <p className="text-xs text-[var(--text-secondary)] mb-6 text-center font-mono uppercase tracking-widest">
        {gameMode === 'ai' ? 'Trận Chiến Phục Hận (vs Máy)' : 'Song Hùng Quyết Đấu (Offline)'}
      </p>

      {/* Main Container Dashboard */}
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start max-w-[1140px] w-full justify-center">

        {/* Left Side: Game Mode Panel / Status */}
        <div className="w-full lg:w-[240px] flex flex-col gap-4 flex-shrink-0">

          {/* Game Modes selector */}
          <div className="bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.15)] flex flex-col gap-3 font-mono">
            <h2 className="text-xs font-black tracking-widest uppercase border-b border-[var(--border-color)]/20 pb-2">
              CHẾ ĐỘ CHƠI
            </h2>
            <button
              onClick={() => { setGameMode('pvp'); resetGame(); }}
              className={`py-2 px-3 text-xs font-bold rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${gameMode === 'pvp'
                  ? 'bg-[var(--bg-active-nav)] border-[var(--border-color)] text-[var(--text-active-nav)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-transparent border-transparent hover:bg-[var(--bg-hover-nav)]'
                }`}
            >
              <Users size={14} /> 2 Người Chơi (Offline)
            </button>
            <button
              onClick={() => { setGameMode('ai'); resetGame(); }}
              className={`py-2 px-3 text-xs font-bold rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${gameMode === 'ai'
                  ? 'bg-[var(--bg-active-nav)] border-[var(--border-color)] text-[var(--text-active-nav)] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-transparent border-transparent hover:bg-[var(--bg-hover-nav)]'
                }`}
            >
              <Cpu size={14} /> Đấu với Máy (AI BOT)
            </button>
          </div>

          {/* AI Color Selection */}
          {gameMode === 'ai' && (
            <div className="bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.15)] flex flex-col gap-3 font-mono">
              <h2 className="text-xs font-black tracking-widest uppercase border-b border-[var(--border-color)]/20 pb-2">
                CHỌN QUÂN CỦA BẠN
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setPlayerColor('red'); resetGame(); }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border flex items-center justify-center cursor-pointer transition-all ${playerColor === 'red'
                      ? 'bg-red-500/10 border-red-500 text-red-600 font-extrabold'
                      : 'border-transparent opacity-60 hover:bg-[var(--bg-hover-nav)]'
                    }`}
                >
                  Đỏ (Đi trước)
                </button>
                <button
                  onClick={() => { setPlayerColor('black'); resetGame(); }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border flex items-center justify-center cursor-pointer transition-all ${playerColor === 'black'
                      ? 'bg-slate-500/10 border-slate-500 text-slate-800 dark:text-slate-100 font-extrabold'
                      : 'border-transparent opacity-60 hover:bg-[var(--bg-hover-nav)]'
                    }`}
                >
                  Đen (Đi sau)
                </button>
              </div>

              {/* AI Difficulty Selector */}
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-[var(--border-color)]/20">
                <span className="text-[10px] font-bold text-[var(--text-secondary)]">ĐỘ KHÓ AI:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { lv: 1, label: 'Nhập môn (Lv1)' },
                    { lv: 2, label: 'Tập sự (Lv2)' },
                    { lv: 3, label: 'Trung cấp (Lv3)' },
                    { lv: 4, label: 'Cao thủ (Lv4)' },
                    { lv: 5, label: '⚡ Siêu cấp (Lv5)' },
                  ].map(item => (
                    <button
                      key={item.lv}
                      onClick={() => setAiDifficulty(item.lv)}
                      className={`py-1.5 px-1 text-[9px] font-bold rounded-lg border cursor-pointer transition-all ${
                        aiDifficulty === item.lv
                          ? 'bg-amber-500/10 border-amber-500 text-amber-600 font-extrabold shadow-sm'
                          : 'border-transparent opacity-60 hover:bg-[var(--bg-hover-nav)]'
                      } ${item.lv === 5 ? 'col-span-2' : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Time Limit Selector */}
          <div className="bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.15)] flex flex-col gap-3 font-mono">
            <h2 className="text-xs font-black tracking-widest uppercase border-b border-[var(--border-color)]/20 pb-2">
              THỜI GIAN MỖI LƯỢT
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { time: 0, label: 'Vô hạn ⏱️' },
                { time: 60, label: '1 Phút ⏱️' },
                { time: 120, label: '2 Phút ⏱️' },
                { time: 180, label: '3 Phút ⏱️' },
              ].map(item => (
                <button
                  key={item.time}
                  onClick={() => {
                    setTimeLimit(item.time);
                    setTimeLeft(item.time);
                  }}
                  className={`py-1.5 px-1 text-[9px] font-bold rounded-lg border cursor-pointer transition-all ${
                    timeLimit === item.time
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 font-extrabold shadow-sm'
                      : 'border-transparent opacity-60 hover:bg-[var(--bg-hover-nav)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Turn / Status Board */}
          <div className="bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.15)] flex flex-col gap-2.5 font-mono">
            <h2 className="text-xs font-black tracking-widest uppercase border-b border-[var(--border-color)]/20 pb-2">
              TRẠNG THÁI TRẬN ĐẤU
            </h2>
            <div className="flex items-center justify-between text-xs py-1">
              <span>Lượt đi:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-black uppercase text-[10px] border border-black/20 ${currentPlayer === 'red'
                  ? 'bg-red-500/10 text-red-600'
                  : 'bg-slate-500/10 text-slate-700 dark:text-slate-200'
                }`}>
                {currentPlayer === 'red' ? 'Đỏ' : 'Đen'}
              </span>
            </div>
            {isAiThinking && (
              <div className="text-[10px] font-bold text-center text-amber-600 dark:text-amber-400 animate-pulse bg-amber-500/10 py-1 border border-amber-500/35 rounded-lg">
                Máy đang suy nghĩ...
              </div>
            )}
            {isChecked && !isGameOver && (
              <div className="text-[10px] font-black text-center text-red-600 animate-bounce bg-red-500/10 py-1 border border-red-500/30 rounded-lg">
                * ĐANG BỊ CHIẾU TƯỚNG *
              </div>
            )}
            {isGameOver && (
              <div className="flex flex-col items-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30 rounded-xl p-3 text-center">
                <span className="text-xs font-black tracking-widest">TRẬN ĐẤU KẾT THÚC</span>
                <span className="text-xs font-bold font-sans">
                  Bên {winner === 'red' ? 'ĐỎ (帥)' : 'ĐEN (將)'} Thắng! 🎉
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center: The Board Visual & Turn Banner */}
        <div className="flex flex-col items-center flex-shrink-0">

          {/* Turn Banner */}
          <div className={`w-full py-2.5 px-4 mb-4 rounded-xl border-2 border-black font-mono text-center text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] uppercase tracking-wider ${isGameOver
              ? 'bg-green-500 text-white animate-bounce'
              : gameMode === 'ai'
                ? currentPlayer === playerColor
                  ? 'bg-green-400 text-black animate-pulse border-green-600'
                  : 'bg-amber-400 text-black border-amber-600 animate-pulse'
                : currentPlayer === 'red'
                  ? 'bg-red-500 text-white border-red-600'
                  : 'bg-slate-800 text-white border-slate-900'
            }`}>
            {isGameOver
              ? `KẾT THÚC: BÊN ${winner === 'red' ? 'ĐỎ' : 'ĐEN'} THẮNG!`
              : gameMode === 'ai'
                ? currentPlayer === playerColor
                  ? `👉 LƯỢT CỦA BẠN (YOUR TURN) ${timeLimit > 0 ? `| ⏱️ ${formatTime(timeLeft)}` : ''} 👈`
                  : '⏳ MÁY ĐANG SUY NGHĨ (AI THINKING...) ⏳'
                : currentPlayer === 'red'
                  ? `🔴 LƯỢT ĐI BÊN ĐỎ (RED\'S TURN) ${timeLimit > 0 ? `| ⏱️ ${formatTime(timeLeft)}` : ''}`
                  : `⚫ LƯỢT ĐI BÊN ĐEN (BLACK\'S TURN) ${timeLimit > 0 ? `| ⏱️ ${formatTime(timeLeft)}` : ''}`
            }
          </div>

          <div className="relative w-[560px] aspect-[8/9] bg-[#eedcbd] dark:bg-[#32281d] border-4 border-black rounded-[24px] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(120,100,240,0.25)] select-none flex-shrink-0">

            {/* River Labels inside board */}
            <div className="absolute top-[45%] left-0 w-full h-[10%] flex justify-around items-center pointer-events-none text-xs font-extrabold text-[#7c5d43] dark:text-[#a08065] font-sans opacity-70">
              <span className="rotate-180">楚 河</span>
              <span>漢 界</span>
            </div>

            {/* Board Line Graphic SVG (Perfect Math Grid) */}
            <svg viewBox="0 0 800 900" className="absolute inset-5 w-[calc(100%-40px)] h-[calc(100%-40px)] stroke-[#7c5d43] dark:stroke-[#a38060] stroke-[4px] fill-none pointer-events-none">
              {/* Outline board box */}
              <rect x="0" y="0" width="800" height="900" className="stroke-[6px]" />

              {/* Horizontal grid lines */}
              <line x1="0" y1="100" x2="800" y2="100" />
              <line x1="0" y1="200" x2="800" y2="200" />
              <line x1="0" y1="300" x2="800" y2="300" />
              <line x1="0" y1="400" x2="800" y2="400" />
              <line x1="0" y1="500" x2="800" y2="500" />
              <line x1="0" y1="600" x2="800" y2="600" />
              <line x1="0" y1="700" x2="800" y2="700" />
              <line x1="0" y1="800" x2="800" y2="800" />

              {/* Vertical grid lines (Broken at river) */}
              {[1, 2, 3, 4, 5, 6, 7].map(col => (
                <React.Fragment key={col}>
                  <line x1={col * 100} y1="0" x2={col * 100} y2="400" />
                  <line x1={col * 100} y1="500" x2={col * 100} y2="900" />
                </React.Fragment>
              ))}

              {/* Diagonal Palace X lines */}
              {/* Top Palace */}
              <line x1="300" y1="0" x2="500" y2="200" />
              <line x1="500" y1="0" x2="300" y2="200" />
              {/* Bottom Palace */}
              <line x1="300" y1="700" x2="500" y2="900" />
              <line x1="500" y1="700" x2="300" y2="900" />
            </svg>

            {/* Absolute Positioning Pieces Overlay (10 rows x 9 columns) */}
            <div className="absolute inset-5 w-[calc(100%-40px)] h-[calc(100%-40px)] pointer-events-none">
              {Array(10).fill(null).map((_, y) => (
                Array(9).fill(null).map((_, x) => {
                  const piece = board[y][x];
                  const isSelected = selectedPiece?.x === x && selectedPiece?.y === y;
                  const isValidMoveTarget = validMovesForSelected.some(m => m.x === x && m.y === y);
                  const isEnemyTarget = isValidMoveTarget && piece !== null;

                  return (
                    <div
                      key={`${x}-${y}`}
                      style={{
                        left: `${x * 12.5}%`,
                        top: `${y * 11.111}%`,
                      }}
                      onClick={() => handleCellClick(x, y)}
                      className="absolute w-[11%] aspect-square -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer pointer-events-auto z-10"
                    >
                      {/* Last Move start cell highlight */}
                      {lastMove?.fromX === x && lastMove?.fromY === y && !piece && (
                        <div className="absolute inset-0 w-[85%] h-[85%] bg-yellow-400/20 border-2 border-dashed border-yellow-500/60 rounded-full z-0 pointer-events-none" />
                      )}

                      {/* Last Move end cell highlight */}
                      {lastMove?.toX === x && lastMove?.toY === y && !piece && (
                        <div className="absolute inset-0 w-[85%] h-[85%] bg-yellow-400/25 border-2 border-yellow-400/60 rounded-full z-0 pointer-events-none" />
                      )}

                      {/* Pieces circles */}
                      {piece && (
                        <div className={`w-full h-full rounded-full border-2 border-black flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all select-none ${piece.player === 'red'
                            ? 'bg-[#ffebee] hover:bg-[#ffcdd2] text-red-700'
                            : 'bg-[#ECEFF1] hover:bg-[#CFD8DC] text-slate-800'
                          } ${isSelected ? 'ring-4 ring-amber-500 border-amber-600 translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : ''} ${isEnemyTarget ? 'ring-4 ring-red-500 border-red-600 animate-pulse' : ''
                          } ${
                            hintMove?.fromX === x && hintMove?.fromY === y
                              ? 'ring-4 ring-blue-500 border-blue-600 animate-pulse translate-y-[-2px] shadow-lg'
                              : hintMove?.toX === x && hintMove?.toY === y
                              ? 'ring-4 ring-cyan-500 border-cyan-600 animate-pulse'
                              : lastMove?.fromX === x && lastMove?.fromY === y
                              ? 'ring-4 ring-yellow-400/50 border-yellow-500 shadow-md'
                              : lastMove?.toX === x && lastMove?.toY === y
                              ? 'ring-4 ring-yellow-400/60 border-yellow-500 shadow-md'
                              : ''
                          }`}>
                          <span className="text-lg sm:text-2xl font-black tracking-tighter select-none font-serif leading-none mt-0.5">
                            {PIECE_LABELS[piece.player][piece.type]}
                          </span>
                          <span className="text-[8px] sm:text-[10px] font-sans font-bold opacity-75 uppercase leading-none tracking-tight">
                            {PIECE_NAMES_VI[piece.type]}
                          </span>
                        </div>
                      )}

                      {/* Hint destination marker (pulsing cyan ring) */}
                      {hintMove?.toX === x && hintMove?.toY === y && !piece && (
                        <div className="absolute w-6 h-6 bg-cyan-400/30 border-2 border-cyan-500 rounded-full animate-ping z-20" />
                      )}

                      {/* Move suggestions (green dots) for empty valid target cells */}
                      {isValidMoveTarget && !piece && (
                        <div className="w-4.5 h-4.5 bg-green-500/80 hover:bg-green-500 rounded-full border-2 border-green-600 animate-pulse shadow-md flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-green-700 rounded-full" />
                        </div>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Move logs / Control Panel */}
        <div className="w-full lg:w-[240px] flex flex-col gap-4 flex-shrink-0">

          {/* General Game Action list */}
          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={onGoBack}
              className="py-3 px-4 text-xs font-extrabold rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] text-[var(--text-primary)] cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <ArrowLeft size={14} /> Danh sách
            </button>
            <button
              onClick={resetGame}
              className="py-3 px-4 text-xs font-extrabold rounded-2xl border-2 border-[var(--border-color)] bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--text-primary)] cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <RotateCcw size={14} /> Chơi Lại
            </button>
          </div>

          {/* Hint Button */}
          <button
            onClick={getHint}
            disabled={isFetchingHint || isAiThinking || isGameOver}
            className="w-full py-2.5 px-4 text-xs font-extrabold rounded-2xl border-2 border-[var(--border-color)] bg-[var(--bg-panel-solid)] hover:bg-[var(--bg-hover-nav)] text-[var(--text-primary)] cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.15)] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingHint ? 'Đang tìm...' : '💡 GỢI Ý NƯỚC ĐI (HINT)'}
          </button>

          {/* Live Move Log Board */}
          <div className="bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(120,100,240,0.15)] flex flex-col gap-2.5 font-mono h-[260px] overflow-hidden">
            <h2 className="text-xs font-black tracking-widest uppercase border-b border-[var(--border-color)]/20 pb-2 flex items-center gap-1.5">
              <Eye size={12} /> BIÊN BẢN NƯỚC ĐI
            </h2>
            <div className="flex-grow overflow-y-auto no-scrollbar flex flex-col gap-1.5 text-[10px] leading-tight select-none">
              {moveHistory.length === 0 ? (
                <div className="text-slate-400 italic text-center mt-8">Chưa có nước đi nào.</div>
              ) : (
                moveHistory.map((log, index) => (
                  <div key={index} className="border-b border-[var(--border-color)]/5 pb-1 flex gap-1 items-start">
                    <span className="font-bold text-[var(--text-secondary)]">{moveHistory.length - index}.</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom guide tips */}
      <div className="max-w-[700px] w-full mt-8 p-4 bg-[var(--bg-panel-solid)] border-2 border-[var(--border-color)] rounded-2xl text-xs text-[var(--text-secondary)] leading-relaxed select-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(120,100,240,0.1)]">
        <p className="font-bold text-[var(--text-primary)] mb-1">Cách chơi cờ tướng:</p>
        <p>1. Nhấp chuột vào một quân cờ của bên bạn (theo lượt) để chọn. Các ô có thể di chuyển hợp lệ sẽ được thắp sáng bằng các chấm màu xanh.</p>
        <p>2. Nhấp vào các ô chấm xanh để di chuyển quân cờ của bạn đến đó. Nếu ô đích chứa quân cờ của đối thủ, quân đó sẽ bị ăn.</p>
        <p>3. Trong chế độ đấu với máy, bạn có thể chủ động chọn màu quân của mình. Bên Đỏ luôn là bên được quyền đi trước theo luật cờ tướng quốc tế.</p>
      </div>
    </div>
  );
}
