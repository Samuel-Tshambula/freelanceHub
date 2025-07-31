import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import Avatar from '../Common/Avatar';
import { getProfileImage } from '../../utils/profileUtils';
import { 
  Edit, 
  Save, 
  X, 
  Star, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Briefcase,
  DollarSign,
  ExternalLink,
  Plus,
  Trash2,
  Camera
} from 'lucide-react';

interface UserProfileProps {
  setCurrentPage: (page: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { user } = useAuth();
  const { tasks, payments, ratings, agents, enterprises } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    link: '',
    type: 'project'
  });

  // Récupérer les données utilisateur depuis le contexte
  const currentUserData = user?.role === 'agent' 
    ? agents.find(a => a.id === user?.id)
    : enterprises.find(e => e.id === user?.id);

  const [profileData, setProfileData] = useState({
    bio: user?.role === 'agent' 
      ? (currentUserData as any)?.bio || user?.bio || "Développeur web passionné"
      : (currentUserData as any)?.description || user?.description || "Entreprise innovante",
    location: user?.location || "Paris, France",
    website: (currentUserData as any)?.website || user?.website || (user?.role === 'agent' ? "https://portfolio.dev" : "https://entreprise.com"),
    phone: user?.phone || "+33 6 12 34 56 78",
    skills: user?.role === 'agent' 
      ? (currentUserData as any)?.skills || user?.skills || ["React", "Node.js", "TypeScript"]
      : ["Développement Web", "Design UX/UI", "Marketing Digital"],
    portfolio: [
      {
        id: '1',
        title: user?.role === 'agent' ? "E-commerce Platform" : "Application SaaS",
        description: user?.role === 'agent' ? "Plateforme e-commerce complète" : "Application SaaS pour gestion",
        link: user?.role === 'agent' ? "https://github.com/project1" : "https://entreprise.com/project1",
        type: "project"
      }
    ],
    paymentMethods: user?.role === 'agent' 
      ? [
          { method: (currentUserData as any)?.paymentMethod || user?.paymentMethod || "Orange Money", number: (currentUserData as any)?.paymentNumber || user?.paymentNumber || "+243 89 123 4567" }
        ]
      : []
  });

  // Calculer les statistiques
  const userTasks = tasks.filter(t => 
    user?.role === 'agent' 
      ? t.assignedTo?.includes(user.id!)
      : t.createdBy === user?.id
  );

  const completedTasks = userTasks.filter(t => t.status === 'completed');
  const totalEarnings = payments
    .filter(p => {
      const task = tasks.find(t => t.id === p.taskId);
      return user?.role === 'agent' 
        ? task?.assignedTo?.includes(user.id!)
        : task?.createdBy === user?.id;
    })
    .filter(p => p.status === 'confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const userRatings = ratings.filter(r => 
    user?.role === 'agent' 
      ? r.toUserId === user.id!
      : r.toUserId === user?.id
  );

  const averageRating = userRatings.length > 0 
    ? userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length 
    : 0;

  const handleSave = () => {
    setIsEditing(false);
    // Ici vous pourriez sauvegarder les données
    alert('Profil mis à jour avec succès !');
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const handleAddPortfolio = () => {
    if (newPortfolioItem.title && newPortfolioItem.description) {
      setProfileData(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, { ...newPortfolioItem, id: Date.now().toString() }]
      }));
      setNewPortfolioItem({ title: '', description: '', link: '', type: 'project' });
      setShowAddPortfolio(false);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((skill: string) => skill !== skillToRemove)
    }));
  };

  const removePortfolioItem = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(item => item.id !== id)
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header avec photo de profil */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Avatar 
              src={getProfileImage(user)}
              alt={user?.name}
              size="xl"
              className="border-4 border-white shadow-lg"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600 mb-2">{user?.email}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {user?.role === 'agent' ? 'Freelance' : 'Entreprise'}
              </span>
              {user?.isVerified && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  ✓ Vérifié
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Informations détaillées</h2>
          <p className="text-gray-600">
            Gérez vos informations personnelles et votre portfolio
          </p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Sauvegarder</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Annuler</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations personnelles</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-600">{profileData.bio}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {profileData.location}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profileData.website}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {profileData.phone}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compétences */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Compétences</h2>
              {isEditing && (
                <button
                  onClick={() => setShowAddSkill(true)}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill: string, index: number) => (
                <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {showAddSkill && (
              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Nouvelle compétence"
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setShowAddSkill(false)}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
              {isEditing && (
                <button
                  onClick={() => setShowAddPortfolio(true)}
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {profileData.portfolio.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Voir le projet
                      </a>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removePortfolioItem(item.id)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {showAddPortfolio && (
              <div className="mt-4 space-y-3 border border-gray-200 rounded-lg p-4">
                <input
                  type="text"
                  value={newPortfolioItem.title}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre du projet"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={newPortfolioItem.description}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <input
                  type="url"
                  value={newPortfolioItem.link}
                  onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="Lien vers le projet"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddPortfolio}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Ajouter
                  </button>
                  <button
                    onClick={() => setShowAddPortfolio(false)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistiques */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-600">Tâches complétées</span>
                </div>
                <span className="font-semibold">{completedTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-600">Revenus totaux</span>
                </div>
                <span className="font-semibold">${totalEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-gray-600">Note moyenne</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-1">{averageRating.toFixed(1)}</span>
                  {renderStars(Math.round(averageRating))}
                </div>
              </div>
            </div>
          </div>

          {/* Méthodes de paiement (pour les agents) */}
          {user?.role === 'agent' && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Méthodes de paiement</h2>
              <div className="space-y-3">
                {profileData.paymentMethods.map((method: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{method.method}</div>
                      <div className="text-sm text-gray-600">{method.number}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Évaluations récentes */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Évaluations récentes</h2>
            <div className="space-y-3">
              {userRatings.slice(0, 3).map((rating: any, index: number) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center">
                      {renderStars(rating.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rating.comment}</p>
                </div>
              ))}
              {userRatings.length === 0 && (
                <p className="text-gray-500 text-sm">Aucune évaluation pour le moment</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 