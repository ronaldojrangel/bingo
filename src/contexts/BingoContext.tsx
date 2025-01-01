import React, { createContext, useContext } from 'react';
import { useGameState } from './hooks/useGameState';
import { useGameActions } from './hooks/useGameActions';
import { useGameSubscription } from './hooks/useGameSubscription';
import { GameContextState, GameType, GameState, WinCondition, Player, BingoContextType } from './types/game';
import { Toaster } from '@/components/ui/toaster';

const BingoContext = createContext<BingoContextType | undefined>(undefined);

export const BingoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = useGameState();
  
  const {
    addPlayer,
    startGame,
    drawNumber,
    finishGame,
    addWinner,
    fetchPlayers,
  } = useGameActions({
    ...state,
    setGameState: (newState: GameState) => state.gameState = newState,
    setPlayers: (players: Player[]) => state.players = players,
    setCurrentNumber: (number: number | null) => state.currentNumber = number,
    setDrawnNumbers: (numbers: number[]) => state.drawnNumbers = numbers,
    setWinners: (winners: string[]) => state.winners = winners,
  });

  useGameSubscription({
    gameCode: state.gameCode,
    setCurrentNumber: (number: number | null) => state.currentNumber = number,
    setDrawnNumbers: (numbers: number[]) => state.drawnNumbers = numbers,
    fetchPlayers,
  });

  const contextValue: BingoContextType = {
    ...state,
    setGameType: (type: GameType) => state.gameType = type,
    setGameState: (newState: GameState) => state.gameState = newState,
    setGameCode: (code: string | null) => state.gameCode = code,
    setIsAdmin: (isAdmin: boolean) => state.isAdmin = isAdmin,
    setMaxWinners: (count: number) => state.maxWinners = count,
    setWinCondition: (condition: WinCondition) => state.winCondition = condition,
    addPlayer,
    drawNumber,
    addWinner,
    startGame,
    finishGame,
  };

  return (
    <BingoContext.Provider value={contextValue}>
      <Toaster />
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