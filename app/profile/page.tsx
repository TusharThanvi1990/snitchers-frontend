"use client";

import React, { useEffect, useState } from 'react';
import { School, BookOpen, Heart, LogOut, Sparkles } from 'lucide-react';
import styles from './profile.module.css';
import FloatingHearts from '@/components/FloatingHearts';

interface User {
  _id: string;
  anonymousName: string;
  college?: string;
  branch?: string;
  interests?: string[];
  likedWhispers?: string[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return <div className={styles.loading}>Entering the shadows...</div>;

  return (
    <div className={styles.container}>
      <FloatingHearts count={6} />
      
      <div className={`${styles.profileCard} glass-card`}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <Sparkles size={40} />
          </div>
          <h1>{user.anonymousName}</h1>
          <p className={styles.identityTag}>Shadow Identity</p>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <School size={20} />
            <div className={styles.infoText}>
              <label>College</label>
              <span>{user.college}</span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <BookOpen size={20} />
            <div className={styles.infoText}>
              <label>Branch</label>
              <span>{user.branch}</span>
            </div>
          </div>
        </div>

        <div className={styles.interestsSection}>
          <h3><Heart size={18} fill="var(--color-romantic-red)" /> My Interests</h3>
          <div className={styles.tags}>
            {user.interests && user.interests.map((interest: string) => (
              <span key={interest} className={styles.tag}>{interest}</span>
            ))}
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={18} /> Logout and Disappear
        </button>
      </div>
    </div>
  );
}
