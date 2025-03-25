"use client";

import { useState } from 'react';
import { ChatBubbleLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useProject } from '@/contexts/ProjectContext';

interface ConversationListProps {
  onSelect: (conversationId: string) => void;
  selectedId?: string;
}

export default function ConversationList({ onSelect, selectedId }: ConversationListProps) {
  const { currentProject, conversations, addConversation } = useProject();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleNewConversation = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (newTitle.trim()) {
      const conversation = addConversation(newTitle.trim());
      onSelect(conversation.id);
      setNewTitle('');
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-100">{currentProject.name}</h2>
        <p className="text-sm text-gray-400">{currentProject.description}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 ${
                selectedId === conversation.id ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
              }`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium truncate">{conversation.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Conversation name..."
              className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNewConversation();
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                  setNewTitle('');
                }
              }}
            />
            <button
              onClick={handleNewConversation}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={handleNewConversation}
            className="w-full rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            New Conversation
          </button>
        )}
      </div>
    </div>
  );
} 