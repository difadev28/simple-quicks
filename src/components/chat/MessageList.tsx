import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import type { Message, Conversation } from '../../types';

interface MessageListProps {
    messages: Message[];
    conversation: Conversation;
    initialUnreadStatus: boolean;
    activeMessageId: number | null;
    setActiveMessageId: (id: number | null) => void;
    editingMessageId: number | null;
    editInputText: string;
    setEditInputText: (text: string) => void;
    onReply: (msgId: number, text: string, senderName: string) => void;
    onStartEdit: (msgId: number, text: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: (msgId: number) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    conversation,
    initialUnreadStatus,
    activeMessageId,
    setActiveMessageId,
    editingMessageId,
    editInputText,
    setEditInputText,
    onReply,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    const groupedMessages: { [date: string]: Message[] } = {};
    messages.forEach(msg => {
        const date = new Date(msg.timestamp).toLocaleDateString();
        if (!groupedMessages[date]) groupedMessages[date] = [];
        groupedMessages[date].push(msg);
    });

    let unreadSeparatorMessageId: number | null = null;
    if (initialUnreadStatus) {
        let lastMyMessageIndex = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].senderId === 'me') {
                lastMyMessageIndex = i;
                break;
            }
        }

        if (lastMyMessageIndex !== -1) {
            if (lastMyMessageIndex < messages.length - 1) {
                unreadSeparatorMessageId = messages[lastMyMessageIndex + 1].id;
            }
        } else if (messages.length > 0) {
            unreadSeparatorMessageId = messages[0].id;
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white relative" onClick={() => setActiveMessageId(null)}>
            {Object.entries(groupedMessages).map(([date, msgs]) => {
                const msgDate = new Date(msgs[0].timestamp);
                const today = new Date();
                const isToday = msgDate.toDateString() === today.toDateString();
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const isYesterday = yesterday.toDateString() === msgDate.toDateString();

                let dateLabel = msgDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                if (isToday) dateLabel = `Today ${dateLabel}`;
                else if (isYesterday) dateLabel = `Yesterday ${dateLabel}`;

                return (
                    <div key={date}>
                        {/* Date Separator */}
                        <div className="relative flex items-center justify-center py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300"></div>
                            </div>
                            <span className="relative px-4 text-xs font-bold text-slate-500 bg-white capitalize">
                                {dateLabel}
                            </span>
                        </div>

                        {msgs.map((msg) => {
                            const isMe = msg.senderId === 'me';
                            let senderName = 'Unknown';
                            if (!isMe) {
                                if (conversation.type === 'personal') {
                                    senderName = conversation.user?.name || 'Unknown';
                                } else {
                                    const participant = conversation.participants?.find(p => p.id === msg.senderId);
                                    senderName = participant?.name || 'Unknown';
                                }
                            }

                            return (
                                <MessageBubble
                                    key={msg.id}
                                    msg={msg}
                                    isMe={isMe}
                                    senderName={senderName}
                                    conversationType={conversation.type}
                                    isEditing={editingMessageId === msg.id}
                                    editInputText={editInputText}
                                    setEditInputText={setEditInputText}
                                    activeMessageId={activeMessageId}
                                    setActiveMessageId={setActiveMessageId}
                                    onReply={onReply}
                                    onStartEdit={onStartEdit}
                                    onSaveEdit={onSaveEdit}
                                    onCancelEdit={onCancelEdit}
                                    onDelete={onDelete}
                                    showNewMessageSeparator={msg.id === unreadSeparatorMessageId}
                                />
                            );
                        })}
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};
