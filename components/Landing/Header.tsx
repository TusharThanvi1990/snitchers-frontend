"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/app/landing.module.css';

interface User {
  _id?: string;
  anonymousName?: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        const parsedUser = JSON.parse(storedUser);
        setTimeout(() => setUser(parsedUser), 0);
      }
    } catch (error) {
      console.error('Failed to parse user in Header:', error);
    }
  }, []);

  return (
    <header className={styles.header}>
      <Link href="/" style={{textDecoration: 'none'}}>
        <div className={styles.logo}>Snitchers</div>
      </Link>
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}>Home</Link>
        <Link href="/whispers" className={`${styles.navLink} ${pathname === '/whispers' ? styles.navLinkActive : ''}`}>Whispers</Link>
        <Link href="/chat" className={`${styles.navLink} ${pathname === '/chat' ? styles.navLinkActive : ''}`}>Lobby</Link>
        <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.navLinkActive : ''}`}>Admin</Link>
      </nav>
      <div className={styles.headerActions}>
        <button className={styles.actionButton}>
          <span className="material-symbols-outlined">notifications</span>
        </button>
        {user ? (
          <Link href="/profile" className={styles.actionButton}>
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        ) : (
          <Link href="/login" className={styles.actionButton}>
             <span className="material-symbols-outlined">login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
