import { useState, useEffect } from 'react';
import { applicationsAPI } from '../services/api';

interface Application {
  id: string;
  taskId: string;
  agentId: string;
  status: 'pending' | 'accepted' | 'rejected';
  proposedPrice: number;
  coverLetter: string;
  estimatedDuration: string;
  createdAt: string;
  task: {
    id: string;
    title: string;
    description: string;
    budget: number;
    location: string;
    duration: string;
    status: string;
  };
}

export const useMyApplications = (page: number = 1, limit: number = 10, status?: string) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await applicationsAPI.getMyApplications(page, limit, status);
      
      if (response.success) {
        setApplications(response.data.applications || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalCount(response.data.pagination?.total || 0);
      } else {
        setError(response.message || 'Erreur lors du chargement');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des candidatures');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, limit, status]);

  const refetch = () => {
    fetchApplications();
  };

  return {
    applications,
    loading,
    error,
    totalPages,
    totalCount,
    refetch
  };
};