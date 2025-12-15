import { User, Message, Conversation, SendMessageRequest, CreateConversationRequest } from '@/domain/chat/chat.entity';
import { Result, success, failure } from '@/domain/common/result';
import { IChatRepository } from '@/application/interfaces/repositories/chat.repository.interface';
import { HttpClient } from '@/infrastructure/http/http-client';

export class ChatRepository implements IChatRepository {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({
      baseUrl: 'https://jsonplaceholder.typicode.com',
    });
  }

  async getConversations(_userId?: number): Promise<Result<Conversation[]>> {
    try {
      // Mock implementation since the API doesn't have conversations endpoint
      const mockConversations: Conversation[] = [
        {
          id: 1,
          participants: [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          unreadCount: 2,
        },
        {
          id: 2,
          participants: [
            { id: 1, name: 'John Doe' },
            { id: 3, name: 'Bob Johnson' }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          unreadCount: 0,
        }
      ];

      return success(mockConversations);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to fetch conversations'));
    }
  }

  async getMessages(conversationId: number): Promise<Result<Message[]>> {
    try {
      // Using comments as mock messages
      const response = await this.httpClient.get<any[]>('/comments', { postId: conversationId });

      if (response.isFailure) {
        // Fallback to mock data
        const mockMessages: Message[] = [
          {
            id: 1,
            conversationId,
            text: 'Hello! How are you?',
            sender: 'user',
            timestamp: new Date(Date.now() - 3600000),
            isRead: true,
          },
          {
            id: 2,
            conversationId,
            text: 'I\'m doing great, thank you!',
            sender: 'assistant',
            timestamp: new Date(Date.now() - 3000000),
            isRead: true,
          }
        ];
        return success(mockMessages);
      }

      const comments = response.value?.data || [];

      // Transform comments to messages
      const messages: Message[] = comments.slice(0, 10).map((comment, index) => ({
        id: comment.id,
        conversationId,
        text: comment.body,
        sender: index % 2 === 0 ? 'user' : 'assistant',
        timestamp: new Date(),
        isRead: true,
      }));

      return success(messages);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to fetch messages'));
    }
  }

  async sendMessage(request: SendMessageRequest): Promise<Result<Message>> {
    try {
      // Mock implementation since the API doesn't have message sending
      const newMessage: Message = {
        id: Date.now(),
        conversationId: request.conversationId,
        text: request.text,
        sender: request.sender,
        timestamp: new Date(),
        userId: request.userId,
        isRead: false,
      };

      return success(newMessage);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to send message'));
    }
  }

  async createConversation(_request: CreateConversationRequest): Promise<Result<Conversation>> {
    try {
      // Mock implementation
      const newConversation: Conversation = {
        id: Date.now(),
        participants: [], // Would be populated based on request.participants
        createdAt: new Date(),
        updatedAt: new Date(),
        unreadCount: 0,
      };

      return success(newConversation);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to create conversation'));
    }
  }

  async markAsRead(_conversationId: number, _userId: number): Promise<Result<void>> {
    try {
      // Mock implementation
      return success(undefined);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to mark as read'));
    }
  }

  async getUsers(): Promise<Result<User[]>> {
    try {
      const response = await this.httpClient.get<any[]>('/users');

      if (response.isFailure) {
        return failure(response.error || new Error('Operation failed'));
      }

      const users = response.value?.data || [];

      const transformedUsers: User[] = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      }));

      return success(transformedUsers);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to fetch users'));
    }
  }
}