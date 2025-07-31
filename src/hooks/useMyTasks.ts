import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';

export const useMyTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getMyTasks();
      if (response.success) {
        setTasks(Array.isArray(response.data.tasks) ? response.data.tasks : []);
      }
    } catch (error: any) {
      setError(error.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: fetchMyTasks
  };
};