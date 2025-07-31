import { useState, useEffect } from 'react';
import { applicationsAPI } from '../services/api';

export const useTaskApplications = (taskId: string) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      const response = await applicationsAPI.getTaskApplications(taskId);
      if (response.success) {
        setApplications(Array.isArray(response.data.applications) ? response.data.applications : []);
      }
    } catch (error: any) {
      setError(error.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [taskId]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications
  };
};