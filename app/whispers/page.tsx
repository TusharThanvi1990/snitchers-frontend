"use client";

import React, { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import gsap from 'gsap';
import styles from './whispers.module.css';
import WhisperCard from '@/components/WhisperCard';
import FloatingHearts from '@/components/FloatingHearts';
import CreateWhisperModal from '@/components/CreateWhisperModal';

import { User, Whisper } from '@/types';

function WhispersContent() {
  const searchParams = useSearchParams();
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [filteredWhispers, setFilteredWhispers] = useState<Whisper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try { return JSON.parse(storedUser); } catch { return null; }
      }
    }
    return null;
  });
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridIdRef = useRef<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowModal(true);
    }
  }, [searchParams]);

  const fetchWhispers = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWhispers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchWhispers]);

  useEffect(() => {
    const filtered = whispers.filter(w => 
      w && w.content && (
        w.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (w.user?.college && w.user.college.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) ||
        (w.targetPerson && w.targetPerson.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
      )
    );
    setFilteredWhispers(filtered);
  }, [debouncedSearchQuery, whispers]);

  const handleLike = async (id: string) => {
    if (!user) {
      alert('Please login to like whispers!');
      return;
    }

    // Optimistic UI Update
    const isCurrentlyLiked = user?.likedWhispers?.includes(id);
    const updatedLikedWhispers = isCurrentlyLiked 
      ? user?.likedWhispers?.filter(wid => wid !== id) 
      : [...(user?.likedWhispers || []), id];
    
    const previousWhispers = [...whispers];
    const previousUser = user ? { ...user } : null;

    // Apply optimistic changes
    setWhispers(prev => prev.map(w => 
      w._id === id ? { ...w, likesCount: isCurrentlyLiked ? Math.max(0, w.likesCount - 1) : w.likesCount + 1 } : w
    ));
    if (user) {
      setUser({ ...user, likedWhispers: updatedLikedWhispers });
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBaseUrl}/api/whispers/${id}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id || user?.id })
      });
      const data = await res.json();
      
      if (res.ok && data.whisper) {
        // Confirm server state
        setWhispers(prev => prev.map(w => w._id === id ? { ...w, likesCount: data.whisper.likesCount } : w));
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        // Rollback on server error
        setWhispers(previousWhispers);
        if (previousUser) setUser(previousUser);
        console.error('Like toggle failed:', data.message);
      }
    } catch (error) {
      // Rollback on connection error
      setWhispers(previousWhispers);
      if (previousUser) setUser(previousUser);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to erase this secret forever?')) return;
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/whispers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setWhispers(prev => prev.filter(w => w._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'The shadows refused to erase this secret.');
      }
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };

  const handleFlag = async (id: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/whispers/${id}/flag`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setWhispers(prev => prev.map(w => w._id === id ? { ...w, isFlagged: true } : w));
        alert('Whisper flagged for moderation.');
      }
    } catch (error) {
      console.error('Flag Error:', error);
    }
  };

  useEffect(() => {
    if (!loading && filteredWhispers.length > 0) {
      // Only re-animate the entire grid if the search query or whisper count changes.
      // Simple interactions like liking or commenting shouldn't trigger the staggered entrance.
      const currentGridId = `${debouncedSearchQuery}-${filteredWhispers.length}`;
      if (gridIdRef.current !== currentGridId) {
        gsap.fromTo(`.${styles.card}`, 
          { opacity: 0, scale: 0.95, y: 30 }, 
          { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
        gridIdRef.current = currentGridId;
      }
    }
  }, [loading, filteredWhispers.length, debouncedSearchQuery]);

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
              creatorId={whisper.user?._id || whisper.user?.id}
              role={user?.role}
              userCollege={user?.college}
              onLike={handleLike}
              onComment={handleComment}
              onDelete={handleDelete}
              onFlag={handleFlag}
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

export default function WhispersPage() {
  return (
    <Suspense fallback={<div>Loading whispers...</div>}>
      <WhispersContent />
    </Suspense>
  );
}
