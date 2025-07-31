import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Briefcase, 
  Search, 
  TrendingUp, 
  Users, 
  Building2,
  Star,
  ArrowRight
} from 'lucide-react';

interface MainHomePageProps {
  setCurrentPage: (page: string) => void;
}

const MainHomePage: React.FC<MainHomePageProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const { tasks, agents, enterprises } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const recentTasks = tasks.filter(t => t.status === 'open').slice(0, 6);
  const topFreelancers = agents.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bienvenue sur FreelanceHub, {user?.name}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez les meilleures opportunités et talents
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des projets, compétences, freelances..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
              <div className="text-sm text-gray-600">Projets actifs</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{agents.length}</div>
              <div className="text-sm text-gray-600">Freelances</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{enterprises.length}</div>
              <div className="text-sm text-gray-600">Entreprises</div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Taux de satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Projets récents */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Projets récents</h2>
                <button className="text-blue-600 hover:text-blue-800 flex items-center">
                  Voir tout <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <span className="text-lg font-bold text-green-600">${task.budget}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{task.description.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {task.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{task.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-900">Mon Dashboard</div>
                  <div className="text-sm text-gray-600">Gérer mes projets et profil</div>
                </button>
                
                {user?.role === 'enterprise' && (
                  <button
                    onClick={() => setCurrentPage('post-task')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Publier un projet</div>
                    <div className="text-sm text-gray-600">Trouvez le freelance idéal</div>
                  </button>
                )}
                
                {user?.role === 'agent' && (
                  <button
                    onClick={() => setCurrentPage('tasks')}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Parcourir les projets</div>
                    <div className="text-sm text-gray-600">Trouvez votre prochaine mission</div>
                  </button>
                )}
              </div>
            </div>

            {/* Top Freelancers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Freelancers</h3>
              <div className="space-y-3">
                {topFreelancers.map((freelancer) => (
                  <div key={freelancer.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{freelancer.name}</div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{freelancer.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHomePage;