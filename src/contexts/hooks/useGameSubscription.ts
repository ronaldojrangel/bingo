import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '../types/game';

interface GameSubscriptionProps {
  gameCode: string | null;
  setCurrentNumber: (number: number | null) => void;
  setDrawnNumbers: (numbers: number[]) => void;
  fetchPlayers: () => Promise<Player[] | undefined>;
}

export const useGameSubscription = ({
  gameCode,
  setCurrentNumber,
  setDrawnNumbers,
  fetchPlayers,
}: GameSubscriptionProps) => {
  useEffect(() => {
    if (!gameCode) return;

    const fetchInitialData = async () => {
      // Fetch initial drawn numbers
      const { data: numbersData } = await supabase
        .from('numbers_drawn')
        .select('number')
        .eq('game_id', gameCode)
        .order('drawn_at', { ascending: true });

      if (numbersData) {
        const numbers = numbersData.map(row => row.number);
        setDrawnNumbers(numbers);
        if (numbers.length > 0) {
          setCurrentNumber(numbers[numbers.length - 1]);
        }
      }

      // Fetch initial players
      await fetchPlayers();
    };

    fetchInitialData();

    const channel = supabase
      .channel('game-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'numbers_drawn',
          filter: `game_id=eq.${gameCode}`,
        },
        async (payload: any) => {
          setCurrentNumber(payload.new.number);
          const { data } = await supabase
            .from('numbers_drawn')
            .select('number')
            .eq('game_id', gameCode)
            .order('drawn_at', { ascending: true });
          
          if (data) {
            setDrawnNumbers(data.map(row => row.number));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `game_id=eq.${gameCode}`,
        },
        async () => {
          await fetchPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameCode, setCurrentNumber, setDrawnNumbers, fetchPlayers]);
};