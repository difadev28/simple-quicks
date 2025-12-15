import React from 'react';
import {
    EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import type { Message } from '../../types';

interface MessageBubbleProps {
    msg: Message;
    isMe: boolean;
    senderName: string;
    conversationType: 'personal' | 'group';
    isEditing: boolean;
    editInputText: string;
    setEditInputText: (text: string) => void;
    activeMessageId: number | null;
    setActiveMessageId: (id: number | null) => void;
    onReply: (msgId: number, text: string, senderName: string) => void;
    onStartEdit: (msgId: number, text: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: (msgId: number) => void;
    showNewMessageSeparator?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    msg,
    isMe,
    senderName,
    conversationType,
    isEditing,
    editInputText,
    setEditInputText,
    activeMessageId,
    setActiveMessageId,
    onReply,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete,
    showNewMessageSeparator
}) => {
    return (
        <React.Fragment>
            {showNewMessageSeparator && (
                <div className="flex justify-center my-4">
                    <span className="bg-sticker-blue text-primary-blue px-4 py-1 rounded-sm font-bold text-xs shadow-sm">
                        New Message
                    </span>
                </div>
            )}

            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-4 group`}>
                {/* Message Header (Name) for others */}
                <span className={`font-bold text-xs mb-1 ml-1 cursor-default ${isMe
                    ? 'text-[#9B51E0]' // Purple for Me
                    : conversationType === 'group'
                        ? (() => {
                            const id = Number(msg.senderId);
                            const colorIndex = isNaN(id) ? 0 : (id - 1) % 2;
                            const textColors = [
                                'text-[#E5A443]', // Darker Orange for Yellow bg
                                'text-[#43B78D]', // Darker Green for Green bg
                            ];
                            return textColors[colorIndex];
                        })()
                        : 'text-primary-dark' // Default for Personal Chat (Other)
                    }`}>
                    {isMe ? 'You' : senderName}
                </span>

                <div className="flex flex-col max-w-[85%] relative">
                    {/* Reply Preview (Outside Bubble) */}
                    {msg.replyTo && (
                        <div className={`mb-1 p-2 rounded-md text-xs bg-[#F2F2F2] w-full max-w-full opacity-90 text-left`}>
                            <span className="text-primary-dark">{msg.replyTo.text}</span>
                        </div>
                    )}

                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full relative`}>
                        {/* Options Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMessageId(activeMessageId === msg.id ? null : msg.id);
                            }}
                            className={`absolute top-0 ${isMe ? '-left-8' : '-right-8'} p-1 text-slate-400 opacity-100 transition-opacity`}
                        >
                            <EllipsisHorizontalIcon className="w-5 h-5" />
                        </button>

                        {/* Active Options Menu */}
                        {activeMessageId === msg.id && (
                            <div className={`absolute top-6 ${isMe ? 'right-full mr-[-2em]' : 'left-full ml-[-2em]'} bg-white shadow-xl border border-slate-100 rounded-lg py-1 z-30 min-w-[120px] flex flex-col`}>
                                <button
                                    onClick={() => onReply(msg.id, msg.text, isMe ? 'You' : senderName)}
                                    className="px-3 py-2 text-left text-xs font-medium text-primary-blue hover:bg-primary-blue hover:text-white flex items-center gap-2"
                                >
                                    Reply
                                </button>
                                {isMe && (
                                    <button
                                        onClick={() => onStartEdit(msg.id, msg.text)}
                                        className="px-3 py-2 text-left text-xs font-medium text-primary-blue hover:bg-primary-blue hover:text-white flex items-center gap-2"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => onDelete(msg.id)}
                                    className="px-3 py-2 text-left text-xs font-medium text-indicator-red hover:bg-indicator-red hover:text-white flex items-center gap-2"
                                >
                                    Delete
                                </button>
                            </div>
                        )}

                        {/* Bubble */}
                        <div
                            className={`px-4 py-3 rounded-tr-md rounded-tl-md shadow-sm text-[13px] leading-relaxed text-primary-dark
                            ${isMe
                                    ? 'bg-[#EEDCFF] rounded-bl-md rounded-br-none' // Me: Purple
                                    : conversationType === 'group'
                                        ? (() => {
                                            // Others: Rotate Yellow / Green
                                            const id = Number(msg.senderId);
                                            // Ensure valid index 0 or 1
                                            const colorIndex = isNaN(id) ? 0 : (id - 1) % 2;
                                            const colors = [
                                                'bg-[#FCEED3]', // Yellow
                                                'bg-[#D2F2EA]', // Green
                                            ];
                                            return `${colors[colorIndex]} rounded-br-md rounded-bl-none`;
                                        })()
                                        : 'bg-[#F8F8F8] rounded-br-md rounded-bl-none'
                                }
                        `}
                        >


                            {isEditing ? (
                                <div className="min-w-[500px]">
                                    <textarea
                                        value={editInputText}
                                        onChange={(e) => setEditInputText(e.target.value)}
                                        className="w-full p-2 text-xs border rounded bg-white/50 mb-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                        rows={3}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={onCancelEdit} className="text-xs font-bold text-primary-dark hover:text-slate-700">Cancel</button>
                                        <button onClick={onSaveEdit} className="text-xs font-bold text-purple-600 hover:text-purple-800">Update</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {msg.text}
                                    <div className={`text-[10px] mt-1 font-medium text-primary-gray text-left`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
