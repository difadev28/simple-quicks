# Clean Architecture Implementation

This document explains the Clean Architecture implementation in this project based on Uncle Bob's principles.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                            UI                              │
│                    (React Components)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Interface Adapters                         │
│               (Hooks, Controllers, Presenters)              │
│  • useTasksClean.ts                                        │
│  • useChatClean.ts                                         │
│  • CleanArchitectureProvider.tsx                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Application Business Rules                   │
│                     (Use Cases)                            │
│  • GetTasksUseCase                                         │
│  • CreateTaskUseCase                                       │
│  • ToggleTaskUseCase                                       │
│  • SendMessageUseCase                                      │
│  • GetMessagesUseCase                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Enterprise Rules                     │
│                      (Domain Entities)                      │
│  • Task (task.entity.ts)                                   │
│  • Message, Conversation, User (chat.entity.ts)            │
│  • Result (common/result.ts)                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Frameworks & Drivers                       │
│                (External Interfaces)                        │
│  • HttpClient                                              │
│  • TaskRepository, ChatRepository                          │
│  • DI Container                                            │
└─────────────────────────────────────────────────────────────┘
```

## Key Principles

### 1. Dependency Rule
Dependencies point inward. Inner layers know nothing about outer layers.

### 2. Separation of Concerns
- **Entities**: Business objects with no dependencies
- **Use Cases**: Application-specific business rules
- **Interface Adapters**: Convert data between layers
- **Frameworks & Drivers**: External interfaces (Web, Database, etc.)

### 3. Testability
Each layer can be tested in isolation with mocks.

## Implementation Details

### Domain Layer (`src/domain/`)
Contains business entities and rules that are independent of frameworks.

```typescript
// Example: Task Entity
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  // ... other properties
}
```

### Application Layer (`src/application/`)
Contains use cases that orchestrate the flow of data to and from the entities.

```typescript
// Example: Use Case
export class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(request: CreateTaskRequest): Promise<Result<Task>> {
    // Business rules validation
    // Repository interaction
  }
}
```

### Infrastructure Layer (`src/infrastructure/`)
Contains external concerns like HTTP clients and database implementations.

```typescript
// Example: Repository Implementation
export class TaskRepository implements ITaskRepository {
  async getAll(filters?: TaskFilters): Promise<Result<Task[]>> {
    // HTTP client calls to external API
  }
}
```

### Interface Adapters Layer (`src/hooks/`, `src/providers/`)
Adapts between the application layer and the UI framework.

```typescript
// Example: Hook
export function useTasksClean() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const createTask = async (request: CreateTaskRequest) => {
    const result = await createTaskUseCase.execute(request);
    // Handle result and update state
  };
}
```

## Benefits of Clean Architecture

1. **Independence from Frameworks**: Business rules don't depend on external frameworks
2. **Testability**: Each component can be tested independently
3. **UI Independence**: UI can be changed without changing business rules
4. **Database Independence**: Business rules are not bound to the database
5. **External Agency Independence**: Business rules don't know about the outside world

## Migration Guide

To use the new Clean Architecture:

1. **For Tasks**:
   ```typescript
   // Old
   import { useTasks } from '@/hooks/useTasks';

   // New
   import { useTasksClean } from '@/hooks/useTasksClean';
   ```

2. **For Chat**:
   ```typescript
   // Old
   import { ChatContext } from '@/contexts/ChatContext';

   // New
   import { useChatClean } from '@/hooks/useChatClean';
   ```

3. **Wrap your app with the provider**:
   ```typescript
   import { CleanArchitectureProvider } from '@/providers/CleanArchitectureProvider';

   function App() {
     return (
       <CleanArchitectureProvider>
         <YourAppComponents />
       </CleanArchitectureProvider>
     );
   }
   ```

## Best Practices

1. **Always use the Result pattern** for returning success/failure
2. **Keep entities pure** - no framework dependencies
3. **Use dependency injection** through the DI container
4. **Handle errors at the use case layer**
5. **Keep UI components focused** on presentation only

## Future Enhancements

1. Add request/response interceptors to HttpClient
2. Implement caching strategy
3. Add authentication/authorization layer
4. Implement retry mechanisms
5. Add logging and monitoring