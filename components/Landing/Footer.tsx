"use client";

import React from 'react';
import styles from '@/app/landing.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLogoContainer}>
        <div className={styles.footerLogo}>Snitchers</div>
        <p className={styles.footerCopyright}>© 2024 Snitchers Anonymous. Veil your identity.</p>
      </div>
      <div className={styles.footerLinks}>
        <a className={styles.footerLink} href="#">Terms</a>
        <a className={styles.footerLink} href="#">Privacy</a>
        <a className={`${styles.footerLink} ${styles.footerLinkSpecial}`} href="#">Manifesto</a>
        <a className={styles.footerLink} href="#">Contact</a>
      </div>
    </footer>
  );
}
