import React, { useState } from 'react';
import { TaskItem } from './TaskItem';
import { Loader } from '../common/Loader';
import type { Task } from '../../types';

interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
    filter: string;
    onToggleComplete: (id: number) => void;
    onDelete: (id: number) => void;
    onUpdateDate: (id: number, date: string) => void;
    onUpdateDescription: (id: number, desc: string) => void;
    onToggleTag: (id: number, tag: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    isLoading,
    filter,
    onToggleComplete,
    onDelete,
    onUpdateDate,
    onUpdateDescription,
    onToggleTag
}) => {
    // UI State managed here nicely for the list items exclusive states
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
    const [activeMenuTaskId, setActiveMenuTaskId] = useState<number | null>(null);
    const [activeTagPopupId, setActiveTagPopupId] = useState<number | null>(null);
    const [editingDescriptionId, setEditingDescriptionId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedTaskId(expandedTaskId === id ? null : id);
        setActiveMenuTaskId(null);
        setActiveTagPopupId(null);
        setEditingDescriptionId(null);
    };

    const toggleMenu = (id: number) => {
        setActiveMenuTaskId(activeMenuTaskId === id ? null : id);
        if (activeMenuTaskId !== id) {
            setActiveTagPopupId(null);
        }
    };

    const toggleTagPopup = (id: number) => {
        setActiveTagPopupId(activeTagPopupId === id ? null : id);
        if (activeTagPopupId !== id) {
            setActiveMenuTaskId(null);
        }
    };

    if (isLoading) {
        return <Loader text="Loading Task List..." />;
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 text-slate-400">
                <p>No tasks found in "{filter}"</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 pb-20"> {/* pb-20 for bottom safe area if needed */}
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    isExpanded={expandedTaskId === task.id}
                    isMenuOpen={activeMenuTaskId === task.id}
                    isTagPopupOpen={activeTagPopupId === task.id}
                    isEditingDescription={editingDescriptionId === task.id}
                    onToggleExpand={() => toggleExpand(task.id)}
                    onToggleMenu={() => toggleMenu(task.id)}
                    onToggleTagPopup={() => toggleTagPopup(task.id)}
                    onToggleDescriptionEdit={() => setEditingDescriptionId(editingDescriptionId === task.id ? null : task.id)}
                    onToggleComplete={() => onToggleComplete(task.id)}
                    onDelete={() => onDelete(task.id)}
                    onUpdateDate={(date) => onUpdateDate(task.id, date)}
                    onUpdateDescription={(desc) => onUpdateDescription(task.id, desc)}
                    onToggleTag={(tag) => onToggleTag(task.id, tag)}
                />
            ))}
        </div>
    );
};
