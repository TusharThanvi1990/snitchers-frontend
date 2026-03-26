"use client";

import React from 'react';
import styles from '@/app/landing.module.css';

export default function PremiumReveal() {
  return (
    <section className={styles.revealSection}>
      <div className={styles.revealContainer}>
        <div className={styles.revealContent}>
          <h2 className={styles.revealTitle}>The Art of the <span style={{color: 'var(--primary)', fontStyle: 'italic'}}>Confession</span></h2>
          <p style={{fontSize: '1.125rem', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-body)'}}>
            We&apos;ve built a sanctuary for the words you can&apos;t say anywhere else. No profiles. No vanity. Just raw, unfiltered human connection in a space designed for beauty.
          </p>
          <ul className={styles.revealPoints}>
            <li className={styles.point}>
              <span className={`material-symbols-outlined ${styles.pointIcon}`}>check_circle</span>
              <span>Curated by human empathy</span>
            </li>
            <li className={styles.point}>
              <span className={`material-symbols-outlined ${styles.pointIcon}`}>check_circle</span>
              <span>Premium glassmorphic interface</span>
            </li>
            <li className={styles.point}>
              <span className={`material-symbols-outlined ${styles.pointIcon}`}>check_circle</span>
              <span>Total anonymity, guaranteed</span>
            </li>
          </ul>
        </div>
        <div className={styles.revealVisual}>
          <div className={styles.visualBg}></div>
          <div className={styles.glassImage}>
            {/* Dummy Image Placeholder */}
            <div style={{width: '100%', height: '450px', backgroundColor: '#e2e8f0', borderRadius: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <p style={{color: '#94a3b8'}}>Image Placeholder (image2.txt)</p>
            </div>
          </div>
          <div className={styles.heartBadge}>
            <span className="material-symbols-outlined" style={{color: 'var(--primary)', fontVariationSettings: "'FILL' 1"}}>favorite</span>
            <span style={{fontWeight: 'bold', fontSize: '0.875rem'}}>342 New Whispers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
