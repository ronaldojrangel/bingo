import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameSetup from './components/GameSetup';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import { BingoProvider } from './contexts/BingoContext';
import AdminPage from './components/AdminPage';
import Game from './components/Game';
import RegisterForm from './components/RegisterForm';
import GameHistory from './components/GameHistory';

const App = () => {
  return (
    <BingoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GameSetup />} />
          <Route path="/create-game" element={<CreateGame />} />
          <Route path="/join-game" element={<JoinGame />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/history" element={<GameHistory />} />
        </Routes>
      </Router>
    </BingoProvider>
  );
};

export default App;