import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '@/domain/task/task.entity';
import { Result, success, failure } from '@/domain/common/result';
import { ITaskRepository } from '@/application/interfaces/repositories/task.repository.interface';
import { HttpClient } from '@/infrastructure/http/http-client';

export class TaskRepository implements ITaskRepository {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({
      baseUrl: 'https://jsonplaceholder.typicode.com',
    });
  }

  async getAll(filters?: TaskFilters): Promise<Result<Task[]>> {
    try {
      const response = await this.httpClient.get<any[]>('/todos', { _limit: '10' });

      if (response.isFailure) {
        return failure(response.error || new Error('Operation failed'));
      }

      const todos = response.value?.data || [];

      // Transform API data to domain entities
      const tasks: Task[] = todos.map((todo) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        userId: todo.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 'general',
        priority: 'medium',
        tags: [],
      }));

      // Apply filters
      let filteredTasks = tasks;
      if (filters) {
        if (filters.completed !== undefined) {
          filteredTasks = filteredTasks.filter(task => task.completed === filters.completed);
        }
        if (filters.category) {
          filteredTasks = filteredTasks.filter(task => task.category === filters.category);
        }
        if (filters.priority) {
          filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
        }
        if (filters.tags && filters.tags.length > 0) {
          filteredTasks = filteredTasks.filter(task =>
            filters.tags!.some(tag => task.tags?.includes(tag))
          );
        }
      }

      return success(filteredTasks);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to fetch tasks'));
    }
  }

  async getById(id: number): Promise<Result<Task>> {
    try {
      const response = await this.httpClient.get<any>(`/todos/${id}`);

      if (response.isFailure) {
        return failure(response.error || new Error('Operation failed'));
      }

      const todo = response.value?.data;

      if (!todo) {
        return failure(new Error('Task not found'));
      }

      const task: Task = {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        userId: todo.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 'general',
        priority: 'medium',
        tags: [],
      };

      return success(task);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to fetch task'));
    }
  }

  async create(request: CreateTaskRequest): Promise<Result<Task>> {
    try {
      const response = await this.httpClient.post<any>('/todos', {
        title: request.title,
        userId: request.userId || 1,
        completed: false,
      });

      if (response.isFailure) {
        return failure(response.error || new Error('Operation failed'));
      }

      const todo = response.value?.data;

      const task: Task = {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        userId: todo.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: request.category || 'general',
        priority: request.priority || 'medium',
        tags: request.tags || [],
      };

      return success(task);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to create task'));
    }
  }

  async update(id: number, request: UpdateTaskRequest): Promise<Result<Task>> {
    try {
      const updateData: any = {};
      if (request.title !== undefined) updateData.title = request.title;
      if (request.completed !== undefined) updateData.completed = request.completed;

      const response = await this.httpClient.patch<any>(`/todos/${id}`, updateData);

      if (response.isFailure) {
        return failure(response.error || new Error('Operation failed'));
      }

      const todo = response.value?.data;

      const task: Task = {
        id: todo.id,
        title: request.title || todo.title,
        completed: request.completed !== undefined ? request.completed : todo.completed,
        userId: todo.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: request.category || 'general',
        priority: request.priority || 'medium',
        tags: request.tags || [],
      };

      return success(task);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to update task'));
    }
  }

  async delete(id: number): Promise<Result<void>> {
    try {
      const response = await this.httpClient.delete(`/todos/${id}`);

      if (response.isFailure) {
        return failure(response.error || new Error('Operation failed'));
      }

      return success(undefined);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to delete task'));
    }
  }

  async toggleStatus(id: number): Promise<Result<Task>> {
    try {
      // First get the current task
      const getResult = await this.getById(id);
      if (getResult.isFailure) {
        return failure(getResult.error || new Error('Failed to get task'));
      }

      const currentTask = getResult.value!;
      const newStatus = !currentTask.completed;

      // Update the task with new status
      const updateResult = await this.update(id, { completed: newStatus });
      if (updateResult.isFailure) {
        return failure(updateResult.error || new Error('Failed to update task'));
      }

      return success(updateResult.value!);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to toggle task status'));
    }
  }
}