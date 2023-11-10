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
    sender: User | null;
    content: string;
    recipient: User | null;
  }

  export interface ChatSessionResponse {
    uuid: string;
    sessionId: string;
  }
