"use client";

import { useState } from 'react';
import Chat from '@/components/Chat';
import ConversationList from '@/components/ConversationList';
import { useProject } from '@/contexts/ProjectContext';

export default function Home() {
  const { conversations } = useProject();
  const [selectedConversationId, setSelectedConversationId] = useState<string>();

  // Create initial conversation if none exists
  if (conversations.length === 0) {
    return (
      <main className="flex h-screen">
        <div className="w-80 flex-shrink-0">
          <ConversationList
            onSelect={setSelectedConversationId}
            selectedId={selectedConversationId}
          />
        </div>
      </main>
    );
  }

  // Show selected conversation or first conversation
  const conversationId = selectedConversationId || conversations[0].id;

  return (
    <main className="flex h-screen">
      <div className="w-80 flex-shrink-0">
        <ConversationList
          onSelect={setSelectedConversationId}
          selectedId={conversationId}
        />
      </div>
      <div className="flex-1">
        <Chat key={conversationId} conversationId={conversationId} />
      </div>
    </main>
  );
}
