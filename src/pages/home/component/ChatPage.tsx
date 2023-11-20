import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';
import { ConversationsAndUser, Message, MessageStatus, MessageType, User } from '../../../types/type';
import { post } from '../../../utils/apiUtils';
import { CHAT_SERVICE_APP } from '../../../utils/constants';



interface ChatPageProps {
  user: User | null; // Make user nullable to handle no user selected
  recipient: User | null; // Make recipient nullable to handle no recipient selected
  chatMessages: Message[];
  selectedConversationAndUser: ConversationsAndUser | null;
  onSendMessage: (message: Message, selectedConversationAndUser: ConversationsAndUser | null) => void;
}

function ChatPage({ user, recipient, chatMessages, selectedConversationAndUser, onSendMessage }: ChatPageProps) {
  const [messages, setMessages] = useState<Set<Message>>(new Set());
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const message = {
      content: newMessage,
      senderUuid: user?.uuid,
      recipientUuid: recipient?.uuid,
      messageType: MessageType.TEXT,
      messageStatus: MessageStatus.SEND,
      conversationUuid: selectedConversationAndUser?.conversationUuid
    };

    post<Message>("/sendMessage", message, undefined, CHAT_SERVICE_APP).then(response => {
      onSendMessage({
        uuid: response.uuid,
        content: response.content,
        sender: user!,
        recipient: recipient!,
        messageType: response.messageType,
        messageStatus: response.messageStatus,
        conversationUuid: response.conversationUuid
      }, selectedConversationAndUser);
      setNewMessage('');
    })



  };

  useEffect(() => {
    setMessages(new Set());
  }, [user, recipient]);

  // Simulate receiving a new message (you would typically get this from a server)
  useEffect(() => {
    // Update the Set with unique message objects
    if (!Array.isArray(chatMessages)) {
      chatMessages = [];
    }
    setMessages(prevSet => new Set([...prevSet, ...chatMessages]));
  }, [chatMessages]);

  return (
    <div className="flex flex-col flex-1 p-4 border-l border-gray-300">
      <div className="flex-1 border p-4">
        {Array.from(messages).map((message, index) => (
          <div key={index} className={`mb-2 ${message?.sender.uuid === user?.uuid ? 'text-blue-500 text-right' : 'text-green-500 text-left'}`}>
            <strong>{message?.sender.uuid === user?.uuid ? 'You' : recipient?.userName}:</strong> {message.content}
            {
              message?.sender.uuid === user?.uuid ? renderMessageStatus(message.messageStatus) : ''
            }

          </div>
        ))}
      </div>

      <div className="flex items-center mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-2 py-1.5 rounded border border-gray-300"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage} className="ml-2 bg-blue-500 text-white px-3 py-1 rounded">
          Send
        </button>
      </div>
    </div>
  );

  function renderMessageStatus(status: MessageStatus) {
    switch (status) {
      case MessageStatus.SENT:
        return <span>&#10003;</span>; // Single tick for sent messages
      case MessageStatus.DELIVERED:
        return <span>&#10003;&#10003;</span>; // Double tick for delivered messages
      case MessageStatus.READ:
        return <span>&#10003;&#10003;&#10003;</span>;
      default:
        return null; // No tick for other statuses
    }
  }
}

export default ChatPage;
