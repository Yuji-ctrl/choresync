import React from 'react';
import { PhotoDetailScreen } from './PhotoDetailScreen';
import { ChoreDetailScreen } from './ChoreDetailScreen';
import { PhotoAlbumScreen } from './PhotoAlbumScreen';
import { FamilyStatsScreen } from './FamilyStatsScreen';
import { GameScreen } from './GameScreen';
import { MessagesScreen } from './MessagesScreen';
import { ChoreListScreen } from './ChoreListScreen';
import { TipsScreen } from './TipsScreen';
import { TipDetailScreen } from './TipDetailScreen';
import { SettingsScreen } from './SettingsScreen';
import { HomeScreen } from './HomeScreen';
import { Chore, ChorePhoto, Message, Tip, AppSettings, FamilyMember } from '../types';

interface MainContentRendererProps {
  activeTab: string;
  selectedPhoto: ChorePhoto | null;
  editingChore: Chore | null | undefined;
  selectedTip: Tip | null;
  chores: Chore[];
  photos: ChorePhoto[];
  messages: Message[];
  tips: Tip[];
  settings: AppSettings;
  familyMembers: FamilyMember[];
  currentUserId: string;
  currentUserName: string;
  
  // Handlers
  setSelectedPhoto: (photo: ChorePhoto | null) => void;
  setEditingChore: (chore: Chore | null | undefined) => void;
  setSelectedTip: (tip: Tip | null) => void;
  setActiveTab: (tab: string) => void;
  handleSaveChore: (choreData: any, existingChore: Chore | null) => void;
  handleDeleteChore: (choreId: string) => void;
  handleCompleteChore: (choreId: string) => void;
  handleEditChore: (chore: any) => void;
  handleTakePhoto: (chore: Chore) => void;
  handleSharePhoto: (photo: ChorePhoto) => void;
  handleUpdatePhotoComment: (photoId: string, comment: string) => Promise<void>;
  handleToggleChoreWithUserId: (choreId: string) => void;
  handleSendMessageWithUser: (text: string, imageFile?: File) => void;
  handleLikeTip: (tipId: string) => void;
  handleUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  handleExportDataWithPhotos: () => void;
  handleClearDataWithChores: () => void;
  handleResetDayWithNotifications: () => void;
  getDisplayedChores: () => Chore[];
  getCurrentUserTodayStats: () => { completed: number; total: number };
  getFamilyTodayStats: () => { completed: number; total: number };
}

export function MainContentRenderer({
  activeTab,
  selectedPhoto,
  editingChore,
  selectedTip,
  chores,
  photos,
  messages,
  tips,
  settings,
  familyMembers,
  currentUserId,
  currentUserName,
  setSelectedPhoto,
  setEditingChore,
  setSelectedTip,
  setActiveTab,
  handleSaveChore,
  handleDeleteChore,
  handleCompleteChore,
  handleEditChore,
  handleTakePhoto,
  handleSharePhoto,
  handleUpdatePhotoComment,
  handleToggleChoreWithUserId,
  handleSendMessageWithUser,
  handleLikeTip,
  handleUpdateSettings,
  handleExportDataWithPhotos,
  handleClearDataWithChores,
  handleResetDayWithNotifications,
  getDisplayedChores,
  getCurrentUserTodayStats,
  getFamilyTodayStats,
}: MainContentRendererProps) {
  switch (activeTab) {
    case 'home':
      if (selectedPhoto) {
        const chore = chores.find(c => c.id === selectedPhoto.choreId);
        return (
          <PhotoDetailScreen
            photo={selectedPhoto}
            chore={chore!}
            onBack={() => setSelectedPhoto(null)}
            onShare={handleSharePhoto}
            onUpdateComment={handleUpdatePhotoComment}
          />
        );
      }
      
      if (editingChore !== undefined) {
        return (
          <ChoreDetailScreen
            chore={editingChore}
            onBack={() => setEditingChore(undefined)}
            onSave={(choreData) => handleSaveChore(choreData, editingChore)}
            onDelete={editingChore?.id ? handleDeleteChore : undefined}
            isNew={!editingChore?.id}
          />
        );
      }
      
      return (
        <HomeScreen
          currentUserName={currentUserName}
          getCurrentUserTodayStats={getCurrentUserTodayStats}
          getFamilyTodayStats={getFamilyTodayStats}
          getDisplayedChores={getDisplayedChores}
          handleResetDayWithNotifications={handleResetDayWithNotifications}
          setEditingChore={setEditingChore}
          setActiveTab={setActiveTab}
          handleCompleteChore={handleCompleteChore}
          handleEditChore={handleEditChore}
          handleTakePhoto={handleTakePhoto}
        />
      );

    case 'album':
      if (selectedPhoto) {
        const chore = chores.find(c => c.id === selectedPhoto.choreId);
        return (
          <PhotoDetailScreen
            photo={selectedPhoto}
            chore={chore!}
            onBack={() => setSelectedPhoto(null)}
            onShare={handleSharePhoto}
            onUpdateComment={handleUpdatePhotoComment}
          />
        );
      }
      return (
        <PhotoAlbumScreen
          photos={photos}
          chores={chores}
          onPhotoClick={setSelectedPhoto}
          onBack={() => setActiveTab('stats')}
        />
      );

    case 'stats':
      return (
        <FamilyStatsScreen
          chores={chores}
          familyMembers={familyMembers}
          onNavigateToAlbum={() => setActiveTab('album')}
        />
      );

    case 'game':
      return (
        <GameScreen
          chores={chores}
          familyMembers={familyMembers}
          currentUserId={currentUserId}
          onBack={() => setActiveTab('messages')}
        />
      );

    case 'messages':
      return (
        <MessagesScreen
          messages={messages}
          familyMembers={familyMembers}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessageWithUser}
          onNavigateToGame={() => setActiveTab('game')}
          onNavigateToTips={() => setActiveTab('tips')}
        />
      );

    case 'chores':
      if (editingChore !== undefined && activeTab === 'chores') {
        return (
          <ChoreDetailScreen
            chore={editingChore}
            onBack={() => setEditingChore(undefined)}
            onSave={(choreData) => handleSaveChore(choreData, editingChore)}
            onDelete={editingChore?.id ? handleDeleteChore : undefined}
            isNew={!editingChore?.id}
          />
        );
      }
      
      return (
        <ChoreListScreen
          chores={chores}
          currentUserName={currentUserName}
          getCurrentUserTodayStats={getCurrentUserTodayStats}
          getFamilyTodayStats={getFamilyTodayStats}
          onAddChore={() => {
            setEditingChore(null);
          }}
          onEditChore={setEditingChore}
          onDeleteChore={handleDeleteChore}
          onToggleChore={handleToggleChoreWithUserId}
        />
      );

    case 'tips':
      if (selectedTip) {
        return (
          <TipDetailScreen
            tip={selectedTip}
            onBack={() => setSelectedTip(null)}
            onLike={handleLikeTip}
            onShare={() => {
              const text = `${selectedTip.title} - おうち家事アプリ`;
              if (navigator.share) {
                navigator.share({ title: selectedTip.title, text });
              } else {
                navigator.clipboard.writeText(text);
              }
            }}
          />
        );
      }
      
      return (
        <TipsScreen
          tips={tips}
          onTipClick={setSelectedTip}
          onLikeTip={handleLikeTip}
        />
      );

    case 'settings':
      return (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onExportData={handleExportDataWithPhotos}
          onClearData={handleClearDataWithChores}
          onBack={() => setActiveTab('home')}
        />
      );

    default:
      return null;
  }
}