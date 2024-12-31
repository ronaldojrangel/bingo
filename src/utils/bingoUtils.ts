export const generateBingoCard = (maxNumber: number) => {
  const numbersPerColumn = Math.floor(maxNumber / 5);
  const card: number[][] = [];

  for (let col = 0; col < 5; col++) {
    const start = col * numbersPerColumn + 1;
    const end = col === 4 ? maxNumber : start + numbersPerColumn - 1;
    
    const columnNumbers = new Set<number>();
    while (columnNumbers.size < 5) {
      const num = Math.floor(Math.random() * (end - start + 1)) + start;
      columnNumbers.add(num);
    }
    
    const numbers = Array.from(columnNumbers).sort((a, b) => a - b);
    card[col] = numbers;
  }

  const transposedCard = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => {
      if (row === 2 && col === 2) {
        return 0;
      }
      return card[col][row];
    })
  );

  return transposedCard;
};

export const STORAGE_KEYS = {
  GAME_TYPE: 'bingo_game_type',
  GAME_STATE: 'bingo_game_state',
  GAME_CODE: 'bingo_game_code',
  IS_ADMIN: 'bingo_is_admin',
  PLAYERS: 'bingo_players',
  DRAWN_NUMBERS: 'bingo_drawn_numbers',
  CURRENT_NUMBER: 'bingo_current_number',
  WINNERS: 'bingo_winners',
  MAX_WINNERS: 'bingo_max_winners',
  WIN_CONDITION: 'bingo_win_condition',
  CURRENT_PLAYER: 'bingo_current_player'
};