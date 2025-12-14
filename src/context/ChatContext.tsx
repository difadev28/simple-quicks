import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Message, Conversation } from '../types';
import { chatApi } from '../api/chat.api';

interface ChatContextType {
    conversations: Conversation[];
    users: User[];
    currentConversationId: number | null;
    setCurrentConversationId: (id: number | null) => void;
    messages: Record<number, Message[]>;
    sendMessage: (conversationId: number, text: string, replyTo?: Message['replyTo']) => void;
    deleteMessage: (conversationId: number, messageId: number) => void;
    editMessage: (conversationId: number, messageId: number, newText: string) => void;
    markConversationAsRead: (conversationId: number) => void;
    getConversationMessages: (conversationId: number) => Message[];
    isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Record<number, Message[]>>({});
    const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Data Fetch
    useEffect(() => {
        const initData = async () => {
            setIsLoading(true);
            try {
                const [fetchedUsers, fetchedConversations] = await Promise.all([
                    chatApi.getUsers(),
                    chatApi.getConversations()
                ]);
                setUsers(fetchedUsers);
                setConversations(fetchedConversations);
            } catch (error) {
                console.error("Failed to load chat data", error);
            } finally {
                setIsLoading(false);
            }
        };
        initData();
    }, []);

    // Fetch messages when entering a conversation
    useEffect(() => {
        if (currentConversationId && !messages[currentConversationId]) {
            const fetchMsgs = async () => {
                try {
                    const msgs = await chatApi.getMessages(currentConversationId);
                    setMessages(prev => ({
                        ...prev,
                        [currentConversationId]: msgs
                    }));
                } catch (error) {
                    console.error("Failed to load messages", error);
                }
            };
            fetchMsgs();
        }
    }, [currentConversationId, messages]);

    const sendMessage = async (conversationId: number, text: string, replyTo?: Message['replyTo']) => {
        const tempId = Date.now();
        const optimisticMessage: Message = {
            id: tempId,
            conversationId,
            senderId: 'me',
            text,
            timestamp: new Date().toISOString(),
            replyTo
        };

        // Optimistic UI Update
        setMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), optimisticMessage]
        }));

        setConversations(prev => prev.map(c =>
            c.id === conversationId ? { ...c, lastMessage: optimisticMessage } : c
        ));

        try {
            const apiMessage = await chatApi.sendMessage(conversationId, text);
            // Replace temp message with real API message (if ID or content changed)
            setMessages(prev => ({
                ...prev,
                [conversationId]: prev[conversationId].map(m => m.id === tempId ? { ...apiMessage, replyTo } : m)
            }));
        } catch (error) {
            console.error("Failed to send message", error);
            // Revert on failure
            setMessages(prev => ({
                ...prev,
                [conversationId]: prev[conversationId].filter(m => m.id !== tempId)
            }));
        }
    };

    const deleteMessage = (conversationId: number, messageId: number) => {
        // Optimistic
        setMessages(prev => ({
            ...prev,
            [conversationId]: prev[conversationId].filter(m => m.id !== messageId)
        }));
    };

    const editMessage = (conversationId: number, messageId: number, newText: string) => {
        // Optimistic
        setMessages(prev => ({
            ...prev,
            [conversationId]: prev[conversationId].map(m =>
                m.id === messageId ? { ...m, text: newText } : m
            )
        }));
    };

    const markConversationAsRead = (conversationId: number) => {
        setConversations(prev => prev.map(c =>
            c.id === conversationId ? { ...c, unread: false } : c
        ));
    };

    const getConversationMessages = (conversationId: number) => {
        return messages[conversationId] || [];
    };

    return (
        <ChatContext.Provider value={{
            conversations,
            users,
            currentConversationId,
            setCurrentConversationId,
            messages,
            sendMessage,
            deleteMessage,
            editMessage,
            markConversationAsRead,
            getConversationMessages,
            isLoading
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
