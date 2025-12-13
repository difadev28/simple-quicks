import React, { useState } from 'react';
import {
    ChevronDownIcon,
    EllipsisHorizontalIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon,
    CheckIcon,
    TagIcon
} from '@heroicons/react/24/outline';
import type { Task } from '../types';

const MOCK_TASKS: Task[] = [
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

const CATEGORIES = ['My Task', 'Personal Errands', 'Urgent To Do'] as const;


const AVAILABLE_TAGS = [
    'Important ASAP',
    'Offline Meeting',
    'Virtual Meeting',
    'ASAP',
    'Client Related',
    'Self Task',
    'Appointments',
    'Court Related'
];

const TAG_COLORS: Record<string, string> = {
    'Important ASAP': 'bg-[#E5F1FF] text-[#0099FF]', // Light Blue
    'Offline Meeting': 'bg-[#F9E9C3] text-[#CB8504]', // Warning / Orange
    'Virtual Meeting': 'bg-[#F9E9C3] text-[#CB8504]',
    'ASAP': 'bg-[#AFEBDB] text-[#01B67D]', // Teal / Green
    'Client Related': 'bg-[#AFEBDB] text-[#01B67D]',
    'Self Task': 'bg-[#E5F1FF] text-[#0099FF]',
    'Appointments': 'bg-[#F9C2FF] text-[#CB2CBB]', // Pink / Purple
    'Court Related': 'bg-[#F9D9D9] text-[#9D1C1C]', // Red ?? Defaulting to greyish pink if unsure
};

const DEFAULT_TAG_COLOR = 'bg-[#F0F0F0] text-[#6B6B6B]';

const TaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [filter, setFilter] = useState<typeof CATEGORIES[number]>('My Task');
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
    const [activeMenuTaskId, setActiveMenuTaskId] = useState<number | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showNewTaskForm, setShowNewTaskForm] = useState(false);
    const [activeTagPopupId, setActiveTagPopupId] = useState<number | 'NEW_TASK' | null>(null);
    const [editingDescriptionId, setEditingDescriptionId] = useState<number | null>(null);

    // New Task Form State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');
    const [newTaskCategory, setNewTaskCategory] = useState<typeof CATEGORIES[number]>('My Task'); // Default
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskTags, setNewTaskTags] = useState<string[]>([]);

    const toggleExpand = (id: number) => {
        setExpandedTaskId(expandedTaskId === id ? null : id);
        setActiveMenuTaskId(null);
    };

    const handleCheckboxChange = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this task?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const handleCreateTask = () => {
        if (!newTaskTitle.trim() || !newTaskDate) return;

        const newTask: Task = {
            id: Date.now(),
            title: newTaskTitle,
            description: newTaskDesc,
            dueDate: new Date(newTaskDate).toISOString(),
            completed: false,
            category: newTaskCategory,
            tags: newTaskTags
        };

        setTasks([newTask, ...tasks]);
        setShowNewTaskForm(false);
        // Reset form
        setNewTaskTitle('');
        setNewTaskDate('');
        setNewTaskCategory('My Task');
        setNewTaskDesc('');
        setNewTaskTags([]);
    };

    const toggleNewTaskTag = (tag: string) => {
        if (newTaskTags.includes(tag)) {
            setNewTaskTags(newTaskTags.filter(t => t !== tag));
        } else {
            setNewTaskTags([...newTaskTags, tag]);
        }
    };

    const toggleTaskTag = (taskId: number, tag: string) => {
        setTasks(tasks.map(t => {
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

    const getDaysLeft = (dateString: string) => {
        const target = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);

        const diffTime = target.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Overdue';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `${diffDays} Days Left`;
    };

    const formatDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const getTagStyle = (tag: string) => TAG_COLORS[tag] || DEFAULT_TAG_COLOR;

    const filteredTasks = tasks.filter(t => filter === 'My Task' ? true : t.category === filter);
    // Wait, filtering logic: "My Task" is just a category.

    const handleBackdropClick = () => {
        setActiveMenuTaskId(null);
        setIsFilterOpen(false);
        setActiveTagPopupId(null);
        setEditingDescriptionId(null);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative" onClick={handleBackdropClick}>
            {/* Header */}
            <header className="px-5 py-4 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between">

                {/* Filter Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 text-slate-700 font-bold text-base hover:text-slate-900"
                    >
                        {filter}
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Dropdown Menu */}
                    {isFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 shadow-lg rounded-lg py-1 z-30">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setFilter(cat);
                                        setIsFilterOpen(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm ${filter === cat ? 'bg-purple-50 text-purple-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* New Task Button */}
                <button
                    onClick={() => setShowNewTaskForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
                >
                    New Task
                </button>
            </header>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* New Task Form (Inline) - No changes needed usually, but just in case of context overflow issue in future, keeping generic structure */}
                {showNewTaskForm && (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ring-2 ring-blue-500/20" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3 flex-1">
                                <span className="w-5 h-5 flex items-center justify-center rounded border border-slate-300 bg-white text-white">
                                    {/* Unchecked look */}
                                </span>
                                <input
                                    type="text"
                                    className="font-bold text-slate-700 bg-transparent border-none focus:ring-0 p-0 w-full placeholder-slate-400"
                                    placeholder="Type Task Title"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <ClockIcon className={`w-5 h-5 ${newTaskDate ? 'text-blue-500' : 'text-slate-400'}`} />
                                <input
                                    type="date"
                                    className="border border-slate-200 rounded px-2 py-1 text-sm text-slate-600 focus:border-blue-500 focus:outline-none"
                                    value={newTaskDate}
                                    onChange={(e) => setNewTaskDate(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <PencilIcon className={`w-5 h-5 ${newTaskDesc ? 'text-blue-500' : 'text-slate-400'}`} />
                                <textarea
                                    className="flex-1 border border-slate-200 rounded p-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none resize-none"
                                    rows={3}
                                    placeholder="No Description"
                                    value={newTaskDesc}
                                    onChange={(e) => setNewTaskDesc(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-4 pl-9">
                                <select
                                    value={newTaskCategory}
                                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                                    className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 bg-white"
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            {/* Stickers / Tags Selection */}
                            <div className="flex items-center gap-4 pl-9 relative">
                                <TagIcon
                                    className={`w-5 h-5 cursor-pointer ${newTaskTags.length > 0 ? 'text-blue-500' : 'text-slate-400'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTagPopupId(activeTagPopupId === 'NEW_TASK' ? null : 'NEW_TASK');
                                    }}
                                />
                                {newTaskTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {newTaskTags.map(tag => (
                                            <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getTagStyle(tag)}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Popup for Tags */}
                                {activeTagPopupId === 'NEW_TASK' && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 shadow-xl rounded-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex flex-wrap gap-2">
                                            {AVAILABLE_TAGS.map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => toggleNewTaskTag(tag)}
                                                    className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors
                                                        ${newTaskTags.includes(tag)
                                                            ? getTagStyle(tag) + ' border-transparent ring-1 ring-offset-1 ring-slate-300'
                                                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                                        }
                                                    `}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setShowNewTaskForm(false)}
                                    className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateTask}
                                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Existing Tasks */}
                {filteredTasks.length === 0 && !showNewTaskForm ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>No tasks found in "{filter}"</p>
                    </div>
                ) : (
                    filteredTasks.map(task => {
                        const isExpanded = expandedTaskId === task.id;
                        const daysLeft = getDaysLeft(task.dueDate);
                        const isOverdue = daysLeft === 'Overdue';
                        const daysLeftColor = isOverdue ? 'text-red-500' : (daysLeft === 'Today' || daysLeft === 'Tomorrow' ? 'text-orange-500' : 'text-slate-500');

                        return (
                            <div key={task.id} className="bg-white rounded-lg shadow-sm border border-slate-200 transition-all duration-200">
                                {/* Header (Click to Expand) */}
                                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 group">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {/* Checkbox */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleCheckboxChange(task.id); }}
                                            className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded border transition-colors ${task.completed ? 'bg-slate-300 border-slate-300' : 'bg-white border-slate-400 group-hover:border-slate-500'
                                                }`}
                                        >
                                            {task.completed && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                                        </button>

                                        {/* Title & Tags */}
                                        <div className="flex flex-col min-w-0 gap-0.5">
                                            <span
                                                onClick={() => toggleExpand(task.id)}
                                                className={`font-bold text-slate-700 truncate select-none ${task.completed ? 'line-through text-slate-400' : ''}`}
                                            >
                                                {task.title}
                                            </span>
                                            {task.tags && task.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {task.tags.map(tag => (
                                                        <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getTagStyle(tag)}`}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 ml-4">
                                        {/* Days Left */}
                                        {!task.completed && (
                                            <span className={`text-xs font-medium whitespace-nowrap ${daysLeftColor}`}>
                                                {daysLeft}
                                            </span>
                                        )}

                                        {/* Due Date Label */}
                                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                                            {formatDateLabel(task.dueDate)}
                                        </span>

                                        {/* Action Menu (Delete) - Fixed Dropdown */}
                                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id)}
                                                className={`p-1 rounded transition-colors ${activeMenuTaskId === task.id ? 'text-slate-600 bg-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                <EllipsisHorizontalIcon className="w-5 h-5" />
                                            </button>

                                            {activeMenuTaskId === task.id && (
                                                <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-100 shadow-md rounded-md py-1 z-50">
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Expand Icon */}
                                        <button onClick={() => toggleExpand(task.id)}>
                                            <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center gap-4">
                                            <ClockIcon className={`w-5 h-5 ${task.dueDate ? 'text-blue-500' : 'text-slate-400'}`} />
                                            <input
                                                type="date"
                                                className="border border-slate-200 rounded px-2 py-1 text-sm text-slate-600 focus:border-blue-500 focus:outline-none bg-white"
                                                value={task.dueDate.split('T')[0]} // Simple ISO split for date input
                                                onChange={(e) => {
                                                    // Update Date (Simple Local State Update)
                                                    const newDate = new Date(e.target.value).toISOString();
                                                    setTasks(tasks.map(t => t.id === task.id ? { ...t, dueDate: newDate } : t));
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-start gap-4 relative">
                                            <PencilIcon
                                                className={`w-5 h-5 mt-1 cursor-pointer ${task.description ? 'text-blue-500' : 'text-slate-400'}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingDescriptionId(editingDescriptionId === task.id ? null : task.id);
                                                }}
                                            />
                                            {editingDescriptionId === task.id ? (
                                                <textarea
                                                    className="flex-1 border border-slate-200 rounded p-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none resize-none bg-white"
                                                    rows={3}
                                                    autoFocus
                                                    value={task.description}
                                                    onChange={(e) => {
                                                        setTasks(tasks.map(t => t.id === task.id ? { ...t, description: e.target.value } : t));
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            ) : (
                                                <p className="flex-1 text-sm text-slate-600 py-1" onClick={() => setEditingDescriptionId(task.id)}>
                                                    {task.description || "No Description"}
                                                </p>
                                            )}
                                        </div>

                                        {/* Edit Tags UI */}
                                        <div className="flex items-center gap-4 relative">
                                            <TagIcon
                                                className={`w-5 h-5 cursor-pointer ${task.tags && task.tags.length > 0 ? 'text-blue-500' : 'text-slate-400'}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveTagPopupId(activeTagPopupId === task.id ? null : task.id);
                                                }}
                                            />
                                            <div className="flex flex-wrap gap-2 flex-1">
                                                {(task.tags || []).map(tag => (
                                                    <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getTagStyle(tag)}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Popup for Task Tags */}
                                            {activeTagPopupId === task.id && (
                                                <div className="absolute top-full left-9 mt-2 w-64 bg-white border border-slate-100 shadow-xl rounded-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex flex-wrap gap-2">
                                                        {AVAILABLE_TAGS.map(tag => (
                                                            <button
                                                                key={tag}
                                                                onClick={(e) => { e.stopPropagation(); toggleTaskTag(task.id, tag); }}
                                                                className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors
                                                                    ${(task.tags || []).includes(tag)
                                                                        ? getTagStyle(tag) + ' border-transparent ring-1 ring-offset-1 ring-slate-300'
                                                                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                                                    }
                                                                `}
                                                            >
                                                                {tag}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TaskPage;
