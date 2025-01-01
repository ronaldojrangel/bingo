import { supabase } from '@/integrations/supabase/client';
import { GameState } from '../../types/game';
import { useToast } from '@/hooks/use-toast';

interface UseGameStateProps {
  gameCode: string | null;
  isAdmin: boolean;
}

export const useGameStateActions = ({ gameCode, isAdmin }: UseGameStateProps) => {
  const { toast } = useToast();

  const startGame = async () => {
    if (!gameCode || !isAdmin) return;

    try {
      const { error } = await supabase
        .from('bingo_games')
        .update({ status: 'playing' })
        .eq('code', gameCode);

      if (error) throw error;
      
      toast({
        title: "Jogo Iniciado!",
        description: "O jogo começou. Você já pode sortear números.",
      });
      
      return 'playing' as GameState;
    } catch (error: any) {
      console.error('Error starting game:', error);
      toast({
        title: "Erro ao iniciar jogo",
        description: error.message,
        variant: "destructive",
      });
      throw error;
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
      
      toast({
        title: "Jogo Finalizado",
        description: "O jogo foi encerrado com sucesso.",
      });
      
      return 'finished' as GameState;
    } catch (error: any) {
      console.error('Error finishing game:', error);
      toast({
        title: "Erro ao finalizar jogo",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    startGame,
    finishGame,
  };
};