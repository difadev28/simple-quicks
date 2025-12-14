import { useState, useEffect } from 'react';
import type { Task } from '../types';
import { taskApi } from '../api/task.api';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            try {
                const data = await taskApi.getAll();
                setTasks(data);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const toggleTaskCompletion = async (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const newStatus = !task.completed;

        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newStatus } : t));

        // For local tasks (created via New Task, ID is timestamp), don't call API
        // JSONPlaceholder only supports IDs 1-200.
        if (id > 1000) return;

        try {
            await taskApi.updateStatus(id, newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert only if we want strict consistency, but for this demo 
            // and mixed local/server data, reverting causes "flicker" on failure.
            // Let's keep the optimistic state to satisfy "smpet work lalu tiba ga completed lagi"
            // Or better, handle the error gracefully without reverting if it's a known limitation.
            // However, sticking to the user's request, preventing the 'revert' is key.
            // commenting out revert for now or making it smarter.
            // setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !newStatus } : t));
        }
    };

    const deleteTask = (id: number) => {
        // Optimistic delete
        setTasks(prev => prev.filter(t => t.id !== id));
        // We assume delete isn't critical to persist for this demo or add API call if provided
    };

    const addNewTask = async (newTask: Task) => {
        // Optimistic update using the provided ID (usually Date.now())
        setTasks(prev => [...prev, newTask]);

        try {
            // We strip ID before sending to API typically, but here we just pass relevant fields
            // JSONPlaceholder returns ID 201 for all new items. 
            // In a real app we would swap the temp ID for the real ID.
            // For this demo, we can just ensure the API call works and we keep our local ID to avoid duplicates.
            const { id, ...taskData } = newTask; // eslint-disable-line @typescript-eslint/no-unused-vars
            await taskApi.create(taskData);
        } catch (error) {
            console.error("Failed to create task", error);
            setTasks(prev => prev.filter(t => t.id !== newTask.id));
        }
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

    const updateTaskDescription = async (taskId: number, description: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, description } : t));

        try {
            await taskApi.update(taskId, { ...task, description });
        } catch (error) {
            console.error("Update task failed", error);
        }
    };

    const updateTaskDate = async (taskId: number, dateString: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, dueDate: dateString } : t));

        try {
            await taskApi.update(taskId, { ...task, dueDate: dateString });
        } catch (error) {
            console.error("Update date failed", error);
        }
    };

    const updateTaskTitle = async (taskId: number, title: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, title } : t));

        try {
            await taskApi.update(taskId, { ...task, title });
        } catch (error) {
            console.error("Update title failed", error);
        }
    };

    return {
        tasks,
        isLoading,
        addNewTask,
        deleteTask,
        toggleTaskCompletion,
        toggleTaskTag,
        updateTaskDescription,
        updateTaskDate,
        updateTaskTitle
    };
};
