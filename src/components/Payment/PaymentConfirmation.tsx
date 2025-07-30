import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Check, X, Eye, AlertTriangle } from 'lucide-react';
import { Enterprise } from '../../types';

interface PaymentConfirmationProps {
  paymentId: string;
  onConfirmed: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ 
  paymentId, 
  onConfirmed 
}) => {
  const { user } = useAuth();
  const { payments, tasks, enterprises, updatePayment, addNotification } = useApp();
  
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const payment = payments.find(p => p.id === paymentId);
  const task = tasks.find(t => t.id === payment?.taskId);
  const enterprise = enterprises.find(e => e.id === task?.createdBy);

  if (!payment || !task || !enterprise) {
    return <div className="text-red-600">Paiement non trouvé</div>;
  }

  const handleConfirm = () => {
    if (!user) return;

    updatePayment(paymentId, { status: 'confirmed', confirmedAt: new Date().toISOString() });

    // Notifier l'entreprise
    addNotification({
      userId: enterprise.id,
      title: 'Paiement confirmé',
      message: `${user.name} a confirmé le paiement pour la tâche "${task.title}".`,
      type: 'success',
      read: false
    });

    alert('Paiement confirmé avec succès !');
    onConfirmed();
  };

  const handleDispute = () => {
    if (!user || !disputeReason.trim()) {
      alert('Veuillez fournir une raison pour contester le paiement');
      return;
    }

    updatePayment(paymentId, { 
      status: 'disputed',
      disputeReason: disputeReason
    });

    // Notifier l'entreprise
    addNotification({
      userId: enterprise.id,
      title: 'Paiement contesté',
      message: `${user.name} a contesté le paiement pour la tâche "${task.title}". Raison: ${disputeReason}`,
      type: 'warning',
      read: false
    });

    alert('Litige signalé. Un administrateur va examiner votre cas.');
    setShowDisputeModal(false);
    setDisputeReason('');
    onConfirmed();
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      disputed: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      pending: 'En attente de confirmation',
      confirmed: 'Confirmé',
      disputed: 'Contesté'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Confirmation de paiement</h3>
          <p className="text-sm text-gray-600">Tâche: {task.title}</p>
        </div>
        {getStatusBadge(payment.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Détails du paiement</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Montant:</span>
              <span className="font-medium">${payment.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Méthode:</span>
              <span className="font-medium">{payment.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date(payment.paidAt).toLocaleDateString()}</span>
            </div>
            {payment.transactionRef && (
              <div className="flex justify-between">
                <span className="text-gray-600">Référence:</span>
                <span className="font-medium">{payment.transactionRef}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Entreprise</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nom:</span>
              <span className="font-medium">{enterprise.name}</span>
            </div>
            {enterprise.role === 'enterprise' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Entreprise:</span>
                <span className="font-medium">{(enterprise as Enterprise).companyName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {payment.proof && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Preuve de paiement</h4>
          <div className="border rounded-lg p-4">
            {payment.proof.endsWith('.pdf') ? (
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <a 
                  href={payment.proof} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Voir la preuve de paiement
                </a>
              </div>
            ) : (
              <img 
                src={payment.proof} 
                alt="Preuve de paiement" 
                className="max-w-full h-auto rounded-lg"
              />
            )}
          </div>
        </div>
      )}

      {payment.status === 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Check size={20} />
            <span>Confirmer le paiement</span>
          </button>
          <button
            onClick={() => setShowDisputeModal(true)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <X size={20} />
            <span>Contester</span>
          </button>
        </div>
      )}

      {/* Modal de contestation */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold">Contester le paiement</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Veuillez expliquer pourquoi vous contestez ce paiement. Un administrateur examinera votre cas.
            </p>

            <textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Ex: Montant insuffisant, preuve invalide, paiement non reçu..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              required
            />

            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDispute}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Signaler le litige
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation; 