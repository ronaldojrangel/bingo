import React from 'react';
import { BingoProvider } from '@/contexts/BingoContext';
import GameSetup from '@/components/GameSetup';
import BingoCard from '@/components/BingoCard';
import { useBingo } from '@/contexts/BingoContext';

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
      <GameContent />
    </BingoProvider>
  );
};

export default Index;