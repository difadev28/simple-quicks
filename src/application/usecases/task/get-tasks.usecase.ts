import { Task, TaskFilters } from '@/domain/task/task.entity';
import { Result, success, failure } from '@/domain/common/result';
import { ITaskRepository } from '@/application/interfaces/repositories/task.repository.interface';

export class GetTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(filters?: TaskFilters): Promise<Result<Task[]>> {
    try {
      const result = await this.taskRepository.getAll(filters);

      if (result.isFailure) {
        return failure(result.error || new Error('Failed to fetch tasks'));
      }

      const tasks = result.value || [];

      // Business logic: Sort tasks by creation date (newest first)
      const sortedTasks = tasks.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return success(sortedTasks);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Unexpected error'));
    }
  }
}