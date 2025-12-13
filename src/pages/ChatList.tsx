import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { NavLink } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ChatList: React.FC = () => {
    const { conversations } = useChat();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConversations = conversations.filter(c => {
        const nameToSearch = c.type === 'group' ? c.title : c.user?.name;
        return (nameToSearch || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-2">
                {filteredConversations.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>No conversations found</p>
                    </div>
                ) : (
                    <ul className="space-y-1 py-2">
                        {filteredConversations.map((conversation) => {
                            const isGroup = conversation.type === 'group';
                            const title = isGroup ? conversation.title : conversation.user?.name;
                            const avatar = isGroup ? 'https://ui-avatars.com/api/?name=Group&background=random' : conversation.user?.avatar; // Fallback or group icon

                            // For group chats: "Sender Name: Message"
                            // For personal: "Message"
                            let lastMessageText = conversation.lastMessage.text;
                            if (isGroup && conversation.lastMessage.senderId !== 'me') {
                                // Find sender name from participants
                                const sender = conversation.participants?.find(p => p.id === conversation.lastMessage.senderId);
                                if (sender) {
                                    lastMessageText = `${sender.name}: ${lastMessageText}`;
                                }
                            }

                            return (
                                <li key={conversation.id}>
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
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ChatList;
