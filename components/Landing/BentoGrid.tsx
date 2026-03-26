"use client";

import React from 'react';
import Link from 'next/link';
import styles from '@/app/landing.module.css';

export default function BentoGrid() {
  return (
    <section className={styles.bentoSection}>
      <div className={styles.bentoHeader}>
        <div style={{maxWidth: '36rem'}}>
          <h2 className={styles.bentoHeaderTitle}>Curated Shadows</h2>
          <p className={styles.bentoHeaderSubtitle}>Explore the most resonant whispers flowing through the garden today.</p>
        </div>
        <div style={{display: 'none'}} className="md:block">
          <Link href="/whispers" className={styles.exploreLink}>
            Explore Archive <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Large Feature Card */}
        <div className={styles.featureCardLarge}>
          <div className={styles.cardGradientOverlay}></div>
          <div className={styles.cardContent}>
            <span className={styles.cardBadge}>Trending Whispers</span>
            <h3 className={styles.cardTitle}>The things we never said stay the loudest.</h3>
            <div className={styles.feelingContainer}>
              <div className={styles.avatars}>
                <div className={styles.miniAvatar} style={{backgroundColor: '#e2e8f0'}}></div>
                <div className={styles.miniAvatar} style={{backgroundColor: '#cbd5e1'}}></div>
                <div className={styles.miniAvatar} style={{backgroundColor: '#94a3b8'}}></div>
              </div>
              <span className={styles.feelingText}>2.4k others feeling this</span>
            </div>
          </div>
        </div>

        {/* Side Cards */}
        <div className={styles.sideCards}>
          <div className={styles.absoluteVeilCard}>
            <div className={styles.veilIcon}>
              <span className="material-symbols-outlined" style={{fontSize: '36px'}}>fingerprint</span>
            </div>
            <div>
              <h4 style={{fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem'}}>Absolute Veil</h4>
              <p style={{fontSize: '0.875rem', color: 'var(--on-surface-variant)'}}>Zero tracking. Zero logs. Just your voice in the digital ether.</p>
            </div>
          </div>
          <div className={styles.safeCard}>
            <div className={styles.safeHeader}>
              <span className="material-symbols-outlined" style={{fontSize: '24px'}}>lock</span>
              <span style={{fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.2em', opacity: 0.8}}>Encrypted</span>
            </div>
            <h4 style={{fontWeight: 'bold', fontSize: '1.5rem'}}>Secrets are safe in the garden.</h4>
          </div>
        </div>

        {/* Bottom Bento Row */}
        <div className={styles.bottomBentoCard}>
          <div className={styles.cardIconCircle}>
            <span className="material-symbols-outlined" style={{color: 'var(--primary)'}}>visibility</span>
          </div>
          <h4 style={{fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.75rem', fontFamily: 'var(--font-headline)'}}>Omniscient View</h4>
          <p style={{fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.625}}>Observe the collective heartbeat of the world without ever being seen. The garden is vast and silent.</p>
        </div>
        <div className={styles.bottomBentoCard} style={{background: 'var(--surface-container-high)'}}>
          <div className={styles.cardIconCircle}>
            <span className="material-symbols-outlined" style={{color: 'var(--primary)'}}>inventory_2</span>
          </div>
          <h4 style={{fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.75rem', fontFamily: 'var(--font-headline)'}}>Eternal Archive</h4>
          <p style={{fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.625}}>Some words deserve to be carved in stone. Our archive keeps the most profound whispers alive forever.</p>
        </div>
        <div className={styles.manifestoCard}>
          <div className={styles.manifestoBg}></div>
          <p className={styles.manifestoQuote}>&quot;Silence is a luxury. We provide the room to break it.&quot;</p>
          <a href="#" className={styles.manifestoLink}>Our Manifesto</a>
        </div>
      </div>
    </section>
  );
}
