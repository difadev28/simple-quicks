import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CATEGORIES } from '../../constants/taskConstants';

interface TaskHeaderProps {
    filter: string;
    setFilter: (filter: typeof CATEGORIES[number]) => void;
    isFilterOpen: boolean;
    setIsFilterOpen: (isOpen: boolean) => void;
    onNewTaskClick: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
    filter,
    setFilter,
    isFilterOpen,
    setIsFilterOpen,
    onNewTaskClick
}) => {
    return (
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
                onClick={onNewTaskClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
                New Task
            </button>
        </header>
    );
};
