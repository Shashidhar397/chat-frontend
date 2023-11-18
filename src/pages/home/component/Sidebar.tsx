import React from 'react';
import { ConversationsAndUser, User } from '../../../types/type';

interface SidebarProps {
  conversationsAndUser: ConversationsAndUser[];
  onUserClick: (conversationAndUser: ConversationsAndUser) => void; // Define the prop as a callback function
}

function Sidebar({ conversationsAndUser, onUserClick }: SidebarProps) {
  return (
    <div className="h-screen w-64 bg-blue-500 p-4">
      <div className="text-white text-xl font-semibold mb-4">Chat Users</div>
      <ul className="space-y-2">
        {conversationsAndUser.map((conversationAndUser: ConversationsAndUser) => (
          <li key={conversationAndUser.toUser.userName} className="hover:bg-blue-600">
            <button onClick={() => onUserClick(conversationAndUser)} className="text-white block p-2">
              {conversationAndUser.toUser.userName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
