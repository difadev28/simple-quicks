import type { User, Conversation, Message } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Helpers to generate consistent fake data
const generateTimestamp = (index: number) => {
    const date = new Date();
    date.setHours(date.getHours() - index * 2); // Spread messages out by hours
    return date.toISOString();
};

const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

export const chatApi = {
    getUsers: async (): Promise<User[]> => {
        const res = await fetch(`${BASE_URL}/users`);
        const data = await res.json();
        return data.map((u: any) => ({
            id: u.id,
            name: u.name,
            avatar: getAvatar(u.name)
        }));
    },

    getConversations: async (): Promise<Conversation[]> => {
        // We'll simulate conversations using "Users" (Personal) and "Posts" (Groups)
        const [usersRes, postsRes] = await Promise.all([
            fetch(`${BASE_URL}/users?_limit=5`),
            fetch(`${BASE_URL}/posts?_limit=3`) // 3 Group chats
        ]);

        const users = await usersRes.json();
        const posts = await postsRes.json();

        const personalChats: Conversation[] = users.map((u: any, index: number) => ({
            id: u.id, // ID 1-5
            type: 'personal',
            userId: u.id,
            user: {
                id: u.id,
                name: u.name,
                avatar: getAvatar(u.name)
            },
            unread: index < 2, // First 2 unread
            lastMessage: {
                id: u.id * 100,
                conversationId: u.id,
                senderId: u.id,
                text: `Hello! This is a message from ${u.name}`,
                timestamp: generateTimestamp(index)
            }
        }));

        const groupChats: Conversation[] = posts.map((p: any, index: number) => ({
            id: 100 + p.id, // ID 101-103
            type: 'group',
            title: p.title.slice(0, 30) + (p.title.length > 30 ? '...' : ''),
            participants: users.slice(0, 3).map((u: any) => ({ id: u.id, name: u.name, avatar: getAvatar(u.name) })),
            unread: index === 0,
            lastMessage: {
                id: (100 + p.id) * 100,
                conversationId: 100 + p.id,
                senderId: users[0].id,
                text: p.body.slice(0, 50),
                timestamp: generateTimestamp(index)
            }
        }));

        return [...groupChats, ...personalChats].sort((a, b) =>
            new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
        );
    },

    getMessages: async (conversationId: number): Promise<Message[]> => {
        // Use comments to simulate messages
        // Map conversationId to postId. If ID < 100, it's a user, so map to a post arbitrarily (e.g. postId = conversationId)
        // If ID > 100, it's a group (which we mapped from posts), so map back (id - 100)

        let postId = conversationId;
        if (conversationId > 100) postId = conversationId - 100;

        // Fetch comments for this "post" to represent messages
        const res = await fetch(`${BASE_URL}/comments?postId=${postId}`);
        if (!res.ok) return [];

        const comments = await res.json();

        return comments.map((c: any, index: number) => ({
            id: c.id,
            conversationId: conversationId,
            senderId: index % 2 === 0 ? 'me' : (c.id % 3) + 1, // IDs 1-3 to match group participants
            text: c.body,
            timestamp: generateTimestamp(comments.length - index), // Reverse time so bottom is new
            replyTo: index > 2 && Math.random() > 0.8 ? {
                id: c.id - 1,
                text: "Previous message...",
                senderName: "Someone"
            } : undefined
        }));
    },

    sendMessage: async (conversationId: number, text: string): Promise<Message> => {
        // Simulate POST
        const res = await fetch(`${BASE_URL}/posts`, { // JSONPlaceholder doesn't have /messages, use /posts or /comments
            method: 'POST',
            body: JSON.stringify({
                title: 'New Message',
                body: text,
                userId: 1,
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });

        const data = await res.json();

        return {
            id: data.id + Date.now(), // Ensure unique ID
            conversationId,
            senderId: 'me',
            text: text,
            timestamp: new Date().toISOString()
        };
    }
};
