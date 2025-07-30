import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { X, Upload, DollarSign, Calendar } from 'lucide-react';

interface PaymentModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSubmitted: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  taskId, 
  isOpen, 
  onClose, 
  onPaymentSubmitted 
}) => {
  const { user } = useAuth();
  const { tasks, addPayment, addNotification } = useApp();
  
  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    transactionRef: '',
    paymentDate: '',
    proof: null as File | null
  });

  const task = tasks.find(t => t.id === taskId);
  const assignedAgents = task?.assignedTo || [];

  const paymentMethods = [
    'Orange Money',
    'Airtel Money', 
    'M-Pesa',
    'Virement bancaire',
    'PayPal',
    'Autre'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !task) return;

    if (!formData.amount || !formData.method || !formData.paymentDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Simuler l'upload du fichier
    const proofUrl = formData.proof ? URL.createObjectURL(formData.proof) : '';

    addPayment({
      taskId,
      amount: parseFloat(formData.amount),
      method: formData.method,
      proof: proofUrl,
      transactionRef: formData.transactionRef,
      status: 'pending',
      paidAt: formData.paymentDate
    });

    // Notifier les agents assignés
    assignedAgents.forEach(agentId => {
      addNotification({
        userId: agentId,
        title: 'Paiement déclaré',
        message: `${user.name} a déclaré avoir effectué le paiement pour la tâche "${task.title}". Veuillez vérifier la preuve et confirmer.`,
        type: 'info',
        read: false
      });
    });

    alert('Paiement déclaré avec succès ! Les agents ont été notifiés.');
    onPaymentSubmitted();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, proof: file }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Marquer comme payée</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tâche
            </label>
            <p className="text-gray-600 text-sm">{task?.title}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant payé *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode de paiement *
            </label>
            <select
              value={formData.method}
              onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un mode</option>
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date du paiement *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Référence de transaction (optionnel)
            </label>
            <input
              type="text"
              value={formData.transactionRef}
              onChange={(e) => setFormData(prev => ({ ...prev, transactionRef: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Numéro de transaction"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preuve de paiement *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
                id="proof-upload"
                required
              />
              <label htmlFor="proof-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {formData.proof ? formData.proof.name : 'Cliquez pour téléverser une preuve'}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, PDF (max 5MB)</p>
              </label>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Confirmer le paiement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal; 