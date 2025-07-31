const API_BASE_URL = 'http://localhost:5500/api';

// Configuration des headers par défaut
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Fonction utilitaire pour les requêtes API
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur API');
    }

    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

// Services d'authentification
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response;
  },

  register: async (userData: any) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.success) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getProfile: async () => {
    return await apiRequest('/auth/me');
  },

  googleSuccess: async (token: string) => {
    const response = await apiRequest('/auth/google/success', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
    
    if (response.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  completeProfile: async (profileData: any) => {
    const response = await apiRequest('/auth/complete-profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
    
    if (response.success) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }
};

// Services des tâches
export const tasksAPI = {
  getTasks: async (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return await apiRequest(`/tasks${queryParams}`);
  },

  getTask: async (id: string) => {
    return await apiRequest(`/tasks/${id}`);
  },

  createTask: async (taskData: any) => {
    return await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  updateTask: async (id: string, taskData: any) => {
    return await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  },

  deleteTask: async (id: string) => {
    return await apiRequest(`/tasks/${id}`, {
      method: 'DELETE'
    });
  },

  getMyTasks: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return await apiRequest(`/tasks/my-tasks?${params}`);
  },

  getAssignedTasks: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return await apiRequest(`/tasks/assigned-tasks?${params}`);
  }
};

// Services des candidatures
export const applicationsAPI = {
  createApplication: async (applicationData: any) => {
    return await apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  getMyApplications: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return await apiRequest(`/applications/my-applications?${params}`);
  },

  getTaskApplications: async (taskId: string, page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return await apiRequest(`/applications/task/${taskId}?${params}`);
  },

  getApplication: async (id: string) => {
    return await apiRequest(`/applications/${id}`);
  },

  updateApplicationStatus: async (id: string, status: string, notes?: string) => {
    return await apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  },

  updateApplication: async (id: string, applicationData: any) => {
    return await apiRequest(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData)
    });
  },

  deleteApplication: async (id: string) => {
    return await apiRequest(`/applications/${id}`, {
      method: 'DELETE'
    });
  }
};

// Services des paiements
export const paymentsAPI = {
  getPayments: async (page = 1, limit = 10, status?: string, method?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    if (method) params.append('method', method);
    return await apiRequest(`/payments?${params}`);
  },

  getPayment: async (id: string) => {
    return await apiRequest(`/payments/${id}`);
  },

  createPayment: async (paymentData: any) => {
    return await apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },

  confirmPayment: async (id: string) => {
    return await apiRequest(`/payments/${id}/confirm`, {
      method: 'PUT'
    });
  },

  disputePayment: async (id: string, disputeReason: string) => {
    return await apiRequest(`/payments/${id}/dispute`, {
      method: 'PUT',
      body: JSON.stringify({ disputeReason })
    });
  },

  getPaymentStatistics: async (period = 'all') => {
    return await apiRequest(`/payments/statistics?period=${period}`);
  }
};

// Services des notifications
export const notificationsAPI = {
  getNotifications: async (page = 1, limit = 20, type?: string, read?: boolean) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (type) params.append('type', type);
    if (read !== undefined) params.append('read', read.toString());
    return await apiRequest(`/notifications?${params}`);
  },

  getNotification: async (id: string) => {
    return await apiRequest(`/notifications/${id}`);
  },

  getUnreadCount: async () => {
    return await apiRequest('/notifications/unread-count');
  },

  markAsRead: async (id: string) => {
    return await apiRequest(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  markAllAsRead: async () => {
    return await apiRequest('/notifications/read-all', {
      method: 'PUT'
    });
  },

  deleteNotification: async (id: string) => {
    return await apiRequest(`/notifications/${id}`, {
      method: 'DELETE'
    });
  },

  deleteAllNotifications: async (type?: string, read?: boolean) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (read !== undefined) params.append('read', read.toString());
    return await apiRequest(`/notifications?${params}`, {
      method: 'DELETE'
    });
  }
};

// Services des utilisateurs
export const usersAPI = {
  getProfile: async () => {
    return await apiRequest('/users/profile');
  },

  updateProfile: async (userData: any) => {
    return await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  getUser: async (id: string) => {
    return await apiRequest(`/users/${id}`);
  },

  getAgents: async (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
    }
    return await apiRequest(`/users/agents?${params}`);
  },

  getEnterprises: async (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
    }
    return await apiRequest(`/users/enterprises?${params}`);
  },

  getUserTasks: async (id: string, page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return await apiRequest(`/users/${id}/tasks?${params}`);
  },

  getUserRatings: async (id: string, page = 1, limit = 10) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    return await apiRequest(`/users/${id}/ratings?${params}`);
  }
};

// Services des évaluations
export const ratingsAPI = {
  createRating: async (ratingData: any) => {
    return await apiRequest('/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData)
    });
  },

  getRatings: async (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
    }
    return await apiRequest(`/ratings?${params}`);
  },

  getRating: async (id: string) => {
    return await apiRequest(`/ratings/${id}`);
  },

  updateRating: async (id: string, ratingData: any) => {
    return await apiRequest(`/ratings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ratingData)
    });
  },

  deleteRating: async (id: string) => {
    return await apiRequest(`/ratings/${id}`, {
      method: 'DELETE'
    });
  },

  getRatingStatistics: async (userId: string) => {
    return await apiRequest(`/ratings/statistics?userId=${userId}`);
  }
};