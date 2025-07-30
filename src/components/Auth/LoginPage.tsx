import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  setCurrentPage: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'agent' | 'enterprise' | 'admin'>('agent');

  const mockUsers = {
    agent: {
      id: '1',
      name: 'Samuel Tshambula',
      email: 'samuel@example.com',
      role: 'agent' as const,
      createdAt: '2024-01-15T10:00:00Z'
    },
    enterprise: {
      id: '3',
      name: 'Jean Mukendi',
      email: 'jean@techcorp.cd',
      role: 'enterprise' as const,
      createdAt: '2024-01-20T09:00:00Z'
    },
    admin: {
      id: 'admin',
      name: 'Administrateur',
      email: 'admin@freelancelink.cd',
      role: 'admin' as const,
      createdAt: '2024-01-01T00:00:00Z'
    }
  };

  const handleLogin = () => {
    login(mockUsers[selectedRole]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à FreelanceLink
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Plateforme de mise en relation freelances-entreprises
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choisissez votre type de compte pour la démo :
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="agent"
                    checked={selectedRole === 'agent'}
                    onChange={(e) => setSelectedRole(e.target.value as 'agent')}
                    className="mr-3 text-blue-600"
                  />
                  <div>
                    <div className="font-medium">Agent / Freelance</div>
                    <div className="text-sm text-gray-500">Postulez à des tâches et gagnez de l'argent</div>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="enterprise"
                    checked={selectedRole === 'enterprise'}
                    onChange={(e) => setSelectedRole(e.target.value as 'enterprise')}
                    className="mr-3 text-blue-600"
                  />
                  <div>
                    <div className="font-medium">Entreprise</div>
                    <div className="text-sm text-gray-500">Publiez des tâches et trouvez des talents</div>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={selectedRole === 'admin'}
                    onChange={(e) => setSelectedRole(e.target.value as 'admin')}
                    className="mr-3 text-blue-600"
                  />
                  <div>
                    <div className="font-medium">Administrateur</div>
                    <div className="text-sm text-gray-500">Gérez la plateforme et les utilisateurs</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Se connecter avec Google (Démo)
            </button>

            <div className="text-xs text-gray-500 text-center">
              <p>Version démo - En production, l'authentification se fera via Google OAuth</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <button
                onClick={() => setCurrentPage('register')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;