import type { Task } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

// Helper to generate random date (for demonstration)
const generateRandomDate = (): string => {
    const today = new Date();
    const daysToAdd = Math.floor(Math.random() * 10) - 2; // -2 to +7 days from today
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + daysToAdd);
    // Return simplest ISO date part YYYY-MM-DD
    return futureDate.toISOString().split('T')[0];
};

const CATEGORIES = ['My Task', 'Personal Errands', 'Urgent To Do'] as const;

export const taskApi = {
    getAll: async (): Promise<Task[]> => {
        // limit to 10 to keep list manageable
        const res = await fetch(`${BASE_URL}?_limit=10`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const todos = await res.json();
        console.log(res);
        return todos.map((todo: any) => ({
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
            dueDate: generateRandomDate(),
            description: Math.random() > 0.5
                ? 'No Description'
                : 'Auto generated description for ' + todo.title,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            tags: Math.random() > 0.7 ? ['#priority'] : [],
        }));
    },

    updateStatus: async (id: number, completed: boolean): Promise<void> => {
        // Optimistic update support
        await fetch(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ completed }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
    },

    create: async (task: Omit<Task, 'id'>): Promise<Task> => {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            body: JSON.stringify({
                title: task.title,
                completed: task.completed,
                userId: 1,
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        const data = await res.json();

        // Combine API response with local data to return full Task object
        return {
            ...task,
            id: data.id, // API provided ID (usually 201)
        };
    },

    update: async (id: number, task: Partial<Task>): Promise<void> => {
        await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...task, userId: 1 }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        });
    }
};
