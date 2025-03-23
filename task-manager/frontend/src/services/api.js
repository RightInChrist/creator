import axios from 'axios';

// Base URL for API requests - Handle different environments
let API_URL;

// Get the environment
if (process.env.NODE_ENV === 'production') {
  API_URL = 'http://backend:5000/api';
} else {
  // For Expo in development, we need to use the mapped port from docker-compose
  // This will work when running in the Docker container
  API_URL = 'http://backend:5000/api';
  
  // For mobile devices/emulators, use the local IP or hostname
  if (process.env.EXPO_PUBLIC_API_URL) {
    API_URL = process.env.EXPO_PUBLIC_API_URL;
  }
}

console.log('Using API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Task Types API
export const taskTypesApi = {
  // Get all task types
  getAll: async () => {
    try {
      const response = await api.get('/task-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching task types:', error);
      throw error;
    }
  },
  
  // Get task type by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/task-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task type with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create new task type
  create: async (taskType) => {
    try {
      const response = await api.post('/task-types', taskType);
      return response.data;
    } catch (error) {
      console.error('Error creating task type:', error);
      throw error;
    }
  },
  
  // Update task type
  update: async (id, taskType) => {
    try {
      const response = await api.put(`/task-types/${id}`, taskType);
      return response.data;
    } catch (error) {
      console.error(`Error updating task type with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete task type
  delete: async (id) => {
    try {
      const response = await api.delete(`/task-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task type with ID ${id}:`, error);
      throw error;
    }
  }
};

// Tasks API
export const tasksApi = {
  // Get all tasks
  getAll: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  // Get task by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create new task
  create: async (task) => {
    try {
      const response = await api.post('/tasks', task);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  // Update task
  update: async (id, task) => {
    try {
      const response = await api.put(`/tasks/${id}`, task);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete task
  delete: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  }
};

export default {
  taskTypes: taskTypesApi,
  tasks: tasksApi
}; 