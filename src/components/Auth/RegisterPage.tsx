import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, User, Building2, ArrowLeft } from 'lucide-react';

interface RegisterPageProps {
  setCurrentPage: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentPage }) => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'agent' | 'enterprise'>('agent');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    sector: '',
    bio: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: 'agent' | 'enterprise') => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        ...(selectedRole === 'enterprise' ? {
          companyName: formData.companyName,
          sector: formData.sector
        } : {
          bio: formData.bio,
          skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
        })
      };

      await register(userData);
    } catch (error: any) {
      setError(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
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
          {step === 1 ? (
            <div className="space-y-4">
              {/* Option Freelance */}
              <button
                onClick={() => handleRoleSelect('agent')}
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
                onClick={() => handleRoleSelect('enterprise')}
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
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {selectedRole === 'enterprise' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
                    <input
                      type="text"
                      value={formData.sector}
                      onChange={(e) => setFormData({...formData, sector: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Compétences (séparées par des virgules)</label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="JavaScript, React, Node.js"
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Inscription...' : 'S\'inscrire'}
                </button>
              </div>
            </form>
          )}

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