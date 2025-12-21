import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChatListItem } from './ChatListItem';
import type { Conversation } from '../../types';

const mockConversation: Conversation = {
    id: 1,
    type: 'personal',
    user: {
        id: 1,
        name: 'John Doe',
        avatar: '/avatar.jpg'
    },
    lastMessage: {
        id: 1,
        conversationId: 1,
        senderId: 'me',
        text: 'Hello, how are you?',
        timestamp: '2024-01-01T10:00:00Z'
    },
    unread: false
};

const mockGroupConversation: Conversation = {
    id: 2,
    type: 'group',
    title: 'Team Chat',
    participants: [
        { id: 1, name: 'Alice', avatar: '/alice.jpg' },
        { id: 2, name: 'Bob', avatar: '/bob.jpg' }
    ],
    lastMessage: {
        id: 2,
        conversationId: 2,
        senderId: 1,
        text: 'Team meeting at 3pm',
        timestamp: '2024-01-01T11:00:00Z'
    },
    unread: true
};

describe('ChatListItem', () => {
    const formatTime = (date: string) => '10:00';

    const renderWithRouter = (component: React.ReactElement) => {
        return render(
            <MemoryRouter>
                {component}
            </MemoryRouter>
        );
    };

    it('renders personal conversation correctly', () => {
        renderWithRouter(
            <ChatListItem conversation={mockConversation} formatTime={formatTime} />
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
        expect(screen.getByText('10:00')).toBeInTheDocument();
        expect(screen.getByText('J')).toBeInTheDocument(); // First letter of name
    });

    it('renders group conversation correctly', () => {
        renderWithRouter(
            <ChatListItem conversation={mockGroupConversation} formatTime={formatTime} />
        );

        expect(screen.getByText('Team Chat')).toBeInTheDocument();
        expect(screen.getByText('Alice:')).toBeInTheDocument();
        expect(screen.getByText('Team meeting at 3pm')).toBeInTheDocument();
        expect(screen.getByAltText('Team Chat')).toBeInTheDocument();
    });

    it('shows unread indicator for unread messages', () => {
        renderWithRouter(
            <ChatListItem conversation={mockGroupConversation} formatTime={formatTime} />
        );

        const unreadIndicator = document.querySelector('span[class*="bg-[#EB5757]"]');
        expect(unreadIndicator).toBeInTheDocument();
    });

    it('does not show unread indicator for read messages', () => {
        renderWithRouter(
            <ChatListItem conversation={mockConversation} formatTime={formatTime} />
        );

        const unreadIndicators = document.querySelectorAll('span[class*="bg-[#EB5757]"]');
        expect(unreadIndicators).toHaveLength(0);
    });

    it('uses user avatar for personal conversations', () => {
        renderWithRouter(
            <ChatListItem conversation={mockConversation} formatTime={formatTime} />
        );

        expect(screen.queryByAltText('John Doe')).not.toBeInTheDocument();
        expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('has correct navigation link', () => {
        renderWithRouter(
            <ChatListItem conversation={mockConversation} formatTime={formatTime} />
        );

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/chat/1');
    });
});