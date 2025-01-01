import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GameSubscriptionProps {
  gameCode: string | null;
  setCurrentNumber: (number: number | null) => void;
  setDrawnNumbers: (numbers: number[]) => void;
  fetchPlayers: () => Promise<void>;
}

export const useGameSubscription = ({
  gameCode,
  setCurrentNumber,
  setDrawnNumbers,
  fetchPlayers,
}: GameSubscriptionProps) => {
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
        () => {
          console.log('Game players update received');
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
          const updatedNumbers = (prev: number[]) => [...prev, newNumber];
          setDrawnNumbers(updatedNumbers([]));
        }
      )
      .subscribe();

    // Initial fetch of players
    fetchPlayers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameCode, fetchPlayers, setCurrentNumber, setDrawnNumbers]);
};