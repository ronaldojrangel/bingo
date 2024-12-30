import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBingo } from '@/contexts/BingoContext';
import { useToast } from '@/hooks/use-toast';

const GameSetup = () => {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [maxWinners, setMaxWinners] = useState('1');
  const [winCondition, setWinCondition] = useState<'line' | 'column' | 'full'>('line');
  const { 
    setGameType, 
    setGameCode: setContextGameCode, 
    setIsAdmin, 
    addPlayer,
    setMaxWinners: setContextMaxWinners,
    setWinCondition: setContextWinCondition
  } = useBingo();
  const { toast } = useToast();

  const handleCreateGame = (type: '75' | '90') => {
    const newGameCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    setContextGameCode(newGameCode);
    setGameType(type);
    setIsAdmin(true);
    setContextMaxWinners(Number(maxWinners));
    setContextWinCondition(winCondition);
    toast({
      title: "Game Created!",
      description: `Your game code is: ${newGameCode}`,
    });
  };

  const handleJoinGame = () => {
    if (gameCode.length !== 8 || !/^\d+$/.test(gameCode)) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 8-digit game code",
        variant: "destructive",
      });
      return;
    }
    if (!playerName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    setContextGameCode(gameCode);
    setIsAdmin(false);
    addPlayer(playerName);
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
            <div className="space-y-4">
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
              <Select
                value={maxWinners}
                onValueChange={setMaxWinners}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Number of Winners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Winner</SelectItem>
                  <SelectItem value="2">2 Winners</SelectItem>
                  <SelectItem value="3">3 Winners</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={winCondition}
                onValueChange={(value: 'line' | 'column' | 'full') => setWinCondition(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Win Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="full">Full Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Join Game</h3>
            <div className="space-y-2">
              <Input
                placeholder="Enter 8-digit Game Code"
                value={gameCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setGameCode(value);
                }}
                maxLength={8}
                className="text-center"
                type="number"
              />
              <Input
                placeholder="Enter Your Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-center"
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