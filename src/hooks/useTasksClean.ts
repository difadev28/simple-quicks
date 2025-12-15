import { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, TaskFilters } from '@/domain/task/task.entity'; 
import { getTasksUseCase, createTaskUseCase, toggleTaskUseCase } from '@/infrastructure/di/container';

export function useTasksClean(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasks = async (customFilters?: TaskFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getTasksUseCase.execute(customFilters || filters);

      if (result.isFailure) {
        setError(result.error?.message || 'Failed to fetch tasks');
        return;
      }

      setTasks(result.value || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Create task
  const createTask = async (request: CreateTaskRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createTaskUseCase.execute(request);

      if (result.isFailure) {
        setError(result.error?.message || 'Failed to create task');
        return false;
      }

      // Refresh the tasks list
      await fetchTasks();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle task completion with optimistic update
  const toggleTaskCompletion = async (taskId: number): Promise<boolean> => {
    const originalTasks = [...tasks];

    // Optimistic update
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );

    try {
      const result = await toggleTaskUseCase.execute(taskId);

      if (result.isFailure) {
        // Rollback on failure
        setTasks(originalTasks);
        setError(result.error?.message || 'Failed to update task');
        return false;
      }

      // Update with the result from the server
      if (result.value) {
        setTasks(prev =>
          prev.map(task =>
            task.id === taskId ? result.value! : task
          )
        );
      }

      return true;
    } catch (err) {
      // Rollback on error
      setTasks(originalTasks);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    toggleTaskCompletion,
    clearError: () => setError(null),
  };
}