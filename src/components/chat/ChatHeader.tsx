import React from 'react';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Conversation } from '../../types';

interface ChatHeaderProps {
    conversation: Conversation;
    onBack: () => void;
    onClose?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onBack, onClose }) => {
    return (
        <header className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-20 shadow-sm sticky top-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="p-1 -ml-1 text-slate-500 hover:text-slate-800 transition-colors"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                        {conversation.type === 'group' ? conversation.title : conversation.user?.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        {conversation.type === 'group'
                            ? `${conversation.participants?.length || 0} Participants`
                            : 'Online'
                        }
                    </p>
                </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
                <XMarkIcon className="w-6 h-6" />
            </button>
        </header>
    );
};
