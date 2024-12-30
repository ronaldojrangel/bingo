import React from 'react';
import { BingoProvider, useBingo } from '@/contexts/BingoContext';
import GameSetup from '@/components/GameSetup';
import BingoCard from '@/components/BingoCard';

const GameContent = () => {
  const { gameCode } = useBingo();
  
  if (!gameCode) {
    return <GameSetup />;
  }
  
  return <BingoCard />;
};

const Index = () => {
  return (
    <BingoProvider>
      <div className="min-h-screen bg-gray-50">
        <GameContent />
      </div>
    </BingoProvider>
  );
};

export default Index;