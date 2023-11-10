import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Button from '../../../components/Button';
import { ChatSessionResponse, Message, User } from '../../../types/type';
import { get } from '../../../utils/apiUtils';
import ChatPage from './ChatPage';
import Sidebar from './Sidebar';
import Stomp, { Client } from 'stompjs';
import SockJS from 'sockjs-client';


const initialStompClient: Client | null = null;

function Home() {



  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const location = useLocation();
  const userData = location.state.userData;

  const users: User[] = [
  ];
  const [usersList, setUsersList] = useState(users);
  const [stompClient, setStompClient] = useState(initialStompClient);
  const [userMessages, setUserMessages] = useState<{ [uuid: string]: Message[] }>({});

  const handleSentMessages = (message: Message) => {
    const newMessage = {
      uuid: message.uuid,
      sender: message.sender,
      recipient: message.recipient,
      content: message.content
    }
    setUserMessages((prevUserMessages) => {
      const recipientUuid = newMessage.recipient?.uuid || '';
      const senderUuid = newMessage.sender?.uuid || '';

      return {
        ...prevUserMessages,
        [recipientUuid]: [...(prevUserMessages[recipientUuid] || []), newMessage],
      };
    });
  }

  useEffect(() => {
    // Create a SockJS connection to your WebSocket server
    if (userData) {
      const sock = new SockJS('http://localhost:8081/ws');

      // Initialize the STOMP client
      const stomp = Stomp.over(sock);
      stomp.connect({}, () => {
        setStompClient(stomp);

        stomp.send("/chat-service/chat.addUser", {}, JSON.stringify({ uuid: userData.uuid, type: 'JOIN' }));

        get<ChatSessionResponse>("/getSession/" + userData.uuid, undefined, "http://localhost:8081").then(response => {
          // Subscribe to a chat topic
          stomp.subscribe('/chat-service-private/' + response.sessionId, (message) => {
            // Handle incoming messages
            const messageData = JSON.parse(message.body);

            if (!usersList.some(user => user.uuid === messageData.sender.uuid)) {
              setUsersList(prevUsersList => [...prevUsersList, messageData.sender]);
            }
            // Update messages for the recipient user
            setUserMessages((prevUserMessages) => ({
              ...prevUserMessages,
              [messageData.sender.uuid]: [...(prevUserMessages[messageData.sender.uuid] || []), messageData],
            }));
            
          });
        })


      });
    }
  }, [usersList, userData]);

  useEffect(() => {
    // Create a SockJS connection to your WebSocket server
    console.log("UserMessages: " + JSON.stringify(userMessages));
  }, [userMessages]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchUser = (event: any) => {
    if (searchTerm !== userData.email) {
      const searchResponse = get<User>("/users/searchUser?email=" + searchTerm);
      searchResponse.then(response => {
        console.log("Response : " + JSON.stringify(response));
        if (!usersList.some(user => user.uuid === response.uuid)) {
              setUsersList(prevUsersList => [...prevUsersList, response]);
            }

      })
    }

  };

  return (
    <div className="flex flex-col">
      <div className="bg-blue-500 text-white p-4">
        Welcome {userData.userName}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search users"
            className="px-2 py-1.5 rounded border border-gray-300 text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearchUser} className="bg-blue-700 text-white px-3 py-1 rounded">
            <i className="fas fa-search"></i> Search & Add
          </button>
        </div>
      </div>
      <div className="flex flex-1">
        <Sidebar users={usersList} onUserClick={handleUserClick} />
        <ChatPage user={userData} recipient={selectedUser} chatMessages={userMessages[selectedUser?.uuid || '']} onSendMessage={handleSentMessages} />
      </div>
    </div>
  );
}

export default Home