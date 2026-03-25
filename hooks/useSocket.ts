"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '@/types';

export const useSocket = (userId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!userId) return;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const socket = io(apiBaseUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server:', socket.id);
      setIsConnected(true);
      socket.emit('register', userId);
    });

    socket.on('receive_private_message', (data: ChatMessage) => {
      console.log('Received private message:', data);
      setMessages(prev => [...prev, data]);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = (toUserId: string, message: string) => {
    if (!userId) return;
    socketRef.current?.emit('send_private_message', { toUserId, message, fromUserId: userId });
    setMessages(prev => [...prev, { fromUserId: userId, message, timestamp: new Date().toISOString() }]);
  };

  return {
    isConnected,
    messages,
    setMessages,
    sendMessage
  };
};
