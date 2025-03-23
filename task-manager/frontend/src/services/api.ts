import axios, { AxiosResponse } from 'axios';
import { Task, TaskInput, TaskType, TaskTypeInput } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const BASE_API = process.env.REACT_APP_BASE_API || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Tasks API
export const tasksApi = {
  getAll: (): Promise<AxiosResponse<Task[]>> => {
    return api.get(`${BASE_API}/tasks`);
  },
  
  getById: (id: number): Promise<AxiosResponse<Task>> => {
    return api.get(`${BASE_API}/tasks/${id}`);
  },
  
  create: (task: TaskInput): Promise<AxiosResponse<Task>> => {
    return api.post(`${BASE_API}/tasks`, task);
  },
  
  update: (id: number, task: Partial<TaskInput>): Promise<AxiosResponse<Task>> => {
    return api.put(`${BASE_API}/tasks/${id}`, task);
  },
  
  delete: (id: number): Promise<AxiosResponse<{ message: string }>> => {
    return api.delete(`${BASE_API}/tasks/${id}`);
  }
};

// Task Types API
export const taskTypesApi = {
  getAll: (): Promise<AxiosResponse<TaskType[]>> => {
    return api.get(`${BASE_API}/task-types`);
  },
  
  getById: (id: number): Promise<AxiosResponse<TaskType>> => {
    return api.get(`${BASE_API}/task-types/${id}`);
  },
  
  create: (taskType: TaskTypeInput): Promise<AxiosResponse<TaskType>> => {
    return api.post(`${BASE_API}/task-types`, taskType);
  },
  
  update: (id: number, taskType: Partial<TaskTypeInput>): Promise<AxiosResponse<TaskType>> => {
    return api.put(`${BASE_API}/task-types/${id}`, taskType);
  },
  
  delete: (id: number): Promise<AxiosResponse<{ message: string }>> => {
    return api.delete(`${BASE_API}/task-types/${id}`);
  }
};

export default api; 