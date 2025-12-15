# Simple QuickS2 - Task & Chat Management App

A modern React application built with TypeScript, implementing Clean Architecture principles for scalable and maintainable code.

## 🚀 Features

- **Task Management**
  - Create, read, update, and delete tasks
  - Toggle task completion status
  - Filter tasks by category, priority, and tags
  - Optimistic updates for better UX

- **Chat System**
  - Real-time messaging interface
  - Conversation management
  - User management
  - Message history and search

- **Clean Architecture**
  - Separation of concerns
  - Testable and maintainable code
  - Dependency injection
  - Domain-driven design

## 🏗️ Architecture Overview

This project follows **Clean Architecture** principles by Uncle Bob, ensuring your business logic is independent of frameworks and external concerns.

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
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Application Business Rules                   │
│                     (Use Cases)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Enterprise Rules                     │
│                      (Domain Entities)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Frameworks & Drivers                       │
│                (External Interfaces)                        │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── application/           # Application Business Rules
│   ├── interfaces/        # Repository interfaces
│   └── usecases/         # Use cases for each feature
│
├── domain/               # Enterprise Rules
│   ├── chat/            # Chat domain entities
│   ├── common/          # Common domain utilities
│   └── task/            # Task domain entities
│
├── infrastructure/       # Frameworks & Drivers
│   ├── di/              # Dependency Injection Container
│   ├── http/            # HTTP Client implementation
│   └── repositories/    # Repository implementations
│
├── hooks/               # Interface Adapters
│   ├── useTasksClean.ts # Clean task management hook
│   └── useChatClean.ts  # Clean chat management hook
│
├── providers/           # React Providers
│   └── CleanArchitectureProvider.tsx
│
└── components/          # UI Components
    ├── chat/           # Chat-related components
    └── task/           # Task-related components
```

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Custom implementation with interceptors
- **State Management**: React Hooks + Context API
- **Architecture**: Clean Architecture (Uncle Bob)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/simple-quicks2.git
   cd simple-quicks2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 Usage Examples

### Using Clean Architecture Hooks

```typescript
// Task Management
import { useTasksClean } from '@/hooks/useTasksClean';

function TaskComponent() {
  const {
    tasks,
    isLoading,
    error,
    createTask,
    toggleTaskCompletion
  } = useTasksClean();

  const handleCreateTask = async (title: string) => {
    const success = await createTask({ title });
    if (success) {
      console.log('Task created successfully');
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    const success = await toggleTaskCompletion(taskId);
    if (success) {
      console.log('Task status updated');
    }
  };

  return (
    <div>
      {/* Your task UI */}
    </div>
  );
}

// Chat System
import { useChatClean } from '@/hooks/useChatClean';

function ChatComponent() {
  const {
    currentMessages,
    sendMessage,
    selectConversation
  } = useChatClean();

  const handleSendMessage = async (text: string) => {
    await sendMessage({
      conversationId: 1,
      text,
      sender: 'user'
    });
  };

  return (
    <div>
      {/* Your chat UI */}
    </div>
  );
}
```

### Dependency Injection

The project uses a DI container to manage dependencies:

```typescript
import { container } from '@/infrastructure/di/container';

// Get use cases
const getTasksUseCase = container.getGetTasksUseCase();
const createTaskUseCase = container.getCreateTaskUseCase();

// Get repositories
const taskRepository = container.getTaskRepository();
```

### Error Handling

All operations return a `Result` type for consistent error handling:

```typescript
import { fold } from '@/domain/common/result';

const result = await someUseCase.execute();

fold(
  result,
  (data) => console.log('Success:', data),
  (error) => console.error('Error:', error.message)
);
```

## 🧪 Testing

The Clean Architecture makes testing easy and isolated:

```typescript
// Example: Testing a use case
import { GetTasksUseCase } from '@/application/usecases/task/get-tasks.usecase';
import { MockTaskRepository } from '@/__tests__/mocks/MockTaskRepository';

test('should get tasks successfully', async () => {
  const mockRepo = new MockTaskRepository();
  const getTasksUseCase = new GetTasksUseCase(mockRepo);

  const result = await getTasksUseCase.execute();

  expect(result.isSuccess).toBe(true);
  expect(result.value).toHaveLength(expectedLength);
});
```

## 🔧 Configuration

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
import { Task } from '@/domain/task/task.entity';
import { GetTasksUseCase } from '@/application/usecases/task/get-tasks.usecase';
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-api-url.com
VITE_API_TIMEOUT=10000
```

## 📝 API Integration

The app integrates with JSONPlaceholder for demo purposes:

- **Tasks API**: `https://jsonplaceholder.typicode.com/todos`
- **Users API**: `https://jsonplaceholder.typicode.com/users`
- **Comments API**: `https://jsonplaceholder.typicode.com/comments` (used as mock messages)

## 🎨 Styling

The project uses Tailwind CSS for styling. Custom configurations are in:

- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles and Tailwind imports

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.
 
### Deploy to Netlify

```bash
npm run build
# Upload the dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📋 Code Style

This project follows:

- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** strict mode
- **Clean Architecture** principles

### Pre-commit Hooks

The project uses Husky for Git hooks:

```bash
npm run prepare  # Install hooks
```

## 📚 Documentation

- [Clean Architecture Guide](./CLEAN_ARCHITECTURE.md) - Detailed explanation of the architecture implementation
- [API Documentation](./docs/api.md) - API endpoints and integration guide
- [Component Library](./docs/components.md) - UI component documentation

## 🐛 Troubleshooting

### Common Issues

1. **TypeScript errors**: Run `npm run build` to check for type errors
2. **Import errors**: Ensure path aliases are configured correctly
3. **Build issues**: Clear the build cache: `rm -rf node_modules/.cache`
 
## 🙏 Acknowledgments

- Uncle Bob (Robert C. Martin) for Clean Architecture principles
- React team for the amazing framework
- Vercel team for the blazing-fast build tool
- Tailwind CSS team for utility-first CSS framework

---

Built with ❤️ using Clean Architecture principles