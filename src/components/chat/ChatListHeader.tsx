import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ChatListHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const ChatListHeader: React.FC<ChatListHeaderProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <header className="px-5 py-4 bg-white border-b border-slate-100/80 sticky top-0 z-10 backdrop-blur-md">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Messages</h1>

            {/* Search Input */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search conversations..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-2xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </header>
    );
};
