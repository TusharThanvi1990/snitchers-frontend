import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '@/app/page.module.css';
import FloatingHearts from '@/components/FloatingHearts';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

export default function LandingPage() {
  return (
    <main className={styles.hero}>
      <FloatingHearts />
      <Hero />
      <div className={styles.scrollDown}>
        <ChevronDown size={32} />
      </div>
      <Features />
    </main>
  );
}
