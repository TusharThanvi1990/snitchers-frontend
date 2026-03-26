"use client";

import React from 'react';
import styles from '@/app/landing.module.css';

export default function BottomNav() {
  return (
    <nav className={styles.mobileBottomNav}>
      <div className={styles.navContainer}>
        <button className={`${styles.navItem} ${styles.navItemActive}`}>
          <span className="material-symbols-outlined">grid_view</span>
          <span className={styles.navLabel}>Feed</span>
        </button>
        <button className={styles.navItem}>
          <span className="material-symbols-outlined">search</span>
          <span className={styles.navLabel}>Search</span>
        </button>
        <button className={styles.navItem}>
          <span className="material-symbols-outlined" style={{fontSize: '30px'}}>add_circle</span>
          <span className={styles.navLabel}>Secrets</span>
        </button>
        <button className={styles.navItem}>
          <span className="material-symbols-outlined">person</span>
          <span className={styles.navLabel}>Profile</span>
        </button>
      </div>
    </nav>
  );
}
