import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameSetup from './components/GameSetup';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import { BingoProvider } from './contexts/BingoContext';
import AdminPage from './components/AdminPage';
import Game from './components/Game';

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
        </Routes>
      </Router>
    </BingoProvider>
  );
};

export default App;