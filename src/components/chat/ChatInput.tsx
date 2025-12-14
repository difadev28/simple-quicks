import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ChatInputProps {
    inputText: string;
    setInputText: (text: string) => void;
    onSend: () => void;
    replyingTo: { id: number; text: string; senderName: string } | null;
    onCancelReply: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    inputText,
    setInputText,
    onSend,
    replyingTo,
    onCancelReply
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSend();
        }
    };

    return (
        <div className="bg-white border-t border-slate-100 relative">
            {/* Reply Preview Popup */}
            {replyingTo && (
                <div className="absolute bottom-full left-0 right-0 bg-slate-50 border-t border-slate-200 p-3 flex justify-between items-start z-10 shadow-sm">
                    <div className="flex flex-col max-w-[90%]">
                        <span className="text-xs text-primary-dark font-bold flex items-center gap-1 mb-1">
                            Replying to {replyingTo.senderName}
                        </span>
                        <p className="text-xs text-primary-dark">
                            {replyingTo.text}
                        </p>
                    </div>
                    <button
                        onClick={onCancelReply}
                        className="text-slate-400 hover:text-slate-600 p-1"
                    >
                        <XMarkIcon className="w-5 h-5 text-primary-dark" />
                    </button>
                </div>
            )}

            <div className="p-4 flex gap-2">
                <input
                    type="text"
                    className="flex-1 border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
                    placeholder="Type a new message"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={onSend}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2.5 text-sm font-bold transition-colors flex items-center justify-center"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
