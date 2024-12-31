import React from 'react';
import { Button } from './ui/button';
import { useBingo } from '@/contexts/BingoContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const { players, startGame, drawNumber, finishGame, gameState, drawnNumbers, currentNumber, gameCode } = useBingo();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartGame = () => {
    if (players.length >= 2) {
      startGame();
      toast({
        title: "Jogo Iniciado!",
        description: "O jogo começou. Você já pode sortear números.",
      });
    } else {
      toast({
        title: "Erro ao Iniciar",
        description: "É necessário no mínimo dois participantes para iniciar o jogo.",
        variant: "destructive",
      });
    }
  };

  const handleDrawNumber = () => {
    drawNumber();
  };

  const handleEndGame = () => {
    finishGame();
    toast({
      title: "Jogo Finalizado",
      description: "O jogo foi encerrado com sucesso.",
    });
    navigate('/');
  };

  const handleCopyCode = () => {
    if (gameCode) {
      navigator.clipboard.writeText(gameCode);
      toast({
        title: "Código copiado!",
        description: "O código do bingo foi copiado para a área de transferência.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-900 text-center mb-6">Administração do Jogo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-purple-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">Código do Bingo</h2>
            <div className="flex items-center gap-2">
              <p className="text-yellow-400 text-2xl font-bold flex-1">{gameCode}</p>
              <Button 
                onClick={handleCopyCode} 
                className="bg-yellow-400 text-purple-900 hover:bg-yellow-500 font-semibold px-4"
              >
                Copiar
              </Button>
            </div>
          </div>

          <div className="bg-purple-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">Número Atual</h2>
            <div className="text-center">
              <span className="text-6xl font-bold text-yellow-400">
                {currentNumber || '-'}
              </span>
            </div>
          </div>

          <div className="bg-purple-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">Status do Jogo</h2>
            <p className="text-white text-lg capitalize">{gameState}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button 
                onClick={handleStartGame} 
                disabled={gameState !== 'pending'}
                className="bg-yellow-400 text-purple-900 hover:bg-yellow-500 font-semibold disabled:opacity-50"
              >
                Iniciar Jogo
              </Button>
              <Button 
                onClick={handleDrawNumber} 
                disabled={gameState !== 'playing'}
                className="bg-yellow-400 text-purple-900 hover:bg-yellow-500 font-semibold disabled:opacity-50"
              >
                Sortear Número
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-purple-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">Números Sorteados</h2>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {drawnNumbers.map((number, index) => (
                <div
                  key={index}
                  className="aspect-square bg-white rounded-lg flex items-center justify-center text-purple-900 font-bold text-lg"
                >
                  {number}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-white">Participantes ({players.length})</h2>
            <div className="max-h-[300px] overflow-y-auto">
              {players.length > 0 ? (
                <ul className="space-y-2">
                  {players.map((player) => (
                    <li key={player.id} className="text-white bg-purple-700 rounded p-2">
                      {player.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/80 italic">Aguardando participantes...</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button 
            onClick={handleEndGame}
            className="w-full bg-red-500 text-white hover:bg-red-600 font-semibold py-3"
          >
            Finalizar Jogo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;