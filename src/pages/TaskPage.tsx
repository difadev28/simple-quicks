import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskHeader } from '../components/task/TaskHeader';
import { TaskList } from '../components/task/TaskList';
import { CATEGORIES } from '../constants/taskConstants';
import type { Task } from '../types';

const TaskPage: React.FC = () => {
    const {
        tasks,
        isLoading,
        addNewTask,
        deleteTask,
        toggleTaskCompletion,
        toggleTaskTag,
        updateTaskDescription,
        updateTaskDate,
        updateTaskTitle
    } = useTasks();

    const [filter, setFilter] = useState<typeof CATEGORIES[number]>('My Task');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredTasks = tasks.filter(t => filter === 'My Task' ? true : t.category === filter);

    const handleBackdropClick = () => {
        setIsFilterOpen(false);
    };

    const handleNewTask = () => {
        // Automatically add a new blank task
        const newTask: Task = {
            id: Date.now(), // Generate ID here
            title: '',
            completed: false,
            dueDate: new Date().toISOString(), // Default to today
            description: '',
            category: (filter === 'My Task' ? 'My Task' : filter) as any, // Use current filter as category or default
            tags: []
        };
        addNewTask(newTask);
    };

    return (
        <div className="flex flex-col h-full bg-white relative" onClick={handleBackdropClick}>
            <TaskHeader
                filter={filter}
                setFilter={setFilter}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                onNewTaskClick={handleNewTask}
            />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <TaskList
                    tasks={filteredTasks}
                    isLoading={isLoading}
                    filter={filter}
                    onToggleComplete={toggleTaskCompletion}
                    onDelete={deleteTask}
                    onUpdateDate={updateTaskDate}
                    onUpdateDescription={updateTaskDescription}
                    onUpdateTitle={updateTaskTitle}
                    onToggleTag={toggleTaskTag}
                />
            </div>
        </div>
    );
};

export default TaskPage;
