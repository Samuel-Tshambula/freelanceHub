import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
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
  const { tasks, applications, proofs, payments, agents, updateApplication, updateTask, addNotification } = useApp();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null);

  const myTasks = tasks.filter(task => task.createdBy === user?.id);

  const handleAcceptApplication = (applicationId: string, taskId: string) => {
    updateApplication(applicationId, { status: 'accepted' });
    updateTask(taskId, { status: 'assigned', assignedTo: [applications.find(app => app.id === applicationId)?.agentId || ''] });
    
    // Notify agent
    const application = applications.find(app => app.id === applicationId);
    const task = tasks.find(t => t.id === taskId);
    if (application && task) {
      addNotification({
        userId: application.agentId,
        title: 'Candidature acceptée !',
        message: `Votre candidature pour "${task.title}" a été acceptée`,
        type: 'success',
        read: false
      });
    }
  };

  const handleRejectApplication = (applicationId: string) => {
    updateApplication(applicationId, { status: 'rejected' });
    
    // Notify agent
    const application = applications.find(app => app.id === applicationId);
    const task = tasks.find(t => t.id === application?.taskId);
    if (application && task) {
      addNotification({
        userId: application.agentId,
        title: 'Candidature refusée',
        message: `Votre candidature pour "${task.title}" n'a pas été retenue`,
        type: 'warning',
        read: false
      });
    }
  };

  const handlePaymentSubmitted = () => {
    setShowPaymentModal(null);
    alert('Paiement marqué comme effectué. L\'agent sera notifié pour confirmation.');
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes tâches</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérez vos tâches publiées et suivez leur progression
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          {myTasks.map((task) => {
            const taskApps = applications.filter(app => app.taskId === task.id);
            const pendingApps = taskApps.filter(app => app.status === 'pending');
            const taskProofs = proofs.filter(proof => proof.taskId === task.id);
            const taskPayments = payments.filter(payment => payment.taskId === task.id);

            return (
              <div key={task.id} className="bg-white rounded-lg shadow-md p-6">
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
                    <div className="text-2xl font-bold text-blue-600">{taskApps.length}</div>
                    <div className="text-xs text-gray-500">Candidatures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{pendingApps.length}</div>
                    <div className="text-xs text-gray-500">En attente</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{taskProofs.length}</div>
                    <div className="text-xs text-gray-500">Preuves</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{taskPayments.length}</div>
                    <div className="text-xs text-gray-500">Paiements</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {task.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                  {task.skills.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{task.skills.length - 3} autres
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Publié le {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedTask === task.id ? 'Masquer' : 'Détails'}
                    </button>
                    {task.status === 'completed' && (
                      <>
                        <button
                          onClick={() => setShowPaymentModal(task.id)}
                          className="inline-flex items-center px-3 py-1 border border-green-600 rounded-md text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Marquer payé
                        </button>
                        <button
                          onClick={() => setShowRatingModal(task.id)}
                          className="inline-flex items-center px-3 py-1 border border-yellow-600 rounded-md text-sm font-medium text-yellow-600 hover:bg-yellow-50 transition-colors"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Évaluer
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Task Details */}
                {selectedTask === task.id && (
                  <div className="mt-6 border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Candidatures */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Candidatures ({taskApps.length})
                        </h4>
                        <div className="space-y-3">
                          {taskApps.map((app) => {
                            const agent = agents.find(a => a.id === app.agentId);
                            return (
                              <div key={app.id} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium">{agent?.name}</div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    app.status === 'pending' 
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : app.status === 'accepted'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {app.status === 'pending' ? 'En attente' : 
                                     app.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{app.message}</p>
                                <div className="text-xs text-gray-500 mb-2">
                                  Note: {agent?.rating}/5 • {agent?.completedTasks} tâches terminées
                                </div>
                                {app.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleAcceptApplication(app.id, task.id)}
                                      className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                                    >
                                      Accepter
                                    </button>
                                    <button
                                      onClick={() => handleRejectApplication(app.id)}
                                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                                    >
                                      Refuser
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {taskApps.length === 0 && (
                            <p className="text-gray-500 text-sm">Aucune candidature</p>
                          )}
                        </div>
                      </div>

                      {/* Preuves */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Preuves soumises ({taskProofs.length})
                        </h4>
                        <div className="space-y-3">
                          {taskProofs.map((proof) => (
                            <div key={proof.id} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium">Preuve #{proof.id.slice(-4)}</div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  proof.status === 'submitted' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : proof.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {proof.status === 'submitted' ? 'Soumise' : 
                                   proof.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{proof.description}</p>
                              <div className="text-xs text-gray-500">
                                Soumise le {new Date(proof.submittedAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                          {taskProofs.length === 0 && (
                            <p className="text-gray-500 text-sm">Aucune preuve soumise</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          taskId={showPaymentModal}
          isOpen={true}
          onClose={() => setShowPaymentModal(null)}
          onPaymentSubmitted={handlePaymentSubmitted}
        />
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingSystem
          taskId={showRatingModal}
          onClose={() => setShowRatingModal(null)}
        />
      )}
    </div>
  );
};

export default MyTasks;