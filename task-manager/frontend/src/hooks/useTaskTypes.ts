import { useState, useEffect, useCallback } from 'react';
import { taskTypesApi } from '../services/api';
import { TaskType, TaskTypeInput, ApiError } from '../types';

export const useTaskTypes = () => {
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchTaskTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskTypesApi.getAll();
      setTaskTypes(response.data);
    } catch (err: any) {
      setError({ 
        message: 'Failed to fetch task types', 
        error: err.response?.data?.error || err.message 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaskTypes();
  }, [fetchTaskTypes]);

  const getTaskTypeById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskTypesApi.getById(id);
      return response.data;
    } catch (err: any) {
      setError({ 
        message: `Failed to fetch task type with ID ${id}`, 
        error: err.response?.data?.error || err.message 
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTaskType = useCallback(async (taskTypeData: TaskTypeInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskTypesApi.create(taskTypeData);
      setTaskTypes(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError({ 
        message: 'Failed to create task type', 
        error: err.response?.data?.error || err.message 
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskType = useCallback(async (id: number, taskTypeData: Partial<TaskTypeInput>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskTypesApi.update(id, taskTypeData);
      setTaskTypes(prev => prev.map(type => type.id === id ? response.data : type));
      return response.data;
    } catch (err: any) {
      setError({ 
        message: `Failed to update task type with ID ${id}`, 
        error: err.response?.data?.error || err.message 
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTaskType = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await taskTypesApi.delete(id);
      setTaskTypes(prev => prev.filter(type => type.id !== id));
      return true;
    } catch (err: any) {
      setError({ 
        message: `Failed to delete task type with ID ${id}`, 
        error: err.response?.data?.error || err.message 
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    taskTypes,
    loading,
    error,
    fetchTaskTypes,
    getTaskTypeById,
    createTaskType,
    updateTaskType,
    deleteTaskType
  };
}; 