import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskHeader } from '../components/task/TaskHeader';
import { NewTaskForm } from '../components/task/NewTaskForm';
import { TaskList } from '../components/task/TaskList';
import { CATEGORIES } from '../constants/taskConstants';

const TaskPage: React.FC = () => {
    const {
        tasks,
        isLoading,
        addNewTask,
        deleteTask,
        toggleTaskCompletion,
        toggleTaskTag,
        updateTaskDescription,
        updateTaskDate
    } = useTasks();

    const [filter, setFilter] = useState<typeof CATEGORIES[number]>('My Task');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);

    const filteredTasks = tasks.filter(t => filter === 'My Task' ? true : t.category === filter);

    const handleBackdropClick = () => {
        setIsFilterOpen(false);
        // Note: TaskList manages its own popups backdrop click via stopPropagation or we could lift state up further if we wanted a global close.
        // For strictly "click outside closes", components usually handle it or use a global listener.
        // Current implementation in TaskList/Item uses local toggle logic, but let's see. 
        // The original code used a giant backdrop click on the main div to close everything.
        // To achieve that here without prop drilling 'closeAll' to every item, simple local toggles are safer unless we use a context/listener.
        // For now, let's stick to local state in TaskList + this global closer for the Header filter.
    };

    return (
        <div className="flex flex-col h-full bg-white relative" onClick={handleBackdropClick}>
            <TaskHeader
                filter={filter}
                setFilter={setFilter}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                onNewTaskClick={() => setShowNewTaskForm(true)}
            />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {showNewTaskForm && (
                    <NewTaskForm
                        onCancel={() => setShowNewTaskForm(false)}
                        onCreate={(task) => {
                            addNewTask(task);
                            setShowNewTaskForm(false);
                        }}
                    />
                )}

                <TaskList
                    tasks={filteredTasks}
                    isLoading={isLoading}
                    filter={filter}
                    onToggleComplete={toggleTaskCompletion}
                    onDelete={deleteTask}
                    onUpdateDate={updateTaskDate}
                    onUpdateDescription={updateTaskDescription}
                    onToggleTag={toggleTaskTag}
                />
            </div>
        </div>
    );
};

export default TaskPage;
