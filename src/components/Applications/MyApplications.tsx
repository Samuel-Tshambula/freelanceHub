import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMyApplications } from '../../hooks/useMyApplications';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  DollarSign,
  MapPin,
  Filter,
  RefreshCw
} from 'lucide-react';

interface Application {
  _id: string;
  taskId: {
    _id: string;
    title: string;
    budget: number;
    status: string;
    createdBy: string;
  };
  agentId: string;
  status: 'pending' | 'accepted' | 'rejected';
  proposedBudget?: number;
  message: string;
  coverLetter?: string;
  proposedDuration?: string;
  createdAt: string;
}

interface MyApplicationsProps {
  setCurrentPage: (page: string) => void;
}

const MyApplications: React.FC<MyApplicationsProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [page, setPage] = useState(1);
  
  const statusFilter = filter === 'all' ? undefined : filter;
  const { applications, loading, error, totalPages, refetch } = useMyApplications(page, 10, statusFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Refusée';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes candidatures</h1>
          <p className="text-gray-600">Suivez l'état de vos candidatures aux tâches</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrer par statut :</span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'pending', label: 'En attente' },
              { key: 'accepted', label: 'Acceptées' },
              { key: 'rejected', label: 'Refusées' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setFilter(item.key as any);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === item.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Liste des candidatures */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Eye className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore postulé à des tâches.
            </p>
            <button
              onClick={() => setCurrentPage('tasks')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Voir les tâches disponibles
            </button>
          </div>
        ) : (
          applications.map((application) => (
            <div key={application._id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {application.taskId.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {application.message}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {getStatusIcon(application.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Budget: {application.taskId.budget}$ {application.proposedBudget && `(Proposé: ${application.proposedBudget}$)`}</span>
                  </div>
                  {application.proposedDuration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Durée proposée: {application.proposedDuration}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Statut tâche: {application.taskId.status}</span>
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Lettre de motivation :</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Candidature envoyée le {new Date(application.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <button
                    onClick={() => setCurrentPage('tasks')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Voir la tâche
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default MyApplications;