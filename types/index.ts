export interface User {
  _id: string;
  id?: string;
  anonymousName?: string;
  college?: string;
  branch?: string;
  interests?: string[];
  role?: 'user' | 'admin' | 'super_admin';
  activeChats?: string[] | User[];
  likedWhispers?: string[];
}

export interface ChatRequest {
  _id: string;
  from: string;
  to: string;
  fromName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Whisper {
  _id: string;
  content: string;
  user?: User;
  creator?: User | string;
  targetName?: string;
  targetPerson?: string; // Unified with targetName if needed
  targetHint?: string;
  likesCount: number;
  commentsCount?: number;
  comments?: { text: string; createdAt: string }[];
  isFlagged?: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  fromUserId: string;
  message: string;
  timestamp: string;
}
