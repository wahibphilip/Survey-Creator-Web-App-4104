import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { SurveyProvider } from './context/SurveyContext';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import SurveyBuilder from './pages/SurveyBuilder';
import SurveyPreview from './pages/SurveyPreview';
import Analytics from './pages/Analytics';
import UserManagement from './components/UserManagement';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<SurveyBuilder />} />
          <Route path="/edit/:id" element={<SurveyBuilder />} />
          <Route path="/preview/:id" element={<SurveyPreview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics/:id" element={<Analytics />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </motion.main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <SurveyProvider>
          <Router>
            <AppContent />
          </Router>
        </SurveyProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
}

export default App;