"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, UserCheck, Ghost, Flame } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import styles from './Chat.module.css';
import { User, ChatRequest } from '@/types';

interface ChatWidgetProps {
  user: User | null;
}

export default function ChatWidget({ user }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState<{ withUserId: string; withName: string } | null>(null);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { 
    incomingRequests, 
    activeChats,
    messages, 
    sendMessage, 
    acceptChatRequest, 
    closeChat
  } = useChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentChat) return;

    sendMessage(currentChat.withUserId, inputValue);
    setInputValue('');
  };

  const handleAccept = (request: ChatRequest) => {
    acceptChatRequest(request._id);
    setCurrentChat({ withUserId: request.from, withName: request.fromName });
  };

  const handleCloseActiveChat = async (e: React.MouseEvent, partnerId: string) => {
    e.stopPropagation();
    await closeChat(partnerId);
    if (currentChat?.withUserId === partnerId) {
      setCurrentChat(null);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.chatContainer}>
      {isOpen && (
        <div className={`${styles.chatWindow} glass-card`}>
          <header className={styles.chatHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {currentChat ? <Flame size={20} /> : <Ghost size={20} />}
              <h3>{currentChat ? currentChat.withName : 'Chat Lobby'}</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {currentChat && (
                <button onClick={() => setCurrentChat(null)} className={styles.backBtn} title="Back to Lobby">
                  <UserCheck size={18} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
          </header>

          <div className={styles.chatBody} ref={scrollRef}>
            {!currentChat ? (
              <div className={styles.lobbyView}>
                {/* Pending Requests Section */}
                <div className={styles.lobbySection}>
                  <h4>Pending Whispers</h4>
                  {incomingRequests.length > 0 ? (
                    incomingRequests.map(req => (
                      <div key={req._id} className={styles.requestCard}>
                        <p><strong>{req.fromName}</strong> wants to whisper.</p>
                        <div className={styles.requestActions}>
                          <button className={styles.acceptBtn} onClick={() => handleAccept(req)}>
                            Accept
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyText}>No pending requests.</p>
                  )}
                </div>

                {/* Active Chats Section */}
                <div className={styles.lobbySection}>
                  <h4>Active Souls</h4>
                  {activeChats.length > 0 ? (
                    activeChats.map(chat => {
                      const chatPartnerId = (chat._id || chat.id);
                      if (!chatPartnerId) return null;
                      return (
                        <div 
                          key={chatPartnerId} 
                          className={styles.activeChatCard}
                          onClick={() => setCurrentChat({ withUserId: chatPartnerId, withName: chat.anonymousName || 'Anonymous Soul' })}
                        >
                          <div className={styles.activeChatInfo}>
                            <span className={styles.dot}></span>
                            <span>{chat.anonymousName || 'Anonymous Soul'}</span>
                          </div>
                          <button 
                            className={styles.closeChatBtn} 
                            onClick={(e) => handleCloseActiveChat(e, chatPartnerId)}
                            title="End Session"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.emptyLobby}>
                      <Ghost size={32} opacity={0.2} />
                      <p>No active whispering sessions.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  This chat is volatile and will vanish when you leave.
                </div>
                {messages
                  .filter(m => m.fromUserId === currentChat.withUserId || m.fromUserId === (user?._id || user?.id))
                  .map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`${styles.message} ${msg.fromUserId === (user?._id || user?.id) ? styles.sent : styles.received}`}
                    >
                      {msg.message}
                      <div className={styles.timestamp}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>

          {currentChat && (
            <form className={styles.chatFooter} onSubmit={handleSendMessage}>
              <input 
                type="text" 
                className={styles.chatInput} 
                placeholder="Type a whisper..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className={styles.sendBtn}>
                <Send size={18} />
              </button>
            </form>
          )}
        </div>
      )}

      <button className={styles.chatToggle} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {incomingRequests.length > 0 && !isOpen && (
          <div className={styles.notificationBadge}>{incomingRequests.length}</div>
        )}
      </button>
    </div>
  );
}
