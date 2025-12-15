import { Task, CreateTaskRequest } from '@/domain/task/task.entity';
import { Result, success, failure } from '@/domain/common/result';
import { ITaskRepository } from '@/application/interfaces/repositories/task.repository.interface';

export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(request: CreateTaskRequest): Promise<Result<Task>> {
    try {
      // Business rules validation
      if (!request.title || request.title.trim().length === 0) {
        return failure(new Error('Task title is required'));
      }

      if (request.title.length > 200) {
        return failure(new Error('Task title must not exceed 200 characters'));
      }

      // Set default values
      const createRequest: CreateTaskRequest = {
        title: request.title.trim(),
        userId: request.userId,
        category: request.category || 'general',
        priority: request.priority || 'medium',
        tags: request.tags || [],
      };

      const result = await this.taskRepository.create(createRequest);

      if (result.isFailure) {
        return failure(result.error || new Error('Failed to create task'));
      }

      return success(result.value!);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Unexpected error'));
    }
  }
}