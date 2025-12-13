import React from 'react';
import {
    EllipsisHorizontalIcon,
    ArrowUturnLeftIcon,
    PencilSquareIcon,
    TrashIcon
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
                    <span className="bg-red-50 text-red-500 px-4 py-1 rounded-full font-bold text-xs shadow-sm">
                        New Message
                    </span>
                </div>
            )}

            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-4 group`}>
                {/* Message Header (Name) for others */}
                {!isMe && (
                    <span className={`font-bold text-xs mb-1 ml-1 cursor-default ${conversationType === 'group' ? 'text-orange-400' : 'text-slate-500'}`}>
                        {senderName}
                    </span>
                )}

                <div className="flex items-end max-w-[85%] relative">
                    {/* Options Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveMessageId(activeMessageId === msg.id ? null : msg.id);
                        }}
                        className={`absolute top-0 ${isMe ? '-left-8' : '-right-8'} p-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                        <EllipsisHorizontalIcon className="w-5 h-5" />
                    </button>

                    {/* Active Options Menu */}
                    {activeMessageId === msg.id && (
                        <div className={`absolute top-6 ${isMe ? 'right-full mr-2' : 'left-full ml-2'} bg-white shadow-xl border border-slate-100 rounded-lg py-1 z-30 min-w-[120px] flex flex-col`}>
                            <button
                                onClick={() => onReply(msg.id, msg.text, isMe ? 'You' : senderName)}
                                className="px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <ArrowUturnLeftIcon className="w-3.5 h-3.5" /> Reply
                            </button>
                            {isMe && (
                                <button
                                    onClick={() => onStartEdit(msg.id, msg.text)}
                                    className="px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                                </button>
                            )}
                            <button
                                onClick={() => onDelete(msg.id)}
                                className="px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <TrashIcon className="w-3.5 h-3.5" /> Delete
                            </button>
                        </div>
                    )}

                    {/* Bubble */}
                    <div
                        className={`px-4 py-3 rounded-tr-2xl rounded-tl-2xl shadow-sm text-[13px] leading-relaxed text-slate-800
                            ${isMe
                                ? 'bg-[#E5D4FF] rounded-bl-2xl rounded-br-none'
                                : 'bg-[#FDF1D6] rounded-br-2xl rounded-bl-none'
                            }
                        `}
                    >
                        {msg.replyTo && (
                            <div className={`mb-2 p-2 rounded bg-opacity-50 text-xs border-l-2 ${isMe ? 'bg-purple-100 border-purple-400' : 'bg-orange-100 border-orange-400'}`}>
                                <span className="font-bold block mb-0.5">{msg.replyTo.senderName}</span>
                                <span className="italic truncate line-clamp-1">{msg.replyTo.text}</span>
                            </div>
                        )}

                        {isEditing ? (
                            <div className="min-w-[200px]">
                                <textarea
                                    value={editInputText}
                                    onChange={(e) => setEditInputText(e.target.value)}
                                    className="w-full p-2 text-xs border rounded bg-white/50 mb-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                    rows={3}
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={onCancelEdit} className="text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                                    <button onClick={onSaveEdit} className="text-xs font-bold text-purple-600 hover:text-purple-800">Update</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {msg.text}
                                <div className={`text-[10px] mt-2 font-medium ${isMe ? 'text-purple-400' : 'text-slate-400'} text-right`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {isMe && (
                    <span className="text-purple-400 font-bold text-xs mt-1 mr-1">
                        You
                    </span>
                )}
            </div>
        </React.Fragment>
    );
};
