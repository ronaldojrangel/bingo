import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useBingo } from "@/contexts/BingoContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Game = () => {
  const { players, drawnNumbers, currentNumber, gameCode, isAdmin } = useBingo();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Recuperar o jogador atual do localStorage
  const currentPlayer = JSON.parse(localStorage.getItem("bingo_current_player") || "null");

  const handleLeaveGame = () => {
    localStorage.removeItem("bingo_current_player");
    toast({
      title: "Saiu do Jogo",
      description: "Você saiu do jogo com sucesso.",
    });
    navigate("/");
  };

  // Redirecionar se não estiver em um jogo
  useEffect(() => {
    if (!gameCode || !currentPlayer) {
      navigate('/');
    }
  }, [gameCode, navigate, currentPlayer]);

  if (!currentPlayer) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="bg-purple-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-white mb-2">Informações do Jogador</h2>
          <p className="text-white">Nome: <span className="font-bold">{currentPlayer.name}</span></p>
          <p className="text-white">Grupo: <span className="font-bold">{gameCode}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Número Atual</h2>
            <div className="text-6xl font-bold text-yellow-400 text-center">
              {currentNumber || '-'}
            </div>
          </div>

          <div className="bg-purple-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-white mb-4">Sua Cartela</h2>
            <div className="grid grid-cols-5 gap-2">
              {currentPlayer.card.map((row: number[], rowIndex: number) =>
                row.map((number: number, colIndex: number) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`aspect-square flex items-center justify-center rounded-lg text-lg font-bold ${
                      number === 0
                        ? "bg-yellow-400 text-purple-900"
                        : drawnNumbers.includes(number)
                        ? "bg-yellow-400 text-purple-900"
                        : "bg-white text-purple-900"
                    }`}
                  >
                    {number === 0 ? "★" : number}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-white mb-3">Números Sorteados</h2>
          <div className="space-y-2">
            <p className="text-white">
              {drawnNumbers.length > 0
                ? drawnNumbers.join(", ")
                : "Nenhum número sorteado ainda"}
            </p>
          </div>
        </div>

        <Button
          onClick={handleLeaveGame}
          className="bg-red-500 text-white hover:bg-red-600 font-semibold py-3"
        >
          Sair do Jogo
        </Button>
      </div>
    </div>
  );
};

export default Game;
