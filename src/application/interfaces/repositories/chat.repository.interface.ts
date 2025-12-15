import { User, Message, Conversation, SendMessageRequest, CreateConversationRequest } from '@/domain/chat/chat.entity';
import { Result } from '@/domain/common/result';

export interface IChatRepository {
  getConversations(userId?: number): Promise<Result<Conversation[]>>;
  getMessages(conversationId: number): Promise<Result<Message[]>>;
  sendMessage(request: SendMessageRequest): Promise<Result<Message>>;
  createConversation(request: CreateConversationRequest): Promise<Result<Conversation>>;
  markAsRead(conversationId: number, userId: number): Promise<Result<void>>;
  getUsers(): Promise<Result<User[]>>;
}