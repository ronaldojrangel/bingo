import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBingo } from "@/contexts/BingoContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const CreateGame = () => {
  const [maxWinners, setMaxWinners] = useState("1");
  const [winCondition, setWinCondition] = useState<"line" | "column" | "full">("line");
  const {
    setGameType,
    setGameCode: setContextGameCode,
    setIsAdmin,
    setMaxWinners: setContextMaxWinners,
    setWinCondition: setContextWinCondition,
    setGameState,
    addPlayer,
  } = useBingo();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateGame = async (type: "75" | "90") => {
    try {
      // Limpar localStorage de jogos anteriores
      localStorage.removeItem('bingo_players');
      localStorage.removeItem('bingo_drawn_numbers');
      localStorage.removeItem('bingo_current_number');
      localStorage.removeItem('bingo_winners');
      localStorage.removeItem('bingo_current_player');

      // Gerar novo código do jogo
      const gameCode = Math.floor(10000000 + Math.random() * 90000000).toString();

      // Criar novo jogo no Supabase
      const { error: gameError } = await supabase
        .from('bingo_games')
        .insert([
          {
            code: gameCode,
            type,
            max_winners: Number(maxWinners),
            win_condition: winCondition,
            status: 'waiting'
          }
        ]);

      if (gameError) throw gameError;

      // Configurar o novo jogo no contexto
      setContextGameCode(gameCode);
      setGameType(type);
      setIsAdmin(true);
      setContextMaxWinners(Number(maxWinners));
      setContextWinCondition(winCondition);
      setGameState('waiting');

      // Adicionar o administrador como um usuário
      await addPlayer('Administrador');

      toast({
        title: "Jogo Criado!",
        description: `Seu código do jogo é: ${gameCode}`,
      });

      // Navegar para a página de admin
      navigate('/admin');
    } catch (error: any) {
      console.error('Error creating game:', error);
      toast({
        title: "Erro ao criar jogo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bingo-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-md bg-bingo-card">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-bingo-header">
            Criar Novo Jogo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-bingo-text">
              Quantidade de Vencedores
            </label>
            <Select
              value={maxWinners}
              onValueChange={(value) => setMaxWinners(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Vencedor</SelectItem>
                <SelectItem value="2">2 Vencedores</SelectItem>
                <SelectItem value="3">3 Vencedores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-bingo-text">
              Condição de Vitória
            </label>
            <Select
              value={winCondition}
              onValueChange={(value: "line" | "column" | "full") =>
                setWinCondition(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Linha Completa</SelectItem>
                <SelectItem value="column">Coluna Completa</SelectItem>
                <SelectItem value="full">Cartela Completa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              onClick={() => handleCreateGame("75")}
              className="bg-bingo-header text-white hover:bg-bingo-header/90"
            >
              Bingo 75
            </Button>
            <Button
              onClick={() => handleCreateGame("90")}
              className="bg-bingo-header text-white hover:bg-bingo-header/90"
            >
              Bingo 90
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGame;