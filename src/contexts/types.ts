export type GameType = '75' | '90';
export type GameState = 'pending' | 'playing' | 'finished';

export type Player = {
  id: string;
  name: string;
  card: number[][];
};

export interface BingoContextType {
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
  addPlayer: (name: string) => Promise<void>;
  drawNumber: () => Promise<void>;
  addWinner: (playerId: string) => void;
  setMaxWinners: (count: number) => void;
  setWinCondition: (condition: 'line' | 'column' | 'full') => void;
  startGame: () => Promise<void>;
  finishGame: () => Promise<void>;
}