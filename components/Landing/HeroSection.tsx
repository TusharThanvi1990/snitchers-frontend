"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/app/landing.module.css';

interface User {
  _id: string;
  anonymousName: string;
}

export default function HeroSection() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        const parsedUser = JSON.parse(storedUser);
        setTimeout(() => setUser(parsedUser), 0);
      }
    } catch (e) {
      console.error("Failed to parse user in HeroSection", e);
    }
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* Background Elements */}
      <div className={styles.heroBgCircle1}></div>
      <div className={styles.heroBgCircle2}></div>

      <div className={styles.heroContent}>
        <div className="mb-6">
          <span className={styles.badge}>The Veiled Garden</span>
        </div>
        <h1 className={styles.heroTitle}>
          Hear the <span className={styles.heroTitleItalic}>Whispers</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Step into the shadows of an editorial-first confession space. Where anonymity meets premium beauty, and every secret is a bloom in the dark.
        </p>
        <div className={styles.heroActions}>
          <Link href={user ? "/whispers?create=true" : "/signin"}>
            <button className={styles.ctaPrimary}>
              {user ? "Share a Secret" : "Step into the Shadows"}
            </button>
          </Link>
          <Link href="/whispers">
            <button className={styles.ctaSecondary}>
              Read Whispers
            </button>
          </Link>
        </div>
      </div>

      {/* Floating Visuals */}
      <div className={`${styles.floatingCard} glass-card animate-float`}>
        <div className={styles.floatingCardHeader}>
          <div className={styles.avatar}>
            <span className="material-symbols-outlined" style={{fontSize: '14px'}}>auto_awesome</span>
          </div>
          <div style={{textAlign: 'left'}}>
            <p className={styles.avatarText}>Anonymous</p>
            <p className={styles.cardTime}>12m ago</p>
          </div>
        </div>
        <p className={styles.cardQuote}>&quot;I still leave the porch light on, hoping they&apos;ll see it from where they are now...&quot;</p>
      </div>
    </section>
  );
}
