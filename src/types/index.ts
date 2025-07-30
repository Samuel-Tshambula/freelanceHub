export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'enterprise' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Agent extends User {
  role: 'agent';
  bio?: string;
  skills: string[];
  rating: number;
  completedTasks: number;
  paymentMethod?: string;
  paymentNumber?: string;
}

export interface Enterprise extends User {
  role: 'enterprise';
  companyName: string;
  sector: string;
  description?: string;
  website?: string;
  logo?: string;
  rating: number;
  postedTasks: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  budget: number;
  duration: string;
  skills: string[];
  requiredProofs: string[];
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'paid';
  createdBy: string;
  assignedTo?: string[];
  createdAt: string;
  deadline?: string;
}

export interface Application {
  id: string;
  taskId: string;
  agentId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Proof {
  id: string;
  taskId: string;
  agentId: string;
  files: string[];
  description: string;
  status: 'submitted' | 'approved' | 'rejected';
  feedback?: string;
  submittedAt: string;
}

export interface Payment {
  id: string;
  taskId: string;
  amount: number;
  method: string;
  proof?: string;
  transactionRef?: string;
  status: 'pending' | 'confirmed' | 'disputed';
  paidAt: string;
  confirmedAt?: string;
  disputeReason?: string;
}

export interface Rating {
  id: string;
  taskId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}