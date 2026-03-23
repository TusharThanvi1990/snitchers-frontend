"use client";

import React, { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import gsap from 'gsap';
import styles from '@/app/page.module.css';

interface FloatingHeartsProps {
  count?: number;
}

export default function FloatingHearts({ count = 12 }: FloatingHeartsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hearts = containerRef.current?.children;
    if (hearts) {
      Array.from(hearts).forEach((heart, i) => {
        gsap.to(heart, {
          y: 'random(-100, 100)',
          x: 'random(-50, 50)',
          rotation: 'random(-45, 45)',
          duration: 'random(3, 6)',
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: i * 0.2
        });
      });
    }
  }, []);

  return (
    <div className={styles.backgroundDecor} ref={containerRef}>
      {[...Array(count)].map((_, i) => (
        <Heart 
          key={i} 
          className={`${styles.heart} floating`} 
          size={Math.random() * 40 + 20}
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}
