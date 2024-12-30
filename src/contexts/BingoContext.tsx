import React, { createContext, useContext, useState } from 'react';

type GameType = '75' | '90';
type GameState = 'waiting' | 'playing' | 'finished';

interface BingoContextType {
  gameType: GameType | null;
  gameState: GameState;
  gameCode: string | null;
  isAdmin: boolean;
  players: string[];
  drawnNumbers: number[];
  currentNumber: number | null;
  winners: string[];
  setGameType: (type: GameType) => void;
  setGameState: (state: GameState) => void;
  setGameCode: (code: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  addPlayer: (player: string) => void;
  drawNumber: () => void;
  addWinner: (player: string) => void;
}

const BingoContext = createContext<BingoContextType | undefined>(undefined);

export const BingoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [winners, setWinners] = useState<string[]>([]);

  const addPlayer = (player: string) => {
    setPlayers((prev) => [...prev, player]);
  };

  const drawNumber = () => {
    const maxNumber = gameType === '75' ? 75 : 90;
    const availableNumbers = Array.from({ length: maxNumber }, (_, i) => i + 1)
      .filter(n => !drawnNumbers.includes(n));
    
    if (availableNumbers.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];
    setCurrentNumber(newNumber);
    setDrawnNumbers((prev) => [...prev, newNumber]);
  };

  const addWinner = (player: string) => {
    setWinners((prev) => [...prev, player]);
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
        setGameType,
        setGameState,
        setGameCode,
        setIsAdmin,
        addPlayer,
        drawNumber,
        addWinner,
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