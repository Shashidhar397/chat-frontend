import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Button from '../../../components/Button';
import { ChatSessionResponse, Conversation, ConversationHistory, ConversationsAndUser, Message, MessageStatus, User } from '../../../types/type';
import { get, post } from '../../../utils/apiUtils';
import ChatPage from './ChatPage';
import Sidebar from './Sidebar';
import Stomp, { Client } from 'stompjs';
import SockJS from 'sockjs-client';
import Select from 'react-select';
import SearchBox from './SearchBox';
import { CHAT_SERVICE_APP } from '../../../utils/constants';


const initialStompClient: Client | null = null;


function Home() {



  const [selectedConversationAndUser, setConversationAndUser] = useState<ConversationsAndUser | null>(null);

  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedOption, setSelectedOption] = useState<User | null>(null);

  const location = useLocation();
  const userData = location.state.userData;

  const conversationsAndUser: ConversationsAndUser[] = [
  ];
  const [conversationsAndUserList, setConversationsAndUserList] = useState(conversationsAndUser);
  const [stompClient, setStompClient] = useState(initialStompClient);
  const [userMessages, setUserMessages] = useState<{ [uuid: string]: Message[] }>({});
  const [messageUpdate, setMessageUpdate] = useState<Message>();

  const [dummyConversationToUser, setDummyConversationToUser] = useState<any>();

  const handleSentMessages = (message: Message, conversationAndUser: ConversationsAndUser | null) => {
    const newMessage = {
      uuid: message.uuid,
      content: message.content,
      sender: message.sender,
      recipient: message.recipient,
      messageType: message.messageType,
      messageStatus: message.messageStatus,
      conversationUuid: message.conversationUuid
    }
    if(conversationAndUser && !conversationAndUser.conversationUuid) {
      const index = conversationsAndUserList.indexOf(conversationAndUser);
      conversationAndUser.conversationUuid = message.conversationUuid;
      conversationsAndUserList[index] = conversationAndUser;
      setConversationsAndUserList(conversationsAndUserList);
    }

    const conversationUuid = message.conversationUuid || '';
    
    setUserMessages((prevUserMessages) => {

      return {
        ...prevUserMessages,
        [conversationUuid]: [...(prevUserMessages[conversationUuid] || []), newMessage],
      };
    });
  }


  useEffect(() => {
    const conversations = get<ConversationHistory>("/chatHistory/" + userData.uuid, undefined, CHAT_SERVICE_APP).then(response => {
          const conversationMessages: any = [];
          const conversationAndUsersArr: ConversationsAndUser[] =  [];
          response.conversations.forEach(conversation => {
            const toUser = conversation?.participants?.filter(user => user.uuid !== userData.uuid)[0];
            userMessages[conversation.uuid] = conversation.messages;
            console.log('To user: '+toUser.userName);
            conversationAndUsersArr.push({toUser: toUser, conversationUuid: conversation.uuid});
          });

          setConversationsAndUserList([...conversationsAndUserList, ...conversationAndUsersArr]);
          setUserMessages(userMessages);

      });
  }, [])

  useEffect(() => {
    // Create a SockJS connection to your WebSocket server
    if (userData) {
      const sock = new SockJS(CHAT_SERVICE_APP+'/ws');

      // Initialize the STOMP client
      const stomp = Stomp.over(sock);
      stomp.connect({}, () => {
        setStompClient(stomp);

        stomp.send("/chat-service/chat.addUser", {}, JSON.stringify({ uuid: userData.uuid, type: 'JOIN' }));

        get<ChatSessionResponse>("/getSession/" + userData.uuid, undefined, CHAT_SERVICE_APP).then(response => {
          // Subscribe to a chat topic
          stomp.subscribe('/chat-service-private/' + response.sessionId, (message) => {
            // Handle incoming messages
            const messageData = JSON.parse(message.body);
            // console.log("existing User: "+JSON.stringify(messageData));
            
            if(messageData.messageStatus === MessageStatus.SENT) {
              messageData.messageStatus = MessageStatus.DELIVERED;
              setDummyConversationToUser({toUser: messageData?.sender, conversationUuid: messageData.conversationUuid});
              setUserMessages((prevUserMessages) => ({
                ...prevUserMessages,
                [messageData?.conversationUuid]: [...(prevUserMessages[messageData?.conversationUuid] || []), messageData],
              }));
              post("/updateMessageStatus", messageData, undefined, CHAT_SERVICE_APP).then(response => {
                console.log("Response from update Message:"+response);
              })
            }
            
          });
          stomp.subscribe('/chat-service-private/' + response.sessionId +'/message-updates', (message) => {
            const messageData = JSON.parse(message.body);
            console.log('MEssage status update : '+messageData);
              setMessageUpdate(messageData);
          });
        });


      });
      
    }
  }, [userData]);

  useEffect(() => {
    if(dummyConversationToUser) {
      const existingUser = conversationsAndUserList.find(conversationAndUser => conversationAndUser?.toUser.uuid === dummyConversationToUser?.toUser?.uuid);
            if (!existingUser) {
              setConversationsAndUserList([...conversationsAndUserList, dummyConversationToUser]);
            }
    }
  }, [dummyConversationToUser]);

  useEffect(() => {
    if(messageUpdate) {
      const conversationKey : string = messageUpdate?.conversationUuid || '';
      const existingMessageIndex = userMessages[conversationKey]?.findIndex(message => messageUpdate.uuid === message.uuid);
      console.log('Exist: '+existingMessageIndex);
      if (existingMessageIndex && existingMessageIndex !== -1) {
        const existingArrayMessage : Message[] = userMessages[conversationKey];
        userMessages[conversationKey][existingMessageIndex] = messageUpdate;
        setUserMessages(userMessages);
        console.log('updated message : '+JSON.stringify(userMessages[conversationKey]));
      }
    }
  }, [messageUpdate]);


  const handleUserClick = (conversationAndUser: ConversationsAndUser) => {
    setConversationAndUser(conversationAndUser);
  };

  const handleSelectedUserFromSearch = (searchUser: User) => {
    if (searchUser && !conversationsAndUser.some(conversationAndUser => searchUser.uuid === conversationAndUser.toUser.uuid)) {
      const searchUserAndConv : ConversationsAndUser = {
        toUser: searchUser
      }
      setConversationsAndUserList(prevConversationsAndUserList => [...prevConversationsAndUserList, searchUserAndConv]);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

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
        <Sidebar conversationsAndUser={conversationsAndUserList} onUserClick={handleUserClick} />
        <ChatPage user={userData} selectedConversationAndUser={selectedConversationAndUser} recipient={selectedConversationAndUser?.toUser || null} chatMessages={userMessages[selectedConversationAndUser?.conversationUuid || '']} onSendMessage={handleSentMessages} />
      </div>
    </div>
  );
}

export default Home