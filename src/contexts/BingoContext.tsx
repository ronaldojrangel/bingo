import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Chaves para o localStorage
const STORAGE_KEYS = {
  GAME_TYPE: 'bingo_game_type',
  GAME_STATE: 'bingo_game_state',
  GAME_CODE: 'bingo_game_code',
  IS_ADMIN: 'bingo_is_admin',
  PLAYERS: 'bingo_players',
  DRAWN_NUMBERS: 'bingo_drawn_numbers',
  CURRENT_NUMBER: 'bingo_current_number',
  WINNERS: 'bingo_winners',
  MAX_WINNERS: 'bingo_max_winners',
  WIN_CONDITION: 'bingo_win_condition',
  CURRENT_PLAYER: 'bingo_current_player'
};

export const BingoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializar estados com dados do localStorage
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

  const [players, setPlayers] = useState<Player[]>(() => {
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

  const [winCondition, setWinCondition] = useState<'line' | 'column' | 'full'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WIN_CONDITION);
    return saved ? JSON.parse(saved) : 'line';
  });

  // Salvar estados no localStorage quando mudarem
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

  // Funções existentes com persistência
  const generateNumericCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const generateBingoCard = (maxNumber: number) => {
    const numbersPerColumn = Math.floor(maxNumber / 5);
    const card: number[][] = [];

    for (let col = 0; col < 5; col++) {
      const start = col * numbersPerColumn + 1;
      const end = col === 4 ? maxNumber : start + numbersPerColumn - 1;
      
      const columnNumbers = new Set<number>();
      while (columnNumbers.size < 5) {
        const num = Math.floor(Math.random() * (end - start + 1)) + start;
        columnNumbers.add(num);
      }
      
      const numbers = Array.from(columnNumbers).sort((a, b) => a - b);
      card[col] = numbers;
    }

    const transposedCard = Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 5 }, (_, col) => {
        if (row === 2 && col === 2) {
          return 0;
        }
        return card[col][row];
      })
    );

    return transposedCard;
  };

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      name,
      id: Math.random().toString(36).substring(2),
      card: generateBingoCard(gameType === '75' ? 75 : 90),
    };

    // Atualizar a lista de jogadores
    setPlayers(prev => {
      const updatedPlayers = [...prev, newPlayer];
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(updatedPlayers));
      return updatedPlayers;
    });

    // Se não for admin, salvar como jogador atual
    if (!isAdmin) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYER, JSON.stringify(newPlayer));
    }
  };

  const handleSetGameCode = (code: string) => {
    setGameCode(code);
    // Ao definir um novo código de jogo, garantir que o estado seja 'waiting'
    setGameState('waiting');
  };

  const handleSetIsAdmin = (admin: boolean) => {
    setIsAdmin(admin);
    if (!admin) {
      // Se não for admin, limpar o jogador atual do localStorage
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAYER);
    }
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
    setDrawnNumbers(prev => [...prev, newNumber]);
    
    checkWinners();
  };

  const checkWinners = () => {
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
      setWinners(prev => [...prev, playerId]);
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
        setGameCode: handleSetGameCode,
        setIsAdmin: handleSetIsAdmin,
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