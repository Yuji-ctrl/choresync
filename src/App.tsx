import React from 'react';

// Components
import { MainContentRenderer } from './components/MainContentRenderer';
import { DialogsManager } from './components/DialogsManager';
import { BottomNavigation } from './components/BottomNavigation';

// Hooks
import { useChores } from './hooks/useChores';
import { usePhotos } from './hooks/usePhotos';
import { useNotifications } from './hooks/useNotifications';
import { useAppState } from './hooks/useAppState';
import { useAppHandlers } from './hooks/useAppHandlers';
import { useDataPersistence } from './hooks/useDataPersistence';

// Data and Types
import {
  initialChores,
  generateSampleChoreHistory,
  samplePhotos,
  sampleTips,
  sampleFamilyMembers,
  sampleMessages,
} from './data/sampleData';
import { AppSettings } from './types';

const defaultSettings: AppSettings = {
  darkMode: false,
  fontSize: 'medium',
  notifications: true,
  soundEnabled: true,
  familySharing: false,
  autoBackup: true,
  language: 'ja',
};

export default function App() {
  // 現在のユーザー（お父さん）
  const currentUserId = '2';
  const currentUserName = 'お父さん';

  // カスタムフック
  const {
    chores,
    setChores,
    completionChore,
    setCompletionChore,
    handleCompleteChore,
    handleChoreCompletion,
    handleSaveChore,
    handleDeleteChore,
    handleToggleChore,
    handleResetDay,
  } = useChores([...initialChores, ...generateSampleChoreHistory()]);

  const {
    photos,
    setPhotos,
    photoCaptureChore,
    setPhotoCaptureChore,
    selectedPhoto,
    setSelectedPhoto,
    sharePhoto,
    setSharePhoto,
    handleTakePhoto,
    handleSavePhoto,
    handleUpdatePhotoComment,
    handleSharePhoto,
  } = usePhotos(samplePhotos);

  const {
    activeTab,
    messages,
    tips,
    settings,
    editingChore,
    selectedTip,
    setActiveTab,
    setMessages,
    setSettings,
    setEditingChore,
    setSelectedTip,
    handleSendMessage,
    handleLikeTip,
    handleUpdateSettings,
    handleExportData,
    handleClearData,
  } = useAppState(sampleMessages, sampleTips, defaultSettings);

  const { clearDelayedNotification, resetNotifications } = useNotifications(chores, handleCompleteChore);

  // データ永続化（LocalStorageへの自動保存とロード）
  useDataPersistence({
    chores,
    photos,
    messages,
    settings,
    setChores,
    setPhotos,
    setMessages,
    setSettings,
  });

  // ハンドラー関数群
  const {
    handleChoreCompletionWithNotification,
    handleResetDayWithNotifications,
    handleToggleChoreWithUserId,
    handleSendMessageWithUser,
    handleSavePhotoWithUser,
    handleExportDataWithPhotos,
    handleClearDataWithChores,
    getDisplayedChores,
    getCurrentUserTodayStats,
    getFamilyTodayStats,
  } = useAppHandlers({
    chores,
    photos,
    currentUserId,
    currentUserName,
    setChores,
    handleChoreCompletion,
    handleCompleteChore,
    handleResetDay,
    handleSavePhoto,
    handleSendMessage,
    handleExportData,
    handleClearData,
    handleToggleChore,
    clearDelayedNotification,
    resetNotifications,
    initialChores,
  });

  // 文字サイズ設定をCSSに反映
  React.useEffect(() => {
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '20px'
    };
    
    document.documentElement.style.setProperty('--font-size', fontSizeMap[settings.fontSize]);
  }, [settings.fontSize]);

  // selectedTipがtipsの変更と同期するように更新
  React.useEffect(() => {
    if (selectedTip) {
      const updatedTip = tips.find(tip => tip.id === selectedTip.id);
      if (updatedTip && (updatedTip.isLiked !== selectedTip.isLiked || updatedTip.likes !== selectedTip.likes)) {
        setSelectedTip(updatedTip);
      }
    }
  }, [tips, selectedTip, setSelectedTip]);

  const handleEditChore = (chore: any) => {
    setEditingChore(chore);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainContentRenderer
        activeTab={activeTab}
        selectedPhoto={selectedPhoto}
        editingChore={editingChore}
        selectedTip={selectedTip}
        chores={chores}
        photos={photos}
        messages={messages}
        tips={tips}
        settings={settings}
        familyMembers={sampleFamilyMembers}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        setSelectedPhoto={setSelectedPhoto}
        setEditingChore={setEditingChore}
        setSelectedTip={setSelectedTip}
        setActiveTab={setActiveTab}
        handleSaveChore={handleSaveChore}
        handleDeleteChore={handleDeleteChore}
        handleCompleteChore={handleCompleteChore}
        handleEditChore={handleEditChore}
        handleTakePhoto={handleTakePhoto}
        handleSharePhoto={handleSharePhoto}
        handleUpdatePhotoComment={handleUpdatePhotoComment}
        handleToggleChoreWithUserId={handleToggleChoreWithUserId}
        handleSendMessageWithUser={handleSendMessageWithUser}
        handleLikeTip={handleLikeTip}
        handleUpdateSettings={handleUpdateSettings}
        handleExportDataWithPhotos={handleExportDataWithPhotos}
        handleClearDataWithChores={handleClearDataWithChores}
        handleResetDayWithNotifications={handleResetDayWithNotifications}
        getDisplayedChores={getDisplayedChores}
        getCurrentUserTodayStats={getCurrentUserTodayStats}
        getFamilyTodayStats={getFamilyTodayStats}
      />

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <DialogsManager
        photoCaptureChore={photoCaptureChore}
        setPhotoCaptureChore={setPhotoCaptureChore}
        sharePhoto={sharePhoto}
        setSharePhoto={setSharePhoto}
        completionChore={completionChore}
        setCompletionChore={setCompletionChore}
        chores={chores}
        familyMembers={sampleFamilyMembers}
        currentUserId={currentUserId}
        handleSavePhotoWithUser={handleSavePhotoWithUser}
        handleChoreCompletionWithNotification={handleChoreCompletionWithNotification}
      />
    </div>
  );
}