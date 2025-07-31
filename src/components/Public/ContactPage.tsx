import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ContactPageProps {
  setCurrentPage: (page: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: 'support', label: 'Support technique' },
    { value: 'billing', label: 'Facturation et paiements' },
    { value: 'dispute', label: 'Résolution de litiges' },
    { value: 'account', label: 'Problème de compte' },
    { value: 'feature', label: 'Suggestion de fonctionnalité' },
    { value: 'partnership', label: 'Partenariat' },
    { value: 'other', label: 'Autre' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', category: '', message: '' });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Message envoyé !</h2>
          <p className="text-gray-600 mb-6">
            Nous avons bien reçu votre message. Notre équipe vous répondra dans les 24h.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-3"
          >
            Envoyer un autre message
          </button>
          <button
            onClick={() => setCurrentPage('main-home')}
            className="w-full text-blue-600 hover:text-blue-800"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou problème.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nos coordonnées</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-gray-600">support@freelancehub.com</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Téléphone</div>
                    <div className="text-gray-600">+33 1 23 45 67 89</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Adresse</div>
                    <div className="text-gray-600">123 Rue de la Tech<br />75001 Paris, France</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Horaires de support</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">Lun - Ven : 9h - 18h</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">Sam : 10h - 16h</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Temps de réponse moyen : 2-4 heures
                </div>
              </div>
            </div>

            {/* FAQ rapide */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Besoin d'aide rapide ?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Consultez notre FAQ pour des réponses immédiates aux questions courantes.
              </p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Voir la FAQ →
              </button>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Envoyez-nous un message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Résumé de votre demande"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    placeholder="Décrivez votre problème ou votre question en détail..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {formData.message.length}/1000 caractères
                  </div>
                </div>

                {/* Avertissement pour litiges */}
                {formData.category === 'dispute' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>Résolution de litiges :</strong> Veuillez fournir tous les détails pertinents 
                        (ID de tâche, captures d'écran, communications) pour accélérer le traitement.
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;