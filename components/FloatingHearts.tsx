"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import gsap from 'gsap';
import styles from '@/app/page.module.css';

interface FloatingHeartsProps {
  count?: number;
}

interface HeartData {
  size: number;
  top: number;
  left: number;
}

export default function FloatingHearts({ count = 12 }: FloatingHeartsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hearts, setHearts] = useState<HeartData[]>([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    // Generate random hearts on mount
    const generatedHearts: HeartData[] = [...Array(count)].map(() => ({
      size: Math.random() * 40 + 20,
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setHearts(generatedHearts);
  }, [count]);

  useEffect(() => {
    // Animate hearts
    const heartElements = containerRef.current?.children;
    if (heartElements) {
      Array.from(heartElements).forEach((heart, i) => {
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
      {hearts.map((heart: HeartData, i: number) => (
        <Heart 
          key={i} 
          className={`${styles.heart} floating`} 
          size={heart.size}
          style={{
            position: 'absolute',
            top: `${heart.top}%`,
            left: `${heart.left}%`,
          }}
        />
      ))}
    </div>
  );
}
