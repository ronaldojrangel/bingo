import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BingoProvider } from './contexts/BingoContext';
import Routes from './Routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <BingoProvider>
        <Routes />
      </BingoProvider>
    </BrowserRouter>
  );
}

export default App;