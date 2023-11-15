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
  }

  export enum MessageType {
    TEXT = 'TEXT',
IMAGE = 'IMAGE',
VIDEO = 'VIDEO',
FILE = 'FILE',
  }

  export enum MessageStatus {
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    SEEN = 'SEEN',
  }

  export interface ChatSessionResponse {
    uuid: string;
    sessionId: string;
  }
