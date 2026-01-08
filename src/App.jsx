import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GameRoom from './pages/GameRoom';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Ranking from './pages/Ranking'; // O novo integrante!

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota principal (Home) */}
        <Route path="/" element={<Home />} />
        
        {/* Rota do Jogo */}
        <Route path="/jogar/:gameId" element={<GameRoom />} />
        
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota de Perfil */}
        <Route path="/perfil" element={<Perfil />} />

        {/* Rota de Ranking (NOVA) */}
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </Router>
  );
}

export default App;