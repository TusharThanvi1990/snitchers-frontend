import React, { useState } from 'react';
import { Heart, MessageCircle, Target, Quote, X, Send } from 'lucide-react';
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
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
}

export default function WhisperCard({ id, content, college, branch, timestamp, likes, commentsCount, comments = [], isLiked, targetPerson, anonymousName, onLike, onComment }: WhisperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');

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
