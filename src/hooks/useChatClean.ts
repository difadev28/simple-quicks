import { useState, useEffect, useCallback } from 'react';
import { Message, SendMessageRequest, User, Conversation } from '@/domain/chat/chat.entity';
import { Result } from '@/domain/common/result';
import { sendMessageUseCase, getMessagesUseCase } from '@/infrastructure/di/container';

export function useChatClean() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send message with optimistic update
  const sendMessage = useCallback(async (request: SendMessageRequest): Promise<boolean> => {
    // Create temporary message for optimistic update
    const tempMessage: Message = {
      id: Date.now(), // Temporary ID
      conversationId: request.conversationId,
      text: request.text,
      sender: request.sender,
      timestamp: new Date(),
      isRead: false,
    };

    // Optimistically add message
    setMessages(prev => ({
      ...prev,
      [request.conversationId]: [...(prev[request.conversationId] || []), tempMessage]
    }));

    try {
      const result = await sendMessageUseCase.execute(request);

      if (result.isFailure) {
        // Remove temporary message on failure
        setMessages(prev => ({
          ...prev,
          [request.conversationId]: prev[request.conversationId].filter(m => m.id !== tempMessage.id)
        }));
        setError(result.error?.message || 'Failed to send message');
        return false;
      }

      // Replace temporary message with real one
      if (result.value) {
        setMessages(prev => ({
          ...prev,
          [request.conversationId]: prev[request.conversationId].map(m =>
            m.id === tempMessage.id ? result.value! : m
          )
        }));
      }

      return true;
    } catch (err) {
      // Remove temporary message on error
      setMessages(prev => ({
        ...prev,
        [request.conversationId]: prev[request.conversationId].filter(m => m.id !== tempMessage.id)
      }));
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      return false;
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getMessagesUseCase.execute(conversationId);

      if (result.isFailure) {
        setError(result.error?.message || 'Failed to fetch messages');
        return;
      }

      setMessages(prev => ({
        ...prev,
        [conversationId]: result.value || []
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set current conversation and fetch its messages if not already loaded
  const selectConversation = useCallback((conversationId: number) => {
    setCurrentConversationId(conversationId);

    if (!messages[conversationId]) {
      fetchMessages(conversationId);
    }
  }, [messages, fetchMessages]);

  // Get messages for current conversation
  const currentMessages = currentConversationId
    ? messages[currentConversationId] || []
    : [];

  return {
    conversations,
    messages,
    currentMessages,
    users,
    currentConversationId,
    isLoading,
    error,
    sendMessage,
    fetchMessages,
    selectConversation,
    clearError: () => setError(null),
  };
}