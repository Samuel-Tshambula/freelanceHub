import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async (filters?: any) => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks(filters);
      console.log('API Response:', response);
      if (response.success) {
        const tasksData = response.data?.tasks || response.data || [];
        console.log('Tasks data:', tasksData);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } else {
        console.log('API response not successful:', response);
        setTasks([]);
      }
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      setError(error.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: any) => {
    try {
      const response = await tasksAPI.createTask(taskData);
      if (response.success) {
        setTasks(prev => [response.data, ...prev]);
        return response.data;
      }
    } catch (error: any) {
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    refetch: fetchTasks
  };
};