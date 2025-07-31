import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import Avatar from '../Common/Avatar';
import { getProfileImage } from '../../utils/profileUtils';
import { 
  Briefcase, 
  DollarSign, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

interface AgentDashboardProps {
  setCurrentPage: (page: string) => void;
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const { tasks, applications, agents } = useApp();

  const agent = agents.find(a => a.id === user?.id);
  const myApplications = applications.filter(app => app.agentId === user?.id);
  const myTasks = tasks.filter(task => task.assignedTo?.includes(user?.id || ''));

  const stats = [
    {
      title: 'Tâches terminées',
      value: agent?.completedTasks || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Note moyenne',
      value: `${agent?.rating || 0}/5`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Candidatures en cours',
      value: myApplications.filter(app => app.status === 'pending').length,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Tâches actives',
      value: myTasks.filter(task => task.status === 'in_progress').length,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const recentTasks = myTasks.slice(0, 3);
  const availableTasks = tasks.filter(task => task.status === 'open').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <Avatar 
            src={getProfileImage(user)}
            alt={user?.name}
            size="lg"
            className="border-2 border-white/20"
          />
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {agent?.name} ! 👋</h1>
            <p className="mt-2 opacity-90">
              Vous avez {myApplications.filter(app => app.status === 'pending').length} candidature(s) en attente
              et {myTasks.filter(task => task.status === 'in_progress').length} tâche(s) active(s).
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mes tâches actives */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mes tâches actives</h2>
            <button
              onClick={() => setCurrentPage('my-applications')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.budget}$ • {task.duration}</p>
                  <div className="flex items-center mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'in_progress' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : task.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status === 'in_progress' ? 'En cours' : 
                       task.status === 'completed' ? 'Terminée' : 'Assignée'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune tâche active</p>
            )}
          </div>
        </div>

        {/* Nouvelles opportunités */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Nouvelles opportunités</h2>
            <button
              onClick={() => setCurrentPage('tasks')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {availableTasks.length > 0 ? (
              availableTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.budget}$ • {task.duration}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-wrap gap-1">
                      {task.skills.slice(0, 2).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage('tasks')}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Postuler
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune nouvelle tâche</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentPage('tasks')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <Briefcase className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Chercher des tâches</p>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentPage('profile')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Mettre à jour le profil</p>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentPage('my-applications')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Suivre mes candidatures</p>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentPage('payment-history')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Mes paiements</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;