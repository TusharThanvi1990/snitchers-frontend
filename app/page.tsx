import React from 'react';
import styles from '@/app/landing.module.css';
import Header from '@/components/Landing/Header';
import HeroSection from '@/components/Landing/HeroSection';
import BentoGrid from '@/components/Landing/BentoGrid';
import PremiumReveal from '@/components/Landing/PremiumReveal';
import Footer from '@/components/Landing/Footer';
import BottomNav from '@/components/Landing/BottomNav';

export default function LandingPage() {
  return (
    <main className={styles.landingMain}>
      <Header />
      <HeroSection />
      <BentoGrid />
      <PremiumReveal />
      <Footer />
      <BottomNav />
    </main>
  );
}
