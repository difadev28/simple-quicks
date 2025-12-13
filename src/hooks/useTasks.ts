import { useState, useEffect } from 'react';
import type { Task } from '../types';
import { MOCK_TASKS } from '../constants/taskConstants';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // 1-second simulated delay
        return () => clearTimeout(timer);
    }, []);

    const toggleTaskCompletion = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const addNewTask = (newTask: Task) => {
        setTasks(prev => [newTask, ...prev]);
    };

    const toggleTaskTag = (taskId: number, tag: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                const currentTags = t.tags || [];
                const newTags = currentTags.includes(tag)
                    ? currentTags.filter(nt => nt !== tag)
                    : [...currentTags, tag];
                return { ...t, tags: newTags };
            }
            return t;
        }));
    };

    const updateTaskDescription = (taskId: number, description: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, description } : t));
    };

    const updateTaskDate = (taskId: number, dateString: string) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, dueDate: dateString } : t));
    };

    return {
        tasks,
        isLoading,
        addNewTask,
        deleteTask,
        toggleTaskCompletion,
        toggleTaskTag,
        updateTaskDescription,
        updateTaskDate
    };
};
