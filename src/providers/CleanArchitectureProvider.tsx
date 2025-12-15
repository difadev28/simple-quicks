'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface CleanArchitectureContextType {
  // We can add global state or utilities here if needed
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  clearMessages: () => void;
}

const CleanArchitectureContext = createContext<CleanArchitectureContextType | undefined>(undefined);

interface CleanArchitectureProviderProps {
  children: ReactNode;
}

export function CleanArchitectureProvider({ children }: CleanArchitectureProviderProps) {
  const [messages, setMessages] = useState<Array<{ id: string; type: 'error' | 'success'; message: string }>>([]);

  const showError = (message: string) => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, type: 'error', message }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 5000);
  };

  const showSuccess = (message: string) => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, type: 'success', message }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 3000);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const contextValue: CleanArchitectureContextType = {
    showError,
    showSuccess,
    clearMessages,
  };

  return (
    <CleanArchitectureContext.Provider value={contextValue}>
      {children}
      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {messages.map(({ id, type, message }) => (
          <div
            key={id}
            className={`p-4 rounded-lg shadow-lg text-white max-w-md animate-pulse ${
              type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {message}
          </div>
        ))}
      </div>
    </CleanArchitectureContext.Provider>
  );
}

export function useCleanArchitecture() {
  const context = useContext(CleanArchitectureContext);
  if (context === undefined) {
    throw new Error('useCleanArchitecture must be used within a CleanArchitectureProvider');
  }
  return context;
}