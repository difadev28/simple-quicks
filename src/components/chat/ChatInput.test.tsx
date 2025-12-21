import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
    const mockProps = {
        inputText: '',
        setInputText: jest.fn(),
        onSend: jest.fn(),
        replyingTo: null,
        onCancelReply: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders input field and send button', () => {
        render(<ChatInput {...mockProps} />);

        expect(screen.getByPlaceholderText('Type a new message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    });

    it('calls setInputText when typing in the input', async () => {
        const user = userEvent.setup();
        render(<ChatInput {...mockProps} />);

        const input = screen.getByPlaceholderText('Type a new message');
        await user.type(input, 'Hello');

        expect(mockProps.setInputText).toHaveBeenCalledTimes(5);
        expect(mockProps.setInputText).toHaveBeenLastCalledWith('o');
    });

    it('calls onSend when Send button is clicked', async () => {
        const user = userEvent.setup();
        render(<ChatInput {...{ ...mockProps, inputText: 'Hello' }} />);

        const sendButton = screen.getByRole('button', { name: 'Send' });
        await user.click(sendButton);

        expect(mockProps.onSend).toHaveBeenCalledTimes(1);
    });

    it('calls onSend when Enter key is pressed', async () => {
        const user = userEvent.setup();
        render(<ChatInput {...{ ...mockProps, inputText: 'Hello' }} />);

        const input = screen.getByPlaceholderText('Type a new message');
        await user.type(input, '{Enter}');

        expect(mockProps.onSend).toHaveBeenCalledTimes(1);
    });

    it('displays reply preview when replyingTo is provided', () => {
        const replyingTo = {
            id: 1,
            text: 'Original message',
            senderName: 'John Doe'
        };

        render(<ChatInput {...{ ...mockProps, replyingTo }} />);

        expect(screen.getByText(/Replying to John Doe/)).toBeInTheDocument();
        expect(screen.getByText('Original message')).toBeInTheDocument();
    });

    it('calls onCancelReply when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const replyingTo = {
            id: 1,
            text: 'Original message',
            senderName: 'John Doe'
        };

        render(<ChatInput {...{ ...mockProps, replyingTo }} />);

        const cancelButton = document.querySelector('button[class*="text-slate-400"]');
        await user.click(cancelButton!);

        expect(mockProps.onCancelReply).toHaveBeenCalledTimes(1);
    });

    it('does not display reply preview when replyingTo is null', () => {
        render(<ChatInput {...mockProps} />);

        expect(screen.queryByText(/Replying to/)).not.toBeInTheDocument();
    });
});