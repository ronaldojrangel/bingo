import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateBingoCard, STORAGE_KEYS } from '@/utils/bingoUtils';
import { BingoContextType, GameType, GameState, Player } from './types';
import { useToast } from '@/hooks/use-toast';

const BingoContext = createContext<BingoContextType | undefined>(undefined);

export const BingoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
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

  // Save states to localStorage
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

  // Subscribe to real-time updates
  useEffect(() => {
    if (!gameCode) return;

    const channel = supabase
      .channel('game-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `game_id=eq.${gameCode}`,
        },
        (payload) => {
          console.log('Game players update:', payload);
          // Update players list
          fetchPlayers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'numbers_drawn',
          filter: `game_id=eq.${gameCode}`,
        },
        (payload: any) => {
          console.log('New number drawn:', payload);
          const newNumber = payload.new.number;
          setCurrentNumber(newNumber);
          setDrawnNumbers(prev => [...prev, newNumber]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameCode]);

  const fetchPlayers = async () => {
    if (!gameCode) return;

    const { data: gamePlayers, error } = await supabase
      .from('game_players')
      .select(`
        id,
        player_id,
        board,
        users (
          name
        )
      `)
      .eq('game_id', gameCode);

    if (error) {
      console.error('Error fetching players:', error);
      return;
    }

    const formattedPlayers: Player[] = gamePlayers.map(gp => ({
      id: gp.player_id,
      name: gp.users.name,
      card: gp.board as number[][] // Type assertion here is safe because we know the structure from our database
    }));

    setPlayers(formattedPlayers);
  };

  const addPlayer = async (name: string) => {
    try {
      // First, create or get user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert([
          { name, role: isAdmin ? 'admin' : 'player' }
        ])
        .select()
        .single();

      if (userError) throw userError;

      // Then, add player to game
      const { error: gamePlayerError } = await supabase
        .from('game_players')
        .insert([
          {
            game_id: gameCode,
            player_id: userData.id,
            board: generateBingoCard(gameType === '75' ? 75 : 90)
          }
        ]);

      if (gamePlayerError) throw gamePlayerError;

      // Store current player info
      if (!isAdmin) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PLAYER, JSON.stringify(userData));
      }

      await fetchPlayers();

    } catch (error: any) {
      console.error('Error adding player:', error);
      toast({
        title: "Erro ao entrar no jogo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startGame = async () => {
    if (!gameCode || !isAdmin) return;

    try {
      const { error } = await supabase
        .from('bingo_games')
        .update({ status: 'playing' })
        .eq('code', gameCode);

      if (error) throw error;

      setGameState('playing');
      
      toast({
        title: "Jogo Iniciado!",
        description: "O jogo começou. Você já pode sortear números.",
      });
    } catch (error: any) {
      console.error('Error starting game:', error);
      toast({
        title: "Erro ao iniciar jogo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const drawNumber = async () => {
    if (!gameCode || !isAdmin || gameState !== 'playing') return;

    try {
      const maxNumber = gameType === '75' ? 75 : 90;
      const availableNumbers = Array.from({ length: maxNumber }, (_, i) => i + 1)
        .filter(n => !drawnNumbers.includes(n));
      
      if (availableNumbers.length === 0) return;
      
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const newNumber = availableNumbers[randomIndex];

      const { error } = await supabase
        .from('numbers_drawn')
        .insert([
          { game_id: gameCode, number: newNumber }
        ]);

      if (error) throw error;

    } catch (error: any) {
      console.error('Error drawing number:', error);
      toast({
        title: "Erro ao sortear número",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const finishGame = async () => {
    if (!gameCode || !isAdmin) return;

    try {
      const { error } = await supabase
        .from('bingo_games')
        .update({ status: 'finished' })
        .eq('code', gameCode);

      if (error) throw error;

      setGameState('finished');
      
      toast({
        title: "Jogo Finalizado",
        description: "O jogo foi encerrado com sucesso.",
      });
    } catch (error: any) {
      console.error('Error finishing game:', error);
      toast({
        title: "Erro ao finalizar jogo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addWinner = (playerId: string) => {
    if (winners.length < maxWinners) {
      setWinners(prev => [...prev, playerId]);
      if (winners.length + 1 >= maxWinners) {
        finishGame();
      }
    }
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