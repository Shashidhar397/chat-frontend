import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Button from '../../../components/Button';
import { ChatSessionResponse, Message, User } from '../../../types/type';
import { get } from '../../../utils/apiUtils';
import ChatPage from './ChatPage';
import Sidebar from './Sidebar';
import Stomp, { Client } from 'stompjs';
import SockJS from 'sockjs-client';
import Select from 'react-select';
import SearchBox from './SearchBox';


const initialStompClient: Client | null = null;

function Home() {



  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedOption, setSelectedOption] = useState<User | null>(null);

  const location = useLocation();
  const userData = location.state.userData;

  const users: User[] = [
  ];
  const [usersList, setUsersList] = useState(users);
  const [stompClient, setStompClient] = useState(initialStompClient);
  const [userMessages, setUserMessages] = useState<{ [uuid: string]: Message[] }>({});

  const handleSentMessages = (message: Message) => {
    console.log("Message" + JSON.stringify(message));
    const newMessage = {
      uuid: message.uuid,
      content: message.content,
      sender: message.sender,
      recipient: message.recipient,
      messageType: message.messageType,
      messageStatus: message.messageStatus
    }
    setUserMessages((prevUserMessages) => {

      return {
        ...prevUserMessages,
        [message.recipient.uuid]: [...(prevUserMessages[message.recipient.uuid] || []), newMessage],
      };
    });
  }

  useEffect(() => {
    // Create a SockJS connection to your WebSocket server
    if (userData) {
      const sock = new SockJS('http://localhost:8083/ws');

      // Initialize the STOMP client
      const stomp = Stomp.over(sock);
      stomp.connect({}, () => {
        setStompClient(stomp);

        stomp.send("/chat-service/chat.addUser", {}, JSON.stringify({ uuid: userData.uuid, type: 'JOIN' }));

        get<ChatSessionResponse>("/getSession/" + userData.uuid, undefined, "http://localhost:8083").then(response => {
          // Subscribe to a chat topic
          stomp.subscribe('/chat-service-private/' + response.sessionId, (message) => {
            // Handle incoming messages
            const messageData = JSON.parse(message.body);

            if (!usersList.some(user => user.uuid === messageData?.sender?.uuid)) {
              setUsersList(prevUsersList => [...prevUsersList, messageData?.sender]);
            }
            setUserMessages((prevUserMessages) => ({
              ...prevUserMessages,
              [messageData?.sender?.uuid]: [...(prevUserMessages[messageData?.sender?.uuid] || []), messageData],
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

  const handleSelectedUserFromSearch = (searchUser: User) => {
    console.log("Selected user: "+JSON.stringify(searchUser));
    console.log("usersList user: "+JSON.stringify(usersList));
    if (searchUser && !usersList.some(user => searchUser.uuid === user.uuid)) {
      console.log("coming here");
      setUsersList(prevUsersList => [...prevUsersList, searchUser]);
    }
    console.log("usersList user: "+JSON.stringify(usersList));
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchUser = (event: any) => {
    if (event.target.value !== userData.email) {
      const searchResponse = get<User[]>("/users/searchUser?searchTerm=" + event.target.value);
      searchResponse.then(response => {
        console.log("Response : " + JSON.stringify(response));

      })
    }

  };
  const handleUserSelect = (selected: User | null) => {
    setSelectedOption(selected);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-blue-500 text-white p-4">
        Welcome {userData.userName}
        <SearchBox user={userData} onUserSelect={handleSelectedUserFromSearch}/>
      </div>
      <div className="flex flex-1">
        <Sidebar users={usersList} onUserClick={handleUserClick} />
        <ChatPage user={userData} recipient={selectedUser} chatMessages={userMessages[selectedUser?.uuid || '']} onSendMessage={handleSentMessages} />
      </div>
    </div>
  );
}

export default Home