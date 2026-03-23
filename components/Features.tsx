import React from 'react';
import { Heart, Ghost, Sparkles } from 'lucide-react';
import styles from '@/app/page.module.css';

export default function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresGrid}>
        <div className={`${styles.featureCard} glass-card`}>
          <Ghost className={styles.featureIcon} size={48} />
          <h3 className={styles.featureTitle}>Stay Hidden</h3>
          <p className={styles.featureText}>
            Your name is never asked. Your identity remains a beautiful mystery.
          </p>
        </div>
        <div className={`${styles.featureCard} glass-card`}>
          <Sparkles className={styles.featureIcon} size={48} />
          <h3 className={styles.featureTitle}>Find Connection</h3>
          <p className={styles.featureText}>
            Discover people with similar interests across your branch and college.
          </p>
        </div>
        <div className={`${styles.featureCard} glass-card`}>
          <Heart className={styles.featureIcon} size={48} />
          <h3 className={styles.featureTitle}>Old School Love</h3>
          <p className={styles.featureText}>
            A space for genuine feelings, not just swipes. Romantic, happy, and pure.
          </p>
        </div>
      </div>
    </section>
  );
}
