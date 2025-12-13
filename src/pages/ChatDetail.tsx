import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { ChatInput } from '../components/chat/ChatInput';

const ChatDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const conversationId = Number(id);
    const navigate = useNavigate();
    const {
        conversations,
        getConversationMessages,
        sendMessage,
        deleteMessage,
        editMessage,
        setCurrentConversationId,
        markConversationAsRead
    } = useChat();

    const [inputText, setInputText] = useState('');
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editInputText, setEditInputText] = useState('');
    const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
    const [replyingTo, setReplyingTo] = useState<{ id: number; text: string; senderName: string } | null>(null);

    // Capture initial unread status
    const [initialUnreadStatus] = useState(() => {
        const c = conversations.find(c => c.id === conversationId);
        return c?.unread ?? false;
    });

    const conversation = conversations.find(c => c.id === conversationId);

    useEffect(() => {
        if (id) {
            setCurrentConversationId(conversationId);
        }

        return () => {
            setCurrentConversationId(null);
            if (id) {
                markConversationAsRead(Number(id));
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, conversationId]);

    const messages = getConversationMessages(conversationId);

    const handleSend = () => {
        if (!inputText.trim()) return;
        sendMessage(conversationId, inputText, replyingTo ? { id: replyingTo.id, text: replyingTo.text, senderName: replyingTo.senderName } : undefined);
        setInputText('');
        setReplyingTo(null);
    };

    const startEditing = (messageId: number, currentText: string) => {
        setEditingMessageId(messageId);
        setEditInputText(currentText);
        setActiveMessageId(null);
    };

    const saveEdit = () => {
        if (editingMessageId && editInputText.trim()) {
            editMessage(conversationId, editingMessageId, editInputText);
            setEditingMessageId(null);
            setEditInputText('');
        }
    };

    const cancelEdit = () => {
        setEditingMessageId(null);
        setEditInputText('');
    };

    const handleReply = (messageId: number, text: string, senderName: string) => {
        setReplyingTo({ id: messageId, text, senderName });
        setActiveMessageId(null);
    };

    const confirmDelete = (messageId: number) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            deleteMessage(conversationId, messageId);
        }
        setActiveMessageId(null);
    };

    if (!conversation) {
        return <div className="p-10 text-center">Conversation not found</div>;
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
            <ChatHeader
                conversation={conversation}
                onBack={() => navigate('/chat')}
            />

            <MessageList
                messages={messages}
                conversation={conversation}
                initialUnreadStatus={initialUnreadStatus}
                activeMessageId={activeMessageId}
                setActiveMessageId={setActiveMessageId}
                editingMessageId={editingMessageId}
                editInputText={editInputText}
                setEditInputText={setEditInputText}
                onReply={handleReply}
                onStartEdit={startEditing}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onDelete={confirmDelete}
            />

            <ChatInput
                inputText={inputText}
                setInputText={setInputText}
                onSend={handleSend}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
            />
        </div>
    );
};

export default ChatDetail;
