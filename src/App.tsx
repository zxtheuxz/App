import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { SearchPage } from './pages/Search';
import { Bible } from './pages/Bible';
import { PrivateRoute } from './components/PrivateRoute';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 ${theme}`}>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={
              <PrivateRoute>
                <SearchPage />
              </PrivateRoute>
            } />
            <Route path="/bible" element={
              <PrivateRoute>
                <Bible />
              </PrivateRoute>
            } />
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
          </Routes>
        </AnimatePresence>
      </Router>
      <Toaster position="top-center" expand={true} richColors />
    </div>
  );
}

export default App;