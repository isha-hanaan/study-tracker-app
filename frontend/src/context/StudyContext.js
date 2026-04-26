import React, { createContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

export const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progressStats, setProgressStats] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState(null);
  const [subjectAnalytics, setSubjectAnalytics] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Plan actions
  const createPlan = useCallback(async (weekStartDate, subjects, goals) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/plans', {
        weekStartDate,
        subjects,
        goals
      });
      setPlans(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create plan';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch plans';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlan = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/plans/${planId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch plan';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlan = useCallback(async (planId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/plans/${planId}`, data);
      setPlans(prev =>
        prev.map(p => (p._id === planId ? response.data : p))
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update plan';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePlan = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/plans/${planId}`);
      setPlans(prev => prev.filter(p => p._id !== planId));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete plan';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Task actions
  const createTask = useCallback(async (planId, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/tasks/plan/${planId}`, taskData);
      setTasks(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create task';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTasks = useCallback(async (status = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = status ? `/tasks?status=${status}` : '/tasks';
      const response = await api.get(url);
      setTasks(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlanTasks = useCallback(async (planId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tasks/plan/${planId}`);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/tasks/${taskId}`, data);
      setTasks(prev =>
        prev.map(t => (t._id === taskId ? response.data : t))
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update task';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete task';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Progress actions
  const getProgressStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/progress/stats');
      setProgressStats(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch stats';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeeklyProgress = useCallback(async (weekStartDate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/progress/weekly', {
        params: { weekStartDate }
      });
      setWeeklyProgress(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch weekly progress';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSubjectAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/progress/subjects');
      setSubjectAnalytics(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch analytics';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrendData = useCallback(async (daysBack = 30) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/progress/trends', {
        params: { daysBack }
      });
      setTrendData(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch trend data';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load plans on mount
  useEffect(() => {
    getPlans();
  }, []);

  return (
    <StudyContext.Provider
      value={{
        plans,
        tasks,
        progressStats,
        weeklyProgress,
        subjectAnalytics,
        trendData,
        loading,
        error,
        createPlan,
        getPlans,
        getPlan,
        updatePlan,
        deletePlan,
        createTask,
        getTasks,
        getPlanTasks,
        updateTask,
        deleteTask,
        getProgressStats,
        getWeeklyProgress,
        getSubjectAnalytics,
        getTrendData
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};
