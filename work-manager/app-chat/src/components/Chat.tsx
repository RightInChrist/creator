"use client";

import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import ChatMessage from './ChatMessage';
import { useProject } from '@/contexts/ProjectContext';
import { Message } from '@/types';

interface ChatProps {
  conversationId: string;
}

export default function Chat({ conversationId }: ChatProps) {
  const { currentProject, conversations, updateConversation } = useProject();
  const conversation = conversations.find(c => c.id === conversationId);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversation || !input.trim() || isLoading) return;

    const now = Date.now();
    const userMessage: Message = {
      id: `user-${now}`,
      role: 'human',
      content: input.trim(),
      name: 'You',
      timestamp: now,
    };

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage],
      updatedAt: now,
    };

    updateConversation(updatedConversation);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to backend
      const response = await new Promise<Message>((resolve) => {
        setTimeout(() => {
          const responseTime = Date.now();
          resolve({
            id: `pm-${responseTime}`,
            role: 'agent',
            content: 'Thank you for sharing that. Could you tell me more about your specific goals and requirements?',
            name: 'Product Manager',
            timestamp: responseTime,
          });
        }, 1000);
      });

      updateConversation({
        ...updatedConversation,
        messages: [...updatedConversation.messages, response],
        updatedAt: response.timestamp,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // TODO: Add error handling UI
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversation) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-none bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">{conversation.title}</h1>
          <p className="text-sm text-gray-500">{currentProject.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {conversation.messages.map((message) => (
            <ChatMessage key={message.id} {...message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-none bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 