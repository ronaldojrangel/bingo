import React from 'react';
import { useBingo } from '@/contexts/BingoContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const WaitingRoom = () => {
  const { gameCode, players, gameState } = useBingo();
  const navigate = useNavigate();
  const currentPlayer = JSON.parse(localStorage.getItem('bingo_current_player') || '{}');

  React.useEffect(() => {
    if (!gameCode) {
      navigate('/');
      return;
    }

    if (gameState === 'playing') {
      navigate('/game');
    }
  }, [gameCode, gameState, navigate]);

  return (
    <div className="min-h-screen bg-bingo-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-purple-900">
            Sala de Espera
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Código do Jogo</p>
            <p className="text-3xl font-bold text-purple-900">{gameCode}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Seu Nome</p>
            <p className="text-lg font-semibold text-purple-900">{currentPlayer?.name}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Jogadores na Sala ({players.length})</p>
            <div className="bg-purple-50 rounded-lg p-3 space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-white rounded-md p-2 shadow-sm"
                >
                  {player.name}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 animate-pulse">
            Aguardando o administrador iniciar o jogo...
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingRoom;