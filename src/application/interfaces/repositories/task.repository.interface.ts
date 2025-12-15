import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '@/domain/task/task.entity';
import { Result } from '@/domain/common/result';

export interface ITaskRepository {
  getAll(filters?: TaskFilters): Promise<Result<Task[]>>;
  getById(id: number): Promise<Result<Task>>;
  create(request: CreateTaskRequest): Promise<Result<Task>>;
  update(id: number, request: UpdateTaskRequest): Promise<Result<Task>>;
  delete(id: number): Promise<Result<void>>;
  toggleStatus(id: number): Promise<Result<Task>>;
}