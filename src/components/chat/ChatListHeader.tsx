import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ChatListHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const ChatListHeader: React.FC<ChatListHeaderProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <header className="px-5 py-4 bg-white border-b border-slate-100/80 sticky top-0 z-10 backdrop-blur-md">
            <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-3 w-3 text-primary-dark" />
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="block w-full pl-10 pr-10 py-1 border border-primary-gray rounded-md leading-5 text-primary-dark  placeholder-primary-dark  transition-all duration-200 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </header>
    );
};
