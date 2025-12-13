import type { Task } from '../types';

export const MOCK_TASKS: Task[] = [
    {
        id: 1,
        title: 'Set up appointment with Dr Blake',
        description: 'Routine checkup and discuss blood test results.',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        completed: false,
        category: 'Personal Errands',
        tags: ['Appointments', 'Self Task']
    },
    {
        id: 2,
        title: 'Pay pending bills',
        description: 'Electricity and Internet bills for December.',
        dueDate: new Date().toISOString(), // Today
        completed: false,
        category: 'Urgent To Do',
        tags: ['ASAP']
    },
    {
        id: 3,
        title: 'Buy Groceries',
        description: 'Milk, Eggs, Bread, and Vegetables.',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        completed: true,
        category: 'My Task',
        tags: ['Self Task']
    },
    {
        id: 4,
        title: 'Finish Project Documentation',
        description: 'Complete the API docs for the new feature.',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        completed: false,
        category: 'My Task',
        tags: ['Client Related']
    }
];

export const CATEGORIES = ['My Task', 'Personal Errands', 'Urgent To Do'] as const;

export const AVAILABLE_TAGS = [
    'Important ASAP',
    'Offline Meeting',
    'Virtual Meeting',
    'ASAP',
    'Client Related',
    'Self Task',
    'Appointments',
    'Court Related'
];

export const TAG_COLORS: Record<string, string> = {
    'Important ASAP': 'bg-[#E5F1FF] text-[#0099FF]', // Light Blue
    'Offline Meeting': 'bg-[#F9E9C3] text-[#CB8504]', // Warning / Orange
    'Virtual Meeting': 'bg-[#F9E9C3] text-[#CB8504]',
    'ASAP': 'bg-[#AFEBDB] text-[#01B67D]', // Teal / Green
    'Client Related': 'bg-[#AFEBDB] text-[#01B67D]',
    'Self Task': 'bg-[#E5F1FF] text-[#0099FF]',
    'Appointments': 'bg-[#F9C2FF] text-[#CB2CBB]', // Pink / Purple
    'Court Related': 'bg-[#F9D9D9] text-[#9D1C1C]', // Red ?? Defaulting to greyish pink if unsure
};

export const DEFAULT_TAG_COLOR = 'bg-[#F0F0F0] text-[#6B6B6B]';
