import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBingo } from '@/contexts/BingoContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const JoinGame = () => {
    const [gameCode, setGameCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setGameCode: setContextGameCode, setIsAdmin, addPlayer } = useBingo();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleJoinGame = async () => {
        if (gameCode.length !== 8 || !/^\d+$/.test(gameCode)) {
            toast({
                title: "Código Inválido",
                description: "Por favor, insira um código de jogo válido de 8 dígitos",
                variant: "destructive",
            });
            return;
        }
        if (!playerName.trim()) {
            toast({
                title: "Nome Inválido",
                description: "Por favor, insira seu nome",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Primeiro definimos o código do jogo e o status de admin
            setContextGameCode(gameCode);
            setIsAdmin(false);

            // Então adicionamos o jogador e esperamos a conclusão
            await addPlayer(playerName);
            
            toast({
                title: "Entrando no Jogo",
                description: "Aguardando o administrador para iniciar o jogo",
            });

            // Só redirecionamos após o jogador ser adicionado com sucesso
            navigate('/waiting-room');
        } catch (error: any) {
            toast({
                title: "Erro ao Entrar",
                description: error.message || "Não foi possível entrar no jogo. Verifique o código e tente novamente.",
                variant: "destructive",
            });
            setContextGameCode(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bingo-background p-4 flex items-center justify-center">
            <Card className="w-full max-w-md bg-bingo-card">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-bold text-bingo-header">
                        Entrar em um Jogo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Insira o código de 8 dígitos"
                        value={gameCode}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                            setGameCode(value);
                        }}
                        maxLength={8}
                        className="text-center"
                        disabled={isLoading}
                    />
                    <Input
                        placeholder="Seu nome"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="text-center"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleJoinGame}
                        className="w-full bg-bingo-header text-white hover:bg-bingo-header/90"
                        disabled={isLoading}
                    >
                        {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default JoinGame;