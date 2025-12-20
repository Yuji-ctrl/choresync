// Core Types
export interface ChorePhoto {
  id: string;
  choreId: string;
  imageUrls: string[]; // 複数枚の画像URL（最大4枚）
  comment: string;
  takenAt: Date;
  takenBy: string; // 投稿者のユーザーID
  takenByName: string; // 投稿者の名前
}

export interface Chore {
  id: string;
  name: string;
  icon: string;
  customIconUrl?: string; // カスタムアイコンのURL
  position?: { x: number; y: number };
  isCompleted: boolean;
  notificationTime: string;
  dueDate?: Date; // 期限
  reminderHours?: number; // 何時間前に通知するか
  completedAt?: Date;
  completedBy?: string;
  completedByName?: string;
  timeSpent?: number;
  estimatedTime?: number;
  assignedTo?: string;
  assignedToName?: string;
  location?: string;
  description?: string;
  photos?: ChorePhoto[];
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  imageUrl?: string;
  timestamp: Date;
  isMe: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  lastSeen: Date;
}

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  publishedAt: Date;
}

export interface AppSettings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  soundEnabled: boolean;
  familySharing: boolean;
  autoBackup: boolean;
  language: 'ja' | 'en';
}

export type NavigationTab = 'home' | 'chores' | 'messages' | 'stats' | 'album' | 'game' | 'tips' | 'settings';