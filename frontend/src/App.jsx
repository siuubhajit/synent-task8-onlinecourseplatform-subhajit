import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { NotificationToast } from './components/NotificationToast';

import { HomePage } from './pages/HomePage';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursePlayerPage } from './pages/CoursePlayerPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

export const AppContent = () => {
  const [route, setRoute] = useState('home'); // 'home' | 'catalog' | 'course-details' | 'dashboard' | 'classroom' | 'admin' | 'verify' | 'reset-password'
  const [routeParams, setRouteParams] = useState({});
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const navigate = (newRoute, params = {}) => {
    setRoute(newRoute);
    setRouteParams(params);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        onOpenAuth={(mode) => { setAuthModalMode(mode); setAuthModalOpen(true); }}
        onNavigate={navigate}
        currentRoute={route}
      />

      <main style={{ flexGrow: 1 }}>
        {route === 'home' && <HomePage onNavigate={navigate} />}
        {route === 'catalog' && <CourseCatalogPage onNavigate={navigate} initialFilters={routeParams} />}
        {route === 'course-details' && (
          <CourseDetailsPage
            courseId={routeParams.courseId}
            onNavigate={navigate}
            onOpenAuth={(mode) => { setAuthModalMode(mode); setAuthModalOpen(true); }}
            onEnrollSuccess={(msg) => showToast(msg, 'success')}
          />
        )}
        {route === 'dashboard' && <DashboardPage onNavigate={navigate} />}
        {route === 'classroom' && (
          <CoursePlayerPage
            courseId={routeParams.courseId}
            onNavigate={navigate}
          />
        )}
        {route === 'admin' && <AdminDashboardPage onNavigate={navigate} />}
        {route === 'verify' && <VerifyEmailPage onNavigate={navigate} />}
        {route === 'reset-password' && <ResetPasswordPage onNavigate={navigate} />}
      </main>

      <Footer onNavigate={navigate} />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => showToast('Authenticated successfully!')}
      />

      <NotificationToast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
