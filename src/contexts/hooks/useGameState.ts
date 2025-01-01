import { useState, useEffect } from 'react';
import { GameContextState, GameType, GameState, WinCondition } from '../types/game';
import { STORAGE_KEYS } from '@/utils/bingoUtils';

export const useGameState = (): GameContextState => {
  const [gameType, setGameType] = useState<GameType | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAME_TYPE);
    return saved ? JSON.parse(saved) : null;
  });

  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return saved ? JSON.parse(saved) : 'waiting';
  });

  const [gameCode, setGameCode] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAME_CODE);
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_ADMIN);
    return saved ? JSON.parse(saved) : false;
  });

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [drawnNumbers, setDrawnNumbers] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DRAWN_NUMBERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentNumber, setCurrentNumber] = useState<number | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_NUMBER);
    return saved ? JSON.parse(saved) : null;
  });

  const [winners, setWinners] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WINNERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [maxWinners, setMaxWinners] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MAX_WINNERS);
    return saved ? JSON.parse(saved) : 1;
  });

  const [winCondition, setWinCondition] = useState<WinCondition>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WIN_CONDITION);
    return saved ? JSON.parse(saved) : 'line';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAME_TYPE, JSON.stringify(gameType));
  }, [gameType]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAME_CODE, JSON.stringify(gameCode));
  }, [gameCode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRAWN_NUMBERS, JSON.stringify(drawnNumbers));
  }, [drawnNumbers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_NUMBER, JSON.stringify(currentNumber));
  }, [currentNumber]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WINNERS, JSON.stringify(winners));
  }, [winners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MAX_WINNERS, JSON.stringify(maxWinners));
  }, [maxWinners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WIN_CONDITION, JSON.stringify(winCondition));
  }, [winCondition]);

  return {
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
  };
};