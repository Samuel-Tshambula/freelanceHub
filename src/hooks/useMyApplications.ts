import { useState, useEffect } from 'react';
import { applicationsAPI } from '../services/api';

export const useMyApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getMyApplications();
      console.log('My applications response:', response);
      if (response.success) {
        const apps = Array.isArray(response.data.applications) ? response.data.applications : [];
        console.log('Setting applications:', apps);
        setApplications(apps);
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError(error.message);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      await applicationsAPI.deleteApplication(applicationId);
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      return true;
    } catch (error: any) {
      throw error;
    }
  };

  const addApplication = (application: any) => {
    console.log('Adding application:', application);
    setApplications(prev => {
      const updated = [...prev, application];
      console.log('Updated applications:', updated);
      return updated;
    });
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    refetch: fetchMyApplications,
    deleteApplication,
    addApplication
  };
};