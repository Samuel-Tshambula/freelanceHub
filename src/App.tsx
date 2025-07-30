import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Layout/Header';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import HomePage from './components/Public/HomePage';
import AboutPage from './components/Public/AboutPage';
import AgentDashboard from './components/Dashboard/AgentDashboard';
import EnterpriseDashboard from './components/Dashboard/EnterpriseDashboard';
import TaskList from './components/Tasks/TaskList';
import PostTask from './components/Tasks/PostTask';
import MyTasks from './components/Tasks/MyTasks';
import PaymentHistory from './components/Payment/PaymentHistory';
import UserProfile from './components/Profile/UserProfile';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  // Rediriger vers le dashboard lors de la connexion
  useEffect(() => {
    if (isAuthenticated && (currentPage === 'login' || currentPage === 'register')) {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated, currentPage]);

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas connecté, afficher les pages publiques
    if (currentPage === 'home') {
      return <HomePage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'about') {
      return <AboutPage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'register') {
      return <RegisterPage setCurrentPage={setCurrentPage} />;
    }
    return <LoginPage setCurrentPage={setCurrentPage} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      
      case 'about':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      
      case 'login':
      case 'register':
        // Rediriger vers dashboard si connecté
        setCurrentPage('dashboard');
        return null;
      
      case 'dashboard':
        if (user?.role === 'agent') {
          return <AgentDashboard setCurrentPage={setCurrentPage} />;
        } else if (user?.role === 'enterprise') {
          return <EnterpriseDashboard setCurrentPage={setCurrentPage} />;
        } else {
          return <div className="text-center py-12">Admin Dashboard - En cours de développement</div>;
        }
      
      case 'tasks':
        return <TaskList />;
      
      case 'post-task':
        return user?.role === 'enterprise' ? (
          <PostTask setCurrentPage={setCurrentPage} />
        ) : (
          <div className="text-center py-12">Accès non autorisé</div>
        );
      
      case 'my-tasks':
        return user?.role === 'enterprise' ? (
          <MyTasks setCurrentPage={setCurrentPage} />
        ) : (
          <div className="text-center py-12">Page pour entreprises uniquement</div>
        );
      
      case 'my-applications':
        return <div className="text-center py-12">Mes candidatures - En cours de développement</div>;
      
      case 'payment-history':
        return <PaymentHistory setCurrentPage={setCurrentPage} />;
      
      case 'profile':
        return <UserProfile setCurrentPage={setCurrentPage} />;
      
      case 'notifications':
        return <div className="text-center py-12">Notifications - En cours de développement</div>;
      
      case 'settings':
        return <div className="text-center py-12">Paramètres - En cours de développement</div>;
      
      default:
        return <div className="text-center py-12">Page non trouvée</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      <main className={isAuthenticated ? "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8" : ""}>
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;