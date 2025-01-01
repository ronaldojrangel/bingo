import { supabase } from '@/integrations/supabase/client';
import { GameType, GameState } from '../../types/game';
import { useToast } from '@/hooks/use-toast';

interface UseGameNumbersProps {
  gameCode: string | null;
  isAdmin: boolean;
  gameState: GameState;
  gameType: GameType | null;
  drawnNumbers: number[];
}

export const useGameNumbers = ({ 
  gameCode, 
  isAdmin, 
  gameState, 
  gameType,
  drawnNumbers 
}: UseGameNumbersProps) => {
  const { toast } = useToast();

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

  return {
    drawNumber,
  };
};