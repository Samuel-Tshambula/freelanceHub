import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMyTasks } from '../../hooks/useMyTasks';
import { useApplicationsCount } from '../../hooks/useApplicationsCount';
import TaskApplications from './TaskApplications';
import { 
  Eye, 
  Users, 
  DollarSign,
  FileText,
  Briefcase,
  Star
} from 'lucide-react';
import PaymentModal from '../Payment/PaymentModal';
import RatingSystem from '../Rating/RatingSystem';

interface MyTasksProps {
  setCurrentPage: (page: string) => void;
}

const MyTasks: React.FC<MyTasksProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const { tasks: myTasks, loading, error } = useMyTasks();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null);



  const getStatusBadge = (status: string) => {
    const badges = {
      open: 'bg-green-100 text-green-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800',
      paid: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      open: 'Ouverte',
      assigned: 'Assignée',
      in_progress: 'En cours',
      completed: 'Terminée',
      paid: 'Payée'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes tâches</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérez vos tâches publiées et suivez leur progression ({myTasks.length} tâche(s))
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          {myTasks.map((task) => {
            const ApplicationsCount = () => {
              const count = useApplicationsCount(task._id);
              return count;
            };

            return (
              <div key={task._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                    {getStatusBadge(task.status)}
                  </div>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-xl font-bold">{task.budget}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600"><ApplicationsCount /></div>
                    <div className="text-xs text-gray-500">Candidatures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">0</div>
                    <div className="text-xs text-gray-500">En attente</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-xs text-gray-500">Preuves</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-xs text-gray-500">Paiements</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(task.skills || []).slice(0, 3).map((skill: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                  {(task.skills || []).length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{(task.skills || []).length - 3} autres
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Publié le {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedTask(selectedTask === task._id ? null : task._id)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedTask === task._id ? 'Masquer' : 'Détails'}
                    </button>
                  </div>
                </div>

                {/* Task Details */}
                {selectedTask === task._id && (
                  <>
                    <div className="mt-6 border-t pt-6">
                      <div className="text-sm text-gray-600 mb-4">
                        <p><strong>Description complète:</strong> {task.description}</p>
                        <p><strong>Durée:</strong> {task.duration}</p>
                        <p><strong>Compétences:</strong> {(task.skills || []).join(', ')}</p>
                        {task.deadline && <p><strong>Échéance:</strong> {new Date(task.deadline).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <TaskApplications taskId={task._id} isOpen={true} />
                  </>
                )}
              </div>
            );
          })}

          {myTasks.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche publiée</h3>
              <p className="text-gray-600 mb-4">Commencez par publier votre première tâche</p>
              <button
                onClick={() => setCurrentPage('post-task')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Publier une tâche
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-medium text-gray-900 mb-4">Résumé</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tâches ouvertes</span>
                <span className="font-medium">{myTasks.filter(t => t.status === 'open').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">En cours</span>
                <span className="font-medium">{myTasks.filter(t => t.status === 'in_progress').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Terminées</span>
                <span className="font-medium">{myTasks.filter(t => t.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Budget total</span>
                <span className="font-medium">{myTasks.reduce((sum, task) => sum + task.budget, 0)}$</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default MyTasks;