"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import styles from './signin.module.css';

const INTERESTS = [
  'Coding', 'Design', 'Music', 'Gaming', 
  'Hiking', 'Photography', 'Literature', 
  'Anime', 'Movies', 'Dancing', 'Fashion'
];

export default function SignInPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    college: '',
    branch: '',
    interests: [] as string[],
    anonymousName: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    );
  }, []);

  const fetchRandomName = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBaseUrl}/api/auth/generate-name`);
      const data = await res.json();
      setFormData(prev => ({ ...prev, anonymousName: data.name }));
    } catch (error) {
      console.error('Failed to fetch name', error);
      setFormData(prev => ({ ...prev, anonymousName: 'Mysterious Whisperer' }));
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 3 && !formData.anonymousName) {
      fetchRandomName();
    }
    
    gsap.to(formRef.current, {
      x: -20,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setStep(step + 1);
        gsap.fromTo(formRef.current, 
          { x: 20, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.4 }
        );
      }
    });
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/whispers';
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Registration failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => {
    gsap.to(formRef.current, {
      x: 20,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setStep(step - 1);
        gsap.fromTo(formRef.current, 
          { x: -20, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.4 }
        );
      }
    });
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className={styles.container}>
      {/* ... previous background decor ... */}
      <div className={styles.backgroundDecor}>
        {[...Array(6)].map((_, i) => (
          <Heart 
            key={i} 
            className="floating" 
            size={Math.random() * 30 + 20}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              color: 'var(--color-soft-pink)',
              opacity: 0.1,
            }}
          />
        ))}
      </div>

      <div className={`${styles.card} glass-card`} ref={cardRef}>
        <div className={styles.header}>
          <div className={styles.steps}>
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className={`${styles.stepDot} ${step >= s ? styles.stepDotActive : ''}`} />
            ))}
          </div>
          <h1 className={styles.title}>Join Snitchers</h1>
          <p className={styles.description}>No names. Just vibes and secrets.</p>
        </div>

        <form className={styles.form} ref={formRef} onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Which College do you haunt?</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. Stanford, IIT Delhi..." 
                value={formData.college}
                onChange={(e) => setFormData({...formData, college: e.target.value})}
              />
              <button type="button" className={styles.submitButton} onClick={nextStep} disabled={!formData.college}>
                Next <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>What's your Branch/Field?</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. CS, Arts, Design..." 
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className={styles.backLink} onClick={prevStep} style={{ flex: 1 }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="button" className={styles.submitButton} onClick={nextStep} style={{ flex: 2 }} disabled={!formData.branch}>
                  Next <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>What makes your heart race?</label>
              <div className={styles.interestTags}>
                {INTERESTS.map(interest => (
                  <span 
                    key={interest} 
                    className={`${styles.tag} ${formData.interests.includes(interest) ? styles.tagActive : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className={styles.backLink} onClick={prevStep} style={{ flex: 1 }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="button" className={styles.submitButton} onClick={nextStep} style={{ flex: 2 }} disabled={formData.interests.length === 0}>
                  Next <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Your Anonymous Identity</label>
              <div className={styles.input} style={{ background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{formData.anonymousName || 'Thinking of a name...'}</span>
                <button type="button" onClick={fetchRandomName} style={{ background: 'none', border: 'none', color: 'var(--color-romantic-red)', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Shuffle name
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>This is how others will see your whispers.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className={styles.backLink} onClick={prevStep} style={{ flex: 1 }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="button" className={styles.submitButton} onClick={nextStep} style={{ flex: 2 }} disabled={!formData.anonymousName}>
                  Confirm Name <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Protect your Identity (Password)</label>
              <input 
                type="password" 
                className={styles.input} 
                placeholder="Make it secret, make it safe..." 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className={styles.backLink} onClick={prevStep} style={{ flex: 1 }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="button" className={styles.submitButton} onClick={handleRegister} style={{ flex: 2 }} disabled={!formData.password || loading}>
                  {loading ? 'Entering shadows...' : 'Enter Shadows'} <Sparkles size={18} />
                </button>
              </div>
            </div>
          )}
        </form>

        <Link href="/" className={styles.backLink}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
