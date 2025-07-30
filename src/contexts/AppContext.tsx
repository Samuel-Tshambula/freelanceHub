import { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Application, Proof, Payment, Rating, Notification, Agent, Enterprise } from '../types';

interface AppContextType {
  tasks: Task[];
  applications: Application[];
  proofs: Proof[];
  payments: Payment[];
  ratings: Rating[];
  notifications: Notification[];
  agents: Agent[];
  enterprises: Enterprise[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addApplication: (application: Omit<Application, 'id' | 'createdAt'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  addProof: (proof: Omit<Proof, 'id' | 'submittedAt'>) => void;
  updateProof: (id: string, updates: Partial<Proof>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock data
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Samuel Tshambula',
    email: 'samuel@example.com',
    role: 'agent',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Développeur web full-stack avec 5 ans d\'expérience',
    skills: ['React', 'Node.js', 'TypeScript', 'Design UI/UX'],
    rating: 4.8,
    completedTasks: 47,
    paymentMethod: 'Orange Money',
    paymentNumber: '+243 89 123 4567',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Marie Kabila',
    email: 'marie@example.com',
    role: 'agent',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Spécialiste en marketing digital et création de contenu',
    skills: ['Marketing Digital', 'Rédaction', 'SEO', 'Réseaux Sociaux'],
    rating: 4.9,
    completedTasks: 32,
    paymentMethod: 'Airtel Money',
    paymentNumber: '+243 97 456 7890',
    createdAt: '2024-02-10T14:30:00Z'
  }
];

const mockEnterprises: Enterprise[] = [
  {
    id: '3',
    name: 'Jean Mukendi',
    email: 'jean@techcorp.cd',
    role: 'enterprise',
    companyName: 'TechCorp RDC',
    sector: 'Technologie',
    description: 'Entreprise de développement logiciel basée à Kinshasa',
    website: 'https://techcorp.cd',
    rating: 4.7,
    postedTasks: 15,
    createdAt: '2024-01-20T09:00:00Z'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Développement d\'une landing page moderne',
    description: 'Création d\'une page d\'accueil responsive avec animations et formulaire de contact pour une startup fintech.',
    budget: 500,
    duration: '5 jours',
    skills: ['React', 'Tailwind CSS', 'Design UI/UX'],
    requiredProofs: ['Code source', 'Screenshots', 'Lien de démonstration'],
    status: 'open',
    createdBy: '3',
    createdAt: '2024-03-15T10:00:00Z',
    deadline: '2024-03-25T23:59:59Z'
  },
  {
    id: '2',
    title: 'Campagne de marketing digital',
    description: 'Mise en place d\'une stratégie marketing complète sur les réseaux sociaux avec création de contenu.',
    budget: 300,
    duration: '2 semaines',
    skills: ['Marketing Digital', 'Création de contenu', 'Réseaux Sociaux'],
    requiredProofs: ['Rapport d\'analyse', 'Contenu créé', 'Métriques de performance'],
    status: 'assigned',
    createdBy: '3',
    assignedTo: ['2'],
    createdAt: '2024-03-10T14:30:00Z'
  }
];

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [applications, setApplications] = useState<Application[]>([]);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [agents] = useState<Agent[]>(mockAgents);
  const [enterprises] = useState<Enterprise[]>(mockEnterprises);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updates } : task));
  };

  const addApplication = (applicationData: Omit<Application, 'id' | 'createdAt'>) => {
    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setApplications(prev => [newApplication, ...prev]);
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  };

  const addProof = (proofData: Omit<Proof, 'id' | 'submittedAt'>) => {
    const newProof: Proof = {
      ...proofData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };
    setProofs(prev => [newProof, ...prev]);
  };

  const updateProof = (id: string, updates: Partial<Proof>) => {
    setProofs(prev => prev.map(proof => proof.id === id ? { ...proof, ...updates } : proof));
  };

  const addPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString(),
    };
    setPayments(prev => [newPayment, ...prev]);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(payment => payment.id === id ? { ...payment, ...updates } : payment));
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  };

  const addRating = (rating: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setRatings(prev => [newRating, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      tasks,
      applications,
      proofs,
      payments,
      ratings,
      notifications,
      agents,
      enterprises,
      addTask,
      updateTask,
      addApplication,
      updateApplication,
      addProof,
      updateProof,
      addPayment,
      updatePayment,
      addNotification,
      markNotificationAsRead,
      addRating,
    }}>
      {children}
    </AppContext.Provider>
  );
};