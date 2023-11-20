export type User = {
  userName: string;
  email: string;
  uuid: string;
}

export type Error = {
  message: string;
}

export interface Message {
  uuid: string;
  content: string;
  sender: User;
  recipient: User;
  messageType: MessageType;
  messageStatus: MessageStatus;
  conversationUuid?: string;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
}

export enum MessageStatus {
  SEND = 'SEND',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export interface ChatSessionResponse {
  uuid: string;
  sessionId: string;
}
export interface Conversation {
  uuid: string;
  messages: Message[];
  participants: User[];
}

export interface ConversationHistory {
  conversations: Conversation[];
}

export interface ConversationsAndUser {
  conversationUuid?: string;
  toUser: User
}


