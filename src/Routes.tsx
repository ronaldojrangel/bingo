import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import GameSetup from './components/GameSetup';
import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import AdminPage from './components/AdminPage';
import Game from './components/Game';
import RegisterForm from './components/RegisterForm';
import GameHistory from './components/GameHistory';
import Login from './components/Login';
import WaitingRoom from './components/WaitingRoom';
import { useNavigate } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (!session) {
        navigate('/login');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<GameSetup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/create-game"
        element={
          <ProtectedRoute>
            <CreateGame />
          </ProtectedRoute>
        }
      />
      <Route path="/join-game" element={<JoinGame />} />
      <Route path="/waiting-room" element={<WaitingRoom />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="/game" element={<Game />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <GameHistory />
          </ProtectedRoute>
        }
      />
    </RouterRoutes>
  );
};

export default Routes;