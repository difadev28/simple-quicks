import React, { useState } from 'react';
import { ClockIcon, PencilIcon, TagIcon } from '@heroicons/react/24/outline';
import { CATEGORIES, AVAILABLE_TAGS } from '../../constants/taskConstants';
import { getTagStyle } from '../../utils/taskUtils';
import type { Task } from '../../types';

interface NewTaskFormProps {
    onCancel: () => void;
    onCreate: (task: Task) => void;
}

export const NewTaskForm: React.FC<NewTaskFormProps> = ({ onCancel, onCreate }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState<typeof CATEGORIES[number]>('My Task');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [isTagPopupOpen, setIsTagPopupOpen] = useState(false);

    const handleCreate = () => {
        if (!title.trim() || !date) return;

        const newTask: Task = {
            id: Date.now(),
            title,
            description,
            dueDate: new Date(date).toISOString(),
            completed: false,
            category,
            tags
        };
        onCreate(newTask);
    };

    const toggleTag = (tag: string) => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ring-2 ring-blue-500/20" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3 flex-1">
                    <span className="w-5 h-5 flex items-center justify-center rounded border border-slate-300 bg-white text-white"></span>
                    <input
                        type="text"
                        className="font-bold text-slate-700 bg-transparent border-none focus:ring-0 p-0 w-full placeholder-slate-400"
                        placeholder="Type Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>
            <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                    <ClockIcon className={`w-5 h-5 ${date ? 'text-blue-500' : 'text-slate-400'}`} />
                    <input
                        type="date"
                        className="border border-slate-200 rounded px-2 py-1 text-sm text-slate-600 focus:border-blue-500 focus:outline-none"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <PencilIcon className={`w-5 h-5 ${description ? 'text-blue-500' : 'text-slate-400'}`} />
                    <textarea
                        className="flex-1 border border-slate-200 rounded p-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none resize-none"
                        rows={3}
                        placeholder="No Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 pl-9">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600 bg-white"
                    >
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {/* Tags Selection */}
                <div className="flex items-center gap-4 pl-9 relative">
                    <TagIcon
                        className={`w-5 h-5 cursor-pointer ${tags.length > 0 ? 'text-blue-500' : 'text-slate-400'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsTagPopupOpen(!isTagPopupOpen);
                        }}
                    />
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${getTagStyle(tag)}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {isTagPopupOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 shadow-xl rounded-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_TAGS.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors
                                            ${tags.includes(tag)
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
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};
