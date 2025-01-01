import { GameType, GameState, Player } from '../types/game';
import { useGamePlayers } from './game/useGamePlayers';
import { useGameStateActions } from './game/useGameState';
import { useGameNumbers } from './game/useGameNumbers';

interface GameActionsProps {
  gameCode: string | null;
  isAdmin: boolean;
  gameType: GameType | null;
  gameState: GameState;
  winners: string[];
  maxWinners: number;
  drawnNumbers: number[];
  setGameState: (state: GameState) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentNumber: (number: number | null) => void;
  setDrawnNumbers: (numbers: number[]) => void;
  setWinners: (winners: string[]) => void;
}

export const useGameActions = ({
  gameCode,
  isAdmin,
  gameType,
  gameState,
  winners,
  maxWinners,
  drawnNumbers,
  setGameState,
  setPlayers,
  setCurrentNumber,
  setDrawnNumbers,
  setWinners,
}: GameActionsProps) => {
  const { fetchPlayers, addPlayer } = useGamePlayers({ 
    gameCode, 
    isAdmin, 
    gameType 
  });

  const { startGame: startGameAction, finishGame: finishGameAction } = useGameStateActions({ 
    gameCode, 
    isAdmin 
  });

  const { drawNumber } = useGameNumbers({ 
    gameCode, 
    isAdmin, 
    gameState, 
    gameType,
    drawnNumbers 
  });

  const startGame = async () => {
    const newState = await startGameAction();
    if (newState) {
      setGameState(newState);
    }
  };

  const finishGame = async () => {
    const newState = await finishGameAction();
    if (newState) {
      setGameState(newState);
    }
  };

  const addWinner = (playerId: string) => {
    if (winners.length < maxWinners) {
      setWinners([...winners, playerId]);
      if (winners.length + 1 >= maxWinners) {
        finishGame();
      }
    }
  };

  return {
    addPlayer,
    startGame,
    drawNumber,
    finishGame,
    addWinner,
    fetchPlayers,
  };
};