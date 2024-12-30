import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBingo } from '@/contexts/BingoContext';
import { useToast } from '@/hooks/use-toast';

const GameSetup = () => {
  const [gameCode, setGameCode] = useState('');
  const { setGameType, setGameCode: setContextGameCode, setIsAdmin } = useBingo();
  const { toast } = useToast();

  const handleCreateGame = (type: '75' | '90') => {
    const newGameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setContextGameCode(newGameCode);
    setGameType(type);
    setIsAdmin(true);
    toast({
      title: "Game Created!",
      description: `Your game code is: ${newGameCode}`,
    });
  };

  const handleJoinGame = () => {
    if (gameCode.length < 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid game code",
        variant: "destructive",
      });
      return;
    }
    setContextGameCode(gameCode.toUpperCase());
    setIsAdmin(false);
    toast({
      title: "Joining Game",
      description: "Waiting for admin to start the game",
    });
  };

  return (
    <div className="min-h-screen bg-bingo-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-bingo-card">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-bingo-header">
            Online Bingo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Create New Game</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleCreateGame('75')}
                className="bg-bingo-accent text-bingo-header hover:bg-bingo-accent/90"
              >
                75 Numbers
              </Button>
              <Button
                onClick={() => handleCreateGame('90')}
                className="bg-bingo-accent text-bingo-header hover:bg-bingo-accent/90"
              >
                90 Numbers
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Join Game</h3>
            <div className="space-y-2">
              <Input
                placeholder="Enter Game Code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center uppercase"
              />
              <Button
                onClick={handleJoinGame}
                className="w-full bg-bingo-header text-white hover:bg-bingo-header/90"
              >
                Join Game
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSetup;