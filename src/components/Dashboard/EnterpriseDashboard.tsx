
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Briefcase, 
  Users, 
  Star, 
  Plus,
  Eye,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface EnterpriseDashboardProps {
  setCurrentPage: (page: string) => void;
}

const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const { tasks, applications, enterprises } = useApp();

  const enterprise = enterprises.find(e => e.id === user?.id);
  const myTasks = tasks.filter(task => task.createdBy === user?.id);
  const myApplications = applications.filter(app => {
    const task = tasks.find(t => t.id === app.taskId);
    return task?.createdBy === user?.id;
  });

  const stats = [
    {
      title: 'Tâches publiées',
      value: myTasks.length,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Candidatures reçues',
      value: myApplications.length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Note entreprise',
      value: `${enterprise?.rating || 0}/5`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Tâches terminées',
      value: myTasks.filter(task => task.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const activeTasks = myTasks.filter(task => task.status !== 'completed').slice(0, 3);
  const recentApplications = myApplications.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Bonjour, {enterprise?.companyName || user?.name} ! 🏢</h1>
        <p className="mt-2 opacity-90">
          Vous avez {myApplications.filter(app => app.status === 'pending').length} nouvelle(s) candidature(s)
          et {myTasks.filter(task => task.status === 'in_progress').length} tâche(s) en cours.
        </p>
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
              onClick={() => setCurrentPage('my-tasks')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {activeTasks.length > 0 ? (
              activeTasks.map((task) => {
                const taskApplications = applications.filter(app => app.taskId === task.id);
                return (
                  <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.budget}$ • {taskApplications.length} candidature(s)</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'open' 
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : task.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status === 'open' ? 'Ouverte' : 
                         task.status === 'assigned' ? 'Assignée' :
                         task.status === 'in_progress' ? 'En cours' : 'Terminée'}
                      </span>
                      <button
                        onClick={() => setCurrentPage('my-tasks')}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Gérer
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune tâche active</p>
            )}
          </div>
        </div>

        {/* Candidatures récentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Candidatures récentes</h2>
            <button
              onClick={() => setCurrentPage('my-tasks')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Voir tout
            </button>
          </div>
          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((application) => {
                const task = tasks.find(t => t.id === application.taskId);
                return (
                  <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-gray-900">{task?.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Candidature pour {task?.budget}$</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {application.status === 'pending' ? 'En attente' : 
                         application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                      </span>
                      <button
                        onClick={() => setCurrentPage('my-tasks')}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune candidature</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentPage('post-task')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Publier une tâche</p>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentPage('my-tasks')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Gérer mes tâches</p>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentPage('profile')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Profil entreprise</p>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentPage('payment-history')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Historique paiements</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;