import React, { useState } from 'react'
import Button from '../../../components/Button';
import { User } from '../../../types/User';
import ChatPage from './ChatPage';
import Sidebar from './Sidebar'


function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  

  const users: User[] = [
];
const [usersList, setUsersList] = useState(users);
const handleNewChatClick = () => {
  const newUser = {
    userName: "Random",
    email: "rand",
    userId: ""
  };
  const updatedUsersList = [...usersList, newUser];
  setUsersList(updatedUsersList);
};

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-blue-500 text-white p-4">
      <Button onClick={handleNewChatClick}>Add User</Button>

      </div>
      <div className="flex flex-1">
        <Sidebar users={usersList} onUserClick={handleUserClick} />
        <ChatPage user={selectedUser} />
      </div>
    </div>
  );
}

export default Home