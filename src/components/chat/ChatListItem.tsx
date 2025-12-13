import React from 'react';
import { NavLink } from 'react-router-dom';
import type { Conversation } from '../../types';

interface ChatListItemProps {
    conversation: Conversation;
    formatTime: (date: string) => string;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ conversation, formatTime }) => {
    const isGroup = conversation.type === 'group';
    const title = isGroup ? conversation.title : conversation.user?.name;
    const avatar = isGroup ? 'https://ui-avatars.com/api/?name=Group&background=random' : conversation.user?.avatar;

    let lastMessageText = conversation.lastMessage.text;
    if (isGroup && conversation.lastMessage.senderId !== 'me') {
        const sender = conversation.participants?.find(p => p.id === conversation.lastMessage.senderId);
        if (sender) {
            lastMessageText = `${sender.name}: ${lastMessageText}`;
        }
    }

    return (
        <li>
            <NavLink
                to={`/chat/${conversation.id}`}
                className={({ isActive }) =>
                    `block p-3 rounded-2xl transition-all duration-200 hover:bg-slate-50 ${isActive ? 'bg-purple-50' : ''}`
                }
            >
                <div className="flex items-center space-x-4">
                    <div className="relative flex-shrink-0">
                        {isGroup ? (
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-100 shadow-sm">
                                GRP
                            </div>
                        ) : (
                            <img
                                className="h-12 w-12 rounded-full object-cover border border-slate-100 shadow-sm"
                                src={avatar}
                                alt={title}
                            />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <p className="text-sm font-bold text-slate-800 truncate">
                                {title}
                            </p>
                            <p className="text-[11px] text-slate-400">
                                {formatTime(conversation.lastMessage.timestamp)}
                            </p>
                        </div>
                        <p className="text-xs text-slate-500 truncate pr-4 leading-relaxed">
                            {lastMessageText}
                        </p>
                    </div>

                    {/* Unread/New Indicator */}
                    {conversation.unread && (
                        <div className="flex flex-col items-end justify-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 uppercase tracking-wide">
                                New
                            </span>
                        </div>
                    )}
                </div>
            </NavLink>
        </li>
    );
};
