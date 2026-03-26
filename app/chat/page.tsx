"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '@/context/ChatContext';
import styles from './chat.module.css';
import { 
  MessageCircle, 
  Ghost, 
  Send, 
  X, 
  Users, 
  Flame, 
  Heart, 
  Search, 
  PlusCircle,
  Plus,
  Settings,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { User, ChatRequest } from '@/types';
import Link from 'next/link';

export default function ChatLobby() {
  const [activeTab, setActiveTab] = useState<'chat' | 'explore'>('chat'); // Default to chat (Shadow Lobby)
  const [sidebarTab, setSidebarTab] = useState<'active' | 'pending'>('active');
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
      const users = Array.isArray(data) ? data : [];
      setTimeout(() => setExploreUsers(users), 0);
    } catch (err) {
      console.error('Fetch Users Error:', err);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchExploreUsers();
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
    setSidebarTab('active');
    setActiveTab('chat');
  };

  if (!user) {
    return (
      <div className={styles.lobbyContainer}>
        <div className={styles.emptyState}>
          <div className={styles.fireIcon}>
            <div className={styles.fireGlow}></div>
            <Ghost size={60} className={styles.fireSymbol} />
          </div>
          <h2 className={styles.emptyTitle}>Whispers are hidden in the shadows.</h2>
          <p className={styles.emptyDesc}>Please log in to join the Chat Lobby.</p>
          <Link href="/login">
            <button className={styles.btnSignature}>Enter the Shadows</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.lobbyContainer}>
      {/* SideNavBar: The Veil */}
      <aside className={styles.veilNav}>
        <div className={styles.veilHeader}>
          <h1 className={styles.veilTitle}>The Veil</h1>
          <p className={styles.veilSubtitle}>Anonymous Presence</p>
        </div>
        
        <nav className={styles.navLinks}>
          <button 
            className={`${styles.navLink} ${activeTab === 'chat' ? styles.activeLink : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle size={20} />
            Whispers
          </button>
          <button 
            className={`${styles.navLink}`}
          >
            <Users size={20} />
            Coven
          </button>
          <button 
            className={`${styles.navLink}`}
          >
            <Sparkles size={20} />
            Rituals
          </button>
          <button 
            className={`${styles.navLink}`}
          >
            <BookOpen size={20} />
            Archives
          </button>
        </nav>

        <div className={styles.veilFooter}>
          <button className={styles.btnNewSecret}>
            <Plus size={16} />
            New Secret
          </button>
          <button className={styles.navLink}>
            <Settings size={20} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Layout */}
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        
        {/* Sidebar: Active Souls & Pending Whispers */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            {/* Toggle Header */}
            <div className={styles.tabToggle}>
              <button 
                className={`${styles.tabButton} ${sidebarTab === 'active' ? styles.tabButtonActive : ''}`}
                onClick={() => { setSidebarTab('active'); setActiveTab('chat'); }}
              >
                Active Souls
              </button>
              <button 
                className={`${styles.tabButton} ${sidebarTab === 'pending' ? styles.tabButtonActive : ''}`}
                onClick={() => setSidebarTab('pending')}
              >
                Pending Whispers
                {incomingRequests.length > 0 && (
                  <span className={styles.badge}>{incomingRequests.length}</span>
                )}
              </button>
            </div>

            {/* Sub Nav Links (matching template top nav links) */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '0 0.5rem' }}>
                <button 
                  onClick={() => setActiveTab('chat')}
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    padding: '0 0 0.25rem 0',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-headline)',
                    borderBottom: activeTab === 'chat' ? '2px solid #D63447' : '2px solid transparent',
                    color: activeTab === 'chat' ? '#D63447' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Shadow Lobby
                </button>
                <button 
                  onClick={() => setActiveTab('explore')}
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    padding: '0 0 0.25rem 0',
                    fontWeight: 500,
                    fontSize: '1.125rem',
                    fontFamily: 'var(--font-headline)',
                    borderBottom: activeTab === 'explore' ? '2px solid #D63447' : '2px solid transparent',
                    color: activeTab === 'explore' ? '#D63447' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  Explore Souls
                </button>
            </div>

            {/* Search Input */}
            <div className={styles.searchContainer}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                className={styles.searchField} 
                placeholder="Search a presence..." 
                type="text"
              />
            </div>
          </div>

          {/* List Area */}
          <div className={styles.listArea}>
            {sidebarTab === 'active' ? (
              activeChats.length > 0 ? (
                activeChats.map(soul => {
                    const partnerId = (soul._id || soul.id);
                    return (
                        <div 
                        key={partnerId} 
                        className={`${styles.chatCard} ${currentChat?.withUserId === partnerId ? styles.chatCardActive : ''}`}
                        onClick={() => {
                            if (partnerId) {
                                setCurrentChat({ withUserId: partnerId, withName: soul.anonymousName || 'Anonymous Soul' });
                                setActiveTab('chat');
                            }
                        }}
                        >
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatar}>
                                <Ghost size={24} color="var(--primary)" opacity={0.6} />
                            </div>
                            <div className={`${styles.onlineIndicator} ${styles.pulse}`}></div>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.cardHeader}>
                            <h3 className={styles.cardName}>{soul.anonymousName || 'Anonymous Soul'}</h3>
                            <span className={styles.cardTime}>12m</span>
                            </div>
                            <p className={styles.cardCollege}>{soul.college || 'ST. JUDE ACADEMY'}</p>
                            <p className={styles.cardSnippet}>The secret we shared...</p>
                        </div>
                        <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                if (partnerId) {
                                  closeChat(partnerId); 
                                  if (currentChat?.withUserId === partnerId) setCurrentChat(null); 
                                }
                            }}
                        >
                            <X size={14} />
                        </button>
                        </div>
                    );
                })
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                    <p>No active sessions.</p>
                </div>
              )
            ) : (
              incomingRequests.length > 0 ? (
                incomingRequests.map(req => (
                  <div key={req._id} className={styles.chatCard}>
                    <div className={styles.avatar}>
                        <Heart size={20} color="var(--primary)" />
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardName}>{req.fromName}</h3>
                      <p className={styles.cardCollege}>Wants to whisper</p>
                    </div>
                    <button className={styles.unreadCount} style={{ background: 'var(--primary)', width: 'auto', padding: '0 0.75rem', height: '2rem' }} onClick={() => handleAccept(req)}>
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                    <p>No requests in the shadows.</p>
                </div>
              )
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <section className={styles.mainChat}>
            {activeTab === 'explore' ? (
                <div className={styles.exploreContent}>
                    <div className={styles.exploreGrid}>
                        {exploreUsers.map(soul => (
                            <div key={soul._id} className={styles.userCard}>
                                <div className={styles.userAvatar}>
                                    <Ghost size={40} />
                                </div>
                                <h3 className={styles.userName}>{soul.anonymousName}</h3>
                                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>{soul.college}</p>
                                <div className={styles.userInterests}>
                                    {soul.interests?.slice(0, 3).map((i: string, idx: number) => (
                                        <span key={idx} className={styles.interestTag}>{i}</span>
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
                            <div className={styles.avatar} style={{ width: '2.5rem', height: '2.5rem' }}>
                                <Ghost size={20} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{currentChat.withName}</h3>
                                <small style={{ color: 'var(--on-surface-variant)' }}>Presence established</small>
                            </div>
                        </div>
                        <button 
                            onClick={() => setCurrentChat(null)} 
                            style={{ background: 'none', border: 'none', color: 'var(--on-surface)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>
                    </header>

                    <div className={styles.chatBody} ref={scrollRef}>
                        <div style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.8rem', padding: '1rem', opacity: 0.6 }}>
                            Messages vanish through the veil when you leave.
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

                    <div className={styles.chatInputBar}>
                        <form className={styles.glassInput} onSubmit={handleSendMessage}>
                            <button type="button" className={styles.iconBtn}>
                                <PlusCircle size={20} />
                            </button>
                            <input 
                                className={styles.textInput} 
                                placeholder="Whisper into the void..." 
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button type="submit" className={styles.sendBtn}>
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.decoration}>
                        <div className={styles.glow}></div>
                    </div>
                    <div className={styles.emptyState}>
                        <div className={styles.fireIcon}>
                            <div className={styles.fireGlow}></div>
                            <Flame size={60} className={styles.fireSymbol} style={{ fill: 'currentColor' }} />
                        </div>
                        <h2 className={styles.emptyTitle}>The Shadows Await</h2>
                        <p className={styles.emptyDesc}>Select a soul from your coven to begin whispering secrets through the veil. Every word is a ghost, every presence an enigma.</p>
                        <button className={styles.btnSignature} onClick={() => setActiveTab('explore')}>
                            Seek New Souls
                        </button>
                    </div>
                </>
            )}
        </section>
      </div>
    </div>
  );
}
