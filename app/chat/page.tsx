"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '@/context/ChatContext';
import styles from './chat.module.css';
import { MessageCircle, Ghost, Send, X, Users, Flame, Info, Heart } from 'lucide-react';
import { User, ChatRequest } from '@/types';

export default function ChatLobby() {
  const [activeTab, setActiveTab] = useState<'chat' | 'explore'>('explore');
  const [currentChat, setCurrentChat] = useState<{ withUserId: string; withName: string } | null>(null);
  const [exploreUsers, setExploreUsers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { 
    user, 
    incomingRequests, 
    activeChats, 
    messages, 
    sendMessage, 
    acceptChatRequest, 
    closeChat,
    sendChatRequest 
  } = useChat();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  const fetchExploreUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setExploreUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch Users Error:', err);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExploreUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchExploreUsers]);

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

  const handleStartChat = async (targetUser: User) => {
    try {
      if (!user) return;
      await sendChatRequest(targetUser._id, user.anonymousName || 'Anonymous');
      alert(`Chat request sent to ${targetUser.anonymousName}!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send request.";
      alert(message);
    }
  };

  const handleAccept = (request: ChatRequest) => {
    acceptChatRequest(request._id);
    setCurrentChat({ withUserId: request.from, withName: request.fromName });
    setActiveTab('chat');
  };

  if (!user) {
    return (
      <div className={styles.lobbyContainer}>
        <div className={styles.emptyState}>
          <Info size={48} />
          <h2>Whispers are hidden in the shadows.</h2>
          <p>Please log in to join the Chat Lobby.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.lobbyContainer}>
      {/* Sidebar: Active Souls & Requests */}
      <aside className={styles.sidebar}>
        <div className={`${styles.section} glass-card`}>
          <h2><Flame size={20} /> Active Souls</h2>
          <div className={styles.activeSoulsList}>
            {activeChats.length > 0 ? (
              activeChats.map(soul => (
                <div 
                  key={soul._id || soul.id} 
                  className={`${styles.soulCard} ${currentChat?.withUserId === (soul._id || soul.id) ? styles.active : ''}`}
                  onClick={() => {
                    const partnerId = (soul._id || soul.id);
                    if (partnerId) {
                      setCurrentChat({ withUserId: partnerId, withName: soul.anonymousName || 'Anonymous Soul' });
                      setActiveTab('chat');
                    }
                  }}
                >
                  <div className={styles.soulInfo}>
                    <span><span className={styles.status}></span>{soul.anonymousName || 'Anonymous Soul'}</span>
                    <small>{soul.college}</small>
                  </div>
                  <button 
                    className={styles.closeChatBtn} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      const partnerId = (soul._id || soul.id);
                      if (partnerId) {
                        closeChat(partnerId); 
                        if (currentChat?.withUserId === partnerId) setCurrentChat(null); 
                      }
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No active sessions.</p>
            )}
          </div>
        </div>

        <div className={`${styles.section} glass-card`}>
          <h2><Heart size={20} /> Pending Whispers</h2>
          <div className={styles.requestsList}>
            {incomingRequests.length > 0 ? (
              incomingRequests.map(req => (
                <div key={req._id} className={styles.requestCard}>
                  <div className={styles.requestInfo}>
                    <strong>{req.fromName}</strong>
                    <small>wants to whisper</small>
                  </div>
                  <button className={styles.acceptBtn} onClick={() => handleAccept(req)}>
                    Accept
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.emptyText}>No requests in the shadows.</p>
            )}
          </div>
        </div>

        <button 
          className={`${styles.exploreToggle} ${activeTab === 'explore' ? styles.active : ''}`}
          onClick={() => { setActiveTab('explore'); setCurrentChat(null); }}
        >
          <Users size={20} /> Explore Souls
        </button>
      </aside>

      {/* Main Content: Chat or Explore */}
      <main className={styles.mainContent}>
        {activeTab === 'explore' ? (
          <div className={`${styles.section} glass-card`}>
            <h2><Users size={24} /> Explore Anonymous Souls</h2>
            <div className={styles.exploreGrid}>
              {exploreUsers.map(soul => (
                <div key={soul._id} className={styles.userCard}>
                  <div className={styles.userAvatar}>
                    <Ghost size={32} />
                  </div>
                  <h3>{soul.anonymousName}</h3>
                  <p>{soul.college}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {soul.interests?.slice(0, 2).map((i: string, idx: number) => (
                      <span key={idx} className="badge">{i}</span>
                    ))}
                  </div>
                  <button className={styles.requestBtn} onClick={() => handleStartChat(soul)}>
                    <Send size={16} /> Send Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : currentChat ? (
          <div className={styles.chatWindow}>
            <header className={styles.chatHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Flame size={24} />
                <div>
                  <h3 style={{ margin: 0 }}>{currentChat.withName}</h3>
                  <small style={{ opacity: 0.8 }}>Volatile conversation...</small>
                </div>
              </div>
              <button 
                onClick={() => setCurrentChat(null)} 
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </header>

            <div className={styles.chatBody} ref={scrollRef}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '1rem' }}>
                Messages vanish when you leave this session.
              </div>
              {messages
                .filter(m => m.fromUserId === currentChat.withUserId || m.fromUserId === (user?._id || user?.id))
                .map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`${styles.message} ${msg.fromUserId === (user?._id || user?.id) ? styles.sent : styles.received}`}
                  >
                    {msg.message}
                  </div>
                ))}
            </div>

            <form className={styles.chatFooter} onSubmit={handleSendMessage}>
              <input 
                type="text" 
                className={styles.chatInput} 
                placeholder="Whisper something..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className={styles.sendBtn}>
                <Send size={20} />
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MessageCircle size={64} opacity={0.1} />
            <h2>Welcome to the Lobby</h2>
            <p>Select an active soul or explore the shadows to start a whisper.</p>
          </div>
        )}
      </main>
    </div>
  );
}
