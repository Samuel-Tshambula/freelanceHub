import { useState } from 'react';
import { useTaskApplications } from '../../hooks/useTaskApplications';
import { applicationsAPI } from '../../services/api';
import { Users, User, Clock } from 'lucide-react';

interface TaskApplicationsProps {
  taskId: string;
  isOpen: boolean;
}

const TaskApplications: React.FC<TaskApplicationsProps> = ({ taskId, isOpen }) => {
  const { applications, loading, error, refetch } = useTaskApplications(taskId);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApplicationAction = async (applicationId: string, status: 'accepted' | 'rejected') => {
    setProcessing(applicationId);
    
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, status);
      refetch(); // Refresh the applications list
      alert(`Candidature ${status === 'accepted' ? 'acceptée' : 'refusée'} avec succès !`);
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la mise à jour de la candidature');
    } finally {
      setProcessing(null);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="mt-6 border-t pt-6">
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 border-t pt-6">
        <p className="text-red-600 text-sm">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t pt-6">
      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
        <Users className="w-4 h-4 mr-2" />
        Candidatures ({applications.length})
      </h4>
      
      {applications.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune candidature pour cette tâche</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {app.agentId?.name || 'Utilisateur inconnu'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {app.agentId?.email}
                    </div>
                  </div>
                </div>
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
              
              <p className="text-sm text-gray-700 mb-3">{app.message}</p>
              
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <Clock className="w-3 h-3 mr-1" />
                Postulé le {new Date(app.createdAt).toLocaleDateString()}
              </div>

              {app.status === 'pending' && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleApplicationAction(app._id, 'accepted')}
                    disabled={processing === app._id}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {processing === app._id ? 'Traitement...' : 'Accepter'}
                  </button>
                  <button 
                    onClick={() => handleApplicationAction(app._id, 'rejected')}
                    disabled={processing === app._id}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {processing === app._id ? 'Traitement...' : 'Refuser'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskApplications;