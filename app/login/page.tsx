"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Ghost, Lock, User } from 'lucide-react';
import styles from './login.module.css';
import FloatingHearts from '@/components/FloatingHearts';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    anonymousName: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await fetch('http://localhost:5000/api/auth/login', {
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
        setError(data.message);
      }
    } catch (err) {
      setError('Connection failed. Is the shadows server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <FloatingHearts count={6} />
      
      <div className={`${styles.card} glass-card`}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <Ghost size={32} />
          </div>
          <h1>Welcome Back</h1>
          <p>Re-enter your secret world.</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label><User size={16} /> Anonymous Identity</label>
            <input 
              type="text" 
              placeholder="e.g. Silver Crimson Panda"
              value={formData.anonymousName}
              onChange={(e) => setFormData({...formData, anonymousName: e.target.value})}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label><Lock size={16} /> Secret Password</label>
            <input 
              type="password" 
              placeholder="Your hidden key..."
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Opening Shadows...' : 'Enter Shadows'} <ArrowRight size={18} />
          </button>
        </form>

        <p className={styles.footerText}>
          First time here? <Link href="/signin">Sign up anonymously</Link>
        </p>
      </div>
    </div>
  );
}
