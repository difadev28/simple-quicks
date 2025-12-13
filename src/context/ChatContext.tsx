import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Message, Conversation } from '../types';

interface ChatContextType {
    conversations: Conversation[];
    users: User[]; // Cache of users
    currentConversationId: number | null;
    setCurrentConversationId: (id: number | null) => void;
    messages: Record<number, Message[]>; // conversationId -> messages
    sendMessage: (conversationId: number, text: string, replyTo?: Message['replyTo']) => void;
    deleteMessage: (conversationId: number, messageId: number) => void;
    editMessage: (conversationId: number, messageId: number, newText: string) => void;
    markConversationAsRead: (conversationId: number) => void;
    getConversationMessages: (conversationId: number) => Message[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// MOCK DATA
const MOCK_USERS: User[] = [
    { id: 1, name: 'Mary Hilda', avatar: 'https://i.pravatar.cc/150?u=mary' },
    { id: 2, name: 'Obaidullah Amarkhil', avatar: 'https://i.pravatar.cc/150?u=obaid' },
    { id: 3, name: 'You', avatar: 'https://i.pravatar.cc/150?u=me' }, // Myself
    { id: 4, name: 'Cameron Williamson', avatar: 'https://i.pravatar.cc/150?u=cameron' },
    { id: 5, name: 'Ellen Knop', avatar: 'https://i.pravatar.cc/150?u=ellen' },
];

const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 101,
        type: 'group',
        title: 'I-589 - AMARKHIL, Obaidullah',
        participants: [MOCK_USERS[0], MOCK_USERS[1]], // Mary and Obaidullah
        lastMessage: {
            id: 10,
            conversationId: 101,
            senderId: 1,
            text: 'Sure thing, Claren.',
            timestamp: new Date().toISOString()
        },
        unread: true // This one has "New" indicator in list, and new messages inside
    },
    {
        id: 102,
        type: 'personal',
        userId: 2,
        user: MOCK_USERS[1],
        lastMessage: {
            id: 20,
            conversationId: 102,
            senderId: 2,
            text: 'I will check the documents.',
            timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        unread: false
    },
    {
        id: 103,
        type: 'personal',
        userId: 4,
        user: MOCK_USERS[3],
        lastMessage: {
            id: 30,
            conversationId: 103,
            senderId: 4,
            text: 'Can we schedule a call?',
            timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        unread: false
    },
    {
        id: 104,
        type: 'personal',
        userId: 5,
        user: MOCK_USERS[4],
        lastMessage: {
            id: 40,
            conversationId: 104,
            senderId: 5,
            text: 'Thanks for the update!',
            timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        },
        unread: false
    }
];

// Helper to create date for "Yesterday" and "Today"
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const INITIAL_MESSAGES: Record<number, Message[]> = {
    101: [
        // Yesterday's Chat
        { id: 1, conversationId: 101, senderId: 1, text: 'Just Fill me in for his updates yea?', timestamp: new Date(yesterday.setHours(19, 32)).toISOString() },
        { id: 2, conversationId: 101, senderId: 'me', text: 'No worries. It will be completed ASAP. I’ve asked him yesterday.', timestamp: new Date(yesterday.setHours(19, 32)).toISOString() },

        // Today's Chat (New Messages)
        { id: 3, conversationId: 101, senderId: 2, text: 'Hello everyone, checking in on this case.', timestamp: new Date(today.setHours(9, 15)).toISOString() },
        { id: 31, conversationId: 101, senderId: 1, text: 'Hello Obaidullah, I will be your case advisor for case #029290. I have assigned some homework for you to fill. Please keep up with the due dates. Should you have any questions, you can message me anytime. Thanks.', timestamp: new Date(today.setHours(9, 30)).toISOString() },
        { id: 4, conversationId: 101, senderId: 'me', text: 'Please contact Mary for questions regarding the case bcs she will be managing your forms from now on! Thanks Mary.', timestamp: new Date(today.setHours(9, 35)).toISOString() },
        { id: 5, conversationId: 101, senderId: 1, text: 'Sure thing, Claren.', timestamp: new Date(today.setHours(9, 36)).toISOString() },
    ],
    102: [
        { id: 21, conversationId: 102, senderId: 2, text: 'Hi', timestamp: new Date(Date.now() - 86405000).toISOString() },
        { id: 22, conversationId: 102, senderId: 2, text: 'I will check the documents.', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ],
    103: [
        { id: 31, conversationId: 103, senderId: 4, text: 'Can we schedule a call?', timestamp: new Date(Date.now() - 172800000).toISOString() }
    ],
    104: [
        { id: 41, conversationId: 104, senderId: 5, text: 'Thanks for the update!', timestamp: new Date(Date.now() - 259200000).toISOString() }
    ]
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [messages, setMessages] = useState<Record<number, Message[]>>(INITIAL_MESSAGES);
    const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

    const sendMessage = (conversationId: number, text: string, replyTo?: Message['replyTo']) => {
        const newMessage: Message = {
            id: Date.now(),
            conversationId,
            senderId: 'me',
            text,
            timestamp: new Date().toISOString(),
            replyTo
        };

        setMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), newMessage]
        }));

        // Update last message in conversation
        setConversations(prev => prev.map(c =>
            c.id === conversationId ? { ...c, lastMessage: newMessage } : c
        ));
    };

    const deleteMessage = (conversationId: number, messageId: number) => {
        setMessages(prev => ({
            ...prev,
            [conversationId]: prev[conversationId].filter(m => m.id !== messageId)
        }));
    };

    const editMessage = (conversationId: number, messageId: number, newText: string) => {
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
            users: MOCK_USERS,
            currentConversationId,
            setCurrentConversationId,
            messages,
            sendMessage,
            deleteMessage,
            editMessage,
            markConversationAsRead,
            getConversationMessages
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
