import React, { useState } from 'react';
import { Heart, MessageCircle, Target, Quote, X, Send, Trash2, Flag, Flame } from 'lucide-react';
import styles from '@/app/whispers/whispers.module.css';

interface WhisperCardProps {
  id: string;
  content: string;
  college: string;
  branch: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  comments?: { text: string; createdAt: string }[];
  isLiked?: boolean;
  targetPerson?: string;
  anonymousName?: string;
  role?: string;
  userCollege?: string;
  creatorId?: string;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
  onFlag?: (id: string) => void;
}

import { useChat } from '@/context/ChatContext';

export default function WhisperCard({ 
  id, content, college, branch, timestamp, likes, commentsCount, comments = [], 
  isLiked, targetPerson, anonymousName, creatorId, role, userCollege, onLike, onComment, onDelete, onFlag 
}: WhisperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { sendChatRequest, user: currentUser } = useChat();

  const handleChatRequest = async () => {
    if (!currentUser) {
      alert('Please login to send chat requests!');
      return;
    }
    if (creatorId) {
      try {
        await sendChatRequest(creatorId, currentUser.anonymousName || 'Anonymous');
        alert(`Chat request sent to ${anonymousName}! It will persist in their lobby for 24 hours.`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to send request.";
        alert(message);
      }
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onComment(id, newComment);
    setNewComment('');
  };

  const CardContent = (
    <>
      <div className={styles.cardHeader}>
        <div className={styles.authorInfo}>
          <span className={styles.branchTag}>{branch}</span>
          <span className={styles.anonymousName}>— {anonymousName || 'Mysterious Shadow'}</span>
        </div>
        {!isExpanded && <span className={styles.timestamp}>{timestamp}</span>}
        {isExpanded && <button className={styles.closeBtn} onClick={() => setIsExpanded(false)}><X size={24} /></button>}
      </div>
      
      <div className={styles.contentWrapper}>
        <Quote className={styles.quoteIcon} size={24} />
        <p className={styles.content}>{content}</p>
      </div>

      {targetPerson && (
        <div className={styles.targetLabel}>
          <Target size={14} /> 
          <span>To: <strong>{targetPerson}</strong></span>
        </div>
      )}
      
      <div className={styles.cardFooter}>
        <div className={styles.footerInfo}>
          <span className={styles.collegeName}>{college}</span>
          {!isExpanded && timestamp && <div style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>{timestamp}</div>}
        </div>
        <div className={styles.actions}>
          <button 
            className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`} 
            onClick={() => onLike(id)}
          >
            <Heart size={20} fill={isLiked ? "var(--color-romantic-red)" : "none"} color={isLiked ? "var(--color-romantic-red)" : "currentColor"} /> 
            <span>{likes}</span>
          </button>
          <button className={styles.actionBtn} onClick={() => setIsExpanded(true)}>
            <MessageCircle size={20} /> <span>{commentsCount}</span>
          </button>
          
          {creatorId && currentUser && (currentUser._id !== creatorId && currentUser.id !== creatorId) && (
            <button 
              className={`${styles.actionBtn} ${styles.chatBtn}`} 
              onClick={(e) => { e.stopPropagation(); handleChatRequest(); }}
              title="Request Anonymous Chat"
              style={{ color: 'var(--color-romantic-red)' }}
            >
              <Flame size={20} />
              <span className={styles.chatLabel}>Chat</span>
            </button>
          )}
          
          {(role === 'super_admin' || (role === 'admin' && college === userCollege)) && (
            <div className={styles.adminActions}>
              <button 
                className={`${styles.actionBtn} ${styles.flagBtn}`} 
                onClick={(e) => { e.stopPropagation(); onFlag?.(id); }}
                title="Flag Whisper"
              >
                <Flag size={18} />
              </button>
              <button 
                className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                onClick={(e) => { e.stopPropagation(); onDelete?.(id); }}
                title="Delete Whisper"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {!isExpanded && commentsCount > 0 && (
        <button className={styles.expandLink} onClick={() => setIsExpanded(true)}>
          View all {commentsCount} comments
        </button>
      )}
    </>
  );

  return (
    <>
      <div className={`${styles.card} glass-card`}>
        {CardContent}
      </div>

      {isExpanded && (
        <div className={styles.expandedOverlay} onClick={() => setIsExpanded(false)}>
          <div className={styles.expandedCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.expandedContent}>
              {CardContent}
            </div>
            
            <div className={styles.commentsSection}>
              <div className={styles.commentsHeader}>
                <h4>Comments</h4>
                <button className={styles.closeBtn} onClick={() => setIsExpanded(false)}><X size={20} /></button>
              </div>

              <div className={styles.commentList}>
                {commentsCount === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: '2rem', fontStyle: 'italic' }}>
                    No whispers yet. Be the first to reply.
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <div key={index} className={styles.commentItem}>
                      <span className={styles.commentText}>{comment.text}</span>
                      <span className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>

              <form className={styles.commentInputArea} onSubmit={handleCommentSubmit}>
                <input 
                  type="text" 
                  className={styles.commentInput} 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className={styles.commentSubmit} disabled={!newComment.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
