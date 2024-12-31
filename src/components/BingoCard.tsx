import React from 'react';
import { useBingo } from '@/contexts/BingoContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

const BingoCard = () => {
  const { 
    gameType,
    gameState,
    drawnNumbers,
    currentNumber,
    isAdmin,
    players,
    drawNumber,
    startGame,
    winners,
    gameCode
  } = useBingo();
  const { toast } = useToast();
  const letters = ['B', 'I', 'N', 'G', 'O'];
  
  const handleDrawNumber = () => {
    if (gameState === 'playing') {
      drawNumber();
      toast({
        title: "New Number Drawn",
        description: `Number ${currentNumber} was drawn!`,
      });
    }
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      toast({
        title: "Cannot Start Game",
        description: "At least 2 players are required to start the game",
        variant: "destructive",
      });
      return;
    }
    startGame();
    toast({
      title: "Game Started",
      description: "The game has begun! Good luck to all players!",
    });
  };

  const copyGameCode = () => {
    if (gameCode) {
      navigator.clipboard.writeText(gameCode);
      toast({
        title: "Code Copied!",
        description: "Game code has been copied to clipboard",
      });
    }
  };

  const currentPlayer = players.find(p => p.id === players[0]?.id);
  const numbers = currentPlayer?.card || [];

  // Pagination for drawn numbers
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(drawnNumbers.length / itemsPerPage);
  const currentDrawnNumbers = drawnNumbers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-bingo-card rounded-lg shadow-xl overflow-hidden">
        {gameCode && (
          <div className="p-4 bg-bingo-header text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Game Code:</span>
              <span className="font-mono text-xl">{gameCode}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyGameCode}
              className="hover:bg-white/20"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="p-4 bg-bingo-header text-white">
          <h2 className="text-2xl font-bold">
            {gameState === 'pending' && 'Waiting for game to start...'}
            {gameState === 'playing' && `Current Number: ${currentNumber || 'Drawing...'}`}
            {gameState === 'finished' && 'Game Finished!'}
          </h2>
        </div>

        {isAdmin && gameState === 'pending' && (
          <div className="p-4 bg-gray-100">
            <h3 className="font-semibold mb-2">Players in Game:</h3>
            <ul className="space-y-1">
              {players.map((player) => (
                <li key={player.id} className="text-sm">
                  {player.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-5 gap-1 p-2">
          {letters.map((letter, i) => (
            <div
              key={letter}
              className="bg-bingo-header text-white text-center py-2 font-bold text-xl"
            >
              {letter}
            </div>
          ))}
          {numbers.map((column, colIndex) =>
            column.map((number, rowIndex) => (
              <div
                key={`${colIndex}-${rowIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-lg font-semibold border border-gray-200",
                  number === 0 ? "bg-gray-200" : drawnNumbers.includes(number)
                    ? "bg-bingo-marked text-white"
                    : "bg-white text-bingo-number",
                  winners.includes(players[0]?.id) && "animate-pulse bg-green-500"
                )}
              >
                {number !== 0 ? number : ''}
              </div>
            ))
          )}
        </div>

        {isAdmin && (
          <div className="p-4 space-y-4">
            {gameState === 'pending' && (
              <Button
                onClick={handleStartGame}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Start Game ({players.length} players)
              </Button>
            )}
            {gameState === 'playing' && (
              <Button
                onClick={handleDrawNumber}
                className="w-full bg-bingo-accent hover:bg-bingo-accent/90"
              >
                Draw Next Number
              </Button>
            )}
          </div>
        )}

        <div className="p-4 bg-gray-100">
          <h3 className="font-semibold">Drawn Numbers:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentDrawnNumbers.map((num) => (
              <span
                key={num}
                className="inline-block px-2 py-1 bg-bingo-header text-white rounded"
              >
                {num}
              </span>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default BingoCard;