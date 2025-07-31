import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import Avatar from '../Common/Avatar';
import { getProfileImage } from '../../utils/profileUtils';
import { 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  FileText, 
  DollarSign,
  Plus,
  X,
  ArrowRight,
  SkipForward
} from 'lucide-react';

interface ProfileCompletionProps {
  setCurrentPage: (page: string) => void;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ setCurrentPage }) => {
  const { user, setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');



  // Données du profil
  const [profileData, setProfileData] = useState({
    // Commun
    location: '',
    phone: '',
    
    // Agent
    bio: '',
    skills: [] as string[],
    paymentMethod: '',
    paymentNumber: '',
    
    // Entreprise
    companyName: '',
    sector: '',
    description: '',
    website: ''
  });

  const [newSkill, setNewSkill] = useState('');

  // Configuration des étapes selon le rôle
  const getSteps = () => {
    if (user?.role === 'agent') {
      return [
        {
          title: 'Informations personnelles',
          fields: ['location', 'phone'],
          required: ['location']
        },
        {
          title: 'Présentation professionnelle',
          fields: ['bio'],
          required: ['bio']
        },
        {
          title: 'Compétences',
          fields: ['skills'],
          required: []
        },
        {
          title: 'Informations de paiement',
          fields: ['paymentMethod', 'paymentNumber'],
          required: []
        }
      ];
    } else if (user?.role === 'enterprise') {
      return [
        {
          title: 'Informations de l\'entreprise',
          fields: ['companyName', 'sector'],
          required: ['companyName']
        },
        {
          title: 'Description de l\'entreprise',
          fields: ['description'],
          required: ['description']
        },
        {
          title: 'Coordonnées',
          fields: ['location', 'phone', 'website'],
          required: ['location']
        }
      ];
    }
    return [];
  };

  const steps = getSteps();
  const currentStepConfig = steps[currentStep];

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const isStepValid = () => {
    return currentStepConfig.required.every(field => 
      profileData[field as keyof typeof profileData] && 
      String(profileData[field as keyof typeof profileData]).trim() !== ''
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (loading) return; // Éviter les soumissions multiples
    
    try {
      setLoading(true);
      setError('');

      // Préparer les données selon le rôle
      const dataToSend = {
        role: user?.role,
        // Champs communs
        location: profileData.location,
        phone: profileData.phone
      };

      // Ajouter les champs spécifiques selon le rôle
      if (user?.role === 'agent') {
        Object.assign(dataToSend, {
          bio: profileData.bio,
          skills: profileData.skills,
          paymentMethod: profileData.paymentMethod,
          paymentNumber: profileData.paymentNumber
        });
      } else if (user?.role === 'enterprise') {
        Object.assign(dataToSend, {
          companyName: profileData.companyName,
          sector: profileData.sector,
          description: profileData.description,
          website: profileData.website
        });
      }

      const response = await authAPI.completeProfile(dataToSend);

      if (response.success) {
        // Mettre à jour l'utilisateur avec les nouvelles données
        const updatedUser = { 
          ...user, 
          ...response.data.user,
          profileCompleted: true 
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Délai pour éviter les conflits DOM
        setTimeout(() => {
          setCurrentPage('main-home');
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        if (user?.role === 'agent') {
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ville, Pays"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de votre entreprise"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'activité
                </label>
                <select
                  value={profileData.sector}
                  onChange={(e) => setProfileData(prev => ({ ...prev, sector: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un secteur</option>
                  <option value="tech">Technologie</option>
                  <option value="marketing">Marketing</option>
                  <option value="design">Design</option>
                  <option value="finance">Finance</option>
                  <option value="education">Éducation</option>
                  <option value="healthcare">Santé</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>
          );
        }

      case 1:
        if (user?.role === 'agent') {
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Présentez-vous *
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez votre expérience, vos spécialités et ce qui vous rend unique..."
              />
            </div>
          );
        } else {
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de l'entreprise *
              </label>
              <textarea
                value={profileData.description}
                onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez votre entreprise, vos services et vos valeurs..."
              />
            </div>
          );
        }

      case 2:
        if (user?.role === 'agent') {
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vos compétences
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ajouter une compétence"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ville, Pays"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://votre-site.com"
                  />
                </div>
              </div>
            </div>
          );
        }

      case 3:
        // Cette étape n'existe que pour les agents (paiement)
        if (user?.role === 'agent') {
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement préférée
                </label>
                <select
                  value={profileData.paymentMethod}
                  onChange={(e) => setProfileData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez une méthode</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="MTN Money">MTN Money</option>
                  <option value="Airtel Money">Airtel Money</option>
                  <option value="Virement bancaire">Virement bancaire</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro/Compte
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.paymentNumber}
                    onChange={(e) => setProfileData(prev => ({ ...prev, paymentNumber: e.target.value }))}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Numéro de téléphone ou compte bancaire"
                  />
                </div>
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            {user?.profilePicture || user?.avatar ? (
              <img
                src={user.profilePicture || user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-4 border-blue-600 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center border-4 border-blue-600 shadow-lg">
                {user?.role === 'agent' ? (
                  <User className="w-8 h-8 text-white" />
                ) : (
                  <Building2 className="w-8 h-8 text-white" />
                )}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Complétez votre profil
          </h2>
          <p className="text-gray-600 mt-2">
            Étape {currentStep + 1} sur {steps.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentStepConfig.title}
          </h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {renderStepContent()}

          <div className="flex justify-between mt-6">
            <button
              onClick={handleSkip}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Passer
            </button>

            <button
              onClick={handleNext}
              disabled={loading || (currentStepConfig.required.length > 0 && !isStepValid())}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span>Sauvegarde...</span>
              ) : currentStep === steps.length - 1 ? (
                <span>Terminer</span>
              ) : (
                <>
                  <span>Suivant</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;