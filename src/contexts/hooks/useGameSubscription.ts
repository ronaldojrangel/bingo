import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '../types/game';

interface GameSubscriptionProps {
  gameCode: string | null;
  setCurrentNumber: (number: number | null) => void;
  setDrawnNumbers: (prev: number[]) => number[];
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
        (payload) => {
          console.log('Game players update:', payload);
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

    // Initial fetch of players
    fetchPlayers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameCode, fetchPlayers, setCurrentNumber, setDrawnNumbers]);
};