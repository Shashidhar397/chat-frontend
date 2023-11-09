import React from 'react';
import { User } from '../../../types/User';

interface Message {
  id: number;
  sender: User;
  content: string;
  timestamp: string;
}

interface ChatPageProps {
  user: User | null; // Make user nullable to handle no user selected
  //recipient: User | null; // Make recipient nullable to handle no recipient selected
  //messages: Message[];
}

function ChatPage({ user }: ChatPageProps) {
  if (!user) {
    return (
      <div className="h-screen bg-white p-4">
        <div>Please select a user to start a chat.</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white p-4">
      {/* Rest of the component to display the chat */}
      {user.userName}
    </div>
  );
}

export default ChatPage;
