export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface Message {
  id: string;
  role: 'agent' | 'human';
  content: string;
  name: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  projectId: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
} 