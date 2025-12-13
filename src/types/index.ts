export interface User {
    id: number;
    name: string;
    avatar: string;
}

export interface Message {
    id: number;
    conversationId: number;
    senderId: number | 'me';
    text: string;
    timestamp: string; // ISO string
    replyTo?: {
        id: number;
        text: string;
        senderName: string;
    };
}

export interface Conversation {
    id: number;
    type: 'personal' | 'group';
    title?: string; // For group chats
    userId?: number;
    user?: User;
    participants?: User[]; // For group chats
    lastMessage: Message;
    unread: boolean;
}
// ... existing code ...
export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string; // ISO string
    completed: boolean;
    category: 'My Task' | 'Personal Errands' | 'Urgent To Do';
    tags?: string[]; // New Labels
}
