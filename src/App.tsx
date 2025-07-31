import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Layout/Header';
import DashboardHeader from './components/Layout/DashboardHeader';
import RoleSelection from './components/Auth/RoleSelection';
import GoogleCallback from './components/Auth/GoogleCallback';
import ProfileCompletion from './components/Auth/ProfileCompletion';
import HomePage from './components/Public/HomePage';
import AboutPage from './components/Public/AboutPage';
import ContactPage from './components/Public/ContactPage';
import MainHomePage from './components/Common/MainHomePage';
import AgentDashboard from './components/Dashboard/AgentDashboard';
import EnterpriseDashboard from './components/Dashboard/EnterpriseDashboard';
import TaskList from './components/Tasks/TaskList';
import PostTask from './components/Tasks/PostTask';
import MyTasks from './components/Tasks/MyTasks';
import MyApplications from './components/Applications/MyApplications';
import PaymentHistory from './components/Payment/PaymentHistory';
import UserProfile from './components/Profile/UserProfile';
import NotificationsList from './components/Notifications/NotificationsList';

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  // Vérifier si c'est un callback Google
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token') && urlParams.get('user')) {
      setCurrentPage('google-callback');
      return;
    }
  }, []);

  // Rediriger selon l'état de l'utilisateur
  useEffect(() => {
    // Vérifier s'il y a une erreur d'authentification
    const authError = localStorage.getItem('authError');
    if (authError && currentPage !== 'role-selection') {
      setCurrentPage('role-selection');
      return;
    }
    
    if (isAuthenticated) {
      // Vérifier si le profil est complet
      const needsProfileCompletion = user && (
        !user.role ||
        (!user.profileCompleted &&
          ((user.role === 'agent' && (!user.bio || !user.location)) ||
           (user.role === 'enterprise' && (!user.companyName || !user.description || !user.location)))
        )
      );
      
      if (needsProfileCompletion && currentPage !== 'profile-completion') {
        setCurrentPage('profile-completion');
      } else if (!needsProfileCompletion && (currentPage === 'auth' || currentPage === 'profile-completion' || currentPage === 'home')) {
        setCurrentPage('main-home');
      }
    }
  }, [isAuthenticated, user, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Gérer le callback Google même si pas encore authentifié
  if (currentPage === 'google-callback') {
    return <GoogleCallback setCurrentPage={setCurrentPage} />;
  }

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas connecté, afficher les pages publiques
    if (currentPage === 'home') {
      return <HomePage setCurrentPage={setCurrentPage} />;
    } else if (currentPage === 'about') {
      return <AboutPage setCurrentPage={setCurrentPage} />;
    }
    return <RoleSelection setCurrentPage={setCurrentPage} />;
  }

  // Si l'utilisateur est connecté mais n'a pas de rôle, rediriger vers sélection de rôle
  if (isAuthenticated && !user?.role && currentPage !== 'role-selection') {
    return <RoleSelection setCurrentPage={setCurrentPage} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'main-home':
        return <MainHomePage setCurrentPage={setCurrentPage} />;
      
      case 'about':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      
      case 'contact':
        return <ContactPage setCurrentPage={setCurrentPage} />;
      
      case 'profile-completion':
        return <ProfileCompletion setCurrentPage={setCurrentPage} />;
      
      case 'role-selection':
        return <RoleSelection setCurrentPage={setCurrentPage} />;
      
      case 'auth':
        // Rediriger vers main-home si connecté
        setCurrentPage('main-home');
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
        return <MyApplications setCurrentPage={setCurrentPage} />;
      
      case 'payment-history':
        return <PaymentHistory setCurrentPage={setCurrentPage} />;
      
      case 'profile':
        return <UserProfile setCurrentPage={setCurrentPage} />;
      
      case 'notifications':
        return <NotificationsList />;
      
      case 'settings':
        return <div className="text-center py-12">Paramètres - En cours de développement</div>;
      
      default:
        return <div className="text-center py-12">Page non trouvée</div>;
    }
  };

  // Vérifier s'il y a une erreur d'authentification pour masquer la navbar
  const hasAuthError = localStorage.getItem('authError');
  const shouldShowNavbar = isAuthenticated && !hasAuthError;

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowNavbar && (
        currentPage === 'main-home' || currentPage === 'about' || currentPage === 'contact' ? 
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} /> :
          <DashboardHeader currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      <main className={shouldShowNavbar ? (currentPage !== 'main-home' ? "max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-20" : "pt-16") : ""}>
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