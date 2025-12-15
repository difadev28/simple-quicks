import React from 'react';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Conversation } from '../../types';

interface ChatHeaderProps {
    conversation: Conversation;
    onBack: () => void;
    onClose?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onBack }) => {
    return (
        <header className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-20 shadow-sm sticky top-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="p-1 -ml-1 cursor-pointer"
                >
                    <ArrowLeftIcon className="w-5 h-5 text-black" />
                </button>
                <div>
                    <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                        {conversation.type === 'group' ? conversation.title : conversation.user?.name}
                    </h2>
                    <p className="text-xs text-primary-dark font-medium">
                        {conversation.type === 'group'
                            ? `${conversation.participants?.length || 0} Participants`
                            : ''
                        }
                    </p>
                </div>
            </div>
            <button onClick={onBack}>
                <XMarkIcon className="w-5 h-5 text-black cursor-pointer" />
            </button>
        </header>
    );
};
