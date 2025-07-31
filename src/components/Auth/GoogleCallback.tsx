import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';

interface GoogleCallbackProps {
  setCurrentPage: (page: string) => void;
}

const GoogleCallback: React.FC<GoogleCallbackProps> = ({ setCurrentPage }) => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const isNewUser = urlParams.get('isNewUser') === 'true';
        const userParam = urlParams.get('user');

        if (!token || !userParam) {
          throw new Error('Données d\'authentification manquantes');
        }

        // Valider le token avec le backend
        const response = await authAPI.googleSuccess(token);
        
        if (response.success) {
          // Mettre à jour le contexte d'authentification
          setUser(response.data.user);
        } else {
          throw new Error(response.message || 'Échec de la validation du token');
        }

        // Nettoyer l'URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Rediriger vers la page principale
        setCurrentPage('main-home');

      } catch (error: any) {
        console.error('Erreur lors du callback Google:', error);
        setError(error.message || 'Erreur lors de l\'authentification');
        setTimeout(() => setCurrentPage('login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [setUser, setCurrentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connexion avec Google en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-md">
            <p className="font-medium">Erreur d'authentification</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <p className="mt-4 text-gray-600">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;