// Repository implementations
import { TaskRepository } from '@/infrastructure/repositories/task.repository.impl';
import { ChatRepository } from '@/infrastructure/repositories/chat.repository.impl';

// Repository interfaces
import { ITaskRepository } from '@/application/interfaces/repositories/task.repository.interface';
import { IChatRepository } from '@/application/interfaces/repositories/chat.repository.interface';

// Use cases
import { GetTasksUseCase } from '@/application/usecases/task/get-tasks.usecase';
import { CreateTaskUseCase } from '@/application/usecases/task/create-task.usecase';
import { ToggleTaskUseCase } from '@/application/usecases/task/toggle-task.usecase';
import { SendMessageUseCase } from '@/application/usecases/chat/send-message.usecase';
import { GetMessagesUseCase } from '@/application/usecases/chat/get-messages.usecase';

export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();
  private repositories: Map<string, any> = new Map();
  private useCases: Map<string, any> = new Map();

  private constructor() {
    this.registerRepositories();
    this.registerUseCases();
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private registerRepositories(): void {
    // Register repositories
    this.repositories.set('ITaskRepository', new TaskRepository());
    this.repositories.set('IChatRepository', new ChatRepository());
  }

  private registerUseCases(): void {
    const taskRepository = this.getTaskRepository();
    const chatRepository = this.getChatRepository();

    // Register task use cases
    this.useCases.set('GetTasksUseCase', new GetTasksUseCase(taskRepository));
    this.useCases.set('CreateTaskUseCase', new CreateTaskUseCase(taskRepository));
    this.useCases.set('ToggleTaskUseCase', new ToggleTaskUseCase(taskRepository));

    // Register chat use cases
    this.useCases.set('SendMessageUseCase', new SendMessageUseCase(chatRepository));
    this.useCases.set('GetMessagesUseCase', new GetMessagesUseCase(chatRepository));
  }

  // Repository getters
  getTaskRepository(): ITaskRepository {
    return this.repositories.get('ITaskRepository');
  }

  getChatRepository(): IChatRepository {
    return this.repositories.get('IChatRepository');
  }

  // Use case getters
  getGetTasksUseCase(): GetTasksUseCase {
    return this.useCases.get('GetTasksUseCase');
  }

  getCreateTaskUseCase(): CreateTaskUseCase {
    return this.useCases.get('CreateTaskUseCase');
  }

  getToggleTaskUseCase(): ToggleTaskUseCase {
    return this.useCases.get('ToggleTaskUseCase');
  }

  getSendMessageUseCase(): SendMessageUseCase {
    return this.useCases.get('SendMessageUseCase');
  }

  getGetMessagesUseCase(): GetMessagesUseCase {
    return this.useCases.get('GetMessagesUseCase');
  }

  // Generic methods for custom registration
  registerService<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  getService<T>(key: string): T {
    return this.services.get(key);
  }

  // Clean up method (if needed)
  clear(): void {
    this.services.clear();
    this.repositories.clear();
    this.useCases.clear();
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();

// Export individual services for convenience
export const taskRepository = container.getTaskRepository();
export const chatRepository = container.getChatRepository();

export const getTasksUseCase = container.getGetTasksUseCase();
export const createTaskUseCase = container.getCreateTaskUseCase();
export const toggleTaskUseCase = container.getToggleTaskUseCase();

export const sendMessageUseCase = container.getSendMessageUseCase();
export const getMessagesUseCase = container.getGetMessagesUseCase();