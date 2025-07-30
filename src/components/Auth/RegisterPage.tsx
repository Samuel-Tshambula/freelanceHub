
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, User, Building2, ArrowLeft } from 'lucide-react';

interface RegisterPageProps {
  setCurrentPage: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentPage }) => {
  const { login } = useAuth();

  const handleRegister = (role: 'agent' | 'enterprise') => {
    const mockUser = {
      id: Date.now().toString(),
      name: role === 'agent' ? 'Nouveau Freelance' : 'Nouvelle Entreprise',
      email: `${role}@example.com`,
      role,
      createdAt: new Date().toISOString()
    };
    
    login(mockUser);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Briefcase className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choisissez votre type de compte pour commencer
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            {/* Option Freelance */}
            <button
              onClick={() => handleRegister('agent')}
              className="w-full flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium text-gray-900">Freelance</h3>
                <p className="text-sm text-gray-500">
                  Je veux proposer mes services et trouver des missions
                </p>
              </div>
            </button>

            {/* Option Entreprise */}
            <button
              onClick={() => handleRegister('enterprise')}
              className="w-full flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mr-4">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium text-gray-900">Entreprise</h3>
                <p className="text-sm text-gray-500">
                  Je veux publier des tâches et recruter des talents
                </p>
              </div>
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setCurrentPage('home')}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;