import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { Plus, X, Upload, FileText } from 'lucide-react';

interface PostTaskProps {
  setCurrentPage: (page: string) => void;
}

const PostTask: React.FC<PostTaskProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();
  const { createTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    duration: '',
    deadline: '',
    skills: [] as string[],
    requiredProofs: [] as string[],
    attachments: [] as File[]
  });

  const [newSkill, setNewSkill] = useState('');
  const [newProof, setNewProof] = useState('');

  const availableSkills = [
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'PHP',
    'Design UI/UX', 'Marketing Digital', 'Rédaction', 'SEO', 
    'Réseaux Sociaux', 'Photographie', 'Montage Vidéo', 'Traduction'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!formData.title || !formData.description || !formData.budget || !formData.duration) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        duration: formData.duration,
        deadline: formData.deadline || undefined,
        skills: formData.skills.join(','),
        requiredProofs: formData.requiredProofs.join(',')
      });

      alert('Tâche publiée avec succès !');
      setCurrentPage('my-tasks');
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la publication de la tâche');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addProof = () => {
    if (newProof && !formData.requiredProofs.includes(newProof)) {
      setFormData(prev => ({
        ...prev,
        requiredProofs: [...prev.requiredProofs, newProof]
      }));
      setNewProof('');
    }
  };

  const removeProof = (proofToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requiredProofs: prev.requiredProofs.filter(proof => proof !== proofToRemove)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Publier une nouvelle tâche</h1>
          <p className="mt-1 text-sm text-gray-600">
            Créez une tâche détaillée pour attirer les meilleurs talents
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la tâche *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Développement d'une landing page moderne"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description détaillée *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={6}
              placeholder="Décrivez en détail ce que vous attendez, les livrables, les contraintes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget ($) *
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="500"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée estimée *
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Sélectionner une durée</option>
                <option value="1-3 heures">1-3 heures</option>
                <option value="4-8 heures">4-8 heures</option>
                <option value="1 jour">1 jour</option>
                <option value="2-3 jours">2-3 jours</option>
                <option value="4-7 jours">4-7 jours</option>
                <option value="1-2 semaines">1-2 semaines</option>
                <option value="3-4 semaines">3-4 semaines</option>
                <option value="1-2 mois">1-2 mois</option>
                <option value="Plus de 2 mois">Plus de 2 mois</option>
              </select>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fichiers de référence (optionnel)
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Ajoutez des images, PDF, Word, Excel pour aider les freelances à comprendre votre projet
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
                }}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Cliquez pour ajouter des fichiers ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, Word, Excel, Images (max 10MB par fichier)
                </p>
              </label>
            </div>

            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Fichiers ajoutés :</p>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          attachments: prev.attachments.filter((_, i) => i !== index)
                        }));
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date limite (optionnel)
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compétences requises
            </label>
            
            {/* Predefined skills */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Compétences populaires :</p>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    disabled={formData.skills.includes(skill)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      formData.skills.includes(skill)
                        ? 'bg-blue-100 text-blue-800 border-blue-300 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom skill input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Ajouter une compétence personnalisée"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))}
              />
              <button
                type="button"
                onClick={() => addSkill(newSkill)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Selected skills */}
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Required Proofs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preuves requises
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Spécifiez les livrables que l'agent devra fournir
            </p>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newProof}
                onChange={(e) => setNewProof(e.target.value)}
                placeholder="Ex: Code source, Screenshots, Rapport..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProof())}
              />
              <button
                type="button"
                onClick={addProof}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {formData.requiredProofs.length > 0 && (
              <div className="space-y-2">
                {formData.requiredProofs.map((proof, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="text-sm text-gray-700">{proof}</span>
                    <button
                      type="button"
                      onClick={() => removeProof(proof)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => setCurrentPage('dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Publication...' : 'Publier la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostTask;