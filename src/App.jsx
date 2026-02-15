import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './config/i18n';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import RoleSelection from './pages/RoleSelection';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ScreeningPage from './pages/ScreeningPage';
import ReportsPage from './pages/ReportsPage';
import ChatbotPage from './pages/ChatbotPage';

function AppContent() {
  const { user, role, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-clinical">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🏥</span>
          </div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <LoginPage />;
  }

  // No role selected
  if (!role) {
    return <RoleSelection />;
  }

  // Main app
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/screening" element={<ScreeningPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
