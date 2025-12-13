import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import {
    ArrowLeftIcon,
    EllipsisHorizontalIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

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
    // Capture the initial unread status to ensure we show the separator even if it gets marked read during the session
    const [initialUnreadStatus] = useState(() => {
        // We need to find the conversation manually here because 'conversation' variable is defined later
        const c = conversations.find(c => c.id === conversationId);
        return c?.unread ?? false;
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversation = conversations.find(c => c.id === conversationId);

    useEffect(() => {
        if (id) {
            setCurrentConversationId(conversationId);
            scrollToBottom();

            // Mark as read immediately when entering the chat, 
            // BUT we want to keep the "unread" state visually for the "New Message" separator to render initially.
            // The separator logic relies on conversation.unread.
            // If we mark it read immediately, the separator won't show or will flicker.

            // However, the user asked: "ketika did click detail itu ada info new Message... tapi ketika aku klik back itu langsung ilang"
            // This implies we should mark it as read *when leaving* or simply *after* rendering.

            // The ERROR "Maximum update depth exceeded" happens if we update state that triggers re-render inside useEffect without proper checks or in a loop.
            // Calling `markConversationAsRead` updates `conversations` context state.
            // If `conversations` is a dependency of this useEffect (via `useChat`), it triggers the effect again -> loop.

            // Solution: We should NOT depend on the entire `conversations` array or functions that change identity if possible.
            // Or better, only run this ONCE per conversationId change.
        }

        // Cleanup function runs when component unmounts OR when dependencies change.
        return () => {
            setCurrentConversationId(null);
            // We mark as read ONLY on unmount (leaving the page)
            if (id) {
                markConversationAsRead(Number(id));
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, conversationId]); // Removed `conversations` and functions from deps to avoid loops. explicitly trusting id/conversationId


    const messages = getConversationMessages(conversationId);
    useEffect(() => {
        scrollToBottom();
    }, [messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = () => {
        if (!inputText.trim()) return;
        sendMessage(conversationId, inputText);
        setInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
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
            {/* Header */}
            <header className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-20 shadow-sm sticky top-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/chat')}
                        className="p-1 -ml-1 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                            {conversation.type === 'group' ? conversation.title : conversation.user?.name}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            {conversation.type === 'group'
                                ? `${conversation.participants?.length || 0} Participants`
                                : 'Online'
                            }
                        </p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white relative" onClick={() => setActiveMessageId(null)}>

                {/* Render Messages grouped by Date */}
                {(() => {
                    const groupedMessages: { [date: string]: typeof messages } = {};
                    messages.forEach(msg => {
                        const date = new Date(msg.timestamp).toLocaleDateString();
                        if (!groupedMessages[date]) groupedMessages[date] = [];
                        groupedMessages[date].push(msg);
                    });

                    // Determine where to split for "New Message" separator
                    // Logic: If conversation WAS unread when we entered, we show the separator.
                    // We use initialUnreadStatus (captured in state) so it persists even if we mark logic as read in background/cleanup.
                    const isConversationUnread = initialUnreadStatus;

                    // Logic: The "New Message" separator should appear after the last message sent by 'me'.
                    // If I haven't sent any messages, it should appear before the first message.
                    let unreadSeparatorMessageId: number | null = null;
                    if (isConversationUnread) {
                        let lastMyMessageIndex = -1;
                        // Manual loop to ensure compatibility if .findLastIndex is missing
                        for (let i = messages.length - 1; i >= 0; i--) {
                            if (messages[i].senderId === 'me') {
                                lastMyMessageIndex = i;
                                break;
                            }
                        }

                        if (lastMyMessageIndex !== -1) {
                            // If I sent a message, the first "New" message is the one immediately following it (if it exists)
                            if (lastMyMessageIndex < messages.length - 1) {
                                unreadSeparatorMessageId = messages[lastMyMessageIndex + 1].id;
                            }
                        } else if (messages.length > 0) {
                            // If I never sent a message, the very first message is "New"
                            unreadSeparatorMessageId = messages[0].id;
                        }
                    }

                    return Object.entries(groupedMessages).map(([date, msgs]) => {
                        // Check if this date is "Today"
                        const msgDate = new Date(msgs[0].timestamp);
                        const today = new Date();
                        const isToday = msgDate.toDateString() === today.toDateString();
                        const yesterday = new Date(today);
                        yesterday.setDate(today.getDate() - 1);
                        const isYesterday = yesterday.toDateString() === msgDate.toDateString();

                        let dateLabel = msgDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                        if (isToday) dateLabel = `Today ${dateLabel}`;
                        else if (isYesterday) dateLabel = `Yesterday ${dateLabel}`;

                        // Check if we should show "New Message" separator before this group
                        // Simple Mock Logic: If it is "Today" and Unread, and we haven't shown it yet.
                        // Or we can try to find the specific message index. 
                        // Let's just put it inside the group loop.

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

                                {msgs.map((msg, index) => {
                                    const isMe = msg.senderId === 'me';

                                    // Determine sender name safely for groups or personal
                                    let senderName = 'Unknown';
                                    if (!isMe) {
                                        if (conversation.type === 'personal') {
                                            senderName = conversation.user?.name || 'Unknown';
                                        } else {
                                            const participant = conversation.participants?.find(p => p.id === msg.senderId);
                                            senderName = participant?.name || 'Unknown';
                                        }
                                    }
                                    const isEditing = editingMessageId === msg.id;

                                    // Separator Logic: Show before the first message of "Today" if unread AND it is NOT me (message from others)
                                    // AND ensure we only show it once.
                                    // The issue "belum ada tepat diatas yg message baru masi di yg sebelumnya" implies it might be showing too early or late.
                                    // In this loop we are iterating messages. `msg` is the current message.
                                    // If this `msg` is the first one suitable (Today + !isMe), we show the separator right here.
                                    // We need to capture if we have SHOWN it, but purely based on the message being the pivot.

                                    // Refined Logic:
                                    // Find the index of the first message that is "Today" and "!isMe".
                                    // If the current `index` matches that index, show the separator.

                                    // Separator Logic: Show before if this is the target unread message
                                    const showNewMessageSeparator = msg.id === unreadSeparatorMessageId;

                                    return (
                                        <React.Fragment key={msg.id}>
                                            {showNewMessageSeparator && (
                                                <div className="flex justify-center my-4">
                                                    <span className="bg-red-50 text-red-500 px-4 py-1 rounded-full font-bold text-xs shadow-sm">
                                                        New Message
                                                    </span>
                                                </div>
                                            )}

                                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-4 group`}>
                                                {/* Message Header (Name) for others */}
                                                {!isMe && (
                                                    <span className={`font-bold text-xs mb-1 ml-1 cursor-default ${conversation.type === 'group' ? 'text-orange-400' : 'text-slate-500'}`}>
                                                        {senderName}
                                                    </span>
                                                )}

                                                <div className="flex items-end max-w-[85%] relative">
                                                    {/* Options Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveMessageId(activeMessageId === msg.id ? null : msg.id);
                                                        }}
                                                        className={`absolute top-0 ${isMe ? '-left-8' : '-right-8'} p-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity`}
                                                    >
                                                        <EllipsisHorizontalIcon className="w-5 h-5" />
                                                    </button>

                                                    {/* Active Options Menu */}
                                                    {activeMessageId === msg.id && (
                                                        <div className={`absolute top-6 ${isMe ? 'right-full mr-2' : 'left-full ml-2'} bg-white shadow-xl border border-slate-100 rounded-lg py-1 z-30 min-w-[100px] flex flex-col`}>
                                                            {isMe && (
                                                                <button
                                                                    onClick={() => startEditing(msg.id, msg.text)}
                                                                    className="px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                                >
                                                                    <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => confirmDelete(msg.id)}
                                                                className="px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            >
                                                                <TrashIcon className="w-3.5 h-3.5" /> Delete
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Bubble */}
                                                    <div
                                                        className={`px-4 py-3 rounded-tr-2xl rounded-tl-2xl shadow-sm text-[13px] leading-relaxed text-slate-800
                                                            ${isMe
                                                                ? 'bg-[#E5D4FF] rounded-bl-2xl rounded-br-none'
                                                                : 'bg-[#FDF1D6] rounded-br-2xl rounded-bl-none'
                                                            }
                                                        `}
                                                    >
                                                        {isEditing ? (
                                                            <div className="min-w-[200px]">
                                                                <textarea
                                                                    value={editInputText}
                                                                    onChange={(e) => setEditInputText(e.target.value)}
                                                                    className="w-full p-2 text-xs border rounded bg-white/50 mb-2 focus:outline-none focus:ring-1 focus:ring-purple-400"
                                                                    rows={3}
                                                                />
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={cancelEdit} className="text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                                                                    <button onClick={saveEdit} className="text-xs font-bold text-purple-600 hover:text-purple-800">Update</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {msg.text}
                                                                <div className={`text-[10px] mt-2 font-medium ${isMe ? 'text-purple-400' : 'text-slate-400'} text-right`}>
                                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {isMe && (
                                                    <span className="text-purple-400 font-bold text-xs mt-1 mr-1">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        );
                    });
                })()}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
                        placeholder="Type a new message"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-2.5 text-sm font-bold transition-colors flex items-center justify-center"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatDetail;
