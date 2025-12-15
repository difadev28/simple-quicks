import { Task } from '@/domain/task/task.entity';
import { Result, success, failure } from '@/domain/common/result';
import { ITaskRepository } from '@/application/interfaces/repositories/task.repository.interface';

export class ToggleTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(taskId: number): Promise<Result<Task>> {
    try {
      if (!taskId || taskId <= 0) {
        return failure(new Error('Valid task ID is required'));
      }

      const result = await this.taskRepository.toggleStatus(taskId);

      if (result.isFailure) {
        return failure(result.error || new Error('Failed to toggle task status'));
      }

      return success(result.value!);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Unexpected error'));
    }
  }
}