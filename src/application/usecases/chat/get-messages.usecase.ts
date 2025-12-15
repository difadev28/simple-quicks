import { Message } from '@/domain/chat/chat.entity';
import { Result, success, failure } from '@/domain/common/result';
import { IChatRepository } from '@/application/interfaces/repositories/chat.repository.interface';

export class GetMessagesUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(conversationId: number): Promise<Result<Message[]>> {
    try {
      if (!conversationId || conversationId <= 0) {
        return failure(new Error('Valid conversation ID is required'));
      }

      const result = await this.chatRepository.getMessages(conversationId);

      if (result.isFailure) {
        return failure(result.error || new Error('Failed to fetch messages'));
      }

      const messages = result.value || [];

      // Business logic: Sort messages by timestamp (oldest first)
      const sortedMessages = messages.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      return success(sortedMessages);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Unexpected error'));
    }
  }
}