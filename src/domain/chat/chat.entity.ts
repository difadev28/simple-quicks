export interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Message {
  id: number;
  conversationId: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  userId?: number;
  isRead: boolean;
}

export interface Conversation {
  id: number;
  participants: User[];
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
  unreadCount: number;
}

export interface SendMessageRequest {
  conversationId: number;
  text: string;
  sender: 'user' | 'assistant';
  userId?: number;
}

export interface CreateConversationRequest {
  participants: number[];
}