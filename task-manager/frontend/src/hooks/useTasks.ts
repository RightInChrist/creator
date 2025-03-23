import { useState, useEffect, useCallback } from 'react';
import { tasksApi } from '../services/api';
import { Task, TaskInput, ApiError } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getAll();
      setTasks(response.data);
    } catch (err: any) {
      setError({ 
        message: 'Failed to fetch tasks', 
        error: err.response?.data?.error || err.message 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getTaskById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getById(id);
      return response.data;
    } catch (err: any) {
      setError({ 
        message: `Failed to fetch task with ID ${id}`, 
        error: err.response?.data?.error || err.message 
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: TaskInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.create(taskData);
      setTasks(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError({ 
        message: 'Failed to create task', 
        error: err.response?.data?.error || err.message 
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: number, taskData: Partial<TaskInput>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.update(id, taskData);
      setTasks(prev => prev.map(task => task.id === id ? response.data : task));
      return response.data;
    } catch (err: any) {
      setError({ 
        message: `Failed to update task with ID ${id}`, 
        error: err.response?.data?.error || err.message 
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await tasksApi.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      return true;
    } catch (err: any) {
      setError({ 
        message: `Failed to delete task with ID ${id}`, 
        error: err.response?.data?.error || err.message 
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
  };
}; 