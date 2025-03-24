"use client";

import { UserCircleIcon, UserIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { Message } from '@/types';

export default function ChatMessage({ role, content, name, timestamp }: Message) {
  const isAgent = role === 'agent';
  const isHuman = role === 'human';
  
  const formattedTime = useMemo(() => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [timestamp]);
  
  return (
    <div className={`flex ${isHuman ? 'justify-end' : 'justify-start'} mb-4`}>
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
            <span className={`text-sm font-medium ${isHuman ? 'text-blue-200' : 'text-gray-400'}`}>
              {name}
            </span>
            <span className={`text-xs ${isHuman ? 'text-blue-200' : 'text-gray-500'}`}>
              {formattedTime}
            </span>
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