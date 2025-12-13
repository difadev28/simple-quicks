import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { ChatListHeader } from '../components/chat/ChatListHeader';
import { ChatListItem } from '../components/chat/ChatListItem';
import { Loader } from '../components/common/Loader';

const ChatList: React.FC = () => {
    const { conversations } = useChat();
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); // 1 second delay
        return () => clearTimeout(timer);
    }, []);

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
            <ChatListHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />

            <div className="flex-1 overflow-y-auto px-2">
                {isLoading ? (
                    <Loader text="Loading Chats..." />
                ) : (
                    <>
                        {filteredConversations.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <p>No conversations found</p>
                            </div>
                        ) : (
                            <ul className="space-y-1 py-2">
                                {filteredConversations.map((conversation) => (
                                    <ChatListItem
                                        key={conversation.id}
                                        conversation={conversation}
                                        formatTime={formatTime}
                                    />
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatList;
