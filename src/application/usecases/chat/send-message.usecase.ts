import { Message, SendMessageRequest } from '@/domain/chat/chat.entity';
import { Result, success, failure } from '@/domain/common/result';
import { IChatRepository } from '@/application/interfaces/repositories/chat.repository.interface';

export class SendMessageUseCase {
  constructor(private chatRepository: IChatRepository) {}

  async execute(request: SendMessageRequest): Promise<Result<Message>> {
    try {
      // Business rules validation
      if (!request.text || request.text.trim().length === 0) {
        return failure(new Error('Message text is required'));
      }

      if (!request.conversationId || request.conversationId <= 0) {
        return failure(new Error('Valid conversation ID is required'));
      }

      const sendRequest: SendMessageRequest = {
        conversationId: request.conversationId,
        text: request.text.trim(),
        sender: request.sender,
        userId: request.userId,
      };

      const result = await this.chatRepository.sendMessage(sendRequest);

      if (result.isFailure) {
        return failure(result.error || new Error('Failed to send message'));
      }

      return success(result.value!);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Unexpected error'));
    }
  }
}