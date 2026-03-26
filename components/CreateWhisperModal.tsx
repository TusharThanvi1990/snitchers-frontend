"use client";

import React, { useState } from 'react';
import { X, Sparkles, Target } from 'lucide-react';
import styles from '../app/whispers/whispers.module.css';

interface CreateWhisperModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateWhisperModal({ onClose, onSuccess }: CreateWhisperModalProps) {
  const [content, setContent] = useState('');
  const [targetPerson, setTargetPerson] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      // Get the logged in user from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        alert('Please sign in first!');
        return;
      }
      
      let user;
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user:', error);
        alert('Your session has expired. Please sign in again.');
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBaseUrl}/api/whispers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          targetPerson,
          userId: user._id || user.id
        })
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert('Failed to send whisper.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} glass-card`}>
        <div className={styles.modalHeader}>
          <h3>Share a Secret</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.inputGroup}>
            <label>Your Whisper</label>
            <textarea 
              placeholder="What&apos;s on your heart? (e.g. &apos;I still think about that day at the cafe...&apos;)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className={styles.inputGroup}>
            <label><Target size={14} /> For someone special? (Optional)</label>
            <input 
              type="text" 
              placeholder="A name, a hint, or leave blank..."
              value={targetPerson}
              onChange={(e) => setTargetPerson(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading || !content.trim()}>
            {loading ? 'Sending...' : 'Release into the shadows'} <Sparkles size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
