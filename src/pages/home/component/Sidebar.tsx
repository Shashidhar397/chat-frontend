import React from 'react';
import { User } from '../../../types/User';

interface SidebarProps {
  users: User[];
  onUserClick: (user: User) => void; // Define the prop as a callback function
}

function Sidebar({ users, onUserClick }: SidebarProps) {
  return (
    <div className="h-screen w-64 bg-blue-500 p-4">
      <div className="text-white text-xl font-semibold mb-4">Chat Users</div>
      <ul className="space-y-2">
        {users.map((user: User) => (
          <li key={user.userName} className="hover:bg-blue-600">
            <button onClick={() => onUserClick(user)} className="text-white block p-2">
              {user.userName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
