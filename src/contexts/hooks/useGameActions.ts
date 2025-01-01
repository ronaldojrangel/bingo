import { supabase } from '@/integrations/supabase/client';
import { generateBingoCard } from '@/utils/bingoUtils';
import { GameType, GameState, Player } from '../types/game';
import { useToast } from '@/hooks/use-toast';

interface GameActionsProps {
  gameCode: string | null;
  isAdmin: boolean;
  gameType: GameType | null;
  gameState: GameState;
  winners: string[];
  maxWinners: number;
  drawnNumbers: number[];  // Added missing prop
  setGameState: (state: GameState) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentNumber: (number: number | null) => void;
  setDrawnNumbers: (numbers: number[]) => void;
  setWinners: (winners: string[]) => void;  // Added missing prop
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
  const { toast } = useToast();

  const fetchPlayers = async () => {
    if (!gameCode) return;

    try {
      const { data: gameData, error: gameError } = await supabase
        .from('bingo_games')
        .select('id')
        .eq('code', gameCode)
        .maybeSingle();

      if (gameError) throw gameError;
      if (!gameData) {
        console.error('Game not found');
        return;
      }

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
        .eq('game_id', gameData.id);

      if (error) {
        console.error('Error fetching players:', error);
        return;
      }

      const formattedPlayers: Player[] = gamePlayers.map(gp => ({
        id: gp.player_id,
        name: gp.users.name,
        card: gp.board as number[][]
      }));

      setPlayers(formattedPlayers);
    } catch (error: any) {
      console.error('Error in fetchPlayers:', error);
    }
  };

  const addPlayer = async (name: string) => {
    try {
      if (!gameCode) return;

      const { data: gameData, error: gameError } = await supabase
        .from('bingo_games')
        .select('id')
        .eq('code', gameCode)
        .maybeSingle();

      if (gameError) throw gameError;
      if (!gameData) {
        throw new Error('Game not found');
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert([
          { name, role: isAdmin ? 'admin' : 'player' }
        ])
        .select()
        .single();

      if (userError) throw userError;

      const { error: gamePlayerError } = await supabase
        .from('game_players')
        .insert([
          {
            game_id: gameData.id,
            player_id: userData.id,
            board: generateBingoCard(gameType === '75' ? 75 : 90)
          }
        ]);

      if (gamePlayerError) throw gamePlayerError;

      if (!isAdmin) {
        localStorage.setItem('CURRENT_PLAYER', JSON.stringify(userData));
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