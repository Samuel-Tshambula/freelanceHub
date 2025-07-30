import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  Search
} from 'lucide-react';

interface TaskListProps {
  setCurrentPage?: (page: string) => void;
}

const TaskList: React.FC<TaskListProps> = () => {
  const { user } = useAuth();
  const { tasks, applications, addApplication, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [budgetRange, setBudgetRange] = useState('');

  // Filter tasks based on user role
  const availableTasks = user?.role === 'agent' 
    ? tasks.filter(task => task.status === 'open')
    : tasks;

  // Apply filters
  const filteredTasks = availableTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = !selectedSkill || task.skills.includes(selectedSkill);
    
    const matchesBudget = !budgetRange || 
                         (budgetRange === 'low' && task.budget <= 200) ||
                         (budgetRange === 'medium' && task.budget > 200 && task.budget <= 500) ||
                         (budgetRange === 'high' && task.budget > 500);
    
    return matchesSearch && matchesSkill && matchesBudget;
  });

  // Get all unique skills for filter
  const allSkills = [...new Set(tasks.flatMap(task => task.skills))];

  const handleApply = (taskId: string) => {
    if (!user) return;
    
    // Check if already applied
    const existingApplication = applications.find(
      app => app.taskId === taskId && app.agentId === user.id
    );
    
    if (existingApplication) {
      alert('Vous avez déjà postulé à cette tâche');
      return;
    }

    addApplication({
      taskId,
      agentId: user.id,
      message: 'Je suis intéressé par cette tâche et j\'ai les compétences requises.',
      status: 'pending'
    });

    // Add notification for enterprise
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      addNotification({
        userId: task.createdBy,
        title: 'Nouvelle candidature',
        message: `${user.name} a postulé pour votre tâche "${task.title}"`,
        type: 'info',
        read: false
      });
    }

    alert('Candidature envoyée avec succès !');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'agent' ? 'Tâches disponibles' : 'Toutes les tâches'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {filteredTasks.length} tâche(s) trouvée(s)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Titre ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compétence
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les compétences</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget
            </label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les budgets</option>
              <option value="low">≤ 200$</option>
              <option value="medium">201$ - 500$</option>
              <option value="high">{'>'} 500$</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSkill('');
                setBudgetRange('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.map((task) => {
          const hasApplied = applications.some(
            app => app.taskId === task.id && app.agentId === user?.id
          );

          return (
            <div key={task.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>  
                  {getStatusBadge(task.status)}
                </div>
                <div className="flex items-center text-green-600 ml-4">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-xl font-bold">{task.budget}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {task.duration}
                </div>
                {task.deadline && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Échéance: {new Date(task.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {task.skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {skill}
                  </span>
                ))}
              </div>

              <hr className="my-4" />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Publié le {new Date(task.createdAt).toLocaleDateString()}
                </div>
                
                {user?.role === 'agent' && task.status === 'open' && (
                  <button
                    onClick={() => handleApply(task.id)}
                    disabled={hasApplied}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      hasApplied
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {hasApplied ? 'Déjà postulé' : 'Postuler'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche trouvée</h3>
          <p className="text-gray-600">Essayez de modifier vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;