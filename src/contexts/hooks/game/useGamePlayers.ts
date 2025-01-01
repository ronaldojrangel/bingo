import { supabase } from '@/integrations/supabase/client';
import { generateBingoCard } from '@/utils/bingoUtils';
import { GameType, Player } from '../../types/game';
import { useToast } from '@/hooks/use-toast';

interface UseGamePlayersProps {
  gameCode: string | null;
  isAdmin: boolean;
  gameType: GameType | null;
}

export const useGamePlayers = ({ gameCode, isAdmin, gameType }: UseGamePlayersProps) => {
  const { toast } = useToast();

  const fetchPlayers = async () => {
    if (!gameCode) {
      console.log('No game code provided');
      return;
    }

    try {
      console.log('Fetching game with code:', gameCode);
      const { data: gameData, error: gameError } = await supabase
        .from('bingo_games')
        .select('id')
        .eq('code', gameCode)
        .maybeSingle();

      if (gameError) {
        console.error('Error fetching game:', gameError);
        throw gameError;
      }
      
      if (!gameData) {
        console.error('Game not found with code:', gameCode);
        return;
      }

      console.log('Found game:', gameData);

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

      return gamePlayers.map(gp => ({
        id: gp.player_id,
        name: gp.users.name,
        card: gp.board as number[][]
      }));
    } catch (error: any) {
      console.error('Error in fetchPlayers:', error);
      return [];
    }
  };

  const addPlayer = async (name: string) => {
    if (!gameCode) {
      toast({
        title: "Erro ao entrar no jogo",
        description: "Código do jogo não fornecido",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Adding player to game with code:', gameCode);
      
      const { data: gameData, error: gameError } = await supabase
        .from('bingo_games')
        .select('id')
        .eq('code', gameCode)
        .maybeSingle();

      if (gameError) throw gameError;
      
      if (!gameData) {
        console.error('Game not found with code:', gameCode);
        throw new Error('Game not found');
      }

      console.log('Found game:', gameData);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert([
          { name, role: isAdmin ? 'admin' : 'player' }
        ])
        .select()
        .single();

      if (userError) throw userError;

      console.log('User created/updated:', userData);

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

      return await fetchPlayers();
    } catch (error: any) {
      console.error('Error adding player:', error);
      toast({
        title: "Erro ao entrar no jogo",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    fetchPlayers,
    addPlayer,
  };
};