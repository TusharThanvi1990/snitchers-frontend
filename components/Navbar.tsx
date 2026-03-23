"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Ghost, User as UserIcon, LogIn, Heart } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        setUser(null);
      }
    };

    fetchUser();
    
    // Listen for storage changes (for logout/login in other tabs)
    const handleStorage = () => fetchUser();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  return (
    <nav className={`${styles.navbar} glass-card`}>
      <Link href="/" className={styles.logo}>
        <Ghost className={styles.icon} />
        <span>Snitchers</span>
      </Link>

      <div className={styles.links}>
        <Link href="/whispers" className={`${styles.link} ${pathname === '/whispers' ? styles.active : ''}`}>
          Whispers
        </Link>
        
        {user ? (
          <Link href="/profile" className={`${styles.profileLink} ${pathname === '/profile' ? styles.active : ''}`}>
            <UserIcon size={18} />
            <span>{user.anonymousName}</span>
          </Link>
        ) : (
          <div className={styles.authLinks}>
            <Link href="/login" className={styles.loginBtn}>
              Login
            </Link>
            <Link href="/signin" className={styles.signupBtn}>
              Join <Heart size={14} fill="white" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
