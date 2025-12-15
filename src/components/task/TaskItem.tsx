import React from 'react';
import {
    ChevronDownIcon,
    EllipsisHorizontalIcon,
    ClockIcon,
    PencilIcon, 
    CheckIcon, 
    BookmarkIcon
} from '@heroicons/react/24/outline';
import { AVAILABLE_TAGS } from '../../constants/taskConstants';
import { getDaysLeft, getTagStyle, formatDateMonth } from '../../utils/taskUtils';
import { useClickOutside } from '../../hooks/useClickOutside';
import type { Task } from '../../types';

interface TaskItemProps {
    task: Task;
    isExpanded: boolean;
    isMenuOpen: boolean;
    isTagPopupOpen: boolean;
    isEditingDescription: boolean;
    onToggleExpand: () => void;
    onToggleMenu: () => void;
    onToggleTagPopup: () => void;
    onToggleDescriptionEdit: () => void;
    onToggleComplete: () => void;
    onDelete: () => void;
    onUpdateDate: (date: string) => void;
    onUpdateDescription: (desc: string) => void;
    onUpdateTitle: (title: string) => void;
    onToggleTag: (tag: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    isExpanded,
    isMenuOpen,
    isTagPopupOpen,
    isEditingDescription,
    onToggleExpand,
    onToggleMenu,
    onToggleTagPopup,
    onToggleDescriptionEdit,
    onToggleComplete,
    onDelete,
    onUpdateDate,
    onUpdateDescription,
    onUpdateTitle,
    onToggleTag
}) => {
    const daysLeft = getDaysLeft(task.dueDate);

    const tagPopupRef = useClickOutside<HTMLDivElement>(
        () => onToggleTagPopup(),
        isTagPopupOpen
    );

    // Handle Title Change inside the component to avoid input lag if needed, or direct prop
    // Direct prop with optimistic update in hook is fast enough usually.

    return (
        <div className="bg-white border-b border-slate-200 transition-all duration-200">
            {/* Header (Click to Expand) */}
            <div className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 ${isExpanded ? 'pb-3' : ''}`}>
                <div className="flex gap-3 flex-1 min-w-0">
                    {/* Checkbox */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
                        className={`flex-shrink-0 w-4 h-4 flex items-center justify-center rounded border transition-colors bg-white border-slate-400 group-hover:border-slate-500 cursor-pointer`}
                    >
                        {task.completed && <CheckIcon className="w-3.5 h-3.5 text-slate-600" />}
                    </button>

                    {/* Title Input - Editable */}
                    <div className="flex flex-col gap-1 min-w-0 flex-1" onClick={onToggleExpand}>
                        <input
                            type="text"
                            value={task.title}
                            onChange={(e) => onUpdateTitle(e.target.value)}
                            autoFocus={!task.title}
                            onClick={(e) => {
                                // Prevent toggle expand when clicking input? 
                                // User said "persis sama kek task item", usually header click expands.
                                // If input takes focus, maybe don't expand?
                                // Let's stop propagation if user is interacting with text.
                                e.stopPropagation();
                            }}
                            className={`font-bold text-primary-dark leading-tight text-sm bg-transparent border-none focus:ring-0 focus:outline-none p-0 w-full placeholder-slate-400 ${task.completed ? 'line-through text-slate-500' : ''}`}
                            placeholder="Type Task Title"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs flex-shrink-0">
                    {!task.completed && (
                        <span className={`font-medium text-indicator-red`}>
                            {daysLeft}
                        </span>
                    )}
                    <span className="text-slate-400">
                        {formatDateMonth(task.dueDate)}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}>
                        <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform cursor-pointer ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); onToggleMenu(); }}>
                            <EllipsisHorizontalIcon className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-100 shadow-lg rounded-lg py-1 z-10" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {
                isExpanded && (
                    <div className="px-4 pb-4 space-y-3 ml-6  animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-3">
                            <ClockIcon className="w-4 h-4 text-primary-blue" />
                            <input
                                type="date"
                                className="border border-slate-200 rounded px-2 py-1 text-sm text-slate-600 focus:border-blue-500 focus:outline-none"
                                defaultValue={task.dueDate.split('T')[0]}
                                onChange={(e) => onUpdateDate(new Date(e.target.value).toISOString())}
                            />
                        </div>
                        <div className="flex items-start gap-3">
                            <PencilIcon
                                className={`w-4 h-4 mt-1 cursor-pointer ${task.description !== '' ? 'text-primary-blue' : 'text-primary-dark'}`}
                                onClick={onToggleDescriptionEdit}
                            />

                            {isEditingDescription ? (
                                <textarea
                                    className="flex-1 border border-slate-200 rounded p-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none"
                                    rows={3}
                                    defaultValue={task.description}
                                    autoFocus
                                    onBlur={(e) => {
                                        onUpdateDescription(e.target.value);
                                        onToggleDescriptionEdit();
                                    }}
                                />
                            ) : (
                                <p
                                    className="flex-1 text-sm text-slate-600 leading-relaxed cursor-pointer hover:text-slate-800"
                                    onClick={onToggleDescriptionEdit}
                                >
                                    {task.description || "No description."}
                                </p>
                            )}
                        </div>

                        {/* Tags in Expanded View */}
                        <div className="flex items-center gap-3 pl-0 relative">
                            <BookmarkIcon
                                className={`w-4 h-4 cursor-pointer ${task.tags && task.tags.length > 0 ? 'text-primary-blue' : 'text-primary-dark'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleTagPopup();
                                }}
                            />

                            <div className="flex flex-wrap gap-2">
                                {task.tags && task.tags.map(tag => (
                                    <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getTagStyle(tag)}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Popup for Tags */}
                            {isTagPopupOpen && (
                                <div ref={tagPopupRef} className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 shadow-xl rounded-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex flex-col gap-2">
                                        {AVAILABLE_TAGS.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={(e) => { e.stopPropagation(); onToggleTag(tag); }}
                                                className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors
                                                ${(task.tags || []).includes(tag)
                                                        ? getTagStyle(tag) + ' border-transparent ring-1 ring-offset-1 ring-slate-300'
                                                        : 'bg-slate-50 text-primary-dark border-slate-200 hover:bg-slate-100'
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
                )
            }
        </div >
    );
};
