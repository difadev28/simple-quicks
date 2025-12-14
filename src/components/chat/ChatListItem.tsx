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
    const avatar = isGroup ? '/logo/groups.svg' : conversation.user?.avatar;

    const lastMessageText = (
        <div className='flex items-center justify-between w-full'>
            {isGroup && conversation.lastMessage.senderId !== 'me' ? (
                <div className="flex space-x-1 overflow-hidden">
                    <span className="text-primary-dark font-bold shrink-0">
                        {conversation.participants?.find(p => p.id === conversation.lastMessage.senderId)?.name}:
                    </span>
                    <p className="text-primary-gray truncate">
                        {conversation.lastMessage.text}
                    </p>
                </div>
            ) : (
                <p className="text-primary-gray truncate">
                    {conversation.lastMessage.text}
                </p>
            )}

            {conversation.unread && (
                <div className="ml-2 shrink-0">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#EB5757]"></span>
                </div>
            )}
        </div>
    );

    return (
        <li className="border-b border-primary-gray last:border-b-0 mx-4">
            <NavLink
                to={`/chat/${conversation.id}`}
                className={({ isActive }) =>
                    `rounded-2xl transition-all duration-200 hover:bg-slate-50  ${isActive ? 'bg-purple-50' : ''}`
                }
            >
                <div className="flex space-x-4  pb-4 mt-3">
                    <div className="relative flex-shrink-0">
                        {isGroup ? (
                            <img
                                className="h-7 w-10.5 object-cover"
                                src={avatar}
                                alt={title}
                            />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-primary-blue flex items-center ml-2.5 justify-center text-primary-light font-bold text-xs shadow-sm">
                                {conversation.user?.name.substring(0, 1).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex gap-3 items-baseline mb-1">
                            <p className="text-sm font-bold text-primary-blue line-clamp-2 max-w-[414px]">
                                {title}
                            </p>
                            <p className="text-[11px] text-primary-gray">
                                {formatTime(conversation.lastMessage.timestamp)}
                            </p>
                        </div>
                        <div className="text-xs leading-relaxed">
                            {lastMessageText}
                        </div>
                    </div>

                </div>
            </NavLink>
        </li>
    );
};
