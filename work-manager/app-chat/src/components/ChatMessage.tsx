"use client";

import { UserCircleIcon, UserIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';

interface ChatMessageProps {
  role: 'agent' | 'human';
  content: string;
  name: string;
  timestamp: number;
}

export default function ChatMessage({ role, content, name, timestamp }: ChatMessageProps) {
  const isAgent = role === 'agent';
  
  const formattedTime = useMemo(() => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }, [timestamp]);
  
  return (
    <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex ${isAgent ? 'flex-row' : 'flex-row-reverse'} max-w-[80%] items-start gap-3`}>
        <div className="flex-shrink-0">
          {isAgent ? (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-600" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>
        <div className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">{name}</span>
            <span className="text-xs text-gray-500">{formattedTime}</span>
          </div>
          <div className={`rounded-lg px-4 py-2 ${
            isAgent 
              ? 'bg-white border border-gray-200' 
              : 'bg-blue-600 text-white'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 