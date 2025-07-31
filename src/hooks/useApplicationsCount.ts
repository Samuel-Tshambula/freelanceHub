import { useState, useEffect } from 'react';
import { applicationsAPI } from '../services/api';

export const useApplicationsCount = (taskId: string) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      if (!taskId) return;
      
      try {
        const response = await applicationsAPI.getTaskApplications(taskId);
        if (response.success) {
          const applications = Array.isArray(response.data.applications) ? response.data.applications : [];
          setCount(applications.length);
        }
      } catch (error) {
        setCount(0);
      }
    };

    fetchCount();
  }, [taskId]);

  return count;
};