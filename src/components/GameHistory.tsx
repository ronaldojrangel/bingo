import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GameHistoryItem {
  id: string;
  code: string;
  type: string;
  status: string;
  created_at: string;
  is_admin: boolean;
}

const GameHistory = () => {
  const [games, setGames] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/register');
          return;
        }

        const { data, error } = await supabase
          .from('bingo_games')
          .select(`
            id,
            code,
            type,
            status,
            created_at,
            admin_id
          `)
          .or(`admin_id.eq.${user.id},game_players.player_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setGames(data.map(game => ({
          ...game,
          is_admin: game.admin_id === user.id
        })));
      } catch (error: any) {
        toast({
          title: "Error fetching games",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-bingo-background p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-900 mb-6">Game History</h1>
        
        {loading ? (
          <p className="text-center text-gray-600">Loading games...</p>
        ) : games.length === 0 ? (
          <p className="text-center text-gray-600">No games found.</p>
        ) : (
          <div className="grid gap-4">
            {games.map((game) => (
              <Card key={game.id} className="bg-white">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Game Code: {game.code}</span>
                    <span className="text-sm font-normal">
                      {game.is_admin ? "Created by you" : "Participated"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">Bingo {game.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium capitalize">{game.status}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">
                        {new Date(game.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHistory;