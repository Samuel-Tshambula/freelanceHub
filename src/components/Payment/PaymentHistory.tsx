import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { DollarSign, Calendar, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import PaymentConfirmation from './PaymentConfirmation';

interface PaymentHistoryProps {
  setCurrentPage: (page: string) => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const { payments, tasks, agents, enterprises } = useApp();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  // Filtrer les paiements selon le rôle de l'utilisateur
  const userPayments = user?.role === 'agent' 
    ? payments.filter(p => {
        const task = tasks.find(t => t.id === p.taskId);
        return task?.assignedTo?.includes(user.id);
      })
    : payments.filter(p => {
        const task = tasks.find(t => t.id === p.taskId);
        return task?.createdBy === user?.id;
      });

  // Appliquer le filtre de statut
  const filteredPayments = userPayments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'disputed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      disputed: 'Contesté'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique des paiements</h1>
          <p className="text-gray-600">
            {user?.role === 'agent' 
              ? 'Suivez vos paiements reçus' 
              : 'Suivez vos paiements effectués'
            }
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Retour
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({userPayments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            En attente ({userPayments.filter(p => p.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'confirmed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Confirmés ({userPayments.filter(p => p.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('disputed')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === 'disputed' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Contestés ({userPayments.filter(p => p.status === 'disputed').length})
          </button>
        </div>
      </div>

      {/* Liste des paiements */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun paiement</h3>
            <p className="mt-1 text-sm text-gray-500">
              {user?.role === 'agent' 
                ? 'Vous n\'avez pas encore reçu de paiements.' 
                : 'Vous n\'avez pas encore effectué de paiements.'
              }
            </p>
          </div>
        ) : (
          filteredPayments.map(payment => {
            const task = tasks.find(t => t.id === payment.taskId);
            const otherUser = user?.role === 'agent' 
              ? enterprises.find(e => e.id === task?.createdBy)
              : agents.find(a => task?.assignedTo?.includes(a.id));

            return (
              <div key={payment.id} className="bg-white rounded-lg border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <h3 className="font-semibold text-gray-900">{task?.title}</h3>
                      <p className="text-sm text-gray-600">
                        {user?.role === 'agent' 
                          ? `Payé par ${otherUser?.name}` 
                          : `Payé à ${otherUser?.name}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${payment.amount}
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{payment.method}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(payment.paidAt)}</span>
                  </div>
                  {payment.transactionRef && (
                    <div className="text-sm text-gray-600">
                      Ref: {payment.transactionRef}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {payment.proof && (
                      <button
                        onClick={() => window.open(payment.proof, '_blank')}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Voir la preuve</span>
                      </button>
                    )}
                  </div>

                  {user?.role === 'agent' && payment.status === 'pending' && (
                    <button
                      onClick={() => setSelectedPayment(payment.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Confirmer/Contester
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de confirmation/contestation */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <PaymentConfirmation
              paymentId={selectedPayment}
              onConfirmed={() => setSelectedPayment(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory; 