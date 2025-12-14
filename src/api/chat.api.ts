import type { User, Conversation, Message } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Helpers to generate consistent fake data
const generateTimestamp = (index: number) => {
    const date = new Date();
    date.setHours(date.getHours() - index * 2); // Spread messages out by hours
    return date.toISOString();
};

export const chatApi = {
    getUsers: async (): Promise<User[]> => {
        const res = await fetch(`${BASE_URL}/users`);
        const data = await res.json();
        return data.map((u: any) => ({
            id: u.id,
            name: u.name,
        }));
    },

    getConversations: async (): Promise<Conversation[]> => {
        // We'll simulate conversations using "Users" (Personal) and "Posts" (Groups)
        const [usersRes, postsRes] = await Promise.all([
            fetch(`${BASE_URL}/users?_limit=5`),
            fetch(`${BASE_URL}/posts?_limit=5`) // 3 Group chats
        ]);

        const users = await usersRes.json();
        const posts = await postsRes.json();

        // Helper to fetch last message for a conversation context
        const fetchLastMessage = async (postId: number, conversationId: number, defaultSenderId: number, index: number) => {
            const res = await fetch(`${BASE_URL}/comments?postId=${postId}`);
            const comments = await res.json();
            if (comments.length === 0) return null;

            const lastComment = comments[comments.length - 1]; // Latest
            return {
                id: lastComment.id,
                conversationId,
                senderId: defaultSenderId, // Simplified for list view
                text: lastComment.body,
                timestamp: generateTimestamp(index) // "Now"
            };
        };

        const personalChatsProp = await Promise.all(users.map(async (u: any, index: number) => {
            const isUnread = index < 2;
            // Unread (0,1) need to be newest (lowest index in generateTimestamp)
            const timeIndex = isUnread ? index : index + 5;

            const lastMsg = await fetchLastMessage(u.id, u.id, u.id, timeIndex);
            return {
                id: u.id, // ID 1-5
                type: 'personal',
                userId: u.id,
                user: {
                    id: u.id,
                    name: u.name,
                },
                unread: isUnread,
                lastMessage: lastMsg || {
                    id: u.id * 100,
                    conversationId: u.id,
                    senderId: u.id,
                    text: `Hello! This is a message from ${u.name}`,
                    timestamp: generateTimestamp(timeIndex)
                }
            } as Conversation;
        }));

        const groupChatsProp = await Promise.all(posts.map(async (p: any, index: number) => {
            const timeIndex = index + 2;
            const lastMsg = await fetchLastMessage(p.id, 100 + p.id, users[0].id, timeIndex);
            return {
                id: 100 + p.id, // ID 101-103
                type: 'group',
                title: p.title.slice(0, 30) + (p.title.length > 30 ? '...' : ''),
                participants: users.slice(0, 3).map((u: any) => ({ id: u.id, name: u.name })),
                unread: false,
                lastMessage: lastMsg || {
                    id: (100 + p.id) * 100,
                    conversationId: 100 + p.id,
                    senderId: users[0].id,
                    text: p.body.slice(0, 50),
                    timestamp: generateTimestamp(index)
                }
            } as Conversation;
        }));

        return [...groupChatsProp, ...personalChatsProp].sort((a, b) =>
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

        return comments.map((c: any, index: number) => {
            const isUnreadConversation = conversationId === 1 || conversationId === 2;
            const isLastMessage = index === comments.length - 1;

            // For unread conversations, force the last message to be from 'other' to ensure "New Message" separator appears
            const isMe = isUnreadConversation && isLastMessage
                ? false
                : index % 2 === 0;

            return {
                id: c.id,
                conversationId: conversationId,
                senderId: isMe ? 'me' : (c.id % 3) + 1, // IDs 1-3 to match group participants
                text: c.body,
                timestamp: generateTimestamp(comments.length - index), // Reverse time so bottom is new
                replyTo: index > 2 && Math.random() > 0.8 ? {
                    id: c.id - 1, // Point to previous
                    text: comments[index - 1]?.body || "Previous message...",
                    senderName: index % 2 !== 0 ? "You" : "User " + ((c.id % 3) + 1) // Inverse of current sender logic approx
                } : undefined
            };
        });
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
