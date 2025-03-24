"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Project, Conversation } from '@/types';

interface ProjectContextType {
  currentProject: Project;
  conversations: Conversation[];
  setCurrentProject: (project: Project) => void;
  addConversation: (title: string) => Conversation;
  updateConversation: (conversation: Conversation) => void;
}

// Default project with stable timestamp
const defaultProject: Project = {
  id: 'default',
  name: 'New Project',
  description: 'A new project for requirements gathering',
  createdAt: 1700000000000, // Use a stable timestamp
};

const ProjectContext = createContext<ProjectContextType>({
  currentProject: defaultProject,
  conversations: [],
  setCurrentProject: () => {},
  addConversation: () => ({ 
    id: '', 
    projectId: '', 
    title: '', 
    messages: [], 
    createdAt: 0, 
    updatedAt: 0 
  }),
  updateConversation: () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState(defaultProject);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Update project timestamp on the client side only
  useEffect(() => {
    setProject(prev => ({
      ...prev,
      createdAt: Date.now(),
    }));
  }, []);

  const addConversation = (title: string): Conversation => {
    const now = Date.now();
    const newConversation: Conversation = {
      id: `conv-${now}`,
      projectId: project.id,
      title: title || 'New Conversation',
      messages: [{
        id: 'welcome',
        role: 'agent',
        content: `Hello! I'm the Product Manager working on gathering requirements for the "${project.name}" project. How can I help you today?`,
        name: 'Product Manager',
        timestamp: now,
      }],
      createdAt: now,
      updatedAt: now,
    };

    setConversations(prev => [...prev, newConversation]);
    return newConversation;
  };

  const updateConversation = (updatedConversation: Conversation) => {
    setConversations(prev => 
      prev.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv)
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        currentProject: project,
        conversations,
        setCurrentProject: setProject,
        addConversation,
        updateConversation,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
} 