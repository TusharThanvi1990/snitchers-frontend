"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { User, ChatRequest, ChatMessage } from '@/types';

interface ChatContextType {
  isConnected: boolean;
  incomingRequests: ChatRequest[];
  activeChats: User[];
  messages: ChatMessage[];
  sendChatRequest: (toUserId: string, fromName: string) => Promise<void>;
  acceptChatRequest: (requestId: string) => Promise<void>;
  sendMessage: (toUserId: string, message: string) => void;
  closeChat: (partnerId: string) => Promise<void>;
  user: User | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try {
          return JSON.parse(storedUser);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [incomingRequests, setIncomingRequests] = useState<ChatRequest[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>([]);

  const socketData = useSocket(user?._id || user?.id);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }, []);

  const fetchStatus = useCallback(async () => {
    if (!user) return;
    try {
      const reqs = await fetch(`${apiBaseUrl}/api/chat/requests`, {
        headers: getHeaders()
      });
      const reqData = await reqs.json();
      setIncomingRequests(Array.isArray(reqData) ? reqData : []);

      const active = await fetch(`${apiBaseUrl}/api/chat/active`, {
        headers: getHeaders()
      });
      const activeData = await active.json();
      setActiveChats(Array.isArray(activeData) ? activeData : []);
    } catch (err) {
      console.error('Fetch Status Error:', err);
    }
  }, [user, apiBaseUrl, getHeaders]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchStatus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user, fetchStatus]);

  const sendChatRequest = async (toUserId: string, fromName: string) => {
    const res = await fetch(`${apiBaseUrl}/api/chat/request`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ toUserId, fromName })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to send request');
    }
  };

  const acceptChatRequest = async (requestId: string) => {
    const res = await fetch(`${apiBaseUrl}/api/chat/accept/${requestId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (res.ok) {
      fetchStatus();
    }
  };

  const closeChat = async (partnerId: string) => {
    const res = await fetch(`${apiBaseUrl}/api/chat/close`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ partnerId })
    });
    if (res.ok) {
      fetchStatus();
    }
  };

  return (
    <ChatContext.Provider value={{ 
      ...socketData, 
      user, 
      incomingRequests, 
      activeChats, 
      sendChatRequest, 
      acceptChatRequest,
      closeChat
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
