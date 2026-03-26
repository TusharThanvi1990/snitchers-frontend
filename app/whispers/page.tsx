"use client";

import React, { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './whispers_premium.module.css';
import PremiumWhisperCard from '@/components/PremiumWhisperCard';
import FloatingHearts from '@/components/FloatingHearts';
import CreateWhisperModal from '@/components/CreateWhisperModal';
import Header from '@/components/Landing/Header';
import { Layout, Plus, PlusCircle, Search, Sparkles, User as UserIcon } from 'lucide-react';
import gsap from 'gsap';

import { User, Whisper } from '@/types';

// Featured images for the masonry grid
const FEATURED_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCmOoc4mdm4gCPf-mYrqjrS0ndff856zbgbAYcyXSLytmSfAYS-ziALUNNnW9_NmuW7so7Y5QXaUbLWjZUku0uCn_mYk0TZn7ReaZN4JSXe3bJpCSDF4BJSGBV6u-6WzHuIwpfUC6Nc8EbrCQ3vTJhNqeki_c6xrn-pqfGpipcNhfWNKQPnutA6HAXbkpaDaEhw8HDCbv_xz4SH3N35WAUap_rIXQ9-SRin6Ug9Gq0Ltxp3fXLszn9EEP4c62sbeGq18_eXwtjz9w",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?q=80&w=1935&auto=format&fit=crop"
];

function WhispersContent() {
  const searchParams = useSearchParams();
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [filteredWhispers, setFilteredWhispers] = useState<Whisper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const gridIdRef = useRef<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        try { 
          const parsed = JSON.parse(storedUser);
          setTimeout(() => setUser(parsed), 0);
        } catch { 
          setTimeout(() => setUser(null), 0);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
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
    fetchWhispers();
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

    const isCurrentlyLiked = user?.likedWhispers?.some(wid => wid.toString() === id);
    const previousWhispers = [...whispers];
    const previousUser = user ? { ...user } : null;

    setWhispers(prev => prev.map(w =>
      w._id === id ? { ...w, likesCount: isCurrentlyLiked ? Math.max(0, w.likesCount - 1) : w.likesCount + 1 } : w
    ));
    const updatedLikedWhispers = isCurrentlyLiked
      ? user?.likedWhispers?.filter(wid => wid !== id)
      : [...(user?.likedWhispers || []), id];
    setUser({ ...user, likedWhispers: updatedLikedWhispers });

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBaseUrl}/api/whispers/${id}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id || user?.id })
      });
      const data = await res.json();

      if (res.ok && data.whisper) {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        setWhispers(previousWhispers);
        if (previousUser) setUser(previousUser);
      }
    } catch (error) {
      setWhispers(previousWhispers);
      if (previousUser) setUser(previousUser);
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
      }
    } catch (err) {
      console.error('Failed to comment on whisper:', err);
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
      if (res.ok) setWhispers(prev => prev.filter(w => w._id !== id));
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
      const currentGridId = `${debouncedSearchQuery}-${filteredWhispers.length}`;
      if (gridIdRef.current !== currentGridId) {
        gsap.fromTo(`.${styles.masonryItem}`,
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
        gridIdRef.current = currentGridId;
      }
    }
  }, [loading, filteredWhispers.length, debouncedSearchQuery]);

  return (
    <div className={styles.container}>
      <Header />
      <FloatingHearts count={6} />

      <div className={styles.maxContainer}>

        <div style={{ maxWidth: '32rem', margin: '0 auto 4rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search the garden..."
            style={{
              width: '100%', padding: '1.25rem 2rem', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)', outline: 'none',
              fontFamily: 'var(--font-body)', fontSize: '1rem'
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search style={{ position: 'absolute', right: '1.5rem', top: '1.25rem', opacity: 0.4 }} size={24} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--primary)', fontStyle: 'italic', padding: '4rem', fontFamily: 'var(--font-headline)', fontSize: '1.25rem' }}>
            Listening to the shadows...
          </div>
        ) : (
          <div className={styles.masonryGrid}>
            {/* First Card: New Decree (as requested to be always first) */}
            <div className={styles.masonryItem}>
              <div className={styles.signatureCard}>
                <Sparkles size={40} className={styles.signatureIcon} />
                <h3 className={styles.signatureTitle}>Have a secret of your own?</h3>
                <p className={styles.signatureText}>Let your words wander through the veiled garden of Snitchers. Your identity is a whisper in the wind.</p>
                <button className={styles.signatureBtn} onClick={() => setShowModal(true)}>New Decree</button>
              </div>
            </div>

            {filteredWhispers.map((whisper, index) => (
              <React.Fragment key={whisper._id}>
                <PremiumWhisperCard
                  id={whisper._id}
                  content={whisper.content}
                  college={whisper.user?.college || 'Unknown'}
                  branch={whisper.user?.branch || 'Anywhere'}
                  timestamp={new Date(whisper.createdAt).toLocaleDateString()}
                  likes={whisper.likesCount}
                  commentsCount={whisper.commentsCount || 0}
                  comments={whisper.comments}
                  isLiked={user?.likedWhispers?.some(wid => wid.toString() === whisper._id)}
                  targetPerson={whisper.targetPerson}
                  anonymousName={whisper.user?.anonymousName}
                  creatorId={whisper.user?._id || whisper.user?.id}
                  role={user?.role}
                  userCollege={user?.college}
                  isFeatured={index % 7 === 0} 
                  featuredImage={FEATURED_IMAGES[index % FEATURED_IMAGES.length]}
                  onLike={handleLike}
                  onComment={handleComment}
                  onDelete={handleDelete}
                  onFlag={handleFlag}
                />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* FAB for mobile: Matches template style */}
      <div className={styles.fabContainer}>
        <button 
          className={styles.fab} 
          onClick={() => setShowModal(true)}
          style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'linear-gradient(135deg, #f67280 0%, #c06c84 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          <Plus size={32} />
        </button>
      </div>

      {/* Bottom Navigation Bar: Matches template */}
      <nav className={styles.bottomNav}>
        <Link href="/" className={`${styles.navItem}`}>
          <Layout size={24} />
          <span className={styles.navLabel}>Feed</span>
        </Link>
        <button className={styles.navItem} onClick={() => document.querySelector('input')?.focus()}>
          <Search size={24} />
          <span className={styles.navLabel}>Search</span>
        </button>
        <button className={`${styles.navItem} ${styles.navItemActive}`} onClick={() => setShowModal(true)}>
          <PlusCircle size={24} />
          <span className={styles.navLabel}>Secrets</span>
        </button>
        <Link href="/profile" className={styles.navItem}>
          <UserIcon size={24} />
          <span className={styles.navLabel}>Profile</span>
        </Link>
      </nav>

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
