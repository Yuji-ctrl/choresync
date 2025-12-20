import { useState, useCallback } from 'react';
import { Message, Tip, AppSettings, NavigationTab, Chore } from '../types';
import { toast } from 'sonner';

export const useAppState = (
  initialMessages: Message[],
  initialTips: Tip[],
  initialSettings: AppSettings
) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [tips, setTips] = useState<Tip[]>(initialTips);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  // ダイアログ状態
  const [editingChore, setEditingChore] = useState<Chore | null | undefined>(undefined);
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  // メッセージ関連
  const handleSendMessage = useCallback(async (
    text: string,
    currentUserId: string,
    currentUserName: string,
    imageFile?: File
  ) => {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        userId: currentUserId,
        userName: currentUserName,
        text,
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
        timestamp: new Date(),
        isMe: true,
      };

      setMessages(prev => [...prev, newMessage]);
      toast('メッセージを送信しました');
    } catch (error) {
      console.error('Error sending message:', error);
      toast('送信に失敗しました');
    }
  }, []);

  // Tips関連
  const handleLikeTip = useCallback((tipId: string) => {
    setTips(prev => prev.map(tip => 
      tip.id === tipId 
        ? { 
            ...tip, 
            isLiked: !tip.isLiked,
            likes: tip.isLiked ? tip.likes - 1 : tip.likes + 1
          }
        : tip
    ));
  }, []);

  // 設定関連
  const handleUpdateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const handleExportData = useCallback((chores: Chore[], photos: any[]) => {
    const data = {
      chores,
      photos,
      settings,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `household-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast('データをエクスポートしました');
  }, [settings]);

  const handleClearData = useCallback((initialChores: Chore[]) => {
    setMessages([]);
    setSettings({
      darkMode: false,
      fontSize: 'medium',
      notifications: true,
      soundEnabled: true,
      familySharing: false,
      autoBackup: true,
      language: 'ja',
    });
    toast('データをクリアしました');
  }, []);

  return {
    // 状態
    activeTab,
    messages,
    tips,
    settings,
    editingChore,
    selectedTip,
    
    // セッター
    setActiveTab,
    setMessages,
    setSettings,
    setEditingChore,
    setSelectedTip,
    
    // ハンドラー
    handleSendMessage,
    handleLikeTip,
    handleUpdateSettings,
    handleExportData,
    handleClearData,
  };
};