import { useState, useEffect } from 'react';
import { User, Building2, ArrowRight } from 'lucide-react';

interface RoleSelectionProps {
  setCurrentPage: (page: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ setCurrentPage }) => {
  const [selectedRole, setSelectedRole] = useState<'agent' | 'enterprise' | null>(null);
  const [authError, setAuthError] = useState('');

  // Vérifier s'il y a un message d'erreur d'authentification
  useEffect(() => {
    const error = localStorage.getItem('authError');
    if (error) {
      setAuthError(error);
      localStorage.removeItem('authError');
    }
  }, []);

  const handleGoogleAuth = () => {
    if (!selectedRole) return;
    
    // Stocker le rôle sélectionné dans le localStorage pour le récupérer après l'auth Google
    localStorage.setItem('selectedRole', selectedRole);
    
    // Rediriger vers Google OAuth
    window.location.href = 'http://localhost:5500/api/auth/google';
  };

  const handleExistingUserAuth = () => {
    // Pour les utilisateurs existants, pas besoin de sélectionner un rôle
    localStorage.removeItem('selectedRole');
    window.location.href = 'http://localhost:5500/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Rejoignez FreelanceLink
          </h2>
          <p className="mt-2 text-gray-600">
            Choisissez votre type de compte pour commencer
          </p>
          
          {authError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              <p className="font-medium">Erreur d'authentification</p>
              <p>{authError}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Freelancer Card */}
          <div
            onClick={() => setSelectedRole('agent')}
            className={`cursor-pointer bg-white rounded-lg border-2 p-8 text-center transition-all hover:shadow-lg ${
              selectedRole === 'agent' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              selectedRole === 'agent' ? 'bg-blue-500' : 'bg-gray-100'
            }`}>
              <User className={`w-8 h-8 ${selectedRole === 'agent' ? 'text-white' : 'text-gray-600'}`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Freelancer</h3>
            <p className="text-gray-600 text-sm mb-4">
              Trouvez des missions qui correspondent à vos compétences et développez votre activité
            </p>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li>• Accès aux offres de missions</li>
              <li>• Gestion de votre portfolio</li>
              <li>• Système de notation</li>
              <li>• Paiements sécurisés</li>
            </ul>
          </div>

          {/* Enterprise Card */}
          <div
            onClick={() => setSelectedRole('enterprise')}
            className={`cursor-pointer bg-white rounded-lg border-2 p-8 text-center transition-all hover:shadow-lg ${
              selectedRole === 'enterprise' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              selectedRole === 'enterprise' ? 'bg-green-500' : 'bg-gray-100'
            }`}>
              <Building2 className={`w-8 h-8 ${selectedRole === 'enterprise' ? 'text-white' : 'text-gray-600'}`} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Entreprise</h3>
            <p className="text-gray-600 text-sm mb-4">
              Publiez vos projets et trouvez les meilleurs freelancers pour vos besoins
            </p>
            <ul className="text-left text-sm text-gray-600 space-y-2">
              <li>• Publication de missions</li>
              <li>• Gestion des candidatures</li>
              <li>• Suivi des projets</li>
              <li>• Facturation intégrée</li>
            </ul>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center space-y-4">
          <button
            onClick={handleGoogleAuth}
            disabled={!selectedRole}
            className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors ${
              selectedRole
                ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          {!selectedRole && (
            <p className="mt-2 text-sm text-gray-500">
              Veuillez sélectionner un type de compte
            </p>
          )}
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Déjà inscrit ?</p>
            <button
              onClick={handleExistingUserAuth}
              className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Se connecter avec Google
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;