import React from 'react';
import { BingoProvider, useBingo } from '@/contexts/BingoContext';
import GameSetup from '@/components/GameSetup';
import BingoCard from '@/components/BingoCard';

const Index = () => {
  return (
    <BingoProvider>
      <div className="min-h-screen bg-gray-50">
        <GameContent />
      </div>
    </BingoProvider>
  );
};

// Move GameContent inside Index so it's always within BingoProvider
const GameContent = () => {
  const { gameCode } = useBingo();
  
  if (!gameCode) {
    return <GameSetup />;
  }
  
  return <BingoCard />;
};

export default Index;