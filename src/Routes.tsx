import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import GameSetup from './components/GameSetup';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import AdminPage from './components/AdminPage';
import Game from './components/Game';
import RegisterForm from './components/RegisterForm';
import GameHistory from './components/GameHistory';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<GameSetup />} />
      <Route path="/create-game" element={<CreateGame />} />
      <Route path="/join-game" element={<JoinGame />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/game" element={<Game />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/history" element={<GameHistory />} />
    </RouterRoutes>
  );
};

export default Routes;