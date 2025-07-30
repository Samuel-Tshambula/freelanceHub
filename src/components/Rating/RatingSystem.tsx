import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Star, 
  Send, 
  X, 
  User, 
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface RatingSystemProps {
  taskId: string;
  onClose: () => void;
}

const RatingSystem: React.FC<RatingSystemProps> = ({ taskId, onClose }) => {
  const { user } = useAuth();
  const { tasks, agents, enterprises, addRating, addNotification } = useApp();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;

  // Déterminer qui évalue qui
  const isAgentRating = user?.role === 'agent';
  const ratedUser = isAgentRating 
    ? enterprises.find(e => e.id === task.createdBy)
    : agents.find(a => task.assignedTo?.includes(a.id));

  if (!ratedUser) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Veuillez donner une note');
      return;
    }

    if (!comment.trim()) {
      alert('Veuillez ajouter un commentaire');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ajouter l'évaluation
      addRating({
        taskId,
        fromUserId: user!.id,
        toUserId: ratedUser.id,
        rating,
        comment: comment.trim()
      });

      // Notifier l'utilisateur évalué
      addNotification({
        userId: ratedUser.id,
        title: 'Nouvelle évaluation reçue',
        message: `${user!.name} vous a évalué pour la tâche "${task.title}".`,
        type: 'info',
        read: false
      });

      alert('Évaluation envoyée avec succès !');
      onClose();
    } catch (error) {
      alert('Erreur lors de l\'envoi de l\'évaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive = true) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => interactive && setRating(i + 1)}
        className={`h-8 w-8 ${interactive ? 'cursor-pointer' : ''} ${
          i < currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
        disabled={!interactive}
      >
        <Star />
      </button>
    ));
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: 'Très décevant',
      2: 'Décevant',
      3: 'Moyen',
      4: 'Bon',
      5: 'Excellent'
    };
    return labels[rating as keyof typeof labels] || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Évaluer la collaboration</h2>
              <p className="text-gray-600 mt-1">
                Partagez votre expérience pour aider la communauté
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Informations sur la tâche */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Terminée le {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Statut: Terminée</span>
              </div>
            </div>
          </div>

          {/* Informations sur l'utilisateur évalué */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-3">
                {isAgentRating ? (
                  <Building2 className="h-6 w-6 text-blue-600" />
                ) : (
                  <User className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{ratedUser.name}</h4>
                <p className="text-sm text-gray-600">
                  {isAgentRating ? 'Entreprise' : 'Freelance'}
                </p>
              </div>
            </div>
          </div>

          {/* Système de notation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Note globale *
            </label>
            <div className="flex items-center space-x-2 mb-2">
              {renderStars(rating)}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">{getRatingLabel(rating)}</p>
            )}
          </div>

          {/* Commentaire */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Décrivez votre expérience avec ${ratedUser.name}...`}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                Soyez constructif et respectueux dans vos commentaires
              </p>
              <span className="text-xs text-gray-500">
                {comment.length}/500
              </span>
            </div>
          </div>

          {/* Critères spécifiques */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Critères d'évaluation</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Communication</span>
                <div className="flex">
                  {renderStars(Math.min(rating, 4), false)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Qualité du travail</span>
                <div className="flex">
                  {renderStars(Math.min(rating, 5), false)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Respect des délais</span>
                <div className="flex">
                  {renderStars(Math.min(rating, 4), false)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Professionnalisme</span>
                <div className="flex">
                  {renderStars(Math.min(rating, 5), false)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Envoi...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Envoyer l'évaluation</span>
                </>
              )}
            </button>
          </div>

          {/* Informations importantes */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Votre évaluation sera visible publiquement sur le profil de {ratedUser.name}</li>
                  <li>Les évaluations sont modérées pour maintenir la qualité de la communauté</li>
                  <li>Vous ne pourrez pas modifier votre évaluation après l'envoi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingSystem; 