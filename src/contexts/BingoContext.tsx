import React, { createContext, useContext, useState } from 'react';

type GameType = '75' | '90';
type GameState = 'waiting' | 'playing' | 'finished';
type Player = {
  name: string;
  id: string;
  card: number[][];
};

interface BingoContextType {
  gameType: GameType | null;
  gameState: GameState;
  gameCode: string | null;
  isAdmin: boolean;
  players: Player[];
  drawnNumbers: number[];
  currentNumber: number | null;
  winners: string[];
  maxWinners: number;
  winCondition: 'line' | 'column' | 'full';
  setGameType: (type: GameType) => void;
  setGameState: (state: GameState) => void;
  setGameCode: (code: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  addPlayer: (name: string) => void;
  drawNumber: () => void;
  addWinner: (playerId: string) => void;
  setMaxWinners: (count: number) => void;
  setWinCondition: (condition: 'line' | 'column' | 'full') => void;
  startGame: () => void;
  finishGame: () => void;
}

const BingoContext = createContext<BingoContextType | undefined>(undefined);

export const BingoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [winners, setWinners] = useState<string[]>([]);
  const [maxWinners, setMaxWinners] = useState(1);
  const [winCondition, setWinCondition] = useState<'line' | 'column' | 'full'>('line');

  const generateBingoCard = (maxNumber: number) => {
    const numbersPerColumn = maxNumber / 5;
    const card = Array.from({ length: 5 }, (_, colIndex) => {
      const start = colIndex * numbersPerColumn + 1;
      const end = start + numbersPerColumn - 1;
      return Array.from({ length: 5 }, (_, rowIndex) => {
        // Make center space empty (position 2,2)
        if (colIndex === 2 && rowIndex === 2) {
          return 0; // 0 represents empty space
        }
        return Math.floor(Math.random() * (end - start + 1)) + start;
      });
    });
    return card;
  };

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      name,
      id: Math.random().toString(36).substring(2),
      card: generateBingoCard(gameType === '75' ? 75 : 90),
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const drawNumber = () => {
    if (gameState !== 'playing') return;
    
    const maxNumber = gameType === '75' ? 75 : 90;
    const availableNumbers = Array.from({ length: maxNumber }, (_, i) => i + 1)
      .filter(n => !drawnNumbers.includes(n));
    
    if (availableNumbers.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];
    setCurrentNumber(newNumber);
    setDrawnNumbers((prev) => [...prev, newNumber]);
    
    checkWinners();
  };

  const checkWinners = () => {
    // Implementation will depend on win condition
    // This is a simplified version checking for a full line
    players.forEach((player) => {
      const hasWon = player.card.some(row => 
        row.every(num => drawnNumbers.includes(num))
      );
      
      if (hasWon && !winners.includes(player.id)) {
        addWinner(player.id);
      }
    });
  };

  const addWinner = (playerId: string) => {
    if (winners.length < maxWinners) {
      setWinners((prev) => [...prev, playerId]);
      if (winners.length + 1 >= maxWinners) {
        finishGame();
      }
    }
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGameState('playing');
    }
  };

  const finishGame = () => {
    setGameState('finished');
  };

  return (
    <BingoContext.Provider
      value={{
        gameType,
        gameState,
        gameCode,
        isAdmin,
        players,
        drawnNumbers,
        currentNumber,
        winners,
        maxWinners,
        winCondition,
        setGameType,
        setGameState,
        setGameCode,
        setIsAdmin,
        addPlayer,
        drawNumber,
        addWinner,
        setMaxWinners,
        setWinCondition,
        startGame,
        finishGame,
      }}
    >
      {children}
    </BingoContext.Provider>
  );
};

export const useBingo = () => {
  const context = useContext(BingoContext);
  if (context === undefined) {
    throw new Error('useBingo must be used within a BingoProvider');
  }
  return context;
};
