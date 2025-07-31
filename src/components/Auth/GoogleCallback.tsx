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

        // Récupérer le rôle sélectionné (peut être null pour utilisateurs existants)
        const selectedRole = localStorage.getItem('selectedRole');
        localStorage.removeItem('selectedRole');
        
        // Valider le token avec le backend
        const response = await authAPI.googleSuccess(token);
        
        if (response.success) {
          let userData = response.data.user;
          // Vérifier si utilisateur existant essaie de s'inscrire
          if (!response.data.isNewUser && selectedRole) {
            // Ne pas sauvegarder les données utilisateur
            // Ne pas mettre à jour le contexte d'authentification
            localStorage.setItem('authError', 'Ce compte existe déjà. Veuillez vous connecter en utilisant le bouton "Se connecter avec Google".');
            
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
            setLoading(false);
            setCurrentPage('role-selection');
            return;
          }
          
          // Si c'est un nouvel utilisateur et qu'un rôle a été sélectionné
          if (response.data.isNewUser && selectedRole) {
            const updateResponse = await authAPI.completeProfile({ role: selectedRole });
            if (updateResponse.success) {
              userData = { ...updateResponse.data.user, role: selectedRole };
            } else {
              throw new Error('Erreur lors de l\'assignation du rôle');
            }
          } else if (response.data.isNewUser && !selectedRole) {
            // Nouveau utilisateur sans rôle sélectionné - rediriger vers sélection de rôle
            setCurrentPage('role-selection');
            return;
          }
          // Si c'est un utilisateur existant sans rôle sélectionné, connexion normale
          
          // Sauvegarder dans localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', token);
          
          // Mettre à jour le contexte d'authentification
          setUser(userData);
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
        setTimeout(() => setCurrentPage('role-selection'), 3000);
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
    const isExistingUserError = error.includes('Ce compte existe déjà');
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-md">
            <p className="font-medium">Erreur d'authentification</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          
          {isExistingUserError ? (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setCurrentPage('role-selection')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retour à la connexion
              </button>
            </div>
          ) : (
            <p className="mt-4 text-gray-600">Redirection vers la page de connexion...</p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;