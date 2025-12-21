import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageBubble } from './MessageBubble';
import type { Message } from '../../types';

const mockMessage: Message = {
    id: 1,
    conversationId: 1,
    senderId: 'me',
    text: 'Hello, this is my message',
    timestamp: '2024-01-01T10:30:00Z'
};

const mockOtherMessage: Message = {
    id: 2,
    conversationId: 1,
    senderId: 2,
    text: 'Hello from someone else',
    timestamp: '2024-01-01T10:31:00Z'
};

const mockMessageWithReply: Message = {
    id: 3,
    conversationId: 1,
    senderId: 'me',
    text: 'Replying to previous message',
    timestamp: '2024-01-01T10:32:00Z',
    replyTo: {
        id: 2,
        text: 'Original message',
        senderName: 'Alice'
    }
};

const mockProps = {
    isMe: true,
    senderName: 'John Doe',
    conversationType: 'personal' as const,
    isEditing: false,
    editInputText: '',
    setEditInputText: jest.fn(),
    activeMessageId: null,
    setActiveMessageId: jest.fn(),
    onReply: jest.fn(),
    onStartEdit: jest.fn(),
    onSaveEdit: jest.fn(),
    onCancelEdit: jest.fn(),
    onDelete: jest.fn(),
};

describe('MessageBubble', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders message correctly', () => {
        render(<MessageBubble msg={mockMessage} {...mockProps} />);

        expect(screen.getByText('Hello, this is my message')).toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.getByText(/\d{2}\.\d{2}/)).toBeInTheDocument();
    });

    it('renders other person message correctly', () => {
        render(<MessageBubble msg={mockOtherMessage} {...{ ...mockProps, isMe: false, senderName: 'Alice' }} />);

        expect(screen.getByText('Hello from someone else')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText(/\d{2}\.\d{2}/)).toBeInTheDocument();
    });

    it('shows new message separator when showNewMessageSeparator is true', () => {
        render(<MessageBubble msg={mockMessage} {...{ ...mockProps, showNewMessageSeparator: true }} />);

        expect(screen.getByText('New Message')).toBeInTheDocument();
    });

    it('displays reply preview when message has replyTo', () => {
        render(<MessageBubble msg={mockMessageWithReply} {...mockProps} />);

        expect(screen.getByText('Original message')).toBeInTheDocument();
    });

    it('opens options menu when ellipsis button is clicked', async () => {
        const user = userEvent.setup();
        render(<MessageBubble msg={mockMessage} {...mockProps} />);

        const ellipsisButton = screen.getByRole('button');
        await user.click(ellipsisButton);

        expect(mockProps.setActiveMessageId).toHaveBeenCalledWith(1);
    });

    it('closes options menu when clicking same message', async () => {
        const user = userEvent.setup();
        render(<MessageBubble msg={mockMessage} {...{ ...mockProps, activeMessageId: 1 }} />);

        const ellipsisButton = document.querySelector('button[class*="absolute top-0"]');
        await user.click(ellipsisButton!);

        expect(mockProps.setActiveMessageId).toHaveBeenCalledWith(null);
    });

    it('shows reply, edit, and delete options when menu is open', () => {
        render(
            <MessageBubble
                msg={mockMessage}
                {...{ ...mockProps, activeMessageId: 1 }}
            />
        );

        expect(screen.getByText('Reply')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('only shows reply and delete for other people messages', () => {
        render(
            <MessageBubble
                msg={mockOtherMessage}
                {...{ ...mockProps, isMe: false, activeMessageId: 2 }}
            />
        );

        expect(screen.getByText('Reply')).toBeInTheDocument();
        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('calls onReply when reply option is clicked', async () => {
        const user = userEvent.setup();
        render(
            <MessageBubble
                msg={mockMessage}
                {...{ ...mockProps, activeMessageId: 1 }}
            />
        );

        const replyButton = screen.getByText('Reply');
        await user.click(replyButton);

        expect(mockProps.onReply).toHaveBeenCalledWith(1, 'Hello, this is my message', 'You');
    });

    it('calls onStartEdit when edit option is clicked', async () => {
        const user = userEvent.setup();
        render(
            <MessageBubble
                msg={mockMessage}
                {...{ ...mockProps, activeMessageId: 1 }}
            />
        );

        const editButton = screen.getByText('Edit');
        await user.click(editButton);

        expect(mockProps.onStartEdit).toHaveBeenCalledWith(1, 'Hello, this is my message');
    });

    it('calls onDelete when delete option is clicked', async () => {
        const user = userEvent.setup();
        render(
            <MessageBubble
                msg={mockMessage}
                {...{ ...mockProps, activeMessageId: 1 }}
            />
        );

        const deleteButton = screen.getByText('Delete');
        await user.click(deleteButton);

        expect(mockProps.onDelete).toHaveBeenCalledWith(1);
    });

    it('shows edit mode when isEditing is true', () => {
        render(
            <MessageBubble
                msg={mockMessage}
                {...{ ...mockProps, isEditing: true, editInputText: 'Editing message' }}
            />
        );

        expect(screen.getByDisplayValue('Editing message')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Update')).toBeInTheDocument();
    });

    it('calls setEditInputText when typing in edit mode', async () => {
        const user = userEvent.setup();
        render(
            <MessageBubble
                msg={mockMessage}
                {...{ ...mockProps, isEditing: true, editInputText: 'Editing message' }}
            />
        );

        const textarea = screen.getByDisplayValue('Editing message');
        await user.type(textarea, 's');

        expect(mockProps.setEditInputText).toHaveBeenLastCalledWith('Editing messages');
    });

    it('calls onCancelEdit when cancel button is clicked in edit mode', async () => {
        const user = userEvent.setup();
        render(
            <MessageBubble
                msg={mockMessage}
                {...{ ...mockProps, isEditing: true }}
            />
        );

        const cancelButton = screen.getByText('Cancel');
        await user.click(cancelButton);

        expect(mockProps.onCancelEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onSaveEdit when update button is clicked in edit mode', async () => {
        const user = userEvent.setup();
        render(
            <MessageBubble
                msg={mockMessage}
                {...{ ...mockProps, isEditing: true }}
            />
        );

        const updateButton = screen.getByText('Update');
        await user.click(updateButton);

        expect(mockProps.onSaveEdit).toHaveBeenCalledTimes(1);
    });

    it('applies correct color classes for personal chat', () => {
        const { container } = render(
            <MessageBubble
                msg={mockOtherMessage}
                {...{ ...mockProps, isMe: false, conversationType: 'personal' }}
            />
        );

        const bubble = container.querySelector('.bg-\\[\\#F8F8F8\\]');
        expect(bubble).toBeInTheDocument();
    });

    it('applies correct color classes for group chat', () => {
        const { container } = render(
            <MessageBubble
                msg={mockOtherMessage}
                {...{ ...mockProps, isMe: false, conversationType: 'group' }}
            />
        );

        const bubble = container.querySelector('.bg-\\[\\#FCEED3\\], .bg-\\[\\#D2F2EA\\]');
        expect(bubble).toBeInTheDocument();
    });
});