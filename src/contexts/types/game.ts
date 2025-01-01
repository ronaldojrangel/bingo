export type GameType = '75' | '90';
export type GameState = 'pending' | 'playing' | 'finished';
export type WinCondition = 'line' | 'column' | 'full';

export interface Player {
  id: string;
  name: string;
  card: number[][];
}

export interface GameContextState {
  gameType: GameType | null;
  gameState: GameState;
  gameCode: string | null;
  isAdmin: boolean;
  players: Player[];
  drawnNumbers: number[];
  currentNumber: number | null;
  winners: string[];
  maxWinners: number;
  winCondition: WinCondition;
}

export interface BingoContextType extends GameContextState {
  setGameType: (type: GameType) => void;
  setGameState: (state: GameState) => void;
  setGameCode: (code: string | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  addPlayer: (name: string) => Promise<Player[]>;
  drawNumber: () => Promise<void>;
  addWinner: (playerId: string) => void;
  setMaxWinners: (count: number) => void;
  setWinCondition: (condition: WinCondition) => void;
  startGame: () => Promise<void>;
  finishGame: () => Promise<void>;
}