import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const GameSetup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bingo-background p-4 flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-center text-white">Meu Bingo Online!</h1>
        <h2 className="text-md text-center text-white">Selecione uma opção abaixo e comece a diversão</h2>

        <Button
          onClick={() => navigate('/create-game')}
          className="w-full bg-yellow-500 text-white hover:bg-yellow-400"
        >
          Criar Novo Jogo
        </Button>
        <Button
          onClick={() => navigate('/join-game')}
          className="w-full bg-green-500 text-white hover:bg-yellow-400"
        >
          Entrar em um Jogo
        </Button>
      </div>
    </div>
  );
};

export default GameSetup;