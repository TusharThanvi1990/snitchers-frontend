"use client";

import React, { useState } from 'react';
import { Heart, MessageCircle, Flag, Trash2, Flame, X, Send } from 'lucide-react';
import styles from '@/app/whispers/whispers_premium.module.css';
import { useChat } from '@/context/ChatContext';

interface PremiumWhisperCardProps {
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
  isFeatured?: boolean;
  featuredImage?: string;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
  onFlag?: (id: string) => void;
}

export default function PremiumWhisperCard({
  id, content, college, branch, timestamp, likes, commentsCount, comments = [],
  isLiked, targetPerson, anonymousName, creatorId, role, userCollege,
  isFeatured, featuredImage, onLike, onComment, onDelete, onFlag
}: PremiumWhisperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { sendChatRequest, user: currentUser } = useChat();

  const handleChatRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      <div className={styles.cardTop}>
        <span className={styles.badge}>{isFeatured ? 'Featured' : 'New Whisper'}</span>
        <span className={styles.timeTag}>{timestamp}</span>
      </div>
      
      <p className={isFeatured ? styles.featuredTitle : styles.cardBody}>
        &quot;{content}&quot;
      </p>
      
      <div className={styles.metadata}>
        <p className={styles.targetLabel} style={isFeatured ? { color: 'white' } : {}}>
          For: {targetPerson || anonymousName || 'The Garden'}
        </p>
        <p className={styles.locationLabel} style={isFeatured ? { color: 'rgba(255,255,255,0.8)' } : {}}>
          {college} • {branch}
        </p>
      </div>

      <div className={styles.cardFooter} style={isFeatured ? { borderTopColor: 'rgba(255,255,255,0.2)' } : {}}>
        <div className={styles.actionGroup}>
          <button 
            className={styles.actionBtn} 
            onClick={(e) => { e.stopPropagation(); onLike(id); }}
            style={isLiked ? { color: isFeatured ? 'white' : 'var(--primary)' } : (isFeatured ? { color: 'white' } : {})}
          >
            <Heart size={20} fill={isLiked ? (isFeatured ? "white" : "var(--primary)") : "none"} />
            <span style={{ fontSize: '0.75rem' }}>{likes}</span>
          </button>
          <button 
            className={styles.actionBtn} 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
            style={isFeatured ? { color: 'white' } : {}}
          >
            <MessageCircle size={20} />
            <span style={{ fontSize: '0.75rem' }}>{commentsCount}</span>
          </button>
          
          {creatorId && currentUser && (currentUser._id !== creatorId && currentUser.id !== creatorId) && (
            <button 
              className={styles.actionBtn} 
              onClick={handleChatRequest}
              title="Request Anonymous Chat"
              style={{ color: isFeatured ? 'white' : 'var(--primary)' }}
            >
              <Flame size={20} />
              <span style={{ fontSize: '0.75rem' }}>Chat</span>
            </button>
          )}
        </div>
        
        <div className={styles.actionGroup}>
          {(role === 'super_admin' || (role === 'admin' && college === userCollege)) && (
            <>
              <button 
                className={styles.actionBtn} 
                onClick={(e) => { e.stopPropagation(); onFlag?.(id); }}
                title="Flag Whisper"
                style={isFeatured ? { color: 'white' } : {}}
              >
                <Flag size={18} />
              </button>
              <button 
                className={styles.actionBtn} 
                onClick={(e) => { e.stopPropagation(); onDelete?.(id); }}
                title="Delete Whisper"
                style={isFeatured ? { color: 'white' } : {}}
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
          {!((role === 'super_admin' || (role === 'admin' && college === userCollege))) && (
            <button 
              className={styles.actionBtn} 
              onClick={(e) => { e.stopPropagation(); onFlag?.(id); }}
              title="Report"
              style={{ opacity: 0.4, color: isFeatured ? 'white' : 'inherit' }}
            >
              <Flag size={18} />
            </button>
          )}
        </div>
      </div>
      
      {!isExpanded && commentsCount > 0 && (
        <button 
          className={styles.expandLink} 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
          style={isFeatured ? { color: 'white' } : {}}
        >
          View all {commentsCount} comments
        </button>
      )}
    </>
  );

  return (
    <div className={styles.masonryItem}>
      <div 
        className={`${styles.premiumCard} ${isFeatured && featuredImage ? styles.featuredCard : ''}`}
        style={isFeatured && featuredImage ? { backgroundImage: `url(${featuredImage})` } : {}}
        onClick={() => setIsExpanded(true)}
      >
        {isFeatured && featuredImage && <div className={styles.featuredOverlay}></div>}
        <div className={isFeatured ? styles.featuredContent : ''}>
          {CardContent}
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedOverlay} onClick={() => setIsExpanded(false)}>
          <div className={styles.expandedCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.expandedContent}>
              {/* Special rendering for featured card content inside modal if needed, 
                  but for now we just use a neutral version of CardContent */}
              <div className={styles.cardTop}>
                <span className={styles.badge}>{isFeatured ? 'Featured' : 'New Whisper'}</span>
                <span className={styles.timeTag}>{timestamp}</span>
              </div>
              <p className={styles.cardBody} style={{ fontSize: '1.75rem' }}>&quot;{content}&quot;</p>
              <div className={styles.metadata}>
                <p className={styles.targetLabel}>For: {targetPerson || anonymousName || 'The Garden'}</p>
                <p className={styles.locationLabel}>{college} • {branch}</p>
              </div>
            </div>
            
            <div className={styles.commentsSection}>
              <div className={styles.commentsHeader}>
                <h4>Comments</h4>
                <button className={styles.closeBtn} onClick={() => setIsExpanded(false)}><X size={20} /></button>
              </div>

              <div className={styles.commentList}>
                {commentsCount === 0 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.4)', paddingTop: '2rem', fontStyle: 'italic' }}>
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
    </div>
  );
}
