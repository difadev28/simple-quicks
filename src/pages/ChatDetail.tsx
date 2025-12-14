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
        markConversationAsRead,
        isLoading
    } = useChat();

    const [inputText, setInputText] = useState('');
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
    const [editInputText, setEditInputText] = useState('');
    const [activeMessageId, setActiveMessageId] = useState<number | null>(null);
    const [replyingTo, setReplyingTo] = useState<{ id: number; text: string; senderName: string } | null>(null);

    // Capture initial unread status
    const [initialUnreadStatus, setInitialUnreadStatus] = useState(false);
    const [hasInitializedUnread, setHasInitializedUnread] = useState(false);

    useEffect(() => {
        if (!isLoading && !hasInitializedUnread && conversations.length > 0) {
            const c = conversations.find(c => c.id === conversationId);
            if (c) {
                setInitialUnreadStatus(c.unread);
                setHasInitializedUnread(true);
            }
        }
    }, [isLoading, conversations, conversationId, hasInitializedUnread]);

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
        deleteMessage(conversationId, messageId);
        setActiveMessageId(null);
    };

    if (!conversation && !isLoading) {
        return <div className="p-10 text-center">Conversation not found</div>;
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
            <ChatHeader
                conversation={conversation || { id: 0, title: 'Loading...', type: 'personal', lastMessage: {} as any, unread: false }}
                onBack={() => navigate('/chat')}
            />

            <MessageList
                messages={messages}
                conversation={conversation || { id: 0, type: 'personal', lastMessage: {} as any, unread: false }} // Fallback during load
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

            <div className="relative z-20">
                {isLoading && (
                    <div className="absolute bottom-full left-0 w-full flex justify-center pb-2 pointer-events-none">
                        <div className="bg-[#E9F3FF] text-primary-blue px-4 py-2 rounded-lg text-xs font-bold shadow-md animate-in fade-in slide-in-from-bottom-2">
                            Please wait while we connect you with one of our team...
                        </div>
                    </div>
                )}
                <ChatInput
                    inputText={inputText}
                    setInputText={setInputText}
                    onSend={handleSend}
                    replyingTo={replyingTo}
                    onCancelReply={() => setReplyingTo(null)}
                />
            </div>
        </div>
    );
};

export default ChatDetail;
