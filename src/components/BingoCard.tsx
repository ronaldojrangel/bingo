import React from 'react';
import { useBingo } from '@/contexts/BingoContext';
import { cn } from '@/lib/utils';

const BingoCard = () => {
  const { gameType, drawnNumbers } = useBingo();
  const letters = ['B', 'I', 'N', 'G', 'O'];
  
  const generateNumbers = () => {
    const maxNumber = gameType === '75' ? 75 : 90;
    const numbersPerColumn = maxNumber / 5;
    
    return letters.map((letter, columnIndex) => {
      const start = columnIndex * numbersPerColumn + 1;
      const end = start + numbersPerColumn - 1;
      const numbers = Array.from({ length: 5 }, () => {
        const num = Math.floor(Math.random() * (end - start + 1)) + start;
        return num;
      });
      return numbers;
    });
  };

  const numbers = React.useMemo(() => generateNumbers(), [gameType]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-bingo-card rounded-lg shadow-xl overflow-hidden">
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
                  drawnNumbers.includes(number)
                    ? "bg-bingo-marked text-white"
                    : "bg-white text-bingo-number"
                )}
              >
                {number}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BingoCard;