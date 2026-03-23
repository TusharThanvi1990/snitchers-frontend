"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import gsap from 'gsap';
import styles from './whispers.module.css';
import WhisperCard from '@/components/WhisperCard';
import FloatingHearts from '@/components/FloatingHearts';
import CreateWhisperModal from '@/components/CreateWhisperModal';

interface Whisper {
  _id: string;
  content: string;
  user?: { college?: string; branch?: string; anonymousName?: string };
  targetPerson?: string;
  createdAt: string;
  likesCount: number;
  commentsCount?: number;
  comments?: { text: string; createdAt: string }[];
}

interface User {
  _id?: string;
  id?: string;
  likedWhispers?: string[];
}

export default function WhispersPage() {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [filteredWhispers, setFilteredWhispers] = useState<Whisper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
    }
  }, []);

  const fetchWhispers = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBaseUrl}/api/whispers`);
      const data = await res.json();
      setWhispers(data);
      setFilteredWhispers(data);
    } catch (error) {
      console.error('Failed to fetch whispers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWhispers();
  }, []);

  useEffect(() => {
    const filtered = whispers.filter(w => 
      w && w.content && (
        w.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.user?.college && w.user.college.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (w.targetPerson && w.targetPerson.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
    setFilteredWhispers(filtered);
  }, [searchQuery, whispers]);

  const handleLike = async (id: string) => {
    if (!user) {
      alert('Please login to like whispers!');
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBaseUrl}/api/whispers/${id}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      const data = await res.json();
      
      if (res.ok && data.whisper) {
        // Update whispers list safely: only update the count to preserve the populated user info
        setWhispers(prev => prev.map(w => w._id === id ? { ...w, likesCount: data.whisper.likesCount } : w));
        
        // Update user state and storage
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        console.error('Like toggle failed:', data.message);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleComment = async (id: string, text: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBaseUrl}/api/whispers/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const updatedWhisper = await res.json();
      
      if (res.ok && updatedWhisper) {
        setWhispers(prev => prev.map(w => w._id === id ? { ...w, commentsCount: updatedWhisper.commentsCount, comments: updatedWhisper.comments } : w));
      } else {
        console.error('Comment failed:', updatedWhisper.message);
      }
    } catch (error) {
      console.error('Failed to comment on whisper:', error);
    }
  };

  useEffect(() => {
    if (!loading && filteredWhispers.length > 0) {
      gsap.fromTo(`.${styles.card}`, 
        { opacity: 0, scale: 0.95, y: 30 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [loading, filteredWhispers]);

  return (
    <div className={styles.container}>
      <FloatingHearts count={6} />
      
      <Link href="/" className={styles.backHome}>
        <ArrowLeft size={18} /> Home
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>Hear the Whispers</h1>
        <p className={styles.subtitle}>Floating secrets from hearts across campus.</p>
      </header>

      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Search by college, person, or secret..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <PlusCircle className={styles.searchIcon} size={24} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--color-romantic-red)', fontStyle: 'italic', padding: '4rem' }}>
          Listening to the shadows...
        </div>
      ) : (
        <div className={styles.feed} ref={containerRef}>
          {filteredWhispers.map((whisper) => (
            <WhisperCard 
              key={whisper._id} 
              id={whisper._id}
              content={whisper.content}
              college={whisper.user?.college || 'Unknown'}
              branch={whisper.user?.branch || 'Anywhere'}
              timestamp={new Date(whisper.createdAt).toLocaleDateString()}
              likes={whisper.likesCount}
              commentsCount={whisper.commentsCount || 0}
              comments={whisper.comments}
              isLiked={user?.likedWhispers?.includes(whisper._id)}
              targetPerson={whisper.targetPerson}
              anonymousName={whisper.user?.anonymousName}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))}
        </div>
      )}

      {/* Placeholder for Add Whisper Button */}
      <button className={styles.addWhisperBtn} onClick={() => setShowModal(true)}>
        <PlusCircle size={32} />
      </button>

      {showModal && (
        <CreateWhisperModal 
          onClose={() => setShowModal(false)} 
          onSuccess={fetchWhispers} 
        />
      )}
    </div>
  );
}
