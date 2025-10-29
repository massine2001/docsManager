import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import PoolPage from './pages/Pool';
import ProfilPage from './pages/Profil';
import JoinPage from './pages/Join';
import { useConsumeInviteAfterLogin } from './hooks/useConsumeInviteAfterLogin';

function App() {

  useConsumeInviteAfterLogin();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/join" element={<JoinPage />} />

          <Route path="/" element={<Home />} />
          <Route path="/pool" element={<PoolPage />} />

          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <ProfilPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
