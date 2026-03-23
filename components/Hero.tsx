"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import gsap from 'gsap';
import styles from '@/app/page.module.css';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(titleRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, delay: 0.2 }
    );
    tl.fromTo(subtitleRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, delay: -0.8 }
    );
    tl.fromTo(ctaRef.current, 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: -0.5 }
    );
  }, []);

  return (
    <>
      <div className={styles.titleContainer}>
        <h1 className={styles.title} ref={titleRef}>Snitchers</h1>
        <p className={styles.subtitle} ref={subtitleRef}>
          Whisper your heart&rsquo;s secrets where only the shadows listen. 
          Find your college spark, anonymously.
        </p>
      </div>

      <div className={styles.ctaContainer} ref={ctaRef}>
        <Link href="/signin">
          <button className={styles.primaryButton}>
            Start Confessing <Send size={18} />
          </button>
        </Link>
        <Link href="/whispers">
          <button className={styles.secondaryButton}>
            Read Whispers
          </button>
        </Link>
      </div>
    </>
  );
}
